import { createClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get("stripe-signature")

    if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Sin firma" }, { status: 400 })
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET)
    } catch (err) {
      console.error("[Stripe Webhook] Firma inválida:", err)
      return NextResponse.json({ error: "Firma inválida" }, { status: 400 })
    }

    console.log("[Stripe Webhook] Evento:", event.type)

    // Pago único completado
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session
      const storeId = session.metadata?.storeId
      const cositas = session.metadata?.cositas?.split(",") || []

      if (!storeId || cositas.length === 0) {
        console.error("[Stripe Webhook] Metadata incompleta:", session.metadata)
        return NextResponse.json({ received: true })
      }

      // Activar las cositas
      for (const code of cositas) {
        await supabase
          .from("store_purchased_features")
          .upsert({
            store_id: storeId,
            feature_code: code.trim(),
            is_active: true,
            payment_method: "stripe",
            payment_id: session.id,
            activated_at: new Date().toISOString(),
          }, { onConflict: "store_id,feature_code" })
      }

      console.log("[Stripe Webhook] Cositas activadas para tienda:", storeId, cositas)
    }

    // Suscripción renovada
    if (event.type === "invoice.payment_succeeded") {
      const invoice = event.data.object as Stripe.Invoice
      const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string)
      const storeId = subscription.metadata?.storeId
      const cositas = subscription.metadata?.cositas?.split(",") || []

      if (storeId && cositas.length > 0) {
        for (const code of cositas) {
          await supabase
            .from("store_purchased_features")
            .upsert({
              store_id: storeId,
              feature_code: code.trim(),
              is_active: true,
              payment_method: "stripe",
              payment_id: invoice.id,
              activated_at: new Date().toISOString(),
            }, { onConflict: "store_id,feature_code" })
        }
        console.log("[Stripe Webhook] Suscripción renovada para tienda:", storeId)
      }
    }

    // Suscripción cancelada
    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as Stripe.Subscription
      const storeId = subscription.metadata?.storeId
      const cositas = subscription.metadata?.cositas?.split(",") || []

      if (storeId && cositas.length > 0) {
        for (const code of cositas) {
          await supabase
            .from("store_purchased_features")
            .update({ is_active: false })
            .eq("store_id", storeId)
            .eq("feature_code", code.trim())
        }
        console.log("[Stripe Webhook] Suscripción cancelada para tienda:", storeId)
      }
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error("[Stripe Webhook] Error:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
