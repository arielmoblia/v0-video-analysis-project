import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

const defaultMensajes: Record<string, { mailSubject: string; mailBody: string; waMessage: string }> = {
  g1: {
    mailSubject: "Tu tienda en tol.ar — últimos días antes de liberar el espacio",
    mailBody: `Hola,\n\nTe escribimos porque hace un tiempo creaste tu tienda [nombre de la tienda].tol.ar, pero nunca llegaste a cargar ni un producto.\n\nEntendemos que a veces el día a día no da tiempo, pero necesitamos ese espacio para emprendedores que sí están listos para arrancar. Por eso, si no cargás al menos un producto antes del [fecha], vamos a dar de baja la tienda.\n\nSi todavía te interesa, es simple: entrá a tu panel y sumá tu primer producto. Si no, no hace falta que hagas nada — se va a borrar sola en esa fecha.\n\nCualquier duda, respondé este mail.\n\nEl equipo de tol.ar`,
    waMessage: "Hola 👋 Te escribimos de tol.ar. Creaste tu tienda [nombre de la tienda].tol.ar pero nunca cargaste productos. Si no sumás al menos uno antes del [fecha], la vamos a dar de baja para liberar el lugar para el que realmente quiera hacer su tienda gratis. ¿Seguís interesado en usarla?",
  },
  g2: {
    mailSubject: "Tu tienda en tol.ar — no queremos que se pierda lo que armaste",
    mailBody: `Hola,\n\nTe escribimos porque tu tienda [nombre de la tienda].tol.ar tiene productos cargados, pero hace más de 30 días que no la tocás.\n\nEstuviste cerca de armar algo real — no queremos que se pierda. Si no volvés a entrar antes del [fecha], vamos a dar de baja la tienda para liberar el lugar para el que realmente quiera avanzar.\n\nEntrá a tu panel cuando quieras retomarla.\n\nCualquier duda, respondé este mail.\n\nEl equipo de tol.ar`,
    waMessage: "Hola 👋 Te escribimos de tol.ar. Tu tienda [nombre de la tienda].tol.ar tiene productos cargados pero hace más de 30 días que no la tocás. Si no volvés a entrar antes del [fecha], la vamos a dar de baja para liberar el lugar para el que realmente quiera avanzar. ¿Seguís interesado en usarla?",
  },
  g3: {
    mailSubject: "Tu tienda en tol.ar — ya casi está lista para vender de verdad",
    mailBody: `Hola,\n\nVimos que tu tienda [nombre de la tienda].tol.ar ya tiene productos cargados — eso ya es un montón, la mayoría de la gente ni llega hasta ahí.\n\nPero te falta un paso clave: todavía no tenés cargada ninguna forma de cobrar ni de entregar. Así como está, es un catálogo — nadie te puede comprar nada.\n\nEs rápido de terminar: entrá a tu panel y sumá al menos una forma de cobrar (Mercado Pago, transferencia, lo que uses) y una forma de entregar (envío, retiro en el local, lo que sea). Con eso ya quedás lista para vender.\n\nSi no lo completás antes del [fecha], vamos a dar de baja la tienda para liberar el lugar para alguien que sí la quiera usar de verdad.\n\nCualquier duda, respondé este mail.\n\nEl equipo de tol.ar`,
    waMessage: "Hola 👋 Te escribimos de tol.ar. Tu tienda [nombre de la tienda].tol.ar ya tiene productos cargados, pero te falta sumar una forma de cobrar y de entregar — sin eso nadie te puede comprar. Sumalo antes del [fecha] o la vamos a dar de baja para liberar el lugar. ¿Seguís interesado en terminarla?",
  },
  g4: {
    mailSubject: "Tu tienda en tol.ar ya está lista para vender — ¿nos das el OK para mostrarla en redes?",
    mailBody: `Hola,\n\nTu tienda [nombre de la tienda].tol.ar ya está lista para vender: tiene productos cargados y una forma de cobrar y/o entregar configurada.\n\nQueremos mostrarla gratis en las redes de tol.ar para que te lleguen más clientes. Nosotros armamos el posteo con lo que ya tenés cargado (fotos, nombre, rubro) — vos no tenés que hacer nada más que darnos el OK.\n\nConfirmá acá con un click: [link]\n\nEl equipo de tol.ar`,
    waMessage: "Hola 👋 Te escribimos de tol.ar. Tu tienda [nombre de la tienda].tol.ar está lista para vender. Queremos mostrarla en redes para que te lleguen más clientes. ¿Nos das el OK? Confirmá acá: [link]",
  },
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("platform_settings")
      .select("*")
      .eq("key", "grupo_mensajes_inactivas")
      .maybeSingle()

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching grupo_mensajes_inactivas:", error)
    }

    const saved = data?.value || {}
    return NextResponse.json({
      g1: { ...defaultMensajes.g1, ...(saved.g1 || {}) },
      g2: { ...defaultMensajes.g2, ...(saved.g2 || {}) },
      g3: { ...defaultMensajes.g3, ...(saved.g3 || {}) },
      g4: { ...defaultMensajes.g4, ...(saved.g4 || {}) },
    }, { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } })
  } catch (error) {
    console.error("Error en GET grupo-mensajes:", error)
    return NextResponse.json(defaultMensajes, { headers: { "Cache-Control": "no-store" } })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { group, mailSubject, mailBody, waMessage } = body
    if (!["g1", "g2", "g3", "g4"].includes(group)) {
      return NextResponse.json({ error: "Grupo inválido" }, { status: 400, headers: { "Cache-Control": "no-store" } })
    }

    const { data: existing } = await supabase
      .from("platform_settings")
      .select("*")
      .eq("key", "grupo_mensajes_inactivas")
      .maybeSingle()

    const current = existing?.value || {}
    const updated = { ...current, [group]: { mailSubject, mailBody, waMessage } }

    const { error } = await supabase.from("platform_settings").upsert(
      { key: "grupo_mensajes_inactivas", value: updated, updated_at: new Date().toISOString() },
      { onConflict: "key" },
    )
    if (error) throw error

    return NextResponse.json({ success: true }, { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } })
  } catch (error) {
    console.error("Error guardando grupo-mensajes:", error)
    return NextResponse.json({ error: "Error al guardar" }, { status: 500, headers: { "Cache-Control": "no-store" } })
  }
}
