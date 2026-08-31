import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const key = searchParams.get("key")
  if (!key) return NextResponse.json({ error: "key requerida" }, { status: 400, headers: { "Cache-Control": "no-store" } })
  const { data } = await supabase
    .from("platform_settings")
    .select("value")
    .eq("key", key)
    .single()
  return NextResponse.json({ value: data?.value ?? null }, { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } })
}

export async function POST(req: Request) {
  const { key, value } = await req.json()
  if (!key) return NextResponse.json({ error: "key requerida" }, { status: 400, headers: { "Cache-Control": "no-store" } })
  const { error } = await supabase
    .from("platform_settings")
    .upsert({ key, value }, { onConflict: "key" })
  if (error) return NextResponse.json({ error: error.message }, { status: 500, headers: { "Cache-Control": "no-store" } })
  return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } })
}
