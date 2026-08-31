import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const DEEPSEEK_KEY = process.env.DEEPSEEK_API_KEY!

async function callDeepSeek(prompt: string): Promise<string> {
  const res = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${DEEPSEEK_KEY}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1200,
    }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error?.message || "DeepSeek error")
  return data.choices[0].message.content.trim()
}

export async function POST(req: NextRequest) {
  const { page, keyword, title } = await req.json()
  if (!page || !keyword) {
    return NextResponse.json({ error: "Falta page o keyword" }, { status: 400 })
  }

  const prompt = `Sos un experto en SEO para tiendas online en Argentina. Escribí un bloque de contenido rico en palabras clave para la página "${title || page}" de tol.ar, cuyo tema principal es: "${keyword}".

El texto debe:
- Estar en español rioplatense (vos, ustedes, Argentina)
- Tener entre 350 y 500 palabras en total
- Ser genuinamente útil e informativo para el lector
- Incluir el keyword "${keyword}" naturalmente varias veces
- Estar organizado con 3-4 párrafos y opcionalmente un subtítulo (## Subtítulo)
- No mencionar precios específicos ni hacer promesas falsas
- Hablar de tol.ar como plataforma de e-commerce argentina
- NO usar markdown con asteriscos para negritas

Devolvé SOLO el texto, sin introducción ni comentarios adicionales.`

  const content = await callDeepSeek(prompt)

  const { error } = await supabase
    .from("page_content")
    .upsert(
      { page, key: "seo_extra", value: content, updated_at: new Date().toISOString() },
      { onConflict: "page,key" }
    )

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, content, palabras: content.split(/\s+/).filter(w => w.length > 3).length })
}
