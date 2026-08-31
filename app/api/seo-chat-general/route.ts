import { NextRequest, NextResponse } from "next/server"
import { leerSearchConsole, leerRegistros } from "./lib-fuentes"
import { readFileSync, readdirSync } from "fs"

export const maxDuration = 300

const CONTROL_URL = "http://127.0.0.1:3007/api/chat"
const CLAUDE_KEY = "jefe-claudio-yo"
const LIBRO_DIR = "/var/www/control/memoria/biblioteca/seo-ai"

function leerLibro() {
  try {
    const archivos = readdirSync(LIBRO_DIR).filter(f => f.endsWith(".md")).sort()
    return archivos.map(f => readFileSync(`${LIBRO_DIR}/${f}`, "utf-8")).join("\n\n---\n\n")
  } catch {
    return "(No se pudo leer el libro de SEO AI)"
  }
}

export async function POST(req: NextRequest) {
  try {
    const { message, conversationId } = await req.json()
    if (!message?.trim()) return NextResponse.json({ error: "Mensaje requerido" }, { status: 400 })

    // PASO LEER: juntar las tres fuentes
    const [gsc, registros] = await Promise.all([leerSearchConsole(), leerRegistros()])
    const libro = leerLibro()

    const contexto = `[CONTEXTO PARA TU ANÁLISIS DE SEO — leé esto antes de responder]

=== DATOS REALES DE GOOGLE SEARCH CONSOLE (últimos 28 días) ===
${gsc.ok ? `Clics totales: ${gsc.totalClicks}
Impresiones totales: ${gsc.totalImpressions}
Posición media: ${gsc.posicionMedia}
Top queries reales:
${gsc.topQueries.map(q => `- "${q.query}": ${q.clicks} clics, ${q.impressions} impresiones, posición ${q.position}`).join("\n")}` : `(Error leyendo Search Console: ${gsc.error})`}

=== REGISTROS (Supabase) ===
${registros.ok ? `Tiendas nuevas últimos 7 días: ${registros.nuevasUltimos7dias}` : `(Error: ${registros.error})`}

=== LIBRO DE TEORÍA SEO AI (lo escribiste vos, basado en fuentes oficiales) ===
${libro}

=== FIN DEL CONTEXTO ===

Ahora respondé al mensaje del usuario usando estos datos reales y la teoría del libro. Sé concreto, usá los números reales que ves arriba, y hablá en español simple.

MENSAJE DEL USUARIO: ${message}`

    const r = await fetch(CONTROL_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-claude-key": CLAUDE_KEY },
      body: JSON.stringify({
        agent: "jefe",
        conversationId: conversationId || `seo-general`,
        message: contexto,
        model: "claude-code",
      }),
    })

    const raw = await r.text()
    let texto = ""
    let final = ""
    for (const line of raw.split("\n")) {
      if (!line.startsWith("data:")) continue
      try {
        const data = JSON.parse(line.slice(5).trim())
        if (data.type === "text" && data.delta) texto += data.delta
        if (data.type === "done" && data.message) final = data.message
      } catch {}
    }
    if (final) texto = final

    return NextResponse.json({ reply: texto.trim() || "El Jefe no respondió.", fuentes: { gsc: gsc.ok, registros: registros.ok } })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
