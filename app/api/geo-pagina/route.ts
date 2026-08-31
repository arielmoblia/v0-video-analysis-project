import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get("slug")
  if (!slug) return NextResponse.json({ error: "Falta slug" }, { status: 400 })
  const { data } = await supabase.from("geo_paginas").select("*").eq("slug", slug).single()
  return NextResponse.json(data || {})
}

export async function POST(request: Request) {
  const body = await request.json()
  const { slug, key, value } = body
  if (!slug || !key) return NextResponse.json({ error: "Faltan datos" }, { status: 400 })

  const { data: existing } = await supabase.from("geo_paginas").select("contenido").eq("slug", slug).single()
  const contenido = { ...(existing?.contenido || {}), [key]: value }

  await supabase.from("geo_paginas").upsert({ slug, frase: slug, contenido, updated_at: new Date().toISOString() }, { onConflict: "slug" })
  return NextResponse.json({ success: true })
}
