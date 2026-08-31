import { createClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
const MY_IP = "104.50.231.150"

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    if (cookieStore.get("super_admin")?.value !== "true")
      return NextResponse.json({ error: "No autorizado" }, { status: 401, headers: { "Cache-Control": "no-store" } })

    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get("days") || "7")

    // Todo desde Supabase directamente
    const [{ data: stats }, { data: convRaw }] = await Promise.all([
      supabase.rpc("get_dashboard_stats", { p_days: days, p_my_ip: MY_IP }),
      supabase.rpc("get_conversion_por_dia", { dias: days }),
    ])

    const s = stats as any
    const conversionRate = s?.unicosArgentina > 0
      ? Math.round((s.nuevasTiendas / s.unicosArgentina) * 100 * 10) / 10
      : 0

    const conversionPorDia = (convRaw || []).map((r: any) => ({
      fecha: r.fecha.slice(8, 10) + "/" + r.fecha.slice(5, 7),
      visitas: Number(r.visitas),
      unicos: Number(r.unicos),
      registros: Number(r.registros),
      pct: Number(r.pct)
    }))

    return NextResponse.json({
      visitasArgentina: s?.visitasArgentina || 0,
      unicosArgentina: s?.unicosArgentina || 0,
      nuevasTiendas: s?.nuevasTiendas || 0,
      conversionRate,
      inactivas: s?.inactivas || 0,
      sinProductos: s?.sinProductos || 0,
      mrr: s?.mrr || 0,
      topStores: s?.topStores || [],
      devices: { mobile: s?.mobile || 0, desktop: s?.desktop || 0 },
      topPages: s?.topPages || [],
      conversionPorDia,
    }, { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } })
  } catch (error) {
    console.error("Error analytics:", error)
    return NextResponse.json({ error: "Failed" }, { status: 500, headers: { "Cache-Control": "no-store" } })
  }
}
