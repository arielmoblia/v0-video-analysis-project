import { createClient } from "@supabase/supabase-js"
import type { MetadataRoute } from "next"
import { articulos } from "@/lib/blog-articulos"

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://tol.ar"
  // IMPORTANTE: solo incluir URLs que tienen páginas reales en el código.
  // Agregar una URL aquí sin que exista la página genera errores 404 en los
  // rastreadores de Google y Bing, lo que daña el posicionamiento.
  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily" as const, priority: 1 },
    { url: `${baseUrl}/plan-gratis`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${baseUrl}/plan-socio`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${baseUrl}/plan-socio/nueva-tienda`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${baseUrl}/plan-socio/vieja-tienda`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${baseUrl}/plan-a-medida`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${baseUrl}/plan-cositas`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${baseUrl}/plan-migrar`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${baseUrl}/diseno-ia`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${baseUrl}/contacto`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${baseUrl}/faq`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.9 },
    { url: `${baseUrl}/pagos`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.75 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.8 },
    ...articulos.map((a) => ({
      url: `${baseUrl}/blog/${a.slug}`,
      lastModified: new Date(a.fecha),
      changeFrequency: "monthly" as const,
      priority: a.priority ?? 0.85,
    })),
    { url: `${baseUrl}/terminos`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.3 },
    { url: `${baseUrl}/scraping-terminos-condiciones`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.2 },
    { url: `${baseUrl}/privacidad`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.3 },
    { url: `${baseUrl}/devoluciones`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.3 },
    { url: `${baseUrl}/sobre-nosotros`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${baseUrl}/testimonios`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${baseUrl}/migrar/sistema`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${baseUrl}/calculadora`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.75 },
    { url: `${baseUrl}/vs-tiendanube`, lastModified: new Date("2026-09-09"), changeFrequency: "weekly" as const, priority: 0.85 },
    { url: `${baseUrl}/tienda-online`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.95 },
    { url: `${baseUrl}/vender-ropa-online`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/vender-calzado-online`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/vender-electronicos-online`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/vender-cosmeticos-online`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    // Subpáginas long-tail por rubro (Contenido Semanal + Plan Septiembre). Se venían
    // publicando en prod desde el 17/08 pero nunca se sumaban acá -> invisibles para
    // Google/Bing en el sitemap (detectado en el control del 06/09, Plan Septiembre día 6).
    // Cada vez que se publique una guía nueva de este tipo, agregarla también acá.
    { url: `${baseUrl}/vender-ropa-online/jeans`, lastModified: new Date("2026-08-17"), changeFrequency: "monthly" as const, priority: 0.75 },
    { url: `${baseUrl}/vender-calzado-online/zapatillas`, lastModified: new Date("2026-08-24"), changeFrequency: "monthly" as const, priority: 0.75 },
    { url: `${baseUrl}/vender-electronicos-online/celulares`, lastModified: new Date("2026-08-31"), changeFrequency: "monthly" as const, priority: 0.75 },
    { url: `${baseUrl}/vender-ropa-online/ropa-deportiva`, lastModified: new Date("2026-09-04"), changeFrequency: "monthly" as const, priority: 0.75 },
  ]

  let storePages: MetadataRoute.Sitemap = []
  try {
    const supabase = getServiceClient()
    const { data: stores } = await supabase
      .from("stores")
      .select("subdomain, last_activity_at, created_at")
      .eq("is_active", true)
      .limit(1000)
    if (stores) {
      storePages = stores.map((store) => ({
        url: `${baseUrl}/tienda/${store.subdomain}`,
        lastModified: new Date(store.last_activity_at || store.created_at || new Date()),
        changeFrequency: "daily" as const,
        priority: 0.7,
      }))
    }
  } catch (error) {
    console.error("Error fetching stores for sitemap:", error)
  }

  // Categorías de cada tienda (ej. /tienda/mitienda/categoria/remeras). Hasta este cambio
  // el sitemap solo traía la portada de cada tienda (storePages) — ninguna categoría estaba
  // avisada acá, aunque sí se avisaban por IndexNow (ver bing-dedicacion.js). Se pagina de a
  // 1000 porque Supabase/PostgREST corta ahí por defecto y hoy hay más de 1000 categorías.
  let categoryPages: MetadataRoute.Sitemap = []
  try {
    const supabase = getServiceClient()
    const pageSize = 1000
    let offset = 0
    const filas: { slug: string; created_at: string; stores: { subdomain: string; is_active: boolean } | { subdomain: string; is_active: boolean }[] | null }[] = []
    while (true) {
      const { data, error } = await supabase
        .from("categories")
        .select("slug, created_at, stores(subdomain, is_active)")
        .range(offset, offset + pageSize - 1)
      if (error || !data || data.length === 0) break
      filas.push(...(data as typeof filas))
      if (data.length < pageSize) break
      offset += pageSize
    }
    categoryPages = filas
      .map((c) => ({ ...c, store: Array.isArray(c.stores) ? c.stores[0] : c.stores }))
      .filter((c) => c.store?.is_active && c.store?.subdomain)
      .map((c) => ({
        url: `${baseUrl}/tienda/${c.store!.subdomain}/categoria/${c.slug}`,
        lastModified: new Date(c.created_at || new Date()),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      }))
  } catch (error) {
    console.error("Error fetching categories for sitemap:", error)
  }

  let geoPages: MetadataRoute.Sitemap = []
  try {
    const supabase = getServiceClient()
    const { data: paginas } = await supabase
      .from("geo_paginas")
      .select("slug, updated_at")
      .eq("estado", "publicada")
    if (paginas) {
      geoPages = paginas.map((p) => ({
        url: `${baseUrl}/${p.slug}`,
        lastModified: new Date(p.updated_at || new Date()),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }))
    }
  } catch (error) {
    console.error("Error fetching geo_paginas for sitemap:", error)
  }

  const all = [...staticPages, ...storePages, ...categoryPages, ...geoPages]
  const seen = new Set<string>()
  return all.filter((entry) => {
    if (seen.has(entry.url)) return false
    seen.add(entry.url)
    return true
  })
}
