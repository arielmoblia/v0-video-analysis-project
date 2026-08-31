import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: NextRequest) {
  const { storeId, featureCode, trialDays, trialEndsAt } = await request.json()
  if (!storeId || !featureCode) return NextResponse.json({ error: "Datos incompletos" }, { status: 400 })

  const { data: existing } = await supabase
    .from("store_purchased_features")
    .select("id")
    .eq("store_id", storeId)
    .eq("feature_code", featureCode)
    .maybeSingle()

  if (existing) return NextResponse.json({ error: "Ya tiene esta feature" }, { status: 400 })

  const { error } = await supabase
    .from("store_purchased_features")
    .insert({
      store_id: storeId,
      feature_code: featureCode,
      is_active: true,
      is_trial: true,
      trial_ends_at: trialEndsAt
    })

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ ok: true })
}
