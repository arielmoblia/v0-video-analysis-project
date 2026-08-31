import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
const KEY = "seo_plan_accion"

export async function GET() {
  const { data, error } = await supabase
    .from("platform_settings")
    .select("value")
    .eq("key", KEY)
    .single()

  if (error && error.code !== "PGRST116") {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(
    data?.value ?? { situacion: "", accion: "", proximo_paso: "" },
    { headers: { "Cache-Control": "no-store" } }
  )
}

export async function POST(request: Request) {
  const body = await request.json()
  const { situacion, accion, proximo_paso } = body

  const { error } = await supabase.from("platform_settings").upsert(
    { key: KEY, value: { situacion, accion, proximo_paso }, updated_at: new Date().toISOString() },
    { onConflict: "key" }
  )

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true }, { headers: { "Cache-Control": "no-store" } })
}
