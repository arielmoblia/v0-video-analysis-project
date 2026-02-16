import { createClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const isAuthenticated = cookieStore.get("super_admin")?.value === "true"

    if (!isAuthenticated) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const days = Number.parseInt(searchParams.get("days") || "30")

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Total de visitas
    const { count: totalViews } = await supabase
      .from("page_views")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startDate.toISOString())

    // Visitantes únicos
    const { data: uniqueVisitors } = await supabase
      .from("page_views")
      .select("visitor_id")
      .gte("created_at", startDate.toISOString())
      .not("visitor_id", "is", null)

    const uniqueCount = new Set(uniqueVisitors?.map((v) => v.visitor_id)).size

    // Visitas por día
    const { data: viewsByDay } = await supabase
      .from("page_views")
      .select("created_at")
      .gte("created_at", startDate.toISOString())
      .order("created_at", { ascending: true })

    const dailyViews: Record<string, number> = {}
    viewsByDay?.forEach((view) => {
      const date = new Date(view.created_at).toISOString().split("T")[0]
      dailyViews[date] = (dailyViews[date] || 0) + 1
    })

    // Top tiendas por visitas
    const { data: topStores } = await supabase
      .from("page_views")
      .select("store_id, stores(subdomain, site_title)")
      .gte("created_at", startDate.toISOString())

    const storeViews: Record<string, { subdomain: string; title: string; views: number }> = {}
    topStores?.forEach((view: any) => {
      const storeId = view.store_id
      if (!storeViews[storeId]) {
        storeViews[storeId] = {
          subdomain: view.stores?.subdomain || "unknown",
          title: view.stores?.site_title || "Sin nombre",
          views: 0,
        }
      }
      storeViews[storeId].views++
    })

    const topStoresList = Object.values(storeViews)
      .sort((a, b) => b.views - a.views)
      .slice(0, 10)

    // Páginas más visitadas
    const { data: topPages } = await supabase
      .from("page_views")
      .select("page_path")
      .gte("created_at", startDate.toISOString())

    const pageViews: Record<string, number> = {}
    topPages?.forEach((view) => {
      pageViews[view.page_path] = (pageViews[view.page_path] || 0) + 1
    })

    const topPagesList = Object.entries(pageViews)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([path, views]) => ({ path, views }))

    return NextResponse.json({
      totalViews: totalViews || 0,
      uniqueVisitors: uniqueCount,
      dailyViews: Object.entries(dailyViews).map(([date, views]) => ({ date, views })),
      topStores: topStoresList,
      topPages: topPagesList,
    })
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}
