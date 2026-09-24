import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { writeFile, mkdir } from "fs/promises"
import { existsSync } from "fs"
import path from "path"
import crypto from "crypto"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

// Scraper de tiendas externas - Extrae TODO del HTML que ve el cliente
// Soporta: Empretienda, Tiendanube, MercadoShops
// DROPSHIPPING: Extrae todo para crear espejo con markup

interface ScrapedVariant {
  id: string | number
  name: string
  option0?: string  // talle
  option1?: string  // color
  option2?: string
  price: number
  compare_price?: number
  stock: number
  available: boolean
  sku?: string
  image_url?: string
}

interface ScrapedProduct {
  name: string
  price: number
  compare_price?: number
  description?: string           // descripción completa
  description_html?: string      // descripción con HTML (tabla de medidas)
  images: string[]               // TODAS las imágenes en alta calidad
  category_name?: string
  sizes?: { size: string; stock: number; price: number }[]
  stock?: number
  variants?: ScrapedVariant[]    // variantes completas
  variant_options?: { name: string; options: string[] }[]  // opciones (talle, color)
  video_url?: string             // video del producto
  source_url?: string            // URL original para pedidos
  source_product_id?: string     // ID en tienda madre
}

interface ScrapeResult {
  success: boolean
  products: ScrapedProduct[]
  total: number
  source_url: string
  platform?: string
  errors?: string[]
}

// ============================================
// DESCARGA DE IMÁGENES AL SERVIDOR LOCAL
// ============================================
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads', 'scraped')

async function downloadImage(imageUrl: string, storeSlug: string): Promise<string | null> {
  try {
    // Asegurar que existe el directorio
    const storeDir = path.join(UPLOADS_DIR, storeSlug)
    if (!existsSync(storeDir)) {
      await mkdir(storeDir, { recursive: true })
    }

    // Generar nombre único basado en la URL
    const hash = crypto.createHash('md5').update(imageUrl).digest('hex').substring(0, 12)
    const ext = imageUrl.match(/\.(jpg|jpeg|png|webp|gif)/i)?.[1] || 'webp'
    const filename = `${hash}.${ext}`
    const localPath = path.join(storeDir, filename)

    // Si ya existe, no descargar de nuevo
    if (existsSync(localPath)) {
      console.log('[scrape] Imagen ya existe:', filename)
      return `/uploads/scraped/${storeSlug}/${filename}`
    }

    // Descargar la imagen
    console.log('[scrape] Descargando imagen:', imageUrl.substring(0, 80))
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
        'Referer': new URL(imageUrl).origin + '/'
      }
    })

    if (!response.ok) {
      console.log('[scrape] Error descargando imagen:', response.status)
      return null
    }

    const buffer = Buffer.from(await response.arrayBuffer())
    await writeFile(localPath, buffer)
    console.log('[scrape] Imagen guardada:', filename, `(${Math.round(buffer.length/1024)}KB)`)

    return `/uploads/scraped/${storeSlug}/${filename}`
  } catch (e) {
    console.error('[scrape] Error descargando imagen:', e)
    return null
  }
}

async function downloadAllImages(images: string[], storeSlug: string): Promise<string[]> {
  const downloadedImages: string[] = []

  for (const imgUrl of images) {
    const localUrl = await downloadImage(imgUrl, storeSlug)
    if (localUrl) {
      downloadedImages.push(localUrl)
    }
    // Pequeña pausa entre descargas
    await new Promise(r => setTimeout(r, 100))
  }

  return downloadedImages
}

