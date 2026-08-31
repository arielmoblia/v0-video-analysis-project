import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET() {
  const { data, error } = await supabase
    .from("marketing_campaigns")
    .select("*")
    .order("created_at", { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500, headers: { "Cache-Control": "no-store" } })
  return NextResponse.json({ campaigns: data || [] }, { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } })
}

export async function POST(req: Request) {
  const body = await req.json()
  const { accion, datos } = body

  if (accion === "crear") {
    const { nombre, canal } = datos
    const utm = nombre.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
    const { data, error } = await supabase
      .from("marketing_campaigns")
      .insert({ nombre, canal, utm_campaign: utm })
      .select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500, headers: { "Cache-Control": "no-store" } })
    return NextResponse.json({ campaign: data }, { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } })
  }

  if (accion === "repetir") {
    const { id } = datos
    const { data: orig } = await supabase.from("marketing_campaigns").select("*").eq("id", id).single()
    if (!orig) return NextResponse.json({ error: "No encontrada" }, { status: 404, headers: { "Cache-Control": "no-store" } })
    const fecha = new Date().toISOString().slice(0, 10)
    const nuevoNombre = orig.nombre + " — " + fecha
    const utm = nuevoNombre.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
    const { data, error } = await supabase
      .from("marketing_campaigns")
      .insert({ nombre: nuevoNombre, canal: orig.canal, utm_campaign: utm })
      .select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500, headers: { "Cache-Control": "no-store" } })
    return NextResponse.json({ campaign: data }, { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } })
  }

  if (accion === "estado") {
    const { id, estado } = datos
    const { error } = await supabase.from("marketing_campaigns").update({ estado }).eq("id", id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500, headers: { "Cache-Control": "no-store" } })
    return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } })
  }

  return NextResponse.json({ error: "Acción desconocida" }, { status: 400, headers: { "Cache-Control": "no-store" } })
}
