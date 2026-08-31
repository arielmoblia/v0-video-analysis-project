import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

// Contenido editable de artículos del blog (título, bajada, cuerpo).
// Si no hay fila para el slug, el artículo usa el texto por defecto hardcodeado en su page.tsx.
export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug")
  if (!slug) return NextResponse.json({ error: "Falta slug" }, { status: 400, headers: { "Cache-Control": "no-store" } })

  const { data } = await supabase.from("blog_articulos_contenido").select("*").eq("slug", slug).maybeSingle()
  return NextResponse.json({ contenido: data || null }, { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } })
}

export async function POST(request: NextRequest) {
  const cookieStore = await cookies()
  if (cookieStore.get("super_admin")?.value !== "true") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401, headers: { "Cache-Control": "no-store" } })
  }

  const { slug, titulo, bajada, cuerpo_html } = await request.json()
  if (!slug) return NextResponse.json({ error: "Falta slug" }, { status: 400, headers: { "Cache-Control": "no-store" } })

  const { error } = await supabase.from("blog_articulos_contenido").upsert(
    { slug, titulo, bajada, cuerpo_html, updated_at: new Date().toISOString() },
    { onConflict: "slug" }
  )
  if (error) return NextResponse.json({ error: error.message }, { status: 500, headers: { "Cache-Control": "no-store" } })

  return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } })
}
