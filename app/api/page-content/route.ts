import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(request: NextRequest) {
  const page = request.nextUrl.searchParams.get("page")
  if (!page) return NextResponse.json({ error: "Falta page" }, { status: 400 })
  const { data } = await supabase.from("page_content").select("*").eq("page", page)
  const content: Record<string, string> = {}
  data?.forEach(row => { content[row.key] = row.value })
  return NextResponse.json(content)
}

export async function POST(request: NextRequest) {
  const cookieStore = await cookies()
  if (cookieStore.get("super_admin")?.value !== "true") return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  const { page, key, value } = await request.json()
  if (!page || !key) return NextResponse.json({ error: "Faltan datos" }, { status: 400 })
  const { error } = await supabase.from("page_content").upsert({ page, key, value, updated_at: new Date().toISOString() }, { onConflict: "page,key" })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
