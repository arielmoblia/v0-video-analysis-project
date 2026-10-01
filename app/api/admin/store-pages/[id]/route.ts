import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

async function requireOwnerOfPage(pageId: string) {
  const { data: page } = await supabase.from("store_pages").select("store_id").eq("id", pageId).single()
  if (!page) return null
  const { data: store } = await supabase.from("stores").select("subdomain").eq("id", page.store_id).single()
  if (!store) return null
  const cookieStore = await cookies()
  const isOwner = cookieStore.get(`admin_${store.subdomain.toLowerCase()}`)?.value === "true"
  return isOwner ? page.store_id : null
}

// PATCH - Edita título, contenido, publicado u orden de una página
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const storeId = await requireOwnerOfPage(id)
  if (!storeId) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const body = await request.json()
  const update: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (typeof body.title === "string") update.title = body.title
  if (typeof body.content === "string") update.content = body.content
  if (typeof body.is_published === "boolean") update.is_published = body.is_published
  if (typeof body.display_order === "number") update.display_order = body.display_order

  const { data, error } = await supabase.from("store_pages").update(update).eq("id", id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ page: data })
}

// DELETE - Borra una página
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const storeId = await requireOwnerOfPage(id)
  if (!storeId) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const { error } = await supabase.from("store_pages").delete().eq("id", id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
