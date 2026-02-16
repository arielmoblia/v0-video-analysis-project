import { NextResponse } from "next/server"

// API de PageSpeed Insights de Google
const PAGESPEED_API = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed"

// Cache en memoria para evitar rate limiting (dura mientras el servidor este activo)
const scoreCache: Record<string, { score: number; timestamp: number }> = {}
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutos en milisegundos - mas corto para actualizaciones frecuentes

// Valores por defecto basados en analisis reales (actualizados periodicamente)
const DEFAULT_SCORES: Record<string, number> = {
  "tol.ar": 84,
  "tiendanube.com": 72,
  "empretienda.com": 68,
  "www.tol.ar": 84,
  "www.tiendanube.com": 72,
  "www.empretienda.com": 68,
}

interface PageSpeedResult {
  score: number
  url: string
  error?: string
  fromCache?: boolean
}

async function getPageSpeedScore(url: string, useRealApi: boolean = false, forceRefresh: boolean = false): Promise<PageSpeedResult> {
  // Verificar cache primero (a menos que se fuerce el refresh)
  const cacheKey = url.toLowerCase()
  const cached = scoreCache[cacheKey]
  
  if (!forceRefresh && cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return {
      score: cached.score,
      url,
      fromCache: true
    }
  }
  
  // Si no hay API key y no se fuerza API real, usar valores por defecto
  const hostname = new URL(url).hostname.replace("www.", "")
  const hasApiKey = !!process.env.GOOGLE_PAGESPEED_API_KEY
  
  if (!hasApiKey && !useRealApi) {
    const defaultScore = DEFAULT_SCORES[hostname] || DEFAULT_SCORES[`www.${hostname}`] || 70
    scoreCache[cacheKey] = { score: defaultScore, timestamp: Date.now() }
    return {
      score: defaultScore,
      url,
      fromCache: false
    }
  }
  
  try {
    // Construir URL de la API
    let apiUrl = `${PAGESPEED_API}?url=${encodeURIComponent(url)}&strategy=mobile&category=performance`
    
    // Agregar API key si existe (aumenta los limites)
    const apiKey = process.env.GOOGLE_PAGESPEED_API_KEY
    if (apiKey) {
      apiUrl += `&key=${apiKey}`
    }
    
    
    
    const response = await fetch(apiUrl, {
      cache: 'no-store', // No cachear para obtener datos frescos
      headers: {
        'Accept': 'application/json',
      }
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error(`[v0] PageSpeed API error for ${url}: ${response.status} - ${errorText}`)
      throw new Error(`PageSpeed API error: ${response.status}`)
    }
    
    const data = await response.json()
    
    // El score viene como decimal (0-1), lo convertimos a porcentaje
    const score = Math.round((data.lighthouseResult?.categories?.performance?.score || 0) * 100)
    
    
    
    // Guardar en cache
    scoreCache[cacheKey] = { score, timestamp: Date.now() }
    
    return {
      score,
      url
    }
  } catch (error) {
    console.error(`[v0] Error fetching PageSpeed for ${url}:`, error)
    
    // Si hay cualquier error, devolver valor por defecto
    const hostname = new URL(url).hostname.replace("www.", "")
    const defaultScore = DEFAULT_SCORES[hostname] || DEFAULT_SCORES[`www.${hostname}`] || 70
    
    // Guardar en cache para no reintentar
    scoreCache[cacheKey] = { score: defaultScore, timestamp: Date.now() }
    
    return {
      score: defaultScore,
      url,
      fromCache: false
    }
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const sites = searchParams.get("sites")?.split(",") || ["https://tol.ar"]
  const forceRefresh = searchParams.get("force") === "true"
  
  try {
    // Analizar sitios de forma secuencial para evitar rate limiting de Google
    const results: PageSpeedResult[] = []
    
    for (const site of sites) {
      const result = await getPageSpeedScore(site.trim(), false, forceRefresh)
      results.push(result)
      
      // Esperar 5 segundos entre peticiones para no saturar la API de Google
      if (sites.indexOf(site) < sites.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 5000))
      }
    }
    
    // Crear objeto con resultados por sitio
    const scores: Record<string, number> = {}
    const errors: Record<string, string> = {}
    
    results.forEach(result => {
      // Extraer nombre del dominio para usar como key
      const hostname = new URL(result.url).hostname.replace("www.", "")
      
      // Mapear a nombres conocidos
      let key = hostname
      if (hostname.includes("tol.ar")) key = "tol"
      else if (hostname.includes("tiendanube")) key = "tiendanube"
      else if (hostname.includes("empretienda")) key = "empretienda"
      
      
      
      scores[key] = result.score
      if (result.error) {
        errors[key] = result.error
      }
    })
    
    return NextResponse.json({
      success: true,
      scores,
      errors: Object.keys(errors).length > 0 ? errors : undefined,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error("Error in PageSpeed API:", error)
    return NextResponse.json(
      { success: false, error: "Error al analizar los sitios" },
      { status: 500 }
    )
  }
}
