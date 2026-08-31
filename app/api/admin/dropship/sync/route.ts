import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// URL del servicio de scraping
const SCRAPING_API = "https://scraping.tol.ar/api/clone-store"

export async function POST(request: Request) {
  try {
    const { storeId, subdomain } = await request.json()

    if (!storeId || !subdomain) {
      return NextResponse.json({ success: false, error: "Faltan datos" }, { status: 400 })
    }

    // Obtener la tienda para verificar que es dropship y obtener source_url
    const { data: store, error: storeError } = await supabase
      .from("stores")
      .select("source_url, markup_percent, is_dropship")
      .eq("id", storeId)
      .single()

    if (storeError || !store) {
      return NextResponse.json({ success: false, error: "Tienda no encontrada" }, { status: 404 })
    }

    if (!store.is_dropship || !store.source_url) {
      return NextResponse.json({ success: false, error: "Esta tienda no es dropship" }, { status: 400 })
    }

    // Llamar al servicio de scraping para re-sincronizar
    const scrapingRes = await fetch(SCRAPING_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sourceUrl: store.source_url,
        destSubdomain: subdomain,
        markupPercent: store.markup_percent || 0,
        maxProducts: 100, // Limite razonable
      }),
    })

    const scrapingData = await scrapingRes.json()

    if (!scrapingData.success) {
      return NextResponse.json({
        success: false,
        error: scrapingData.message || "Error en sincronizacion"
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      productsImported: scrapingData.productsImported,
      platform: scrapingData.platform,
    })
  } catch (error) {
    console.error("Error en sync dropship:", error)
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
