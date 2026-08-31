import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
const WA_SERVICE = "http://localhost:3200"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const accion = searchParams.get("accion") || "status"

  if (accion === "status") {
    try {
      const res = await fetch(`${WA_SERVICE}/status`)
      const data = await res.json()
      return NextResponse.json(data, { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } })
    } catch {
      return NextResponse.json({ status: "offline", phoneNumber: null, qr: null }, { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } })
    }
  }

  if (accion === "contacts") {
    const { data } = await supabase
      .from("whatsapp_contacts")
      .select("*")
      .order("created_at", { ascending: false })
    return NextResponse.json({ contacts: data || [] }, { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } })
  }

  if (accion === "messages") {
    const { data } = await supabase
      .from("whatsapp_messages")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50)
    return NextResponse.json({ messages: data || [] }, { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } })
  }

  if (accion === "grupos") {
    try {
      const res = await fetch(`${WA_SERVICE}/grupos`)
      const data = await res.json()
      const { data: ocultos } = await supabase.from("whatsapp_grupos_ocultos").select("grupo_id")
      const ocultoIds = new Set((ocultos || []).map((o: any) => o.grupo_id))
      const grupos = (data.grupos || []).map((g: any) => ({ ...g, oculto: ocultoIds.has(g.id) }))
      return NextResponse.json({ grupos }, { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } })
    } catch {
      return NextResponse.json({ grupos: [] }, { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } })
    }
  }

  if (accion === "campanas-activas") {
    const { data } = await supabase.from("whatsapp_campanas").select("*").eq("estado","activa").order("created_at",{ascending:false})
    return NextResponse.json({ campanas: data || [] }, { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } })
  }

  if (accion === "grupo-miembros") {
    const id = searchParams.get("id") || ""
    const limite = searchParams.get("limite") || "50"
    const offset = searchParams.get("offset") || "0"
    const incluir_admins = searchParams.get("incluir_admins") || "false"
    try {
      const res = await fetch(`${WA_SERVICE}/grupo-miembros?id=${id}&limite=${limite}&offset=${offset}&incluir_admins=${incluir_admins}`)
      const data = await res.json()
      return NextResponse.json(data, { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } })
    } catch {
      return NextResponse.json({ miembros: [] }, { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } })
    }
  }

  if (accion === "merchants") {
    const { data } = await supabase
      .from("stores")
      .select("id, site_title, subdomain, social_whatsapp, email")
      .not("social_whatsapp", "is", null)
      .neq("social_whatsapp", "")
      .eq("is_active", true)
      .eq("whatsapp_marketing_consent", true)
      .order("created_at", { ascending: false })
    return NextResponse.json({ merchants: data || [] }, { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } })
  }

  return NextResponse.json({ error: "Acción desconocida" }, { status: 400, headers: { "Cache-Control": "no-store" } })
}

export async function POST(req: Request) {
  const body = await req.json()
  const { accion, datos } = body

  if (accion === "send") {
    const { number, message, imageUrl } = datos
    try {
      const res = await fetch(`${WA_SERVICE}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ number, message, imageUrl })
      })
      const data = await res.json()
      return NextResponse.json(data, { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } })
    } catch {
      return NextResponse.json({ ok: false, error: "Servicio no disponible" }, { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } })
    }
  }

  if (accion === "ocultar-grupo") {
    const { grupo_id } = datos
    await supabase.from("whatsapp_grupos_ocultos").upsert({ grupo_id })
    return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } })
  }

  if (accion === "mostrar-grupo") {
    const { grupo_id } = datos
    await supabase.from("whatsapp_grupos_ocultos").delete().eq("grupo_id", grupo_id)
    return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } })
  }

  if (accion === "pausar-campana") {
    const { id } = datos
    await supabase.from("whatsapp_campanas").update({ estado: "pausada", updated_at: new Date().toISOString() }).eq("id", id)
    return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } })
  }

  if (accion === "cancelar-campana") {
    const { id } = datos
    await supabase.from("whatsapp_campanas").update({ estado: "cancelada", updated_at: new Date().toISOString() }).eq("id", id)
    return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } })
  }

  if (accion === "guardar-campana") {
    const { grupo_id, grupo_nombre, total_miembros, offset_actual, limite_diario, mensaje, imagen_url } = datos
    const { data, error } = await supabase.from("whatsapp_campanas")
      .upsert({ grupo_id, grupo_nombre, total_miembros, offset_actual, limite_diario, mensaje, imagen_url, estado: "activa", updated_at: new Date().toISOString() }, { onConflict: "grupo_id" })
      .select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500, headers: { "Cache-Control": "no-store" } })
    return NextResponse.json({ campana: data }, { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } })
  }

  if (accion === "broadcast") {
    const { numbers, message, imageUrl, interval, nombre_campania } = datos
    try {
      const { data: msg } = await supabase
        .from("whatsapp_messages")
        .insert({
          tipo: "broadcast",
          mensaje: message,
          imagen_url: imageUrl || null,
          destinatarios: numbers.length,
          estado: "enviando"
        })
        .select().single()

      const res = await fetch(`${WA_SERVICE}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ numbers, message, imageUrl, interval })
      })
      const result = await res.json()

      if (msg) {
        await supabase.from("whatsapp_messages").update({
          enviados: result.sent || 0,
          fallidos: result.failed || 0,
          estado: "enviado"
        }).eq("id", msg.id)
      }

      return NextResponse.json(result, { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } })
    } catch {
      return NextResponse.json({ ok: false, error: "Error en broadcast" }, { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } })
    }
  }

  if (accion === "add-contact") {
    const { nombre, numero, etiqueta } = datos
    const { data, error } = await supabase
      .from("whatsapp_contacts")
      .insert({ nombre, numero, etiqueta })
      .select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500, headers: { "Cache-Control": "no-store" } })
    return NextResponse.json({ contact: data }, { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } })
  }

  return NextResponse.json({ error: "Acción desconocida" }, { status: 400, headers: { "Cache-Control": "no-store" } })
}
