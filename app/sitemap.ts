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
    { url: `${baseUrl}/privacidad`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.3 },
    { url: `${baseUrl}/devoluciones`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.3 },
    { url: `${baseUrl}/sobre-nosotros`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${baseUrl}/testimonios`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${baseUrl}/migrar/sistema`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${baseUrl}/calculadora`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.75 },
    { url: `${baseUrl}/tienda-online`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.95 },
    { url: `${baseUrl}/vender-ropa-online`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/vender-calzado-online`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/vender-electronicos-online`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/vender-cosmeticos-online`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
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

  const all = [...staticPages, ...storePages, ...geoPages]
  const seen = new Set<string>()
  return all.filter((entry) => {
    if (seen.has(entry.url)) return false
    seen.add(entry.url)
    return true
  })
}
