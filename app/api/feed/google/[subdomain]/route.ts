import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// Mapeo de categorias internas -> Taxonomia de Google
const GOOGLE_CATEGORY_MAP: Record<string, string> = {
  zapatos: "Apparel & Accessories > Shoes",
  ropa: "Apparel & Accessories > Clothing",
  perfumes: "Health & Beauty > Personal Care > Cosmetics > Perfume & Cologne",
  electronicos: "Electronics",
  accesorios: "Apparel & Accessories > Clothing Accessories",
  deportes: "Sporting Goods",
  hogar: "Home & Garden",
  juguetes: "Toys & Games",
  alimentos: "Food, Beverages & Tobacco",
  mascotas: "Animals & Pet Supplies",
  salud: "Health & Beauty",
  libros: "Media > Books",
  arte: "Arts & Entertainment",
  joyeria: "Apparel & Accessories > Jewelry",
  bebes: "Baby & Toddler",
}

function getGoogleCategory(template: string, categoryName?: string): string {
  if (categoryName) {
    const lower = categoryName.toLowerCase()
    for (const [key, value] of Object.entries(GOOGLE_CATEGORY_MAP)) {
      if (lower.includes(key)) return value
    }
  }
  return GOOGLE_CATEGORY_MAP[template] || "Business & Industrial"
}

// Feed XML para Google Merchant Center
export async function GET(request: Request, { params }: { params: Promise<{ subdomain: string }> }) {
  const { subdomain } = await params
  const supabase = await createClient()

  const { data: store } = await supabase.from("stores").select("*").eq("subdomain", subdomain).single()

  if (!store) {
    return NextResponse.json({ error: "Tienda no encontrada" }, { status: 404 })
  }

  if (!store.google_merchant_enabled) {
    return NextResponse.json({ error: "Google Merchant no habilitado" }, { status: 403 })
  }

  const { data: products } = await supabase
    .from("products")
    .select("*, categories(name)")
    .eq("store_id", store.id)
    .eq("is_active", true)

  if (!products || products.length === 0) {
    return NextResponse.json({ error: "No hay productos" }, { status: 404 })
  }

  let exchangeRate = 1
  if (store.prices_in_usd) {
    try {
      const response = await fetch("https://dolarapi.com/v1/dolares/blue")
      const data = await response.json()
      exchangeRate = data.venta || 1000
    } catch {
      exchangeRate = 1000
    }
  }

  const baseUrl = `https://${subdomain}.tol.ar`
  const template = store.template || "base"

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>${escapeXml(store.site_title || store.subdomain)}</title>
    <link>${baseUrl}</link>
    <description>Productos de ${escapeXml(store.site_title || store.subdomain)}</description>
${products
  .map((product: any) => {
    const price = store.prices_in_usd ? Math.round(product.price * exchangeRate) : product.price
    const comparePrice = product.compare_price 
      ? (store.prices_in_usd ? Math.round(product.compare_price * exchangeRate) : product.compare_price)
      : null
    const slug = product.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
    const categoryName = product.categories?.name || ""
    const googleCategory = getGoogleCategory(template, categoryName)
    const imageUrl = product.images?.[0] || product.image_url || ""

    return `    <item>
      <g:id>${product.id}</g:id>
      <g:title><![CDATA[${product.name}]]></g:title>
      <g:description><![CDATA[${(product.description || product.name).substring(0, 5000)}]]></g:description>
      <g:link>${baseUrl}/producto/${slug}</g:link>
      <g:image_link>${imageUrl}</g:image_link>
      <g:price>${price} ARS</g:price>${comparePrice && comparePrice > price ? `\n      <g:sale_price>${price} ARS</g:sale_price>` : ""}
      <g:availability>${product.stock > 0 ? "in_stock" : "out_of_stock"}</g:availability>
      <g:condition>new</g:condition>
      <g:brand><![CDATA[${escapeXml(store.site_title || store.subdomain)}]]></g:brand>
      <g:google_product_category>${googleCategory}</g:google_product_category>${categoryName ? `\n      <g:product_type><![CDATA[${categoryName}]]></g:product_type>` : ""}
      <g:shipping>
        <g:country>AR</g:country>
        <g:service>Standard</g:service>
        <g:price>0 ARS</g:price>
      </g:shipping>
    </item>`
  })
  .join("\n")}
  </channel>
</rss>`

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  })
}

function escapeXml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
}
