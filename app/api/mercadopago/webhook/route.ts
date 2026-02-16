import { createClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Mercado Pago envía notificaciones de pagos
    if (body.type === "payment" && body.data?.id) {
      const paymentId = body.data.id

      // Obtener detalles del pago (necesitaríamos el access token de la tienda)
      // Por ahora solo logueamos
      console.log("[v0] Webhook de Mercado Pago recibido:", { paymentId, body })

      // Aquí podrías actualizar el estado del pedido basándote en el external_reference
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Error en webhook:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
