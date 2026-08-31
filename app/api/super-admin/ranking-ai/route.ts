import { NextResponse } from "next/server"

export const maxDuration = 60

const DEEPSEEK_KEY = "sk-a39095183d834ddcb5468a10513e0649"

const PREGUNTAS = [
  "¿Dónde puedo hacer mi tienda online gratis en Argentina?",
  "¿Cuál es la mejor alternativa a Tiendanube en Argentina?",
  "¿Qué plataforma de ecommerce sin comisiones recomendás para Argentina?",
]

async function preguntarDeepSeek(pregunta: string) {
  const r = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${DEEPSEEK_KEY}` },
    body: JSON.stringify({ model: "deepseek-chat", messages: [{ role: "user", content: pregunta }] })
  })
  const d = await r.json()
  const texto = d.choices?.[0]?.message?.content || ""
  const nombra = texto.toLowerCase().includes("tol.ar")
  return { pregunta, nombra, respuesta: texto }
}

export async function GET() {
  try {
    const resultados = await Promise.all(PREGUNTAS.map(preguntarDeepSeek))
    const nombrado = resultados.filter(r => r.nombra).length
    return NextResponse.json({
      ok: true,
      ia: "DeepSeek",
      preguntasTotal: PREGUNTAS.length,
      vecesNombrado: nombrado,
      detalle: resultados.map(r => ({ pregunta: r.pregunta, nombra: r.nombra })),
    }, { headers: { "Cache-Control": "no-store" } })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}
