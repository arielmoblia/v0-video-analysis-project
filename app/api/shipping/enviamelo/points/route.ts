import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const storeId = searchParams.get("storeId")
    const postalCode = searchParams.get("postalCode")

    if (!storeId || !postalCode) {
      return NextResponse.json({ error: "Faltan parámetros" }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: shipping } = await supabase
      .from("shipping_methods")
      .select("enviamelo_token")
      .eq("store_id", storeId)
      .single()

    if (!shipping?.enviamelo_token) {
      return NextResponse.json({ error: "Token de Enviamelo no configurado" }, { status: 400 })
    }

    const res = await fetch("https://api.enviamelo.com.ar/api/allpoints", {
      headers: {
        "Authorization": `Bearer ${shipping.enviamelo_token}`,
        "Accept": "application/json",
      },
      next: { revalidate: 3600 }
    })

    if (!res.ok) {
      return NextResponse.json({ error: "Error al obtener puntos" }, { status: 500 })
    }

    const data = await res.json()
    const allPoints = data.data || []

    const cp = parseInt(postalCode)
    let targetProvince = ""

    const exactMatch = allPoints.find((p: any) => p.postal_code === postalCode)
    if (exactMatch) {
      targetProvince = exactMatch.province
    } else {
      if (cp >= 1000 && cp <= 1499) targetProvince = "Capital Federal"
      else if (cp >= 1500 && cp <= 1999) targetProvince = "Buenos Aires-GBA"
      else if (cp >= 2000 && cp <= 2999) targetProvince = "Santa Fe"
      else if (cp >= 3000 && cp <= 3499) targetProvince = "Entre Ríos"
      else if (cp >= 3500 && cp <= 3999) targetProvince = "Corrientes"
      else if (cp >= 4000 && cp <= 4499) targetProvince = "Tucumán"
      else if (cp >= 4500 && cp <= 4999) targetProvince = "Salta"
      else if (cp >= 5000 && cp <= 5499) targetProvince = "Córdoba"
      else if (cp >= 5500 && cp <= 5699) targetProvince = "Mendoza"
      else if (cp >= 6000 && cp <= 7999) targetProvince = "Buenos Aires"
      else if (cp >= 8000 && cp <= 8499) targetProvince = "Neuquén"
      else if (cp >= 8500 && cp <= 8999) targetProvince = "Río Negro"
      else if (cp >= 9000 && cp <= 9499) targetProvince = "Chubut"
      else if (cp >= 9500 && cp <= 9999) targetProvince = "Santa Cruz"
      else targetProvince = "Buenos Aires"
    }

    const filtered = allPoints.filter((p: any) => p.province === targetProvince)
    const points = filtered.length > 0 ? filtered : allPoints.slice(0, 5)

    const formatted = points.map((p: any) => ({
      id: p.id,
      name: p.note || "Punto Enviamelo",
      address: `${p.street} ${p.height}`,
      location: p.location,
      province: p.province,
      postalCode: p.postal_code,
      lat: parseFloat(p.latitude),
      lng: parseFloat(p.longitude),
      schedules: p.schedules,
    }))

    return NextResponse.json({ 
      points: formatted,
      province: targetProvince,
      total: formatted.length
    })

  } catch (error) {
    console.error("[enviamelo] Error obteniendo puntos:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
