import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { generatePageSlug } from "@/lib/services/store-pages"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

async function requireOwner(storeId: string) {
  const { data: store } = await supabase.from("stores").select("subdomain").eq("id", storeId).single()
  if (!store) return false
  const cookieStore = await cookies()
  return cookieStore.get(`admin_${store.subdomain.toLowerCase()}`)?.value === "true"
}

// GET - Lista todas las páginas (incluye no publicadas) de una tienda, para el admin
export async function GET(request: NextRequest) {
  const storeId = request.nextUrl.searchParams.get("storeId")
  if (!storeId) return NextResponse.json({ error: "storeId requerido" }, { status: 400 })

  const { data, error } = await supabase
    .from("store_pages")
    .select("*")
    .eq("store_id", storeId)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ pages: data || [] })
}

// POST - Crea una página nueva
export async function POST(request: NextRequest) {
  const { storeId, title, content } = await request.json()
  if (!storeId || !title) return NextResponse.json({ error: "Faltan datos" }, { status: 400 })

  if (!(await requireOwner(storeId))) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const baseSlug = generatePageSlug(title) || "pagina"
  let slug = baseSlug
  let attempt = 1
  while (true) {
    const { data: existing } = await supabase
      .from("store_pages")
      .select("id")
      .eq("store_id", storeId)
      .eq("slug", slug)
      .maybeSingle()
    if (!existing) break
    attempt += 1
    slug = `${baseSlug}-${attempt}`
  }

  const { data: countRows } = await supabase.from("store_pages").select("id").eq("store_id", storeId)
  const displayOrder = (countRows || []).length

  const { data, error } = await supabase
    .from("store_pages")
    .insert({ store_id: storeId, slug, title, content: content || "", display_order: displayOrder })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ page: data })
}
