import { GoogleAuth } from "google-auth-library"

const SUPABASE_URL = 'https://tuznlaqncbrsbokbbzhy.supabase.co'
const SUPABASE_KEY = 'sb_secret_P5hw12ktlNKwPr4df4RFYA_5pWljzt3'

export async function leerSearchConsole() {
  try {
    const auth = new GoogleAuth({
      keyFile: '/root/tolar-seo-credentials.json',
      scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
    })
    const client = await auth.getClient()
    const siteUrl = encodeURIComponent('sc-domain:tol.ar')
    const end = new Date().toISOString().split('T')[0]
    const start = new Date(Date.now() - 28 * 86400000).toISOString().split('T')[0]

    const [metrics, queries] = await Promise.all([
      client.request({ url: `https://www.googleapis.com/webmasters/v3/sites/${siteUrl}/searchAnalytics/query`, method: 'POST', data: { startDate: start, endDate: end, dimensions: [], rowLimit: 1 } }),
      client.request({ url: `https://www.googleapis.com/webmasters/v3/sites/${siteUrl}/searchAnalytics/query`, method: 'POST', data: { startDate: start, endDate: end, dimensions: ['query'], rowLimit: 15 } }),
    ]) as any[]

    const m = metrics.data.rows?.[0] || {}
    return {
      ok: true,
      totalClicks: m.clicks || 0,
      totalImpressions: m.impressions || 0,
      posicionMedia: m.position ? Math.round(m.position * 10) / 10 : 0,
      topQueries: (queries.data.rows || []).map((r: any) => ({
        query: r.keys[0],
        clicks: r.clicks,
        impressions: r.impressions,
        position: Math.round(r.position * 10) / 10,
      })),
    }
  } catch (e: any) {
    return { ok: false, error: e.message }
  }
}

export async function leerRegistros() {
  try {
    const hace7 = new Date(Date.now() - 7 * 86400000).toISOString()
    const r = await fetch(`${SUPABASE_URL}/rest/v1/stores?select=id,created_at,subdomain&created_at=gte.${hace7}`, {
      headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
    })
    const tiendas = await r.json()
    return { ok: true, nuevasUltimos7dias: Array.isArray(tiendas) ? tiendas.length : 0 }
  } catch (e: any) {
    return { ok: false, error: e.message }
  }
}
