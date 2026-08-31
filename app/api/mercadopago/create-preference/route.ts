import { createClient } from "@supabase/supabase-js"
import { decryptFields } from "@/lib/crypto"
import { type NextRequest, NextResponse } from "next/server"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { storeId, items, orderId, customerEmail, shippingCost } = body

    if (!storeId || !items || !orderId) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 })
    }

    // Verificar el precio real contra la base de datos antes de cobrar
    // (nunca confiar en el precio que manda el navegador)
    const verifiedItems = await Promise.all(
      items.map(async (item: any) => {
        if (!item.productId) return item

        const { data: product } = await supabase
          .from("products")
          .select("price, sizes")
          .eq("id", item.productId)
          .single()

        if (!product) return item

        let realPrice = product.price
        if (item.size && Array.isArray(product.sizes)) {
          const sizeData = product.sizes.find((s: any) => s.name === item.size || s.size === item.size)
          if (sizeData && typeof sizeData.price === "number") realPrice = sizeData.price
        }

        if (realPrice !== item.price) {
          console.warn(`[precio] Corregido en Mercado Pago: producto ${item.productId} vino en $${item.price}, precio real $${realPrice}`)
        }

        return { ...item, price: realPrice }
      })
    )

    // Obtener el access token de la tienda
    const { data: paymentMethods, error: paymentError } = await supabase
      .from("payment_methods")
      .select(
        "mercadopago_access_token, mercadopago_test_mode, mercadopago_test_token, mercadopago_checkout_type, mercadopago_oauth_access_token, mercadopago_oauth_connected",
      )
      .eq("store_id", storeId)
      .single()

    if (paymentMethods) {
      Object.assign(
        paymentMethods,
        decryptFields(paymentMethods, ["mercadopago_access_token", "mercadopago_test_token", "mercadopago_oauth_access_token"]),
      )
    }

    if (paymentError) {
      return NextResponse.json(
        {
          error: "Mercado Pago no configurado para esta tienda",
        },
        { status: 400 },
      )
    }

    // Determinar si usar modo test o producción
    const isTestMode = paymentMethods.mercadopago_test_mode
    const accessToken = isTestMode 
      ? paymentMethods.mercadopago_test_token 
      : paymentMethods.mercadopago_access_token

    if (!accessToken) {
      return NextResponse.json(
        {
          error: isTestMode
            ? "Token de prueba no configurado. Configurá el Access Token de TEST en el admin."
            : "Access Token de producción no configurado.",
        },
        { status: 400 },
      )
    }

    // Split de pagos (marketplace_fee): solo para la tienda de prueba que conectó
    // su cuenta de Mercado Pago vía OAuth. El resto de las tiendas sigue igual.
    const isMarketplaceTestStore = storeId === process.env.MP_MARKETPLACE_TEST_STORE_ID
    const useMarketplaceSplit =
      isMarketplaceTestStore && !isTestMode && paymentMethods.mercadopago_oauth_connected && paymentMethods.mercadopago_oauth_access_token

    const collectorAccessToken = useMarketplaceSplit ? paymentMethods.mercadopago_oauth_access_token : accessToken

    // Obtener info de la tienda para URLs
    const { data: store } = await supabase.from("stores").select("subdomain, site_title").eq("id", storeId).single()

    const baseUrl = `https://${store?.subdomain}.tol.ar`

    // Crear preferencia en Mercado Pago
    const preferenceData = {
      items: [
        ...verifiedItems.map((item: any) => ({
          title: `${item.name}${item.size ? ` - Talle ${item.size}` : ""}`,
          quantity: item.quantity,
          unit_price: Number(item.price),
          currency_id: "ARS",
        })),
        ...(Number(shippingCost) > 0
          ? [
              {
                title: "Envío",
                quantity: 1,
                unit_price: Number(shippingCost),
                currency_id: "ARS",
              },
            ]
          : []),
      ],
      payer: {
        email: customerEmail || undefined,
      },
      back_urls: {
        success: `${baseUrl}/checkout/confirmacion?order=${orderId}`,
        failure: `${baseUrl}/checkout?error=payment_failed`,
        pending: `${baseUrl}/checkout/confirmacion?order=${orderId}&status=pending`,
      },
      auto_return: "approved",
      external_reference: orderId,
      notification_url: `${baseUrl}/api/mercadopago/webhook`,
      ...(useMarketplaceSplit && Number(shippingCost) > 0 ? { marketplace_fee: Number(shippingCost) } : {}),
    }

    const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${collectorAccessToken}`,
      },
      body: JSON.stringify(preferenceData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("[v0] Error de Mercado Pago:", JSON.stringify(errorData, null, 2))
      console.error("[v0] Access Token usado (primeros 20 chars):", collectorAccessToken?.substring(0, 20))
      console.error("[v0] Status:", response.status)
      return NextResponse.json(
        {
          error: "Error al crear preferencia de pago",
          details: errorData.message || errorData.error || "Error desconocido",
        },
        { status: 500 },
      )
    }

    const preference = await response.json()

    return NextResponse.json({
      preferenceId: preference.id,
      initPoint: isTestMode ? preference.sandbox_init_point : preference.init_point,
      sandboxInitPoint: preference.sandbox_init_point,
      isTestMode,
      checkoutType: paymentMethods.mercadopago_checkout_type || "redirect",
    })
  } catch (error) {
    console.error("Error creando preferencia:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
