import { createClient as createSupabaseAdmin } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"
import { getPaymentsConfig } from "@/lib/payments-config"

// Esta API crea preferencias de pago para que los clientes paguen a TOL.AR
// (cositas, planes, etc.)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { storeId, features, totalARS } = body

    if (!storeId || !features || !totalARS) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 })
    }
    // Verificar que la tienda existe
    const supabase = createSupabaseAdmin(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
    const { data: store, error: storeError } = await supabase
      .from("stores")
      .select("id, subdomain, site_title, email")
      .eq("id", storeId)
      .single()
    if (storeError || !store) {
      return NextResponse.json({ error: "Tienda no encontrada" }, { status: 404 })
    }
    const user = { id: store.id, email: store.email || "merchant@tol.ar" }

    // Access Token de TOL.AR (tu cuenta de MercadoPago)
    let storedAccessToken: string | undefined
    try {
      storedAccessToken = (await getPaymentsConfig()).mp_access_token
    } catch (e) {
      console.error("[v0] No se pudo leer/descifrar payments_config:", e)
    }
    const accessToken = process.env.MP_ACCESS_TOKEN || storedAccessToken

    if (!accessToken) {
      console.error("[v0] MP_ACCESS_TOKEN no configurado")
      return NextResponse.json(
        { error: "MercadoPago no configurado. Contacta al soporte." },
        { status: 500 }
      )
    }

    // Base real de donde vino el pedido (prod, dev, o cualquier subdominio de tienda),
    // no un valor fijo: si no coincide con el dominio real, MP redirige/notifica mal
    // y el checkout de sandbox devuelve 403 si se usa la URL de producción.
    const host = request.headers.get("host") || "tol.ar"
    const baseUrl = `https://${host}`

    // Crear referencia unica para este pago
    const externalReference = `tolar_features_${storeId}_${Date.now()}`

    // Guardar el intento de compra en la base de datos
    const { data: purchase, error: purchaseError } = await supabase
      .from("feature_purchases")
      .insert({
        store_id: storeId,
        features: features,
        amount_ars: totalARS,
        external_reference: externalReference,
        status: "pending",
        payment_method: "mercadopago"
      })
      .select()
      .single()

    if (purchaseError) {
      console.error("[v0] Error guardando purchase:", purchaseError)
      // Continuamos aunque falle el guardado
    }

    // Crear descripcion de items
    const itemsDescription = features.map((f: { name: string, price: number }) => f.name).join(", ")

    // Crear preferencia en Mercado Pago
    const preferenceData = {
      items: [
        {
          title: `Plan Cositas - ${itemsDescription}`,
          description: `Funcionalidades para tu tienda: ${itemsDescription}`,
          quantity: 1,
          unit_price: Number(totalARS),
          currency_id: "ARS",
        }
      ],
      payer: {
        email: user.email,
      },
      back_urls: {
        success: `${baseUrl}/admin?tab=planes&payment=success`,
        failure: `${baseUrl}/admin?tab=planes&payment=failed`,
        pending: `${baseUrl}/admin?tab=planes&payment=pending`,
      },
      auto_return: "approved",
      external_reference: externalReference,
      notification_url: `${baseUrl}/api/tolar/mercadopago/webhook`,
      statement_descriptor: "TOLAR",
      expires: true,
      expiration_date_from: new Date().toISOString(),
      expiration_date_to: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 horas
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
      console.error("[v0] Error de MercadoPago:", JSON.stringify(errorData, null, 2))
      return NextResponse.json(
        { error: "Error al crear preferencia de pago", details: errorData.message },
        { status: 500 }
      )
    }

    const preference = await response.json()

    // Con credenciales TEST- (sandbox) el link de producción (init_point) da 403 al
    // abrirlo: MP exige el link de sandbox para preferencias creadas en modo prueba.
    const isTestCredential = accessToken.startsWith("TEST-")
    const checkoutUrl = isTestCredential ? preference.sandbox_init_point : preference.init_point

    return NextResponse.json({
      preferenceId: preference.id,
      initPoint: preference.init_point,
      sandboxInitPoint: preference.sandbox_init_point,
      checkoutUrl,
    })
  } catch (error) {
    console.error("[v0] Error creando preferencia TOL.AR:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
