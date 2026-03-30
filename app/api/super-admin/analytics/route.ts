import { createClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
const PLATFORM_STORE_ID = "a921029f-9dc7-40ed-ae14-732491c37eee"
const PRECIOS: Record<string, number> = { gratis: 0, free: 0, cositas: 2999, socios: 9999 }

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const isAuthenticated = cookieStore.get("super_admin")?.value === "true"
    if (!isAuthenticated) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get("days") || "30")
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const { count: totalViews } = await supabase
      .from("page_views").select("*", { count: "exact", head: true })
      .neq("store_id", PLATFORM_STORE_ID)
      .gte("created_at", startDate.toISOString())

    const { data: uniqueData } = await supabase
      .from("page_views").select("visitor_id")
      .neq("store_id", PLATFORM_STORE_ID)
      .gte("created_at", startDate.toISOString())
      .not("visitor_id", "is", null)
    const uniqueVisitors = new Set(uniqueData?.map(v => v.visitor_id)).size

    const { data: viewsByDay } = await supabase
      .from("page_views").select("created_at")
      .neq("store_id", PLATFORM_STORE_ID)
      .gte("created_at", startDate.toISOString())
      .order("created_at", { ascending: true })
    const dailyMap: Record<string, number> = {}
    viewsByDay?.forEach(v => {
      const date = new Date(v.created_at).toISOString().split("T")[0]
      dailyMap[date] = (dailyMap[date] || 0) + 1
    })
    const dailyViews = Object.entries(dailyMap).map(([date, views]) => ({ date, views }))
    // Visitas diarias de tol.ar (plataforma)
    const { data: platformByDay } = await supabase
      .from("page_views").select("created_at")
      .eq("store_id", PLATFORM_STORE_ID)
      .gte("created_at", startDate.toISOString())
    const dailyPlatformMap: Record<string, number> = {}
    platformByDay?.forEach(v => {
      const date = new Date(v.created_at).toISOString().split("T")[0]
      dailyPlatformMap[date] = (dailyPlatformMap[date] || 0) + 1
    })
    const dailyPlatformViews = Object.entries(dailyPlatformMap).map(([date, views]) => ({ date, views }))

    const { data: topStoresData } = await supabase
      .from("page_views").select("store_id, stores(subdomain, site_title)")
      .neq("store_id", PLATFORM_STORE_ID)
      .gte("created_at", startDate.toISOString())
    const storeMap: Record<string, any> = {}
    topStoresData?.forEach((v: any) => {
      if (!storeMap[v.store_id]) storeMap[v.store_id] = { subdomain: v.stores?.subdomain || "unknown", title: v.stores?.site_title || "Sin nombre", views: 0 }
      storeMap[v.store_id].views++
    })
    const topStores = Object.values(storeMap).sort((a: any, b: any) => b.views - a.views).slice(0, 10)

    const { data: topPagesData } = await supabase
      .from("page_views").select("page_path")
      .neq("store_id", PLATFORM_STORE_ID)
      .gte("created_at", startDate.toISOString())
    const pageMap: Record<string, number> = {}
    topPagesData?.forEach(v => { pageMap[v.page_path] = (pageMap[v.page_path] || 0) + 1 })
    const topPages = Object.entries(pageMap).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([path, views]) => ({ path, views }))

    const { data: deviceData } = await supabase
      .from("page_views").select("user_agent")
      .neq("store_id", PLATFORM_STORE_ID)
      .gte("created_at", startDate.toISOString())
      .not("user_agent", "is", null)
    let mobile = 0, desktop = 0
    deviceData?.forEach(v => {
      const ua = (v.user_agent || "").toLowerCase()
      if (ua.includes("mobile") || ua.includes("android") || ua.includes("iphone")) mobile++
      else desktop++
    })

    const { data: hourData } = await supabase
      .from("page_views").select("created_at")
      .neq("store_id", PLATFORM_STORE_ID)
      .gte("created_at", startDate.toISOString())
    const hourMap: Record<number, number> = {}
    for (let i = 0; i < 24; i++) hourMap[i] = 0
    hourData?.forEach(v => { const h = new Date(v.created_at).getHours(); hourMap[h] = (hourMap[h] || 0) + 1 })
    const hourlyViews = Object.entries(hourMap).map(([hour, views]) => ({ hour: Number(hour), views }))

    const { data: geoData } = await supabase
      .from("page_views").select("country, city")
      .neq("store_id", PLATFORM_STORE_ID)
      .gte("created_at", startDate.toISOString())
      .not("country", "is", null)
    const countryMap: Record<string, number> = {}
    const cityMap: Record<string, number> = {}
    geoData?.forEach(v => {
      if (v.country) countryMap[v.country] = (countryMap[v.country] || 0) + 1
      if (v.city) cityMap[v.city] = (cityMap[v.city] || 0) + 1
    })
    const topCountries = Object.entries(countryMap).sort((a,b) => b[1]-a[1]).slice(0,5).map(([name,views]) => ({ name, views }))
    const topCities = Object.entries(cityMap).sort((a,b) => b[1]-a[1]).slice(0,5).map(([name,views]) => ({ name, views }))

    const { count: platformViews } = await supabase
      .from("page_views").select("*", { count: "exact", head: true })
      .eq("store_id", PLATFORM_STORE_ID)
      .gte("created_at", startDate.toISOString())
    const { data: platformPagesData } = await supabase
      .from("page_views").select("page_path")
      .eq("store_id", PLATFORM_STORE_ID)
      .gte("created_at", startDate.toISOString())
    const platformPageMap: Record<string, number> = {}
    platformPagesData?.forEach(v => { platformPageMap[v.page_path] = (platformPageMap[v.page_path] || 0) + 1 })
    const topPlatformPages = Object.entries(platformPageMap).sort((a,b) => b[1]-a[1]).slice(0,5).map(([path,views]) => ({ path, views }))

    const { count: newStores } = await supabase
      .from("stores").select("*", { count: "exact", head: true })
      .neq("plan", "templates").neq("subdomain", "tolar-platform")
      .gte("created_at", startDate.toISOString())
    const conversionRate = platformViews && platformViews > 0 ? Math.round(((newStores || 0) / platformViews) * 100) : 0

    const { data: allStores } = await supabase.from("stores").select("plan").neq("plan", "templates").neq("subdomain", "tolar-platform")
    let mrr = 0
    const planIncome: Record<string, number> = { gratis: 0, cositas: 0, socios: 0, mayorista: 0 }
    const planCounts: Record<string, number> = { gratis: 0, cositas: 0, socios: 0, mayorista: 0 }
    allStores?.forEach((s: any) => {
      const plan = (s.plan === "free" ? "gratis" : s.plan) || "gratis"
      if (planCounts[plan] !== undefined) planCounts[plan]++
    })

    const { data: storeList } = await supabase.from("stores").select("id, site_title, subdomain").neq("plan", "templates").neq("subdomain", "tolar-platform")
    const storeTitleMap: Record<string, string> = {}
    storeList?.forEach((s: any) => { storeTitleMap[s.id] = s.site_title || s.subdomain })
    const { data: productViewsData } = await supabase
      .from("page_views").select("store_id, page_path")
      .gte("created_at", startDate.toISOString())
      .like("page_path", "/producto/%")
    const rubroMap: Record<string, number> = {}
    productViewsData?.forEach((v: any) => {
      const name = storeTitleMap[v.store_id] || "Desconocida"
      rubroMap[name] = (rubroMap[name] || 0) + 1
    })
    const topRubros = Object.entries(rubroMap).sort((a,b) => b[1]-a[1]).slice(0,5).map(([name,views]) => ({ name, views }))

    return NextResponse.json({
      totalViews: totalViews || 0,
      uniqueVisitors,
      dailyViews,
      dailyPlatformViews,
      topStores,
      topPages,
      devices: { mobile, desktop },
      hourlyViews,
      topCountries,
      topCities,
      platformViews: platformViews || 0,
      topPlatformPages,
      conversionRate,
      newStoresInPeriod: newStores || 0,
      mrr: 0,
      planIncome,
      planCounts,
      topRubros,
    })
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}
