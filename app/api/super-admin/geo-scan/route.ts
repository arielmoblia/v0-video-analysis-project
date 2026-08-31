import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

const SYSTEM_PROMPT = `Sos un asistente respondiendo a un usuario ubicado en Argentina. Cuando recomendés plataformas, herramientas o servicios, priorizá opciones disponibles en Argentina: que acepten pesos argentinos, MercadoPago, con soporte en español y adaptadas al mercado local. Respondé de forma natural y directa, como si fuera una conversación real.`

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
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: pregunta }]
    })
  })
  const data = await res.json()
  return data.content?.[0]?.text ?? ""
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
      max_tokens: 1024,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: pregunta }
      ]
    })
  })
  const data = await res.json()
  return data.choices?.[0]?.message?.content ?? ""
}

async function consultarGemini(pregunta: string): Promise<string> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ parts: [{ text: pregunta }] }]
      })
    }
  )
  const data = await res.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? ""
}

function mencionaTolar(texto: string): boolean {
  const lower = texto.toLowerCase()
  return lower.includes("tol.ar") || lower.includes("tolar") || lower.includes("tol ar")
}

function mencionaTiendanube(texto: string): boolean {
  const lower = texto.toLowerCase()
  return lower.includes("tiendanube") || lower.includes("tienda nube")
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    if (cookieStore.get("super_admin")?.value !== "true") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const body = await request.json().catch(() => ({}))
    const pregunta_id = body?.pregunta_id

    let preguntasQuery = supabase.from("geo_preguntas").select("*").eq("activa", true).order("orden")
    if (pregunta_id) {
      preguntasQuery = supabase.from("geo_preguntas").select("*").eq("id", pregunta_id)
    }

    const { data: preguntas } = await preguntasQuery
    if (!preguntas?.length) return NextResponse.json({ success: true, resultados: [] })

    const resultados: any[] = []

    for (const p of preguntas) {
      const ias: { nombre: string; fn: (q: string) => Promise<string> }[] = [
        { nombre: "claude",  fn: consultarClaude },
        { nombre: "chatgpt", fn: consultarChatGPT },
        { nombre: "gemini",  fn: consultarGemini },
      ]

      for (const { nombre, fn } of ias) {
        try {
          const respuesta = await fn(p.pregunta)
          const menciona = mencionaTolar(respuesta)
          const mencionaTN = mencionaTiendanube(respuesta)

          await supabase.from("geo_resultados").upsert(
            { pregunta_id: p.id, ia: nombre, respuesta, menciona_tolar: menciona, updated_at: new Date().toISOString() },
            { onConflict: "pregunta_id,ia" }
          )

          // Guardar historial para métricas hoy/semana/mes
          const { error: histErr } = await supabase.from("geo_resultados_historial").insert({
            pregunta_id: p.id,
            ia: nombre,
            menciona_tolar: menciona,
            menciona_tiendanube: mencionaTN,
          })
          if (histErr) console.warn("[geo-scan] historial insert failed:", histErr.message)

          resultados.push({ pregunta: p.pregunta, ia: nombre, menciona_tolar: menciona, menciona_tiendanube: mencionaTN })
        } catch (e: any) {
          resultados.push({ pregunta: p.pregunta, ia: nombre, error: e.message })
        }
      }
    }

    return NextResponse.json({ success: true, resultados }, { headers: { "Cache-Control": "no-store" } })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies()
    if (cookieStore.get("super_admin")?.value !== "true") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { data } = await supabase
      .from("geo_resultados")
      .select("*, geo_preguntas(pregunta)")
      .order("updated_at", { ascending: false })

    return NextResponse.json({ success: true, data }, { headers: { "Cache-Control": "no-store" } })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
