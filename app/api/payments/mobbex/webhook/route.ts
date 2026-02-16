import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { mapMobbexStatus } from "@/lib/payments/mobbex"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json()
    
    console.log("[Mobbex Webhook] Received:", JSON.stringify(payload, null, 2))

    const { type, data } = payload

    // Solo procesar notificaciones de pago
    if (type !== "payment") {
      return NextResponse.json({ received: true })
    }

    const payment = data?.payment
    if (!payment) {
      return NextResponse.json({ error: "No payment data" }, { status: 400 })
    }

    const orderId = payment.reference
    const statusCode = payment.status?.code
    const status = mapMobbexStatus(statusCode)

    // Actualizar orden en la base de datos
    const { error } = await supabase
      .from("orders")
      .update({
        payment_status: status,
        payment_method: "mobbex",
        payment_id: payment.id,
        payment_details: {
          mobbex_status_code: statusCode,
          mobbex_status_text: payment.status?.text,
          mobbex_payment_id: payment.id,
          total: payment.total,
          currency: payment.currency,
          customer: data.customer,
          entity: data.entity,
        },
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId)

    if (error) {
      console.error("[Mobbex Webhook] Error updating order:", error)
      return NextResponse.json({ error: "Error updating order" }, { status: 500 })
    }

    console.log(`[Mobbex Webhook] Order ${orderId} updated to status: ${status}`)

    return NextResponse.json({ received: true, status })
  } catch (error) {
    console.error("[Mobbex Webhook] Error:", error)
    return NextResponse.json({ error: "Webhook error" }, { status: 500 })
  }
}

// Mobbex tambien puede enviar GET para verificar el endpoint
export async function GET() {
  return NextResponse.json({ status: "ok", service: "mobbex-webhook" })
}
