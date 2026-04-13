import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Mapeo template wizard -> template create-store
const TEMPLATE_MAP: Record<string, string> = {
  indumentaria: "clothing",
  calzado:      "footwear",
  perfumeria:   "cosmetics",
  tecnologia:   "electronics",
  hogar:        "default",
  generico:     "default",
}

// Descarga imagen externa y la guarda en Supabase Storage
async function downloadAndStoreImage(
  imageUrl: string,
  storeId: string,
  productSlug: string,
  supabase: any
): Promise<string | null> {
  if (!imageUrl || !imageUrl.startsWith("http")) return null
  try {
    const res = await fetch(imageUrl, { signal: AbortSignal.timeout(8000) })
    if (!res.ok) return null
    const buffer = await res.arrayBuffer()
    const contentType = res.headers.get("content-type") || "image/jpeg"
    const ext = contentType.includes("png") ? "png" : contentType.includes("webp") ? "webp" : "jpg"
    const path = `${storeId}/${productSlug}-${Date.now()}.${ext}`
    const { error } = await supabase.storage
      .from("store-images")
      .upload(path, buffer, { contentType, upsert: true })
    if (error) { console.error("[migrar] Storage error:", error.message); return null }
    const { data: { publicUrl } } = supabase.storage.from("store-images").getPublicUrl(path)
    return publicUrl
  } catch (e) {
    console.error("[migrar] Image download error:", e)
    return null
  }
}

// Genera slug desde nombre
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .substring(0, 80)
}

// Parsea CSV simple (maneja comillas y comas dentro de campos)
function parseCSV(text: string): Record<string, string>[] {
  const lines = text.split(/\r?\n/).filter(l => l.trim())
  if (lines.length < 2) return []

  const headers = lines[0].split(",").map(h => h.replace(/^"|"$/g, "").trim().toLowerCase())
  const rows: Record<string, string>[] = []

  for (let i = 1; i < lines.length; i++) {
    const values: string[] = []
    let current = ""
    let inQuotes = false

    for (const char of lines[i]) {
      if (char === '"') { inQuotes = !inQuotes; continue }
      if (char === "," && !inQuotes) { values.push(current.trim()); current = ""; continue }
      current += char
    }
    values.push(current.trim())

    const row: Record<string, string> = {}
    headers.forEach((h, idx) => { row[h] = values[idx] || "" })
    rows.push(row)
  }

  return rows
}