// ============================================
// EXTRACCIÓN DE PALABRA CLAVE DEL PRODUCTO
// ============================================
// Tiendanube: las imágenes del producto contienen el "nombre único" en el filename
// Ej: /productos/campera-concordia/ → imágenes: concordia-1.webp, concordia-2.webp
// Ej: /productos/tapado-luna-tweed/ → imágenes: luna-1.webp, luna-3.webp
// Los productos sugeridos tienen otros nombres: medicina-1.webp, acoyte-crema.webp
function extractProductKeyword(url: string): string[] {
  try {
    const urlObj = new URL(url)
    const path = urlObj.pathname

    // Extraer el slug del producto de la URL
    // /productos/campera-concordia/ → campera-concordia
    const slugMatch = path.match(/\/productos\/([^\/]+)/i)
    if (!slugMatch) return []

    const slug = slugMatch[1].replace(/\/$/, '').toLowerCase()

    // Separar el slug en palabras
    // campera-concordia → ["campera", "concordia"]
    // tapado-luna-tweed → ["tapado", "luna", "tweed"]
    const words = slug.split('-').filter(w => w.length > 2)

    // Palabras genéricas que no sirven para identificar el producto
    const genericWords = [
      'campera', 'tapado', 'remera', 'pantalon', 'jean', 'short', 'vestido',
      'camisa', 'buzo', 'sweater', 'chomba', 'musculosa', 'top', 'body',
      'pollera', 'falda', 'blazer', 'saco', 'cardigan', 'chaleco', 'abrigo',
      'piloto', 'trench', 'parka', 'montgomery', 'sobretodo', 'capa',
      'algodon', 'lana', 'cuero', 'jean', 'denim', 'lino', 'seda', 'tweed',
      'negro', 'blanco', 'azul', 'rojo', 'verde', 'gris', 'beige', 'crema',
      'marron', 'rosa', 'naranja', 'amarillo', 'violeta', 'celeste',
      'hombre', 'mujer', 'unisex', 'niño', 'niña', 'bebe',
      'talle', 'unico', 'oversize', 'slim', 'fit', 'regular', 'largo', 'corto'
    ]

    // Filtrar palabras genéricas para quedarnos con el nombre único
    const uniqueWords = words.filter(w => !genericWords.includes(w))

    // Si hay palabras únicas, usarlas como keywords
    if (uniqueWords.length > 0) {
      return uniqueWords
    }

    // Si todas las palabras son genéricas, usar las últimas palabras del slug
    // (generalmente el nombre del modelo viene después del tipo de prenda)
    if (words.length >= 2) {
      return [words[words.length - 1]]
    }

    return words
  } catch (e) {
    console.log('[scrape-tn] Error extrayendo keyword:', e)
    return []
  }
}

// Verificar si una URL de imagen corresponde al producto actual
function imageMatchesProduct(imageUrl: string, keywords: string[]): boolean {
  if (keywords.length === 0) return true // Si no hay keywords, aceptar todo

  const urlLower = imageUrl.toLowerCase()

  // Extraer el nombre del archivo de la URL
  // /products/concordia-1-abc123.webp → concordia-1-abc123
  const filenameMatch = urlLower.match(/\/products\/([^\/]+?)(?:-[a-f0-9]{10,})?(?:-\d+)?\.(?:webp|jpg|jpeg|png)/i)
  if (!filenameMatch) {
    // Fallback: buscar keywords en cualquier parte de la URL
    return keywords.some(kw => urlLower.includes(kw))
  }

  const filename = filenameMatch[1]

  // Verificar si alguna keyword está en el nombre del archivo
  return keywords.some(kw => filename.includes(kw))
}

// Detectar plataforma por URL o HTML
function detectPlatform(url: string, html: string): string {
  if (url.includes('empretienda.com')) return 'empretienda'
  if (url.includes('tiendanube.com') || url.includes('mitiendanube.com')) return 'tiendanube'
  if (url.includes('mercadoshops.com')) return 'mercadoshops'
  if (html.includes('Empretienda')) return 'empretienda'
  if (html.includes('Tiendanube') || html.includes('nuvemshop')) return 'tiendanube'
  return 'unknown'
}

