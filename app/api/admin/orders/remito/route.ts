import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { generateRemitoPdf } from "@/lib/pdf/remito"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get("orderId")

    if (!orderId) {
      return NextResponse.json({ error: "Order ID requerido" }, { status: 400 })
    }

    const { data: order, error } = await supabase
      .from("orders")
      .select("*, stores(site_title, address, phone, email, whatsapp_number)")
      .eq("id", orderId)
      .single()

    if (error || !order) {
      return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 })
    }

    const pdfBuffer = await generateRemitoPdf(order, order.stores || {})

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="remito-${orderId.slice(0, 8)}.pdf"`,
      },
    })
  } catch (error) {
    console.error("Error generando remito:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
