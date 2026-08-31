import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

const PLATAFORMAS = [
  { nombre: "tol.ar", keywords: ["tol.ar", "tolar", "tol ar"], color: "#1D9E75" },
  { nombre: "Tiendanube", keywords: ["tiendanube", "tienda nube"], color: "#E24B4A" },
  { nombre: "Empretienda", keywords: ["empretienda"], color: "#EF9F27" },
  { nombre: "Shopify", keywords: ["shopify"], color: "#94a3b8" },
  { nombre: "WooCommerce", keywords: ["woocommerce", "woo commerce"], color: "#94a3b8" },
  { nombre: "Wix", keywords: ["wix"], color: "#94a3b8" },
]

export async function GET() {
  try {
    const cookieStore = await cookies()
    if (cookieStore.get("super_admin")?.value !== "true") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401, headers: { "Cache-Control": "no-store" } })
    }

    const { data } = await supabase.from("geo_resultados").select("ia, respuesta")

    if (!data || data.length === 0) return NextResponse.json({ success: true, data: [] }, { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } })

    const porIA: Record<string, { total: number; counts: Record<string, number> }> = {}

    for (const row of data) {
      const ia = row.ia
      const texto = (row.respuesta || "").toLowerCase()
      if (!porIA[ia]) porIA[ia] = { total: 0, counts: {} }
      if (!texto) continue
      porIA[ia].total++
      for (const plat of PLATAFORMAS) {
        if (plat.keywords.some(k => texto.includes(k))) {
          porIA[ia].counts[plat.nombre] = (porIA[ia].counts[plat.nombre] || 0) + 1
        }
      }
    }

    const resultado = Object.entries(porIA).map(([ia, { total, counts }]) => {
      const bars = PLATAFORMAS
        .map(p => ({ name: p.nombre, pct: total > 0 ? Math.round((counts[p.nombre] || 0) / total * 100) : 0, color: p.color }))
        .filter(b => b.pct > 0)
        .sort((a, b) => b.pct - a.pct)
      return { ia, total, bars }
    })

    return NextResponse.json({ success: true, data: resultado }, { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } })
  } catch {
    return NextResponse.json({ error: "Error" }, { status: 500, headers: { "Cache-Control": "no-store" } })
  }
}
