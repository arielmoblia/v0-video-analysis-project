import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { GoogleAuth } from "google-auth-library"

async function getSearchConsoleData(endpoint: string, body: object) {
  const auth = new GoogleAuth({
    keyFile: '/root/tolar-seo-credentials.json',
    scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
  })
  const client = await auth.getClient()
  const siteUrl = encodeURIComponent('sc-domain:tol.ar')
  const response = await client.request({
    url: `https://www.googleapis.com/webmasters/v3/sites/${siteUrl}/searchAnalytics/query`,
    method: 'POST',
    data: body,
  }) as any
  return response.data
}

export async function GET() {
  try {
    const cookieStore = await cookies()
    const superAdmin = cookieStore.get("super_admin")
    if (!superAdmin?.value) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 28)
    const formatDate = (d: Date) => d.toISOString().split("T")[0]

    const [metricsData, dailyData, queriesData, pagesData] = await Promise.all([
      getSearchConsoleData('query', { startDate: formatDate(startDate), endDate: formatDate(endDate), dimensions: [], rowLimit: 1 }),
      getSearchConsoleData('query', { startDate: formatDate(startDate), endDate: formatDate(endDate), dimensions: ['date'], rowLimit: 28 }),
      getSearchConsoleData('query', { startDate: formatDate(startDate), endDate: formatDate(endDate), dimensions: ['query'], rowLimit: 10 }),
      getSearchConsoleData('query', { startDate: formatDate(startDate), endDate: formatDate(endDate), dimensions: ['page'], rowLimit: 10 }),
    ])

    const row = metricsData.rows?.[0] || {}

    return NextResponse.json({
      metrics: {
        impressions: row.impressions || 0,
        clicks: row.clicks || 0,
        position: row.position ? Math.round(row.position * 10) / 10 : 0,
        ctr: row.ctr ? Math.round(row.ctr * 1000) / 10 : 0,
      },
      daily: (dailyData.rows || []).map((r: any) => ({
        date: r.keys[0],
        impressions: r.impressions,
        clicks: r.clicks,
        position: Math.round(r.position * 10) / 10,
        ctr: Math.round(r.ctr * 1000) / 10,
      })),
      topQueries: (queriesData.rows || []).map((r: any) => ({
        query: r.keys[0],
        impressions: r.impressions,
        clicks: r.clicks,
        position: Math.round(r.position * 10) / 10,
        ctr: Math.round(r.ctr * 1000) / 10,
      })),
      topPages: (pagesData.rows || []).map((r: any) => ({
        page: r.keys[0],
        impressions: r.impressions,
        clicks: r.clicks,
        position: Math.round(r.position * 10) / 10,
        ctr: Math.round(r.ctr * 1000) / 10,
      })),
      period: {
        start: formatDate(startDate),
        end: formatDate(endDate),
      },
    })
  } catch (error: any) {
    console.error("[Search Console] Error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
