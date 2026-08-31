import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function preguntarleAClaudeCode(mensaje: string, puerto: number): Promise<string> {
  const res = await fetch(`http://localhost:${puerto}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: mensaje, projectPath: "/var/www/tol.ar-dev", allowedTools: [] }),
  })
  const raw = await res.text()
  let fullText = ""
  for (const line of raw.split("\n")) {
    if (!line.trim()) continue
    try {
      const evt = JSON.parse(line)
      if (evt.type !== "claude_json") continue
      const d = evt.data
      if (d.type === "assistant" && d.message?.content) {
        const txt = d.message.content.filter((b: any) => b.type === "text").map((b: any) => b.text).join("")
        if (txt) fullText = txt
      }
      if (d.type === "result" && d.result && !fullText) fullText = d.result
    } catch {}
  }
  return fullText
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("marketing_youtube")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(2)
    if (error) throw error
    return NextResponse.json({ guiones: data || [] }, { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } })
  } catch (error) {
    return NextResponse.json({ error: "Error cargando guiones" }, { status: 500, headers: { "Cache-Control": "no-store" } })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { accion, datos } = await request.json()

    if (accion === "generar") {
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      const { data: newStores } = await supabase
        .from("stores")
        .select("id")
        .gte("created_at", sevenDaysAgo.toISOString())
        .not("subdomain", "like", "%template%")

      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      const { data: inactiveStores } = await supabase
        .from("stores")
        .select("id")
        .lt("updated_at", thirtyDaysAgo.toISOString())
        .not("subdomain", "like", "%template%")

      const tiendasNuevas = newStores?.length || 0
      const tiendasInactivas = inactiveStores?.length || 0

      const promptCompleto = `Sos el agente de marketing de tol.ar, plataforma de e-commerce argentina con 0% de comision por venta. Diferencial: plan gratis, 0% comision, facil de usar. Slogan: Claros donde otros son confusos a proposito. Generás guiones de YouTube Shorts de 30 segundos basados en datos reales. Respondés SOLO en JSON valido sin markdown ni backticks. IMPORTANTE: nunca menciones a la competencia por nombre (Tiendanube, Empretienda, Jumpseller, etc.) en ningun titulo ni contenido, ni siquiera para compararla; si necesitas referirte a ella usa "otras plataformas".

Datos reales de tol.ar:
- Tiendas nuevas (7 dias): ${tiendasNuevas}
- Tiendas inactivas (30+ dias): ${tiendasInactivas}

Target del operador:
- Audiencia: ${datos.target_audiencia}
- Ubicacion: ${datos.target_ubicacion}
- Perfil: ${datos.target_perfil}
- Objetivo: ${datos.target_objetivo}

${datos.notas ? "Notas: " + datos.notas : ""}

Genera 2 guiones distintos de YouTube Short. Cada uno con escenas de 30 segundos.
Responde SOLO con este JSON:
{
  "guiones": [
    {
      "titulo": "...",
      "escenas": [
        {"tiempo": "[0-3s]", "texto": "..."},
        {"tiempo": "[4-10s]", "texto": "..."},
        {"tiempo": "[11-20s]", "texto": "..."},
        {"tiempo": "[21-27s]", "texto": "..."},
        {"tiempo": "[28-30s]", "texto": "..."}
      ],
      "hashtags": "#... #... #..."
    },
    {
      "titulo": "...",
      "escenas": [...],
      "hashtags": "..."
    }
  ]
}

Responde SOLO con el JSON, nada más.`

      let text = await preguntarleAClaudeCode(promptCompleto, 4001)
      if (/usage limit|rate limit|rate_limit|session limit/i.test(text)) {
        text = await preguntarleAClaudeCode(promptCompleto, 4002)
      }
      const clean = text.replace(/```json|```/g, "").trim()
      const parsed = JSON.parse(clean)

      await supabase.from("marketing_youtube").delete().neq("id", "00000000-0000-0000-0000-000000000000")

      const inserts = parsed.guiones.map((g: any) => ({
        target_audiencia: datos.target_audiencia,
        target_ubicacion: datos.target_ubicacion,
        target_perfil: datos.target_perfil,
        target_objetivo: datos.target_objetivo,
        guion_titulo: g.titulo,
        guion_escenas: g.escenas,
        guion_hashtags: g.hashtags,
        notas: datos.notas || "",
        estado: "borrador"
      }))

      const { data: saved, error } = await supabase
        .from("marketing_youtube")
        .insert(inserts)
        .select()

      if (error) throw error
      return NextResponse.json({ guiones: saved }, { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } })
    }

    if (accion === "cargar-config") {
      const { data, error } = await supabase
        .from("marketing_config")
        .select("*")
        .limit(1)
        .single()
      if (error && error.code !== "PGRST116") throw error
      return NextResponse.json({ config: data || null }, { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } })
    }

    if (accion === "guardar-config") {
      const { data: existing } = await supabase
        .from("marketing_config")
        .select("id")
        .limit(1)
        .single()
      if (existing?.id) {
        const { error } = await supabase
          .from("marketing_config")
          .update({ ...datos, updated_at: new Date().toISOString() })
          .eq("id", existing.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from("marketing_config")
          .insert(datos)
        if (error) throw error
      }
      return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } })
    }

    if (accion === "listar-generadores") {
      const { data, error } = await supabase
        .from("marketing_generadores")
        .select("id, nombre, api_key, endpoint")
        .eq("activo", true)
        .order("created_at", { ascending: true })
      if (error) throw error
      return NextResponse.json({ generadores: data || [] }, { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } })
    }

    if (accion === "agregar-generador") {
      const { data, error } = await supabase
        .from("marketing_generadores")
        .insert({ nombre: datos.nombre, api_key: datos.api_key || "", endpoint: datos.endpoint || "", activo: true })
        .select()
        .single()
      if (error) throw error
      return NextResponse.json({ generador: data }, { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } })
    }

    if (accion === "actualizar") {
      const { id, ...campos } = datos
      const { error } = await supabase
        .from("marketing_youtube")
        .update({ ...campos, updated_at: new Date().toISOString() })
        .eq("id", id)
      if (error) throw error
      return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } })
    }

    return NextResponse.json({ error: "Accion no reconocida" }, { status: 400, headers: { "Cache-Control": "no-store" } })
  } catch (error) {
    console.error("marketing-youtube error:", error)
    return NextResponse.json({ error: "Error en el servidor" }, { status: 500, headers: { "Cache-Control": "no-store" } })
  }
}
