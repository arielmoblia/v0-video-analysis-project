import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies()
    if (cookieStore.get("super_admin")?.value !== "true") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401, headers: { "Cache-Control": "no-store" } })
    }

    const { searchParams } = new URL(request.url)
    const periodo = searchParams.get("periodo") || "mes"

    const ahora = new Date()
    let desde: Date

    if (periodo === "semana") {
      desde = new Date(ahora)
      desde.setDate(ahora.getDate() - 7)
    } else if (periodo === "mes") {
      desde = new Date(ahora)
      desde.setDate(ahora.getDate() - 30)
    } else {
      desde = new Date(ahora)
      desde.setFullYear(ahora.getFullYear() - 1)
    }

    const ias = [
      { nombre: "ChatGPT", dominios: ["chatgpt.com", "openai.com"] },
      { nombre: "Gemini", dominios: ["gemini.google.com", "bard.google.com"] },
      { nombre: "Perplexity", dominios: ["perplexity.ai"] },
      { nombre: "Claude", dominios: ["claude.ai", "anthropic.com"] },
    ]

    const resultados = await Promise.all(ias.map(async (ia) => {
      const conditions = ia.dominios.map(d => `referrer.ilike.%${d}%`).join(",")
      const { count } = await supabase
        .from("page_views")
        .select("*", { count: "exact", head: true })
        .or(conditions)
        .gte("created_at", desde.toISOString())
      return { nombre: ia.nombre, entraron: count || 0 }
    }))

    return NextResponse.json({ success: true, data: resultados, periodo, desde: desde.toISOString() }, { headers: { "Cache-Control": "no-store" } })
  } catch (error) {
    return NextResponse.json({ error: "Error" }, { status: 500, headers: { "Cache-Control": "no-store" } })
  }
}