// Detecta qué columna del CSV corresponde a cada campo de tol.ar
function mapColumns(headers: string[], userMapping?: Record<string, string>) {
  // Si el usuario mandó un mapping manual, usarlo
  if (userMapping) return userMapping

  const map: Record<string, string> = {}
  const FIELD_ALIASES: Record<string, string[]> = {
    name:        ["nombre", "name", "titulo", "title", "producto", "descripcion corta"],
    price:       ["precio", "price", "precio_venta", "valor", "costo"],
    description: ["descripcion", "description", "detalle", "detalle_producto"],
    image_url:   ["foto", "imagen", "image", "url_foto", "url_foto_1", "foto_url", "img"],
    category:    ["categoria", "category", "rubro", "tipo"],
    stock:       ["stock", "cantidad", "inventory", "existencias"],
  }

  for (const [field, aliases] of Object.entries(FIELD_ALIASES)) {
    for (const header of headers) {
      if (aliases.some(a => header.includes(a))) {
        map[field] = header
        break
      }
    }
  }

  return map
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    // Datos del wizard
    const file        = formData.get("file") as File | null
    const email       = formData.get("email") as string
    const subdomain   = formData.get("subdomain") as string
    const template    = formData.get("template") as string
    const destino     = formData.get("destino") as string // "nueva" | "existente"
    const storeId     = formData.get("store_id") as string | null // si es existente
    const columnMapRaw = formData.get("column_map") as string | null

    // Validaciones básicas
    if (!file)      return NextResponse.json({ error: "Archivo requerido" }, { status: 400 })
    if (!email)     return NextResponse.json({ error: "Email requerido" }, { status: 400 })
    if (destino === "nueva" && !subdomain)
                    return NextResponse.json({ error: "Subdominio requerido" }, { status: 400 })

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // ─── PASO 1: Leer y parsear el archivo ───────────────────────────────────
    const fileText = await file.text()
    let rows: Record<string, string>[] = []

    const fileName = file.name.toLowerCase()
    if (fileName.endsWith(".csv")) {
      rows = parseCSV(fileText)
    } else {
      return NextResponse.json({ error: "Por ahora solo soportamos CSV. Excel (.xlsx) próximamente." }, { status: 400 })
    }

    if (rows.length === 0) {
      return NextResponse.json({ error: "El archivo está vacío o no tiene el formato correcto" }, { status: 400 })
    }

    const headers = Object.keys(rows[0])
    const userMapping = columnMapRaw ? JSON.parse(columnMapRaw) : null
    const colMap = mapColumns(headers, userMapping)

    if (!colMap.name) {
      return NextResponse.json({
        error: "No pudimos detectar la columna de nombre del producto. Por favor mapeá las columnas manualmente.",
        headers,
        detected: colMap,
      }, { status: 422 })
    }

    // ─── PASO 2: Crear o buscar la tienda ────────────────────────────────────
    let targetStoreId: string
    let storeUrl: string
    let adminUrl: string
    let adminPassword: string | null = null

    if (destino === "existente" && storeId) {
      // Tienda existente — verificar que existe
      const { data: existingStore, error: storeError } = await supabase
        .from("stores")
        .select("id, subdomain, store_url, admin_url")
        .eq("id", storeId)
        .single()

      if (storeError || !existingStore) {
        return NextResponse.json({ error: "Tienda no encontrada" }, { status: 404 })
      }

      targetStoreId = existingStore.id
      storeUrl      = existingStore.store_url
      adminUrl      = existingStore.admin_url

    } else {
      // Tienda nueva — llamar a la API de create-store internamente
      const createStoreBody = {
        username:       subdomain.toLowerCase(),
        email:          email.toLowerCase(),
        subdomain:      subdomain.toLowerCase(),
        siteTitle:      subdomain.charAt(0).toUpperCase() + subdomain.slice(1),
        allowIndexing:  "no",
        template:       TEMPLATE_MAP[template] || "default",
      }

      const createRes = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3003"}/api/create-store`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createStoreBody),
      })

      const createData = await createRes.json()

      if (!createRes.ok || !createData.success) {
        return NextResponse.json({
          error: createData.error || "Error al crear la tienda"
        }, { status: 400 })
      }

      targetStoreId = createData.store.id
      storeUrl      = createData.store.storeUrl
      adminUrl      = createData.store.adminUrl
      adminPassword = createData.store.adminPassword
    }

    // ─── PASO 2.5: Borrar productos del template ────────────────────────────
    // Cuando es tienda nueva, borramos los productos clonados del template
    // para que solo queden los importados del CSV
    if (destino !== "existente") {
      await supabase.from("products").delete().eq("store_id", targetStoreId)
      await supabase.from("categories").delete().eq("store_id", targetStoreId)
      console.log("[migrar] Productos y categorías del template eliminados")
    }

    // ─── PASO 3: Importar productos ──────────────────────────────────────────
    const imported: string[] = []
    const warnings: { row: number; name: string; issue: string }[] = []

    // Primero obtener categorías existentes de la tienda
    const { data: existingCategories } = await supabase
      .from("categories")
      .select("id, name, slug")
      .eq("store_id", targetStoreId)

    const categoryCache: Record<string, string> = {}
    if (existingCategories) {
      existingCategories.forEach(cat => { categoryCache[cat.name.toLowerCase()] = cat.id })
    }

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i]

      const name = row[colMap.name]?.trim()
      if (!name) {
        warnings.push({ row: i + 2, name: "(sin nombre)", issue: "Fila sin nombre — omitida" })
        continue
      }

      const priceRaw = colMap.price ? row[colMap.price]?.replace(/[^0-9.,]/g, "").replace(",", ".") : ""
      const price    = priceRaw ? parseFloat(priceRaw) : null

      if (!price) {
        warnings.push({ row: i + 2, name, issue: "Sin precio — importado igual, editalo después" })
      }

      const description = colMap.description ? row[colMap.description]?.trim() : ""
      const imageUrl    = colMap.image_url   ? row[colMap.image_url]?.trim()   : ""
      const categoryName = colMap.category   ? row[colMap.category]?.trim()    : ""

      // Resolver o crear categoría
      let categoryId: string | null = null
      if (categoryName) {
        const catKey = categoryName.toLowerCase()
        if (categoryCache[catKey]) {
          categoryId = categoryCache[catKey]
        } else {
          // Crear la categoría
          const { data: newCat } = await supabase
            .from("categories")
            .insert({
              store_id: targetStoreId,
              name:     categoryName,
              slug:     generateSlug(categoryName),
            })
            .select("id")
            .single()

          if (newCat) {
            categoryCache[catKey] = newCat.id
            categoryId = newCat.id
          }
        }
      }

      // Generar slug único
      let slug = generateSlug(name)
      const { data: slugCheck } = await supabase
        .from("products")
        .select("id")
        .eq("store_id", targetStoreId)
        .eq("slug", slug)
        .maybeSingle()

      if (slugCheck) slug = `${slug}-${i}`

      // Descargar imagen y guardar en Supabase Storage
      let finalImageUrl: string | null = null
      if (imageUrl) {
        finalImageUrl = await downloadAndStoreImage(imageUrl, targetStoreId, slug, supabase)
        if (!finalImageUrl) finalImageUrl = imageUrl // fallback a URL original si falla
      }

      // Insertar producto
      const { error: productError } = await supabase.from("products").insert({
        store_id:    targetStoreId,
        name,
        slug,
        description: description || null,
        price:       price || 0,
        image_url:   finalImageUrl || null,
        category_id: categoryId,
        active:      true,
      })

      if (productError) {
        warnings.push({ row: i + 2, name, issue: "Error al insertar: " + productError.message })
      } else {
        imported.push(name)
      }
    }

    // ─── PASO 4: Respuesta ───────────────────────────────────────────────────
    return NextResponse.json({
      success:       true,
      imported:      imported.length,
      warnings:      warnings.length,
      warningDetail: warnings,
      storeUrl,
      adminUrl,
      adminPassword,
      subdomain:     subdomain?.toLowerCase(),
    })

  } catch (error) {
    console.error("[migrar] Error:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
