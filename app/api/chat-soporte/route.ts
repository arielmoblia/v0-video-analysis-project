const AGENTES = ["Tomi", "Ariel", "Belkis", "Franchesca", "Guada", "Dante"]

function getSystemPrompt() {
  return `Sos parte del equipo de soporte de tol.ar.

tol.ar es una plataforma para crear tiendas online en Argentina. Simple, gratis y sin comisiones.

ESTILO:
- Frases MUY cortas, como WhatsApp desde el celu
- Máximo 1-2 oraciones. A veces solo 3-4 palabras.
- Informal, minúsculas a veces
- Sin emojis exagerados
- Nunca decís que sos IA o bot
- Nunca decís tu nombre
- Si no sabés: "no sé bien, te paso con alguien 🙏"
- Nunca inventás info

PLANES:
1. GRATIS ($0): productos ilimitados, tienda completa, MercadoPago
2. COSITAS: pagás solo lo que usás. Ver tol.ar/plan-cositas
3. SOCIO: 10% por venta, sin mensualidad, nosotros ponemos publicidad
4. PERSONALIZADO: todo a medida, nuestro equipo configura todo

PAGOS: MercadoPago, plata directo al vendedor
ENVÍOS: Andreani, Correo Argentino, envío propio, retiro en local
CONTACTO: este chat, WhatsApp, soporte@tiendaonline.com.ar`
}

export async function POST(req: Request) {
  try {
    const url = new URL(req.url)
    const agentName = url.searchParams.get("agent") || "Tomi"
    const validAgent = AGENTES.includes(agentName) ? agentName : "Tomi"
    const { messages: rawMessages } = await req.json()
    // AI SDK v3 manda parts, DeepSeek necesita content
    const messages = rawMessages.map((m: any) => ({
      role: m.role,
      content: m.content ?? m.parts?.filter((p: any) => p.type === "text").map((p: any) => p.text).join("") ?? ""
    }))

    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000))

    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: getSystemPrompt() },
          ...messages
        ],
        max_tokens: 300,
        temperature: 0.8,
        stream: true,
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      console.error("DeepSeek error:", err)
      return new Response("Error en el chat", { status: 500 })
    }

    // Stream directo al cliente
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        controller.enqueue(encoder.encode('data: {"type":"start"}\n\n'))
        controller.enqueue(encoder.encode('data: {"type":"start-step"}\n\n'))
        controller.enqueue(encoder.encode('data: {"type":"text-start","id":"txt-0"}\n\n'))

        const reader = response.body!.getReader()
        const decoder = new TextDecoder()
        let buffer = ""

        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split("\n")
          buffer = lines.pop() || ""
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6).trim()
              if (data === "[DONE]") continue
              try {
                const json = JSON.parse(data)
                const delta = json.choices?.[0]?.delta?.content
                if (delta) {
                  const escaped = JSON.stringify(delta)
                  controller.enqueue(encoder.encode(`data: {"type":"text-delta","id":"txt-0","delta":${escaped}}\n\n`))
                }
              } catch {}
            }
          }
        }

        controller.enqueue(encoder.encode('data: {"type":"text-end","id":"txt-0"}\n\n'))
        controller.enqueue(encoder.encode('data: {"type":"finish-step"}\n\n'))
        controller.enqueue(encoder.encode('data: {"type":"finish","finishReason":"stop"}\n\n'))
        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        controller.close()
      }
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    })
  } catch (error) {
    console.error("Error en chat-soporte:", error)
    return new Response("Error en el chat", { status: 500 })
  }
}
