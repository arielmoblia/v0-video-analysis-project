import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function argPeriods() {
  const now = new Date()
  const argNow = new Date(now.getTime() - 3 * 3600 * 1000)
  const todayArg = argNow.toISOString().slice(0, 10)
  const todayStart = new Date(todayArg + "T03:00:00.000Z") // 00:00 ART = 03:00 UTC
  const weekStart = new Date(todayStart.getTime() - 6 * 86400 * 1000)
  const monthStart = new Date(todayStart.getTime() - 29 * 86400 * 1000)
  return { todayStart, weekStart, monthStart }
}

export async function GET() {
  try {
    const cookieStore = await cookies()
    if (cookieStore.get("super_admin")?.value !== "true") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { todayStart, weekStart, monthStart } = argPeriods()

    const { data, error } = await supabase
      .from("geo_resultados_historial")
      .select("menciona_tolar, menciona_tiendanube, created_at")
      .gte("created_at", monthStart.toISOString())

    if (error) {
      return NextResponse.json({
        tableReady: false,
        tolar: { hoy: 0, semana: 0, mes: 0 },
        tiendanube: { hoy: 0, semana: 0, mes: 0 },
      })
    }

    const rows = data ?? []
    const todayISO = todayStart.toISOString()
    const weekISO = weekStart.toISOString()
    const hoy = rows.filter(r => r.created_at >= todayISO)
    const semana = rows.filter(r => r.created_at >= weekISO)

    const ultimaActualizacion = rows.length > 0
      ? rows.reduce((max, r) => (r.created_at > max ? r.created_at : max), rows[0].created_at)
      : null

    const { data: textRows } = await supabase
      .from("geo_resultados")
      .select("ia, respuesta, menciona_tolar")
      .order("updated_at", { ascending: false })

    const ias = ["claude", "chatgpt", "gemini"]
    const respuestasTolar = ias
      .map(ia => {
        const r = (textRows ?? []).find(r => r.ia === ia && r.menciona_tolar && r.respuesta?.trim())
        return r ? { ia, respuesta: r.respuesta as string } : null
      })
      .filter((r): r is { ia: string; respuesta: string } => r !== null)

    const respuestasTiendanube = ias
      .map(ia => {
        const r = (textRows ?? []).find(r => r.ia === ia && r.respuesta?.toLowerCase().includes("tiendanube") && r.respuesta?.trim())
        return r ? { ia, respuesta: r.respuesta as string } : null
      })
      .filter((r): r is { ia: string; respuesta: string } => r !== null)

    return NextResponse.json({
      tableReady: true,
      tolar: {
        hoy: hoy.filter(r => r.menciona_tolar).length,
        semana: semana.filter(r => r.menciona_tolar).length,
        mes: rows.filter(r => r.menciona_tolar).length,
      },
      tiendanube: {
        hoy: hoy.filter(r => r.menciona_tiendanube).length,
        semana: semana.filter(r => r.menciona_tiendanube).length,
        mes: rows.filter(r => r.menciona_tiendanube).length,
      },
      ultimaActualizacion,
      respuestasTolar,
      respuestasTiendanube,
    })
  } catch {
    return NextResponse.json({ error: "Error" }, { status: 500 })
  }
}
