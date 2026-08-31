import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(request: NextRequest) {
  try {
    const { mensaje, imagen, imagenTipo } = await request.json()
    const mediaType = (imagenTipo || "image/jpeg").includes("png") ? "image/png" 
      : (imagenTipo || "image/jpeg").includes("gif") ? "image/gif"
      : (imagenTipo || "image/jpeg").includes("webp") ? "image/webp" : "image/jpeg"

    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system: "Sos Claudio, el asistente de tol.ar. Analizá la imagen que te manda Ariel y respondé en español de forma clara y concisa.",
      messages: [{
        role: "user",
        content: [
          { type: "image", source: { type: "base64", media_type: mediaType, data: imagen } },
          { type: "text", text: mensaje || "Analizá esta imagen y describí qué ves." }
        ]
      }]
    })

    return NextResponse.json({ texto: response.content[0].type === "text" ? response.content[0].text : "No pude analizar la imagen." })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
