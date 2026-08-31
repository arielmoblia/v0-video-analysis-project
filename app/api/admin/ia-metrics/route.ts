import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const AI_REFERRERS = [
  "chatgpt.com", "perplexity.ai", "claude.ai", "gemini.google.com",
  "copilot.microsoft.com", "you.com", "phind.com", "poe.com", "chat.openai.com"
]

function argPeriods() {
  // Argentina = UTC-3 siempre
  const now = new Date()
  const argNow = new Date(now.getTime() - 3 * 3600 * 1000)
  const todayArg = argNow.toISOString().slice(0, 10)
  const todayStart = new Date(todayArg + "T03:00:00.000Z") // 00:00 ART = 03:00 UTC
  const weekStart = new Date(todayStart.getTime() - 6 * 86400 * 1000)
  const monthStart = new Date(todayStart.getTime() - 29 * 86400 * 1000)
  return { todayStart, weekStart, monthStart }
}

function countIA(rows: { referral_source: string | null }[]) {
  return rows.filter(r => r.referral_source === "ia").length
}

function countGratis(rows: { plan: string | null; referral_source: string | null }[]) {
  return rows.filter(r => r.referral_source === "ia" && (r.plan === "gratis" || r.plan === "free")).length
}

function countPagas(rows: { plan: string | null; referral_source: string | null }[]) {
  return rows.filter(r => r.referral_source === "ia" && r.plan && r.plan !== "gratis" && r.plan !== "free" && r.plan !== "templates").length
}

function countAIClicks(rows: { referrer: string | null }[]) {
  return rows.filter(r => r.referrer && AI_REFERRERS.some(ai => r.referrer!.includes(ai))).length
}

export async function GET() {
  try {
    const { todayStart, weekStart, monthStart } = argPeriods()

    const [storesMonth, pvMonth, storesAll] = await Promise.all([
      supabase
        .from("stores")
        .select("plan, referral_source, created_at")
        .gte("created_at", monthStart.toISOString()),
      supabase
        .from("page_views")
        .select("referrer, created_at")
        .gte("created_at", monthStart.toISOString()),
      supabase
        .from("stores")
        .select("referral_source")
        .not("referral_source", "is", null),
    ])

    if (storesMonth.error) throw storesMonth.error
    if (pvMonth.error) throw pvMonth.error
    if (storesAll.error) throw storesAll.error

    const stores = storesMonth.data ?? []
    const pvRows = pvMonth.data ?? []
    const allStores = storesAll.data ?? []

    const stHoy = stores.filter(s => s.created_at >= todayStart.toISOString())
    const stSemana = stores.filter(s => s.created_at >= weekStart.toISOString())
    const pvHoy = pvRows.filter(p => p.created_at >= todayStart.toISOString())
    const pvSemana = pvRows.filter(p => p.created_at >= weekStart.toISOString())

    // % IA = ia stores / all stores with known source (últimos 30 días)
    const knownSource = allStores.length
    const iaTotal = allStores.filter(s => s.referral_source === "ia").length
    const pctIA = knownSource > 0 ? Math.round((iaTotal / knownSource) * 100) : 0

    return NextResponse.json({
      pctIA,
      consultas: {
        hoy: countIA(stHoy),
        semana: countIA(stSemana),
        mes: countIA(stores),
      },
      clicks: {
        hoy: countAIClicks(pvHoy),
        semana: countAIClicks(pvSemana),
        mes: countAIClicks(pvRows),
      },
      tiendas_gratis: {
        hoy: countGratis(stHoy),
        semana: countGratis(stSemana),
        mes: countGratis(stores),
      },
      tiendas_pagas: {
        hoy: countPagas(stHoy),
        semana: countPagas(stSemana),
        mes: countPagas(stores),
      },
    })
  } catch (err) {
    console.error("ia-metrics error:", err)
    return NextResponse.json({ error: "Error al obtener métricas" }, { status: 500 })
  }
}