// Extraer URLs de productos del listado/catálogo
function extractProductUrls(html: string, baseUrl: string, platform: string): string[] {
  const urls: string[] = []
  const baseUrlObj = new URL(baseUrl)
  const origin = baseUrlObj.origin

  if (platform === 'empretienda') {
    // Empretienda: links a /productos/xxx o /producto/xxx
    const regex = /href=["']([^"']*(?:producto|productos)[^"']*)["']/gi
    let match
    while ((match = regex.exec(html)) !== null) {
      let productUrl = match[1]
      if (productUrl.startsWith('/')) {
        productUrl = origin + productUrl
      } else if (!productUrl.startsWith('http')) {
        productUrl = origin + '/' + productUrl
      }
      if (!urls.includes(productUrl)) {
        urls.push(productUrl)
      }
    }
  } else if (platform === 'tiendanube') {
    // Tiendanube: links a /productos/xxx
    const regex = /href=["']([^"']*\/productos\/[^"']*)["']/gi
    let match
    while ((match = regex.exec(html)) !== null) {
      let productUrl = match[1]
      if (productUrl.startsWith('/')) {
        productUrl = origin + productUrl
      } else if (!productUrl.startsWith('http')) {
        productUrl = origin + '/' + productUrl
      }
      if (!urls.includes(productUrl)) {
        urls.push(productUrl)
      }
    }
  } else {
    // Genérico: buscar links que parezcan productos
    const regex = /href=["']([^"']*(?:product|producto)[^"']*)["']/gi
    let match
    while ((match = regex.exec(html)) !== null) {
      let productUrl = match[1]
      if (productUrl.startsWith('/')) {
        productUrl = origin + productUrl
      } else if (!productUrl.startsWith('http')) {
        productUrl = origin + '/' + productUrl
      }
      if (!urls.includes(productUrl) && !productUrl.includes('javascript:')) {
        urls.push(productUrl)
      }
    }
  }

  return urls
}

