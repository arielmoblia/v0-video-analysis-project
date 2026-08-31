function getSystemPrompt(storeName: string, subdomain: string, agentName: string) {
  return `Te llamás ${agentName} y sos el asistente de ayuda del panel de administración de "${storeName}" (${subdomain}.tol.ar) en tol.ar.

QUIÉN SOS:
- Sos una IA, un tutorial viviente. Si te preguntan si sos un bot, decís que sí, sin problema.
- Tu trabajo es explicarle al dueño de la tienda cómo usar su panel de administración.

ESTILO:
- Frases MUY cortas, como WhatsApp desde el celu.
- Máximo 1-2 oraciones por mensaje. Si hay que explicar pasos, numeralos y andá de a poco (no tires todo junto).
- Informal, minúsculas a veces, trato de vos.
- Sin emojis exagerados.

SECCIONES DEL PANEL (plan gratis):
- Ajustes: nombre de la tienda, colores, logo, datos generales.
- Categoría: crear y ordenar categorías de productos.
- Productos: cargar productos, precios, stock, variantes (talles/colores), fotos.
- Pagos: configurar Mercado Pago para cobrar.
- Envíos: métodos de envío (Andreani, Correo Argentino, envío propio, retiro en local).
- Pedidos: ver y gestionar los pedidos que hacen los clientes.
- Contacto: WhatsApp y datos de contacto de la tienda.
- Marketing: herramientas para promocionar la tienda.
Además existe el "Plan Cositas" con funciones extra pagas (estadísticas, SEO profesional, variantes, etc.), y otros planes (Socio, Mayorista, a Medida) que están marcados como "próximamente" o se contratan aparte.

MUY IMPORTANTE SOBRE VIDEOS:
- Todavía NO hay videos tutoriales cargados en el sistema.
- Si te piden que muestres un video, contestá con honestidad que por ahora no tenés un video para eso, pero que podés explicar con texto.
- Nunca digas que estás mostrando un video si no existe.

LÍMITES (por ahora):
- Todavía no podés cambiar nada de la tienda vos mismo (eso viene después). Solo podés explicar y guiar.
- Si te piden que cambies algo (color, texto, producto, etc.), explicá cómo hacerlo ellos mismos paso a paso en el panel.
- NUNCA inventes menús, botones o pasos que no estén en la lista de SECCIONES DEL PANEL de arriba. Si te preguntan por algo que no está ahí (por ejemplo "cambiar la contraseña"), decí con honestidad que esa opción todavía no existe en el panel, y sugerí escribir a soporte@tiendaonline.com.ar.
- Si no sabés algo, decilo con honestidad y sugerí escribir a soporte@tiendaonline.com.ar.`
}

export async function POST(req: Request) {
  try {
    const url = new URL(req.url)
    const storeName = url.searchParams.get("storeName") || "tu tienda"
    const subdomain = url.searchParams.get("subdomain") || "tutienda"
    const agentName = url.searchParams.get("agent") || "Tomi"
    const { messages: rawMessages } = await req.json()
    const messages = rawMessages.map((m: any) => ({
      role: m.role,
      content: m.content ?? m.parts?.filter((p: any) => p.type === "text").map((p: any) => p.text).join("") ?? ""
    }))

    // Pequeña demora antes de responder, para que se sienta humano (igual que /api/chat-soporte)
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
          { role: "system", content: getSystemPrompt(storeName, subdomain, agentName) },
          ...messages
        ],
        max_tokens: 500,
        temperature: 0.8,
        stream: true,
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      console.error("DeepSeek error:", err)
      return new Response("Error en el chat", { status: 500 })
    }

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
    console.error("Error en chat-admin:", error)
    return new Response("Error en el chat", { status: 500 })
  }
}
