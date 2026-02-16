import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { storeId, product } = body

    if (!storeId || !product?.name || !product?.price) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 })
    }

    const supabase = await createServerClient()

    // Verificar que la tienda tiene la feature csv_import activa
    const { data: feature } = await supabase
      .from("store_purchased_features")
      .select("id")
      .eq("store_id", storeId)
      .eq("feature_code", "csv_import")
      .eq("is_active", true)
      .maybeSingle()

    if (!feature) {
      return NextResponse.json({ error: "No tenes la feature de importacion CSV activa" }, { status: 403 })
    }

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

    // Si tiene categoria, buscar o crear
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
        // Crear la categoria
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

        if (newCat) {
          categoryId = newCat.id
        }
      }
    }

    // Parsear talles si existen (formato: S|M|L|XL)
    let sizes = null
    if (product.sizes) {
      const sizeList = product.sizes.split("|").map((s: string) => s.trim()).filter(Boolean)
      if (sizeList.length > 0) {
        sizes = sizeList.map((size: string) => ({
          size,
          stock: product.stock || 10,
          price: 0,
        }))
      }
    }

    // Insertar producto
    const productData: Record<string, unknown> = {
      store_id: storeId,
      name: product.name,
      slug,
      description: product.description || "",
      price: product.price,
      compare_price: product.compare_price || null,
      image_url: product.image_url || null,
      category_id: categoryId,
      sizes: sizes,
      is_active: true,
    }

    // Si no tiene talles pero tiene stock, se podria agregar como info
    // El stock se maneja por talle en este sistema

    const { data, error } = await supabase
      .from("products")
      .insert(productData)
      .select()
      .single()

    if (error) {
      console.error("Error importing product:", error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ product: data })
  } catch (error) {
    console.error("Error importing product:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