// ============================================
// SCRAPER TIENDANUBE - Extrae TODO del HTML
// ============================================
function scrapeTiendanubeProduct(html: string, url: string): ScrapedProduct | null {
  try {
    const product: ScrapedProduct = {
      name: '',
      price: 0,
      images: [],
      source_url: url
    }

    // === 1. EXTRAER LS.variants (JSON con toda la data) ===
    const variantsMatch = html.match(/LS\.variants\s*=\s*(\[[\s\S]*?\]);/m)
    let variants: any[] = []
    if (variantsMatch) {
      try {
        variants = JSON.parse(variantsMatch[1])
        console.log('[scrape-tn] Encontré LS.variants con', variants.length, 'variantes')
      } catch (e) {
        console.log('[scrape-tn] Error parseando LS.variants')
      }
    }

    // === 2. EXTRAER PRODUCT DATA del JSON embebido ===
    const productDataMatch = html.match(/const\s*{\s*id:\s*productId,\s*price:\s*productPrice\s*}\s*=\s*({[\s\S]*?});/m)
    let productData: any = null
    if (productDataMatch) {
      try {
        productData = JSON.parse(productDataMatch[1])
        console.log('[scrape-tn] Encontré productData:', productData.name)
      } catch (e) {
        console.log('[scrape-tn] Error parseando productData')
      }
    }

    // === 3. NOMBRE ===
    if (productData?.name) {
      product.name = productData.name
    } else {
      const nameMatch = html.match(/<meta\s+property="og:title"\s+content="([^"]+)"/i)
      if (nameMatch) product.name = nameMatch[1].split(' - ')[0].trim()
    }

    // === 4. PRECIO (de LS.variants o productData) ===
    if (variants.length > 0) {
      // price_number está en pesos, no en centavos
      product.price = variants[0].price_number || (variants[0].price_number_raw / 100)
      if (variants[0].compare_at_price_number) {
        product.compare_price = variants[0].compare_at_price_number
      }
    } else if (productData?.price) {
      // price está en centavos
      product.price = productData.price / 100
      if (productData.compare_at_price) {
        product.compare_price = productData.compare_at_price / 100
      }
    }

    // === 5. PRODUCT ID (para reenvío de pedidos) ===
    if (productData?.id) {
      product.source_product_id = String(productData.id)
    } else if (variants.length > 0) {
      product.source_product_id = String(variants[0].product_id)
    }

    // === 6. IMÁGENES (filtradas por keyword del producto) ===
    // Extraer keywords del URL para filtrar imágenes del producto vs sugeridos
    const productKeywords = extractProductKeyword(url)
    console.log('[scrape-tn] Keywords del producto:', productKeywords)

    const allImages: string[] = []
    const filteredImages: string[] = []

    // Método 1: Buscar TODAS las imágenes del CDN de Tiendanube en el HTML
    const cdnRegex = /(\/\/acdn(?:-us)?\.mitiendanube\.com\/stores\/[^"'\s]+\.(?:webp|jpg|jpeg|png))/gi
    let cdnMatch
    while ((cdnMatch = cdnRegex.exec(html)) !== null) {
      let imgUrl = cdnMatch[1]
      if (imgUrl.startsWith('//')) imgUrl = 'https:' + imgUrl

      // Solo imágenes 1024 (alta calidad) o imágenes de producto
      if (imgUrl.includes('/products/') && (imgUrl.includes('1024') || imgUrl.includes('640'))) {
        if (!allImages.includes(imgUrl)) {
          allImages.push(imgUrl)

          // Filtrar por keywords del producto
          if (imageMatchesProduct(imgUrl, productKeywords)) {
            filteredImages.push(imgUrl)
          }
        }
      }
    }

    // Método 2: data-fancybox (enlaces a imágenes grandes)
    const fancyboxRegex = /data-fancybox="product-gallery"[^>]*href="([^"]+)"/gi
    let fancyMatch
    while ((fancyMatch = fancyboxRegex.exec(html)) !== null) {
      let imgUrl = fancyMatch[1]
      if (imgUrl.startsWith('//')) imgUrl = 'https:' + imgUrl

      if (!allImages.includes(imgUrl)) {
        allImages.push(imgUrl)

        if (imageMatchesProduct(imgUrl, productKeywords)) {
          if (!filteredImages.includes(imgUrl)) {
            filteredImages.push(imgUrl)
          }
        }
      }
    }

    // Método 3: data-srcset con 1024w
    const srcsetRegex = /data-srcset='([^']+)'/gi
    let srcMatch
    while ((srcMatch = srcsetRegex.exec(html)) !== null) {
      const srcset = srcMatch[1]
      const url1024 = srcset.split(',').find(s => s.includes('1024'))
      if (url1024) {
        let imgUrl = url1024.trim().split(' ')[0]
        if (imgUrl.startsWith('//')) imgUrl = 'https:' + imgUrl

        if (!allImages.includes(imgUrl)) {
          allImages.push(imgUrl)

          if (imageMatchesProduct(imgUrl, productKeywords)) {
            if (!filteredImages.includes(imgUrl)) {
              filteredImages.push(imgUrl)
            }
          }
        }
      }
    }

    console.log('[scrape-tn] Imágenes encontradas:', allImages.length, '| Filtradas:', filteredImages.length)

    // Usar imágenes filtradas si hay, si no usar todas (fallback)
    // También excluir "paleta" que son las muestras de colores
    const finalImages = (filteredImages.length > 0 ? filteredImages : allImages)
      .filter(img => !img.toLowerCase().includes('paleta'))
      .slice(0, 10)

    product.images = finalImages

    // === 7. VIDEO ===
    if (productData?.video_url) {
      product.video_url = productData.video_url
    } else {
      const videoMatch = html.match(/data-video-url="([^"]+)"/i)
      if (videoMatch) product.video_url = videoMatch[1]
    }

    // === 8. VARIANTES COMPLETAS ===
    if (variants.length > 0) {
      const scrapedVariants: ScrapedVariant[] = []
      const optionNames: Set<string> = new Set()

      for (const v of variants) {
        scrapedVariants.push({
          id: v.id,
          name: v.option0 ? `${product.name} (${v.option0})` : product.name,
          option0: v.option0 || undefined,
          option1: v.option1 || undefined,
          option2: v.option2 || undefined,
          price: v.price_number || (v.price_number_raw / 100),
          compare_price: v.compare_at_price_number || undefined,
          stock: v.stock || 0,
          available: v.available || false,
          sku: v.sku || undefined,
          image_url: v.image_url ? (v.image_url.startsWith('//') ? 'https:' + v.image_url : v.image_url) : undefined
        })

        if (v.option0) optionNames.add(v.option0)
      }

      product.variants = scrapedVariants

      // Crear opciones de variante (ej: Talle: S, M, L)
      if (optionNames.size > 0) {
        // Buscar el label de la variante
        const labelMatch = html.match(/<label[^>]*class="form-label"[^>]*>([^<]+)<\/label>/i)
        const optionLabel = labelMatch ? labelMatch[1].trim().replace(':', '') : 'Talle'

        product.variant_options = [{
          name: optionLabel,
          options: Array.from(optionNames)
        }]
      }

      // Stock total
      product.stock = scrapedVariants.reduce((sum, v) => sum + v.stock, 0)

      // Para compatibilidad con sizes
      product.sizes = scrapedVariants.map(v => ({
        size: v.option0 || 'Único',
        stock: v.stock,
        price: v.price - product.price // diferencia de precio
      }))
    }

    // === 9. DESCRIPCIÓN CON HTML (incluye tabla de medidas) ===
    // Buscar el contenedor de descripción de Tiendanube
    const descSection = html.match(/data-store="product-description[^"]*"[\s\S]*?<div class="user-content[^"]*">([\s\S]*?)<\/div>\s*<\/div>/i)
    if (descSection) {
      let descHtml = descSection[1].trim()

      // Limpiar scripts y estilos inline excesivos, pero mantener tablas
      descHtml = descHtml
        .replace(/<script[\s\S]*?<\/script>/gi, '')
        .replace(/<style[\s\S]*?<\/style>/gi, '')
        // Simplificar estilos de tablas para que se vean bien
        .replace(/style="[^"]*"/gi, '')
        // Mantener estructura de la tabla pero limpiar
        .replace(/<colgroup[\s\S]*?<\/colgroup>/gi, '')

      product.description_html = descHtml
      // Guardar HTML como descripción para que se renderice en la tienda
      product.description = descHtml
    }

    // Fallback descripción desde meta
    if (!product.description) {
      const metaDesc = html.match(/<meta\s+property="og:description"\s+content="([^"]+)"/i)
      if (metaDesc) product.description = metaDesc[1]
    }

    // === 10. CATEGORÍA ===
    const categoryMatch = html.match(/item_category["']?\s*:\s*["']([^"']+)["']/i)
    if (categoryMatch) {
      product.category_name = categoryMatch[1]
    }

    // Validar mínimos
    if (!product.name || product.price === 0) {
      console.log('[scrape-tn] Producto inválido:', { name: product.name, price: product.price })
      return null
    }

    console.log('[scrape-tn] Producto scrapeado:', {
      name: product.name,
      price: product.price,
      images: product.images.length,
      variants: product.variants?.length || 0
    })

    return product
  } catch (e) {
    console.error('[scrape-tn] Error:', e)
    return null
  }
}

