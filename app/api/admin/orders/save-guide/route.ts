import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

// Guarda el resultado de "Guía de Transporte" (integración real ya existente con Enviamelo,
// ver app/api/shipping/enviamelo/operation/route.ts) en el pedido, para que el paso del
// cronograma general quede en verde y el link al PDF real persista aunque se cierre el modal
// o se recargue la página (antes vivía solo en estado local de React y se perdía).
export async function POST(request: NextRequest) {
  try {
    const { orderId, guideId, pdfUrl, amount } = await request.json()

    if (!orderId || !pdfUrl) {
      return NextResponse.json({ error: "Faltan datos de la guía" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("orders")
      .update({
        shipping_guide_id: guideId != null ? String(guideId) : null,
        shipping_guide_pdf_url: pdfUrl,
        shipping_guide_amount: typeof amount === "number" && !Number.isNaN(amount) ? amount : null,
        shipping_guide_generated_at: new Date().toISOString(),
      })
      .eq("id", orderId)
      .select()
      .single()

    if (error) {
      console.error("Error saving guide:", error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ order: data })
  } catch (error) {
    console.error("[orders/save-guide] Error:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
