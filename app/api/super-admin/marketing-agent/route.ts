import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import { createClient } from "@supabase/supabase-js"

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

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: `Sos el agente de marketing de tol.ar, plataforma de e-commerce argentina con 0% de comision por venta. Competimos con Tiendanube. Diferencial: plan gratis, 0% comision, facil de usar. Slogan: Claros donde otros son confusos a proposito. Generás contenido concreto listo para publicar basado en datos reales. Respondés SIEMPRE en español argentino informal. Generás exactamente 2 borradores para ${red.toUpperCase()}. Respondés SOLO en JSON valido: {"sugerencias": [{"titulo": "...", "tipo": "...", "motivo": "...", "contenido": "..."}, {"titulo": "...", "tipo": "...", "motivo": "...", "contenido": "..."}]}`,
      messages: [{
        role: "user",
        content: "Datos reales de tol.ar hoy:\n- Tiendas nuevas (7 dias): " + contexto.tiendasNuevas7d + "\n- Tiendas inactivas (30+ dias): " + contexto.tiendasInactivas30d + "\n- Visitas desde " + red + " hoy: " + contexto.visitasDesde + "\n- Keyword sin comisiones en Google: posicion 18\n\nInstrucciones para " + red + ": " + redInstrucciones[red] + "\n\n" + (brief ? "Brief del operador: \"" + brief + "\"" : "Genera las 2 mejores sugerencias basadas en los datos.") + "\n\nResponde SOLO con el JSON."
      }]
    })

    const text = message.content[0].type === "text" ? message.content[0].text : ""
    const clean = text.replace(/```json|```/g, "").trim()
    const data = JSON.parse(clean)

    return NextResponse.json({ ...data, contexto })
  } catch (error) {
    console.error("marketing-agent error:", error)
    return NextResponse.json({ error: "Error generando sugerencias" }, { status: 500 })
  }
}
