import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

const COMPETIDORES = ["tol.ar", "tiendanube", "empretienda", "pistacho", "mitienda"]

async function consultarGemini(pregunta: string): Promise<string> {
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: pregunta }] }]
    })
  })
  const data = await res.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text || ""
}

async function consultarChatGPT(pregunta: string): Promise<string> {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      max_tokens: 500,
      messages: [{ role: "user", content: pregunta }]
    })
  })
  const data = await res.json()
  return data.choices?.[0]?.message?.content || ""
}

async function consultarClaude(pregunta: string): Promise<string> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 500,
      messages: [{ role: "user", content: pregunta }]
    })
  })
  const data = await res.json()
  return data.content?.[0]?.text || ""
}

function analizarRespuesta(texto: string): Record<string, boolean> {
  const textoLower = texto.toLowerCase()
  const resultado: Record<string, boolean> = {}
  for (const comp of COMPETIDORES) {
    resultado[comp] = textoLower.includes(comp.replace(".ar", "").toLowerCase())
  }
  return resultado
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    if (cookieStore.get("super_admin")?.value !== "true") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401, headers: { "Cache-Control": "no-store" } })
    }

    const { preguntas } = await request.json()

    const resultados = []

    for (const p of preguntas) {
      const [respGemini, respClaude, respChatGPT] = await Promise.all([
        consultarGemini(p.pregunta).catch(() => ""),
        consultarClaude(p.pregunta).catch(() => ""),
        consultarChatGPT(p.pregunta).catch(() => ""),
      ])

      const gemini = analizarRespuesta(respGemini)
      const claude = analizarRespuesta(respClaude)
      const chatgpt = analizarRespuesta(respChatGPT)

      resultados.push({
        id: p.id,
        pregunta: p.pregunta,
        gemini,
        claude,
        chatgpt,
        perplexity: null,
      })

      await supabase.from("geo_resultados").upsert({
        pregunta_id: p.id,
        ia: "gemini",
        respuesta: respGemini,
        menciona_tolar: gemini["tol.ar"],
        updated_at: new Date().toISOString()
      }, { onConflict: "pregunta_id,ia" })

      await supabase.from("geo_resultados").upsert({
        pregunta_id: p.id,
        ia: "claude",
        respuesta: respClaude,
        menciona_tolar: claude["tol.ar"],
        updated_at: new Date().toISOString()
      }, { onConflict: "pregunta_id,ia" })

      await supabase.from("geo_resultados").upsert({
        pregunta_id: p.id,
        ia: "chatgpt",
        respuesta: respChatGPT,
        menciona_tolar: chatgpt["tol.ar"],
        updated_at: new Date().toISOString()
      }, { onConflict: "pregunta_id,ia" })
    }

    return NextResponse.json({ success: true, resultados }, { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } })
  } catch (error) {
    return NextResponse.json({ error: "Error" }, { status: 500, headers: { "Cache-Control": "no-store" } })
  }
}
