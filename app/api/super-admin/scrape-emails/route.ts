import { NextResponse } from "next/server"

const VPS_SCRAPER_URL = process.env.VPS_SCRAPER_URL || "http://157.173.212.229:3456"
const SCRAPER_SECRET = process.env.SCRAPER_SECRET || "tolar-scraper-2026"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { action, domain, maxPages, url } = body

    let endpoint = "/api/scrape"
    let fetchBody: any = { domain, maxPages: maxPages || 3 }

    if (action === "scrape-url") {
      endpoint = "/api/scrape-url"
      fetchBody = { url }
    } else if (action === "status") {
      const res = await fetch(`${VPS_SCRAPER_URL}/api/status`)
      const data = await res.json()
      return NextResponse.json(data)
    } else if (action === "cache") {
      const res = await fetch(`${VPS_SCRAPER_URL}/api/cache`, {
        headers: { Authorization: `Bearer ${SCRAPER_SECRET}` }
      })
      const data = await res.json()
      return NextResponse.json(data)
    }

    const res = await fetch(`${VPS_SCRAPER_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SCRAPER_SECRET}`
      },
      body: JSON.stringify(fetchBody)
    })

    const data = await res.json()

    if (!res.ok) {
      return NextResponse.json({ error: data.error || "Error del scraper" }, { status: res.status })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Error conectando con VPS scraper:", error)
    return NextResponse.json(
      { error: "No se pudo conectar con el scraper. Verifica que el VPS este corriendo." },
      { status: 503 }
    )
  }
}
