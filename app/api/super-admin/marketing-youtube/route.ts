import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("marketing_youtube")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(2)
    if (error) throw error
    return NextResponse.json({ guiones: data || [] })
  } catch (error) {
    return NextResponse.json({ error: "Error cargando guiones" }, { status: 500 })
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

      const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

      const message = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2000,
        system: `Sos el agente de marketing de tol.ar, plataforma de e-commerce argentina con 0% de comision por venta. Competimos con Tiendanube. Diferencial: plan gratis, 0% comision, facil de usar. Slogan: Claros donde otros son confusos a proposito. Generás guiones de YouTube Shorts de 30 segundos basados en datos reales. Respondés SOLO en JSON valido sin markdown ni backticks.`,
        messages: [{
          role: "user",
          content: `Datos reales de tol.ar:
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
}`
        }]
      })

      const text = message.content[0].type === "text" ? message.content[0].text : ""
      const clean = text.replace(/\`\`\`json|\`\`\`/g, "").trim()
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
      return NextResponse.json({ guiones: saved })
    }

    if (accion === "cargar-config") {
      const { data, error } = await supabase
        .from("marketing_config")
        .select("*")
        .limit(1)
        .single()
      if (error && error.code !== "PGRST116") throw error
      return NextResponse.json({ config: data || null })
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
      return NextResponse.json({ ok: true })
    }

    if (accion === "listar-generadores") {
      const { data, error } = await supabase
        .from("marketing_generadores")
        .select("id, nombre, api_key, endpoint")
        .eq("activo", true)
        .order("created_at", { ascending: true })
      if (error) throw error
      return NextResponse.json({ generadores: data || [] })
    }

    if (accion === "agregar-generador") {
      const { data, error } = await supabase
        .from("marketing_generadores")
        .insert({ nombre: datos.nombre, api_key: datos.api_key || "", endpoint: datos.endpoint || "", activo: true })
        .select()
        .single()
      if (error) throw error
      return NextResponse.json({ generador: data })
    }

    if (accion === "actualizar") {
      const { id, ...campos } = datos
      const { error } = await supabase
        .from("marketing_youtube")
        .update({ ...campos, updated_at: new Date().toISOString() })
        .eq("id", id)
      if (error) throw error
      return NextResponse.json({ ok: true })
    }

    return NextResponse.json({ error: "Accion no reconocida" }, { status: 400 })
  } catch (error) {
    console.error("marketing-youtube error:", error)
    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 })
  }
}
