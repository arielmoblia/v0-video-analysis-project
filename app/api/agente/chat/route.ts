import { NextRequest } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SISTEMA = `Sos Claudio. Respondés SIEMPRE en máximo 2 oraciones. Sin saludos, sin empatía, sin listas, sin bullets, sin explicaciones no pedidas. Solo la respuesta exacta a lo que se preguntó. Si necesitás más de 2 oraciones, algo está mal.

Tenés acceso a dos herramientas:
- VER_DATOS: para consultar información real de Supabase (merchants, ventas, actividad)
- EJECUTAR_ACCION: para ordenarle al agente que ejecute algo (mandar mails, WhatsApp, etc.)

REGLAS:
- Para saludos, preguntas generales o conversación → respondé directo, sin usar herramientas
- Solo usás VER_DATOS cuando necesitás datos reales de la plataforma
- Solo usás EJECUTAR_ACCION cuando Ariel aprueba una acción concreta
- NUNCA ejecutes nada sin aprobación explícita de Ariel
- Cuando propongas una acción, mostrá exactamente qué vas a hacer y esperá el OK`

async function consultarAgente(consulta: string): Promise<string> {
  try {
    const res = await fetch("http://localhost:3001/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mensaje: "VER_DATOS: " + consulta })
    })
    const reader = res.body!.getReader()
    const decoder = new TextDecoder()
    let resultado = ""
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      const chunk = decoder.decode(value)
      const lines = chunk.split("\n").filter(l => l.startsWith("data: "))
      for (const line of lines) {
        try {
          const data = JSON.parse(line.replace("data: ", ""))
          if (data.tipo === "final" && data.texto) resultado = data.texto
        } catch(e) {}
      }
    }
    return resultado || "No obtuve datos"
  } catch(e: any) {
    return "Error consultando datos: " + e.message
  }
}

export async function POST(request: NextRequest) {
  const { mensaje, historial = [] } = await request.json()
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      const send = (texto: string, tipo = "texto") => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ tipo, texto })}\n\n`))
      }

      try {
        const mensajes = [
          ...historial.slice(-6),
          { role: "user" as const, content: mensaje }
        ]

        const respuesta = await client.messages.create({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 1024,
          system: SISTEMA,
          messages: mensajes
        })

        let texto = respuesta.content[0].type === "text" ? respuesta.content[0].text : ""

        if (texto.includes("VER_DATOS:")) {
          const match = texto.match(/VER_DATOS:\s*(.+)/);
          if (match) {
            send("Consultando datos...", "progreso")
            const datos = await consultarAgente(match[1].trim())
            const respFinal = await client.messages.create({
              model: "claude-haiku-4-5-20251001",
              max_tokens: 1024,
              system: SISTEMA,
              messages: [
                ...mensajes,
                { role: "assistant" as const, content: texto },
                { role: "user" as const, content: "Datos obtenidos:\n" + datos }
              ]
            })
            texto = respFinal.content[0].type === "text" ? respFinal.content[0].text : texto
          }
        }

        send(texto, "final")
      } catch(e: any) {
        send("Error: " + e.message, "final")
      }
      controller.close()
    }
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive"
    }
  })
}
