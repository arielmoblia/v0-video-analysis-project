import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  const cookieStore = await cookies()
  const isAuthenticated = cookieStore.get("super_admin")?.value === "true"
  if (!isAuthenticated) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401, headers: { "Cache-Control": "no-store" } })
  }

  const { data, error } = await supabase.from("utm_visits").select("utm_source")

  if (error) return NextResponse.json({ error: error.message }, { status: 500, headers: { "Cache-Control": "no-store" } })

  const counts: Record<string, number> = {}
  for (const row of data || []) {
    const src = row.utm_source
    counts[src] = (counts[src] || 0) + 1
  }

  return NextResponse.json({ counts }, { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } })
}
