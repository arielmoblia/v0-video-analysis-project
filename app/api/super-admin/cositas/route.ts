import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function PATCH(request: NextRequest) {
  const { code, price, trial_days } = await request.json()
  if (!code) return NextResponse.json({ error: "code requerido" }, { status: 400, headers: { "Cache-Control": "no-store" } })
  const updates: any = {}
  if (price !== undefined) updates.price = price
  if (trial_days !== undefined) updates.trial_days = trial_days
  const { error } = await supabase.from("store_features").update(updates).eq("code", code)
  if (error) return NextResponse.json({ error: error.message }, { status: 400, headers: { "Cache-Control": "no-store" } })
  return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } })
}
