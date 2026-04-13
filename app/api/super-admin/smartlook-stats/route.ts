import { createClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
const PLATFORM_STORE_ID = "a921029f-9dc7-40ed-ae14-732491c37eee"
const BLOCKED_IPS = ["104.50.231.150", "::ffff:104.50.231.150"]

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const isAuthenticated = cookieStore.get("super_admin")?.value === "true"
    if (!isAuthenticated) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

    const now = new Date()
    const starts = {
      hoy:    new Date(now.getFullYear(), now.getMonth(), now.getDate()),
      semana: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      mes:    new Date(now.getFullYear(), now.getMonth(), 1),
      anio:   new Date(now.getFullYear(), 0, 1),
    }

    const count = async (from: Date, tipo: "tolar"|"tiendas"|"compradores") => {
      let q = supabase.from("page_views").select("*", { count: "exact", head: true })
        .gte("created_at", from.toISOString())
      BLOCKED_IPS.forEach(ip => { q = q.neq("ip", ip) })
      if (tipo === "tolar") {
        q = q.eq("store_id", PLATFORM_STORE_ID).not("page_path", "like", "%/admin%")
      } else if (tipo === "tiendas") {
        q = q.neq("store_id", PLATFORM_STORE_ID).like("page_path", "%/admin%")
      } else {
        q = q.neq("store_id", PLATFORM_STORE_ID).not("page_path", "like", "%/admin%")
      }
      const { count: c } = await q
      return c ?? 0
    }

    const [l_hoy, l_sem, l_mes, l_anio,
           t_hoy, t_sem, t_mes, t_anio,
           c_hoy, c_sem, c_mes, c_anio] = await Promise.all([
      count(starts.hoy,"tolar"),    count(starts.semana,"tolar"),
      count(starts.mes,"tolar"),    count(starts.anio,"tolar"),
      count(starts.hoy,"tiendas"),  count(starts.semana,"tiendas"),
      count(starts.mes,"tiendas"),  count(starts.anio,"tiendas"),
      count(starts.hoy,"compradores"), count(starts.semana,"compradores"),
      count(starts.mes,"compradores"), count(starts.anio,"compradores"),
    ])

    return NextResponse.json({
      landing:     { hoy: l_hoy, semana: l_sem, mes: l_mes, anio: l_anio },
      tiendas:     { hoy: t_hoy, semana: t_sem, mes: t_mes, anio: t_anio },
      compradores: { hoy: c_hoy, semana: c_sem, mes: c_mes, anio: c_anio },
      url: "https://app.smartlook.com/org/vq72x3vilvwbhabt1fyti0dn/project/wf4je1lke0xwvcbbp81a2o8q/recordings?segment=all"
    })
  } catch (error) {
    return NextResponse.json({
      landing:     { hoy: 0, semana: 0, mes: 0, anio: 0 },
      tiendas:     { hoy: 0, semana: 0, mes: 0, anio: 0 },
      compradores: { hoy: 0, semana: 0, mes: 0, anio: 0 },
      url: "https://app.smartlook.com"
    })
  }
}
