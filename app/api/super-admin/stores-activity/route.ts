import { createClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const isAuthenticated = cookieStore.get("super_admin")?.value === "true"
    if (!isAuthenticated) return NextResponse.json({ error: "No autorizado" }, { status: 401, headers: { "Cache-Control": "no-store" } })

    const days = parseInt(request.nextUrl.searchParams.get("days") || "7")
    const since = new Date()
    since.setDate(since.getDate() - days)

    // Traer visitas de los últimos 7 días con store_id e ip
    const { data: views } = await supabase
      .from("page_views")
      .select("store_id, ip")
      .gte("created_at", since.toISOString())
      .not("store_id", "is", null)
      .not("page_path", "like", "%/admin%")
      .limit(50000)

    // Traer creator_ip de cada tienda
    const { data: stores } = await supabase
      .from("stores")
      .select("id, creator_ip")

    if (!views || !stores) return NextResponse.json({}, { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } })

    // Mapa id -> creator_ip
    const creatorMap: Record<string, string> = {}
    stores.forEach((s: any) => {
      if (s.creator_ip) creatorMap[s.id] = s.creator_ip
    })

    // Contar visitas por store excluyendo creator_ip
    const sessionMap: Record<string, number> = {}
    views.forEach((v: any) => {
      if (!v.store_id) return
      const creatorIp = creatorMap[v.store_id]
      // Excluir si la IP es del dueño
      if (creatorIp && (v.ip === creatorIp || v.ip === "::ffff:" + creatorIp)) return
      sessionMap[v.store_id] = (sessionMap[v.store_id] || 0) + 1
    })

    return NextResponse.json(sessionMap, { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500, headers: { "Cache-Control": "no-store" } })
  }
}
