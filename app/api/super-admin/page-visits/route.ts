import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const TOLAR_STORE_ID = "a921029f-9dc7-40ed-ae14-732491c37eee"

export async function GET() {
  const { data, error } = await supabase
    .from("page_views")
    .select("page_path")
    .eq("store_id", TOLAR_STORE_ID)
    .not("page_path", "like", "/admin%")
    .not("page_path", "like", "/api%")

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Contar visitas por page_path
  const counts: Record<string, number> = {}
  for (const row of data || []) {
    const p = row.page_path || "/"
    counts[p] = (counts[p] || 0) + 1
  }

  return NextResponse.json({ visits: counts }, { headers: { "Cache-Control": "no-store" } })
}
