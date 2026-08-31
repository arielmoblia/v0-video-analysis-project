import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    if (cookieStore.get("super_admin")?.value !== "true") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401, headers: { "Cache-Control": "no-store" } })
    }

    const { frase, frases, prompt: userPrompt, tipo } = await request.json()
    const frasesTexto = frases && frases.length > 1 ? frases.join(", ") : frase

    const prompt = `Sos el redactor SEO de tol.ar, una plataforma de e-commerce argentina gratuita y sin comisiones por venta.

Escribí el contenido para una página SEO que cubra estas frases de búsqueda: "${frasesTexto}"

${userPrompt ? `Instrucciones adicionales del dueño del sitio:\n${userPrompt}\n` : ""}

tol.ar es una plataforma de e-commerce argentina gratuita y sin comisiones por venta. Sus ventajas principales:
- 100% gratis, sin comisión por venta
- Subdominio propio: tutienda.tol.ar
- MercadoPago, Mobbex y MODO integrados
- Sin límite de productos
- Soporte en español

IMPORTANTE: nunca menciones a la competencia por nombre (Tiendanube, Empretienda, Jumpseller, etc.) en ningún título ni contenido, ni siquiera para compararla; si necesitás referirte a ella usá "otras plataformas".

Respondé SOLO con un JSON válido, sin markdown ni texto extra:
{
  "slug": "url-en-minusculas-con-guiones",
  "badge": "texto del badge (ej: Sin comisiones)",
  "titulo": "título principal de la página",
  "subtitulo": "subtítulo descriptivo de 1-2 oraciones",
  "como_funciona_titulo": "título de la sección cómo funciona",
  "paso1_titulo": "título paso 1",
  "paso1_desc": "descripción paso 1",
  "paso2_titulo": "título paso 2", 
  "paso2_desc": "descripción paso 2",
  "paso3_titulo": "título paso 3",
  "paso3_desc": "descripción paso 3",
  "faq1_pregunta": "pregunta frecuente 1",
  "faq1_respuesta": "respuesta frecuente 1",
  "faq2_pregunta": "pregunta frecuente 2",
  "faq2_respuesta": "respuesta frecuente 2",
  "cta_titulo": "título del llamado a la acción",
  "cta_boton": "texto del botón"
}`

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1500,
        messages: [{ role: "user", content: prompt }]
      })
    })

    const data = await res.json()
    const text = data.content?.[0]?.text || ""
    
    let content
    try {
      content = JSON.parse(text)
    } catch {
      const match = text.match(/\{[\s\S]*\}/)
      if (match) content = JSON.parse(match[0])
      else throw new Error("No se pudo parsear el JSON")
    }

    return NextResponse.json({ success: true, content }, { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } })
  } catch (error) {
    return NextResponse.json({ error: "Error generando contenido" }, { status: 500, headers: { "Cache-Control": "no-store" } })
  }
}
