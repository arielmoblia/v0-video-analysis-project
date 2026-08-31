import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET() {
  const { data } = await supabase.from("platform_settings").select("value").eq("key", "especialista_servicios").single()
  if (!data) return NextResponse.json(null, { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } })
  return NextResponse.json(JSON.parse(data.value, { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } }))
}

export async function POST(req: Request) {
  const body = await req.json()
  await supabase.from("platform_settings").upsert({ key: "especialista_servicios", value: JSON.stringify(body) }, { onConflict: "key" })
  return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } })
}
