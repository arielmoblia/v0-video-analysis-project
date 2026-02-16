import { createClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { storeId, items, orderId, customerEmail } = body

    if (!storeId || !items || !orderId) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 })
    }

    // Obtener el access token de la tienda
    const { data: paymentMethods, error: paymentError } = await supabase
      .from("payment_methods")
      .select("mercadopago_access_token, mercadopago_test_mode, mercadopago_test_token, mercadopago_checkout_type")
      .eq("store_id", storeId)
      .single()

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

    // Obtener info de la tienda para URLs
    const { data: store } = await supabase.from("stores").select("subdomain, site_title").eq("id", storeId).single()

    const baseUrl = `https://${store?.subdomain}.tol.ar`

    // Crear preferencia en Mercado Pago
    const preferenceData = {
      items: items.map((item: any) => ({
        title: `${item.name}${item.size ? ` - Talle ${item.size}` : ""}`,
        quantity: item.quantity,
        unit_price: Number(item.price),
        currency_id: "ARS",
      })),
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
    }

    const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(preferenceData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("[v0] Error de Mercado Pago:", JSON.stringify(errorData, null, 2))
      console.error("[v0] Access Token usado (primeros 20 chars):", accessToken?.substring(0, 20))
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
