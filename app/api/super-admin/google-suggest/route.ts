import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies()
    if (cookieStore.get("super_admin")?.value !== "true") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401, headers: { "Cache-Control": "no-store" } })
    }
    const { searchParams } = new URL(request.url)
    const q = searchParams.get("q")
    if (!q) return NextResponse.json({ sugerencias: [] }, { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } })

    const res = await fetch(`https://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(q)}&hl=es`)
    const data = await res.json()
    const sugerencias = (data[1] || []).map((s: string) => {
      const palabras = s.trim().split(" ").length
      let pct = 20
      pct += Math.min((palabras - 3) * 5, 20)
      if (/sin comisiones|0%|cero comision/.test(s)) pct += 15
      if (/gratis|gratuita|gratuito/.test(s)) pct += 10
      if (/argentina|argentino/.test(s)) pct += 10
      if (/crear|como hacer|como crear/.test(s)) pct += 5
      if (palabras <= 2) pct -= 20
      if (/tiendanube|mercadolibre|shopify/.test(s)) pct -= 10
      pct = Math.max(5, Math.min(95, pct))
      const color = pct >= 65 ? "#1D9E75" : pct >= 40 ? "#EF9F27" : "#E24B4A"
      return { frase: s, pct, color }
    })

    return NextResponse.json({ success: true, sugerencias }, { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } })
  } catch {
    return NextResponse.json({ error: "Error" }, { status: 500, headers: { "Cache-Control": "no-store" } })
  }
}
