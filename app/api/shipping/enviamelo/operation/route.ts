import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Genera la guía de envío automática vía API de Enviamelo (cobra real en la cuenta
// del transportista). Mientras se prueba el flujo, solo esta tienda la ve
// (mismo filtro que components/admin/orders-manager.tsx).
const ENVIAMELO_AUTO_GUIDE_SUBDOMAINS = ["prueba3", "doppiam"]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      storeId, weight, dimensions, postalCode,
      recipientName, recipientLastName, recipientDni, recipientPhone, recipientEmail,
      product, province, location, street, height, floor, departament, note,
    } = body

    if (!storeId || !weight || !dimensions || !postalCode || !recipientName || !recipientLastName ||
        !recipientDni || !recipientPhone || !recipientEmail || !product || !province || !location ||
        !street || !height) {
      return NextResponse.json({ error: "Faltan parámetros" }, { status: 400 })
    }

    const { data: store } = await supabase
      .from("stores")
      .select("subdomain")
      .eq("id", storeId)
      .single()

    if (!store || !ENVIAMELO_AUTO_GUIDE_SUBDOMAINS.includes(store.subdomain)) {
      return NextResponse.json({ error: "Guía automática aún no habilitada para esta tienda" }, { status: 403 })
    }

    const { data: shipping } = await supabase
      .from("shipping_methods")
      .select("enviamelo_token")
      .eq("store_id", storeId)
      .single()

    if (!shipping?.enviamelo_token) {
      return NextResponse.json({ error: "Token de Enviamelo no configurado" }, { status: 400 })
    }

    const cp = parseInt(postalCode)

    const priceRes = await fetch("https://api.enviamelo.com.ar/api/v1/price", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${shipping.enviamelo_token}`,
        "Content-Type": "application/json",
        "accept": "application/json",
      },
      body: JSON.stringify({ weight: Number(weight), postal_code: cp, point: false }),
    })

    if (!priceRes.ok) {
      return NextResponse.json({ error: "No se pudo cotizar el envío antes de generar la guía" }, { status: 502 })
    }

    const priceData = await priceRes.json()
    const priceArray = Array.isArray(priceData) ? priceData : (priceData?.data || [])
    const domicilio = priceArray.find((d: any) => d.point === false) || priceArray[0]

    if (!domicilio?.term) {
      return NextResponse.json({ error: "Enviamelo no devolvió una tarifa a domicilio para ese código postal" }, { status: 502 })
    }

    const operationRes = await fetch("https://api.enviamelo.com.ar/api/v1/operation", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${shipping.enviamelo_token}`,
        "Content-Type": "application/json",
        "accept": "application/json",
      },
      body: JSON.stringify({
        weight: Number(weight),
        unit: "KG",
        dimensions,
        term: domicilio.term,
        recipient_name: recipientName,
        recipient_last_name: recipientLastName,
        recipient_dni: recipientDni,
        recipient_phone: recipientPhone,
        recipient_email: recipientEmail,
        product,
        retirement: "client",
        retirement_item: {
          province,
          location,
          street,
          height,
          floor: floor || "",
          departament: departament || "",
          postal_code: postalCode,
          note: note || "",
        },
        note: note || "",
      }),
    })

    const operationData = await operationRes.json()

    if (!operationRes.ok) {
      return NextResponse.json({ error: operationData?.message || "Enviamelo rechazó la generación de la guía" }, { status: operationRes.status })
    }

    return NextResponse.json({ id: operationData.id, pdf: operationData.pdf, amount: domicilio.amount ?? null })

  } catch (error) {
    console.error("[enviamelo/operation] Error:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
