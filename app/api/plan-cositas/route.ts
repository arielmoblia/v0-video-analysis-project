import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET() {
  const { data } = await supabase.from("page_content").select("*").eq("page", "plan-cositas")
  const content: Record<string, string> = {}
  data?.forEach(row => { content[row.key] = row.value })
  return NextResponse.json(content)
}

export async function POST(request: NextRequest) {
  const cookieStore = await cookies()
  if (cookieStore.get("super_admin")?.value !== "true") return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  const { key, value } = await request.json()
  const { error } = await supabase.from("page_content").upsert({ page: "plan-cositas", key, value, updated_at: new Date().toISOString() }, { onConflict: "page,key" })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
