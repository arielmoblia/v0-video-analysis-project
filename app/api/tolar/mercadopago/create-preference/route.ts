import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

// Esta API crea preferencias de pago para que los clientes paguen a TOL.AR
// (cositas, planes, etc.)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { storeId, features, totalARS } = body

    if (!storeId || !features || !totalARS) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 })
    }

    // Verificar que el usuario tenga acceso a esta tienda
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Verificar que la tienda pertenezca al usuario
    const { data: store, error: storeError } = await supabase
      .from("stores")
      .select("id, subdomain, site_title, user_id")
      .eq("id", storeId)
      .single()

    if (storeError || !store || store.user_id !== user.id) {
      return NextResponse.json({ error: "Tienda no encontrada" }, { status: 404 })
    }

    // Access Token de TOL.AR (tu cuenta de MercadoPago)
    const accessToken = process.env.TOLAR_MP_ACCESS_TOKEN

    if (!accessToken) {
      console.error("[v0] TOLAR_MP_ACCESS_TOKEN no configurado")
      return NextResponse.json(
        { error: "MercadoPago no configurado. Contacta al soporte." },
        { status: 500 }
      )
    }

    // Crear referencia unica para este pago
    const externalReference = `tolar_features_${storeId}_${Date.now()}`

    // Guardar el intento de compra en la base de datos
    const { data: purchase, error: purchaseError } = await supabase
      .from("feature_purchases")
      .insert({
        store_id: storeId,
        user_id: user.id,
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
        success: `${process.env.NEXT_PUBLIC_APP_URL || "https://tol.ar"}/admin?tab=planes&payment=success`,
        failure: `${process.env.NEXT_PUBLIC_APP_URL || "https://tol.ar"}/admin?tab=planes&payment=failed`,
        pending: `${process.env.NEXT_PUBLIC_APP_URL || "https://tol.ar"}/admin?tab=planes&payment=pending`,
      },
      auto_return: "approved",
      external_reference: externalReference,
      notification_url: `${process.env.NEXT_PUBLIC_APP_URL || "https://tol.ar"}/api/tolar/mercadopago/webhook`,
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

    return NextResponse.json({
      preferenceId: preference.id,
      initPoint: preference.init_point,
      sandboxInitPoint: preference.sandbox_init_point,
    })
  } catch (error) {
    console.error("[v0] Error creando preferencia TOL.AR:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
