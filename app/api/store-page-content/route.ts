import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

// Contenido de paginas legales por tienda.
// Por defecto una tienda hereda el texto de tol.ar (tabla page_content).
// Si el dueño edita algo, esa key queda guardada en store_legal_content y ya no hereda mas cambios de tol.ar para esa key puntual.
export async function GET(request: NextRequest) {
  const page = request.nextUrl.searchParams.get("page")
  const subdomain = request.nextUrl.searchParams.get("subdomain")
  if (!page || !subdomain) return NextResponse.json({ error: "Faltan datos" }, { status: 400 })

  const { data: globalRows } = await supabase.from("page_content").select("*").eq("page", page)
  const content: Record<string, string> = {}
  globalRows?.forEach(row => { content[row.key] = row.value })

  const { data: store } = await supabase.from("stores").select("id").ilike("subdomain", subdomain).single()
  if (store) {
    const { data: storeRows } = await supabase.from("store_legal_content").select("*").eq("store_id", store.id).eq("page", page)
    storeRows?.forEach(row => { content[row.key] = row.value })
  }

  return NextResponse.json(content)
}

export async function POST(request: NextRequest) {
  const { subdomain, page, key, value } = await request.json()
  if (!subdomain || !page || !key) return NextResponse.json({ error: "Faltan datos" }, { status: 400 })

  const cookieStore = await cookies()
  if (cookieStore.get(`admin_${String(subdomain).toLowerCase()}`)?.value !== "true") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const { data: store } = await supabase.from("stores").select("id").ilike("subdomain", subdomain).single()
  if (!store) return NextResponse.json({ error: "Tienda no encontrada" }, { status: 404 })

  const { error } = await supabase.from("store_legal_content").upsert(
    { store_id: store.id, page, key, value, updated_at: new Date().toISOString() },
    { onConflict: "store_id,page,key" }
  )
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
