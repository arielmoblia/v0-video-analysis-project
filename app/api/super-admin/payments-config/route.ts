import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET() {
  try {
    const { data: config, error: configError } = await supabase
      .from("platform_settings")
      .select("*")
      .eq("key", "payments_config")
      .maybeSingle()

    // Ignorar error PGRST116 (no rows returned)
    if (configError && configError.code !== "PGRST116") {
      console.error("Error fetching config:", configError)
    }

    // Obtener estadísticas de suscripciones
    const { data: subscriptions } = await supabase.from("store_purchased_features").select("*")

    const stats = {
      total_subscribers: subscriptions?.length || 0,
      active_subscriptions: subscriptions?.filter((s: any) => s.is_active).length || 0,
      monthly_revenue_ars: 0,
      monthly_revenue_usd: 0,
      canceled_this_month: 0,
    }

    const defaultConfig = {
      stripe_enabled: false,
      stripe_publishable_key: "",
      stripe_secret_key: "",
      stripe_webhook_secret: "",
      bank_name: "Wells Fargo",
      bank_account_last4: "",
      customer_currency: "ARS",
      payout_currency: "USD",
    }

    return NextResponse.json({
      config: config?.value || defaultConfig,
      stats,
    })
  } catch (error) {
    console.error("Error fetching payments config:", error)
    return NextResponse.json({
      config: {
        stripe_enabled: false,
        stripe_publishable_key: "",
        stripe_secret_key: "",
        stripe_webhook_secret: "",
        bank_name: "Wells Fargo",
        bank_account_last4: "",
        customer_currency: "ARS",
        payout_currency: "USD",
      },
      stats: {
        total_subscribers: 0,
        active_subscriptions: 0,
        monthly_revenue_ars: 0,
        monthly_revenue_usd: 0,
        canceled_this_month: 0,
      },
    })
  }
}

export async function POST(request: Request) {
  try {
    const config = await request.json()

    // Guardar configuración
    const { error } = await supabase.from("platform_settings").upsert(
      {
        key: "payments_config",
        value: config,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "key",
      },
    )

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving payments config:", error)
    return NextResponse.json({ error: "Error al guardar" }, { status: 500 })
  }
}
