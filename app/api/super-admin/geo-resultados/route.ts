import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET() {
  try {
    const cookieStore = await cookies()
    if (cookieStore.get("super_admin")?.value !== "true") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401, headers: { "Cache-Control": "no-store" } })
    }
    const { data } = await supabase.from("geo_resultados").select("*").order("updated_at", { ascending: false })
    return NextResponse.json({ success: true, data }, { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } })
  } catch {
    return NextResponse.json({ error: "Error" }, { status: 500, headers: { "Cache-Control": "no-store" } })
  }
}