// ============================================
// SCRAPER GENÉRICO (fallback)
// ============================================
function scrapeProductPage(html: string, url: string, platform: string): ScrapedProduct | null {
  // Si es Tiendanube, usar scraper especializado
  if (platform === 'tiendanube') {
    return scrapeTiendanubeProduct(html, url)
  }

  try {
    const product: ScrapedProduct = {
      name: '',
      price: 0,
      images: [],
      source_url: url
    }

    // === NOMBRE ===
    const namePatterns = [
      /<h1[^>]*class="[^"]*product[^"]*name[^"]*"[^>]*>([^<]+)</i,
      /<h1[^>]*class="[^"]*nombre[^"]*"[^>]*>([^<]+)</i,
      /<h1[^>]*>([^<]+)</i,
      /<meta\s+property="og:title"\s+content="([^"]+)"/i,
      /<title>([^<|]+)/i,
      /itemprop="name"[^>]*>([^<]+)</i,
      /<span[^>]*class="[^"]*product-name[^"]*"[^>]*>([^<]+)</i
    ]

    for (const pattern of namePatterns) {
      const match = html.match(pattern)
      if (match && match[1]) {
        product.name = match[1].trim()
        break
      }
    }

    // === PRECIO ===
    const pricePatterns = [
      /\$\s*([\d.,]+)/,
      /precio[^>]*>\s*\$?\s*([\d.,]+)/i,
      /price[^>]*>\s*\$?\s*([\d.,]+)/i,
      /itemprop="price"[^>]*content="([\d.]+)"/i,
      /"price":\s*"?([\d.]+)/i,
      /data-price="([\d.]+)"/i,
      /class="[^"]*price[^"]*"[^>]*>\s*\$?\s*([\d.,]+)/i
    ]

    for (const pattern of pricePatterns) {
      const match = html.match(pattern)
      if (match && match[1]) {
        let priceStr = match[1].replace(/\./g, '').replace(',', '.')
        const price = parseFloat(priceStr)
        if (price > 0) {
          product.price = price
          break
        }
      }
    }

    // === DESCRIPCIÓN ===
    const descPatterns = [
      /<div[^>]*class="[^"]*description[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
      /<div[^>]*class="[^"]*descripcion[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
      /<meta\s+name="description"\s+content="([^"]+)"/i,
      /<meta\s+property="og:description"\s+content="([^"]+)"/i
    ]

    for (const pattern of descPatterns) {
      const match = html.match(pattern)
      if (match && match[1]) {
        product.description_html = match[1]
        product.description = match[1]
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
          .substring(0, 2000)
        break
      }
    }

    // === IMÁGENES ===
    const images: string[] = []

    // Buscar imágenes de producto
    const imgPatterns = [
      /data-zoom="([^"]+)"/gi,
      /data-zoom-image="([^"]+)"/gi,
      /data-large="([^"]+)"/gi,
      /<a[^>]*href="([^"]+\.(?:jpg|jpeg|png|webp))"/gi,
    ]

    for (const pattern of imgPatterns) {
      let match
      while ((match = pattern.exec(html)) !== null) {
        let imgUrl = match[1]
        if (imgUrl.startsWith('//')) imgUrl = 'https:' + imgUrl
        if (!images.includes(imgUrl) && !imgUrl.includes('placeholder')) {
          images.push(imgUrl)
        }
      }
    }

    // Fallback og:image
    const ogImage = html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i)
    if (ogImage && !images.includes(ogImage[1])) {
      images.push(ogImage[1])
    }

    product.images = images.slice(0, 10)

    // === STOCK ===
    if (html.match(/sin\s*stock|agotado|out\s*of\s*stock|no\s*disponible/i)) {
      product.stock = 0
    } else {
      product.stock = 10
    }

    if (!product.name || product.price === 0) {
      return null
    }

    return product
  } catch (e) {
    console.error('[scrape] Error parsing product:', e)
    return null
  }
}

