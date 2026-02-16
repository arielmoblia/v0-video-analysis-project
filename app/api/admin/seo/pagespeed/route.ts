import { NextResponse } from "next/server"

// API de PageSpeed Insights (gratis, sin key necesaria para uso basico)
const PAGESPEED_API = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get("url") || "https://tol.ar"
  const strategy = searchParams.get("strategy") || "mobile" // mobile o desktop

  try {
    const apiUrl = `${PAGESPEED_API}?url=${encodeURIComponent(url)}&strategy=${strategy}&category=performance`
    
    const response = await fetch(apiUrl, {
      next: { revalidate: 300 } // Cache por 5 minutos
    })

    if (!response.ok) {
      throw new Error(`PageSpeed API error: ${response.status}`)
    }

    const data = await response.json()
    
    // Extraer el puntaje de performance (0-1, lo convertimos a 0-100)
    const performanceScore = Math.round(
      (data.lighthouseResult?.categories?.performance?.score || 0) * 100
    )

    // Extraer metricas adicionales
    const metrics = {
      fcp: data.lighthouseResult?.audits?.["first-contentful-paint"]?.displayValue,
      lcp: data.lighthouseResult?.audits?.["largest-contentful-paint"]?.displayValue,
      cls: data.lighthouseResult?.audits?.["cumulative-layout-shift"]?.displayValue,
      tbt: data.lighthouseResult?.audits?.["total-blocking-time"]?.displayValue,
      si: data.lighthouseResult?.audits?.["speed-index"]?.displayValue,
    }

    return NextResponse.json({
      success: true,
      url,
      strategy,
      score: performanceScore,
      metrics,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error("PageSpeed API error:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: "No se pudo obtener el puntaje de PageSpeed",
        score: null 
      },
      { status: 500 }
    )
  }
}
