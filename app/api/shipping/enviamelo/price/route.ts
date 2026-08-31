import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { storeId, postalCode } = await request.json()

    if (!storeId || !postalCode) {
      return NextResponse.json({ error: "Faltan parámetros" }, { status: 400 })
    }

    const { data: shipping } = await supabase
      .from("shipping_methods")
      .select("enviamelo_token, enviamelo_free_above")
      .eq("store_id", storeId)
      .single()

    if (!shipping?.enviamelo_token) {
      return NextResponse.json({ error: "Token no configurado" }, { status: 400 })
    }

    const cp = parseInt(postalCode)

    const [domRes, retiroRes] = await Promise.all([
      fetch("https://api.enviamelo.com.ar/api/v1/price", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${shipping.enviamelo_token}`,
          "Content-Type": "application/json",
          "accept": "application/json",
        },
        body: JSON.stringify({ weight: 1, postal_code: cp, point: false }),
      }),
      fetch("https://api.enviamelo.com.ar/api/v1/price", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${shipping.enviamelo_token}`,
          "Content-Type": "application/json",
          "accept": "application/json",
        },
        body: JSON.stringify({ weight: 1, postal_code: cp, point: true }),
      }),
    ])

    const domData = await domRes.json()
    const retiroData = await retiroRes.json()

    // La API devuelve { data: [...] } o directamente un array
    const domArray = Array.isArray(domData) ? domData : (domData?.data || [])
    const retiroArray = Array.isArray(retiroData) ? retiroData : (retiroData?.data || [])

    const domPrecio = domArray.find((d: any) => d.point === false)?.amount
      || domArray[0]?.amount || 0

    const retiroPrecio = retiroArray.find((d: any) => d.point === true)?.amount
      || retiroArray[0]?.amount || 0

    return NextResponse.json({
      domicilio: domPrecio,
      retiro: retiroPrecio,
      freeAbove: parseFloat(shipping.enviamelo_free_above) || 0,
    })

  } catch (error) {
    console.error("[enviamelo/price] Error:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