// Obtener todas las páginas del catálogo
async function getAllCatalogPages(baseUrl: string): Promise<string[]> {
  const pages: string[] = [baseUrl]

  try {
    const response = await fetch(baseUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })
    const html = await response.text()

    // Buscar links de paginación
    const pageRegex = /href="([^"]*(?:page|pagina|p)=\d+[^"]*)"/gi
    let match
    while ((match = pageRegex.exec(html)) !== null) {
      let pageUrl = match[1]
      if (pageUrl.startsWith('/')) {
        const urlObj = new URL(baseUrl)
        pageUrl = urlObj.origin + pageUrl
      }
      if (!pages.includes(pageUrl)) {
        pages.push(pageUrl)
      }
    }

    // También buscar /page/2, /page/3, etc.
    const pageNumRegex = /href="([^"]*\/page\/\d+[^"]*)"/gi
    while ((match = pageNumRegex.exec(html)) !== null) {
      let pageUrl = match[1]
      if (pageUrl.startsWith('/')) {
        const urlObj = new URL(baseUrl)
        pageUrl = urlObj.origin + pageUrl
      }
      if (!pages.includes(pageUrl)) {
        pages.push(pageUrl)
      }
    }
  } catch (e) {
    console.error('[scrape] Error getting catalog pages:', e)
  }

  return pages.slice(0, 20) // Máximo 20 páginas
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      url,
      storeId,
      dryRun = true,
      markup = 0,           // % de ganancia sobre precio madre (ej: 30 = +30%)
      sourceStoreUrl = ''   // URL de la tienda madre para pedidos
    } = body // dryRun=true solo scrapea, no importa

    if (!url) {
      return NextResponse.json({ error: "URL requerida" }, { status: 400 })
    }

    if (!storeId && !dryRun) {
      return NextResponse.json({ error: "storeId requerido para importar" }, { status: 400 })
    }

    const result: ScrapeResult = {
      success: false,
      products: [],
      total: 0,
      source_url: url,
      errors: []
    }

    // 1. Obtener HTML de la tienda
    console.log('[scrape] Fetching:', url)
    const mainResponse = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'es-AR,es;q=0.9,en;q=0.8'
      }
    })

    if (!mainResponse.ok) {
      return NextResponse.json({
        error: `No se pudo acceder a la URL: ${mainResponse.status}`
      }, { status: 400 })
    }

    const mainHtml = await mainResponse.text()
    const platform = detectPlatform(url, mainHtml)
    result.platform = platform
    console.log('[scrape] Platform detected:', platform)

    // 2. Obtener todas las páginas del catálogo
    const catalogPages = await getAllCatalogPages(url)
    console.log('[scrape] Found catalog pages:', catalogPages.length)

    // 3. Extraer URLs de productos de cada página
    const allProductUrls: string[] = []
    for (const pageUrl of catalogPages) {
      try {
        let pageHtml = mainHtml
        if (pageUrl !== url) {
          const pageResponse = await fetch(pageUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
          })
          pageHtml = await pageResponse.text()
        }

        const productUrls = extractProductUrls(pageHtml, url, platform)
        for (const pUrl of productUrls) {
          if (!allProductUrls.includes(pUrl)) {
            allProductUrls.push(pUrl)
          }
        }
      } catch (e) {
        result.errors?.push(`Error en página ${pageUrl}: ${e}`)
      }
    }

    console.log('[scrape] Found product URLs:', allProductUrls.length)

    // 4. Scrapear cada producto
    for (const productUrl of allProductUrls.slice(0, 100)) { // Máximo 100 productos
      try {
        console.log('[scrape] Scraping product:', productUrl)
        const productResponse = await fetch(productUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        })
        const productHtml = await productResponse.text()

        const product = scrapeProductPage(productHtml, productUrl, platform)
        if (product) {
          // Aplicar markup si se especificó
          if (markup > 0) {
            const markupMultiplier = 1 + (markup / 100)
            product.price = Math.round(product.price * markupMultiplier)
            if (product.compare_price) {
              product.compare_price = Math.round(product.compare_price * markupMultiplier)
            }
            if (product.variants) {
              for (const v of product.variants) {
                v.price = Math.round(v.price * markupMultiplier)
                if (v.compare_price) {
                  v.compare_price = Math.round(v.compare_price * markupMultiplier)
                }
              }
            }
          }
          result.products.push(product)
        }

        // Pequeña pausa para no saturar el servidor
        await new Promise(r => setTimeout(r, 200))
      } catch (e) {
        result.errors?.push(`Error scrapeando ${productUrl}: ${e}`)
      }
    }

    result.total = result.products.length
    result.success = result.products.length > 0

    // 5. Si no es dryRun, importar a la tienda
    if (!dryRun && storeId && result.products.length > 0) {
      let imported = 0

      // Obtener slug de la tienda para la carpeta de imágenes
      const { data: store } = await supabase
        .from("stores")
        .select("slug")
        .eq("id", storeId)
        .single()

      const storeSlug = store?.slug || storeId

      for (const product of result.products) {
        try {
          // DESCARGAR IMÁGENES AL SERVIDOR LOCAL
          console.log('[scrape] Descargando imágenes para:', product.name)
          const localImages = await downloadAllImages(product.images, storeSlug)
          console.log('[scrape] Imágenes descargadas:', localImages.length, 'de', product.images.length)

          // Generar slug
          let baseSlug = product.name
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "")

          let slug = baseSlug
          let counter = 1
          let slugExists = true

          while (slugExists) {
            const { data: existingProduct } = await supabase
              .from("products")
              .select("id")
              .eq("store_id", storeId)
              .eq("slug", slug)
              .maybeSingle()

            if (!existingProduct) {
              slugExists = false
            } else {
              counter++
              slug = `${baseSlug}-${counter}`
            }
          }

          // Buscar o crear categoría
          let categoryId = null
          if (product.category_name) {
            const { data: existingCat } = await supabase
              .from("categories")
              .select("id")
              .eq("store_id", storeId)
              .ilike("name", product.category_name)
              .maybeSingle()

            if (existingCat) {
              categoryId = existingCat.id
            } else {
              const catSlug = product.category_name
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "")

              const { data: newCat } = await supabase
                .from("categories")
                .insert({
                  store_id: storeId,
                  name: product.category_name,
                  slug: catSlug,
                })
                .select("id")
                .single()

              if (newCat) categoryId = newCat.id
            }
          }

          // Insertar producto con datos completos para dropshipping
          // Usar imágenes locales descargadas (si hay) o las originales como fallback
          const finalImages = localImages.length > 0 ? localImages : product.images
          const { error } = await supabase
            .from("products")
            .insert({
              store_id: storeId,
              name: product.name,
              slug,
              description: product.description || "",
              price: product.price,
              compare_price: product.compare_price || null,
              image_url: finalImages[0] || null,
              images: finalImages,
              category_id: categoryId,
              sizes: product.sizes || null,
              active: true
            })

          if (error) {
            console.error('[scrape] Error insertando producto:', product.name, error)
            result.errors?.push(`Error insertando ${product.name}: ${error.message}`)
          } else {
            imported++
          }
        } catch (e) {
          result.errors?.push(`Error importando ${product.name}: ${e}`)
        }
      }

      return NextResponse.json({
        ...result,
        imported,
        message: `Scrapeados ${result.total} productos, importados ${imported} a la tienda`
      })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("[scrape] Error:", error)
    return NextResponse.json({
      error: `Error interno: ${error}`
    }, { status: 500 })
  }
}

