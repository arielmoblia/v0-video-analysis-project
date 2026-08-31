import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { generateGuiaDemoPdf } from "@/lib/pdf/guia-demo"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Vista previa de guía: arma un PDF con el mismo tipo de datos que pediría la
// API real de Enviamelo, pero sin llamarla. No genera ningún envío ni cobra
// nada — sirve para probar el flujo y mostrarle la idea a Enviamelo.
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
      .select("subdomain, site_title")
      .eq("id", storeId)
      .single()

    if (!store || !ENVIAMELO_AUTO_GUIDE_SUBDOMAINS.includes(store.subdomain)) {
      return NextResponse.json({ error: "Vista previa aún no habilitada para esta tienda" }, { status: 403 })
    }

    const pdfBuffer = await generateGuiaDemoPdf({
      storeName: store.site_title || "Tienda",
      recipientName, recipientLastName, recipientDni, recipientPhone, recipientEmail,
      product, province, location, street, height, floor, departament, postalCode,
      weight: String(weight), dimensions, note,
    })

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="guia-demo.pdf"`,
      },
    })
  } catch (error) {
    console.error("[enviamelo/operation-demo] Error:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
