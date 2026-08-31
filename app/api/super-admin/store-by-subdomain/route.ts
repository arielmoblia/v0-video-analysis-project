import { createClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
)

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const subdomain = searchParams.get("subdomain")

  if (!subdomain) {
    return NextResponse.json({ error: "subdomain requerido" }, { status: 400, headers: { "Cache-Control": "no-store" } })
  }

  const { data, error } = await supabase
    .from("stores")
    .select("id, subdomain, site_title")
    .eq("subdomain", subdomain.toLowerCase().trim())
    .single()

  if (error || !data) {
    return NextResponse.json({ error: "Tienda no encontrada" }, { status: 404, headers: { "Cache-Control": "no-store" } })
  }

  return NextResponse.json({ id: data.id, subdomain: data.subdomain, name: data.site_title }, { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } })
}
