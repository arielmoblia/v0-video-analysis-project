import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

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

export async function POST(request: NextRequest) {
  try {
    const { red, brief } = await request.json()

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

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

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const referrerMap: Record<string, string> = {
      facebook: "facebook.com",
      instagram: "instagram.com",
      whatsapp: "whatsapp.com",
      tiktok: "tiktok.com",
      youtube: "youtube.com"
    }
    const { data: socialVisits } = await supabase
      .from("page_views")
      .select("id")
      .ilike("referrer", "%" + referrerMap[red] + "%")
      .gte("created_at", today.toISOString())

    const contexto = {
      tiendasNuevas7d: newStores?.length || 0,
      tiendasInactivas30d: inactiveStores?.length || 0,
      visitasDesde: socialVisits?.length || 0,
      red
    }

    const redInstrucciones: Record<string, string> = {
      facebook: "Posts para grupos de vendedores argentinos y para la pagina de tol.ar. Tono cercano, directo. Sin hashtags excesivos. Maximo 150 palabras.",
      instagram: "Stories de 3 slides o Reels con guion. Tono visual, conciso. Incluir hashtags relevantes. Maximo 100 palabras.",
      whatsapp: "Mensajes cortos para grupos de vendedores. Muy informal, como un mensaje real. Maximo 80 palabras.",
      tiktok: "Guion de video corto 30-60 segundos. Formato [tiempo] accion. Hook fuerte en los primeros 3 segundos.",
      youtube: "Guion de YouTube Short de 30-60 segundos. Formato [tiempo] accion. Hook, problema, solucion, CTA. Optimizado para SEO."
    }

    const promptCompleto = `Sos el agente de marketing de tol.ar, plataforma de e-commerce argentina con 0% de comision por venta. Diferencial: plan gratis, 0% comision, facil de usar. Slogan: Claros donde otros son confusos a proposito. Generás contenido concreto listo para publicar basado en datos reales. Respondés SIEMPRE en español argentino informal. IMPORTANTE: nunca menciones a la competencia por nombre (Tiendanube, Empretienda, Jumpseller, etc.) en ningun titulo ni contenido, ni siquiera para compararla; si necesitas referirte a ella usa "otras plataformas". Generás exactamente 2 borradores para ${red.toUpperCase()}. Respondés SOLO en JSON valido, sin texto antes ni después, sin bloques de markdown: {"sugerencias": [{"titulo": "...", "tipo": "...", "motivo": "...", "contenido": "..."}, {"titulo": "...", "tipo": "...", "motivo": "...", "contenido": "..."}]}

Datos reales de tol.ar hoy:
- Tiendas nuevas (7 dias): ${contexto.tiendasNuevas7d}
- Tiendas inactivas (30+ dias): ${contexto.tiendasInactivas30d}
- Visitas desde ${red} hoy: ${contexto.visitasDesde}
- Keyword sin comisiones en Google: posicion 18

Instrucciones para ${red}: ${redInstrucciones[red]}

${brief ? `Brief del operador: "${brief}"` : "Genera las 2 mejores sugerencias basadas en los datos."}

Responde SOLO con el JSON, nada más.`

    let text = await preguntarleAClaudeCode(promptCompleto, 4001)
    if (/usage limit|rate limit|rate_limit|session limit/i.test(text)) {
      text = await preguntarleAClaudeCode(promptCompleto, 4002)
    }
    const clean = text.replace(/```json|```/g, "").trim()
    const data = JSON.parse(clean)

    return NextResponse.json({ ...data, contexto }, { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } })
  } catch (error) {
    console.error("marketing-agent error:", error)
    return NextResponse.json({ error: "Error generando sugerencias" }, { status: 500, headers: { "Cache-Control": "no-store" } })
  }
}
