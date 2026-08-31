import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
export async function GET() {
  const { data, error } = await supabase
    .from("seo_pages")
    .select("id, url, noindex, show_in_header, show_in_footer, nav_label, nav_order, meta_title, meta_description, keyword, jurista")
  if (error) return NextResponse.json({ error: error.message }, { status: 500, headers: { "Cache-Control": "no-store" } })
  return NextResponse.json(data, { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } })
}
export async function PATCH(req: Request) {
  const { id, noindex, show_in_header, show_in_footer, nav_label, meta_title, meta_description, keyword, jurista } = await req.json()
  const updates: any = { updated_at: new Date().toISOString() }
  if (noindex !== undefined) updates.noindex = noindex
  if (show_in_header !== undefined) updates.show_in_header = show_in_header
  if (show_in_footer !== undefined) updates.show_in_footer = show_in_footer
  if (nav_label !== undefined) updates.nav_label = nav_label
  if (meta_title !== undefined) updates.meta_title = meta_title
  if (meta_description !== undefined) updates.meta_description = meta_description
  if (keyword !== undefined) updates.keyword = keyword
  if (jurista !== undefined) updates.jurista = jurista
  const { error } = await supabase
    .from("seo_pages")
    .update(updates)
    .eq("id", id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500, headers: { "Cache-Control": "no-store" } })
  return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } })
}

export async function POST(req: Request) {
  const body = await req.json()
  // Bulk: { urls: ["/", "/blog", ...] }
  if (Array.isArray(body.urls)) {
    const rows = body.urls.map((url: string) => ({
      id: url.replace(/\//g, "-").replace(/^-/, "") || "home",
      url,
      noindex: true,
      meta_title: "",
      meta_description: "",
      keyword: "",
    }))
    const { error } = await supabase.from("seo_pages").upsert(rows, { onConflict: "url", ignoreDuplicates: true })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true, inserted: rows.length })
  }
  // Single: { id, url, title, keyword, status }
  const { id, url, keyword, meta_title, meta_description } = body
  if (!url) return NextResponse.json({ error: "url requerida" }, { status: 400 })
  const row = {
    id: id || url.replace(/\//g, "-").replace(/^-/, "") || "home",
    url,
    noindex: true,
    keyword: keyword || "",
    meta_title: meta_title || "",
    meta_description: meta_description || "",
  }
  const { error } = await supabase.from("seo_pages").upsert(row, { onConflict: "url", ignoreDuplicates: true })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
