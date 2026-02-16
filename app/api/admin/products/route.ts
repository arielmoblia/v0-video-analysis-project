import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const storeId = searchParams.get("storeId")

    if (!storeId) {
      return NextResponse.json({ error: "Store ID requerido" }, { status: 400 })
    }

    const supabase = await createServerClient()

    const [productsRes, categoriesRes] = await Promise.all([
      supabase.from("products").select("*").eq("store_id", storeId).order("display_order", { ascending: true, nullsFirst: false }).order("created_at", { ascending: false }),
      supabase.from("categories").select("*").eq("store_id", storeId).order("name"),
    ])

    return NextResponse.json({
      products: productsRes.data || [],
      categories: categoriesRes.data || [],
    })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { storeId, ...productData } = body

    if (!storeId) {
      return NextResponse.json({ error: "Store ID requerido" }, { status: 400 })
    }

    const supabase = await createServerClient()

    // Generar slug base
    let baseSlug = productData.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    // Verificar si ya existe un producto con ese slug en la tienda
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

    const { data, error } = await supabase
      .from("products")
      .insert({
        store_id: storeId,
        slug,
        ...productData,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating product:", error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ product: data })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, storeId, ...productData } = body

    if (!id) {
      return NextResponse.json({ error: "Product ID requerido" }, { status: 400 })
    }

    const supabase = await createServerClient()

    // Generar slug base
    let baseSlug = productData.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    // Verificar si ya existe otro producto con ese slug (excluyendo el actual)
    let slug = baseSlug
    let counter = 1
    let slugExists = true

    while (slugExists) {
      const { data: existingProduct } = await supabase
        .from("products")
        .select("id")
        .eq("store_id", storeId)
        .eq("slug", slug)
        .neq("id", id)
        .maybeSingle()

      if (!existingProduct) {
        slugExists = false
      } else {
        counter++
        slug = `${baseSlug}-${counter}`
      }
    }

    const { data, error } = await supabase
      .from("products")
      .update({
        slug,
        ...productData,
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error updating product:", error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ product: data })
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Product ID requerido" }, { status: 400 })
    }

    const supabase = await createServerClient()

    const { error } = await supabase.from("products").delete().eq("id", id)

    if (error) {
      console.error("Error deleting product:", error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
