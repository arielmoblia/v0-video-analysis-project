import { NextRequest, NextResponse } from "next/server"

export const maxDuration = 300

const CONTROL_URL = "http://127.0.0.1:3007/api/chat"
const CLAUDE_KEY = "jefe-claudio-yo"

export async function POST(req: NextRequest) {
  try {
    const { message, conversationId } = await req.json()
    if (!message?.trim()) return NextResponse.json({ error: "Mensaje requerido" }, { status: 400 })

    const r = await fetch(CONTROL_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-claude-key": CLAUDE_KEY },
      body: JSON.stringify({
        agent: "jefe",
        conversationId: conversationId || `seo-${Date.now()}`,
        message,
        model: "claude-code",
      }),
    })

    // El endpoint responde con SSE (text/event-stream). Leemos todo y extraemos el texto.
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

    return NextResponse.json({ reply: texto.trim() || "El Jefe no respondió." })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