// GET para verificar el endpoint
export async function GET() {
  return NextResponse.json({
    endpoint: "/api/admin/scrape-tienda",
    method: "POST",
    description: "Scraper para DROPSHIPPING - Extrae TODO del HTML visual de tiendas externas",
    params: {
      url: "URL de la tienda externa a scrapear (catálogo o producto)",
      storeId: "ID de la tienda destino (opcional si dryRun=true)",
      dryRun: "true para solo scrapear sin importar (default: true)",
      markup: "% de ganancia sobre precio madre (ej: 30 = +30%). Default: 0",
      sourceStoreUrl: "URL de la tienda madre para reenvío de pedidos"
    },
    platforms: ["tiendanube (optimizado)", "empretienda", "mercadoshops", "genérico"],
    features: [
      "✅ Nombre del producto",
      "✅ Precio REAL (del HTML visual)",
      "✅ Precio anterior (compare_price)",
      "✅ TODAS las imágenes en alta calidad (1024px)",
      "✅ Descripción completa con HTML (tabla de medidas)",
      "✅ Variantes completas (talle, color, stock por variante)",
      "✅ Video del producto",
      "✅ Categoría",
      "✅ ID y URL del producto madre (para pedidos)",
      "✅ Aplicación automática de markup %"
    ],
    ejemplo: {
      url: "https://mochi.com.ar/productos/tapado-luna-tweed/",
      storeId: "uuid-tienda-destino",
      dryRun: false,
      markup: 30,
      sourceStoreUrl: "https://mochi.com.ar"
    }
  })
}
