// ===========================================
// SERVICIO DE PRODUCTOS - tol.ar
// ===========================================

import { createClient } from "@/lib/supabase/server"
import type { Product, Category } from "@/lib/types"

/**
 * Obtiene todos los productos activos de una tienda
 */
export async function getStoreProducts(storeId: string): Promise<Product[]> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("store_id", storeId)
      .eq("active", true)
      .order("display_order", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: false })

    if (error || !data) return []
    return data as Product[]
  } catch (e) {
    console.error("[products] Error in getStoreProducts:", e)
    return []
  }
}

/**
 * Obtiene productos destacados de una tienda
 */
export async function getFeaturedProducts(storeId: string, limit = 8): Promise<Product[]> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("store_id", storeId)
      .eq("active", true)
      .eq("featured", true)
      .limit(limit)

    if (error || !data) return []
    return data as Product[]
  } catch (e) {
    console.error("[products] Error in getFeaturedProducts:", e)
    return []
  }
}

/**
 * Obtiene un producto por su slug
 */
export async function getProductBySlug(storeId: string, slug: string): Promise<Product | null> {
  try {
    const supabase = await createClient()

    // Primero intentar buscar por slug exacto
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("store_id", storeId)
      .eq("slug", slug)
      .eq("active", true)
      .maybeSingle()

    if (data) return data as Product

    // Si no encuentra por slug, intentar buscar por ID (por si el slug es un UUID)
    if (slug.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      const { data: dataById } = await supabase
        .from("products")
        .select("*")
        .eq("store_id", storeId)
        .eq("id", slug)
        .eq("active", true)
        .single()

      if (dataById) return dataById as Product
    }

    // Si hay múltiples productos con el mismo slug, tomar el primero
    const { data: dataMultiple } = await supabase
      .from("products")
      .select("*")
      .eq("store_id", storeId)
      .ilike("slug", slug)
      .eq("active", true)
      .limit(1)
      .single()

    if (dataMultiple) return dataMultiple as Product

    return null
  } catch (e) {
    console.error("[products] Error in getProductBySlug:", e)
    return null
  }
}

/**
 * Obtiene productos por categoría
 */
export async function getProductsByCategory(storeId: string, categoryId: string): Promise<Product[]> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("store_id", storeId)
      .eq("category_id", categoryId)
      .eq("active", true)
      .order("display_order", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: false })

    if (error || !data) return []
    return data as Product[]
  } catch (e) {
    console.error("[products] Error in getProductsByCategory:", e)
    return []
  }
}

/**
 * Obtiene todas las categorías de una tienda
 */
export async function getStoreCategories(storeId: string): Promise<Category[]> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("store_id", storeId)
      .order("name", { ascending: true })

    if (error || !data) return []
    return data as Category[]
  } catch (e) {
    console.error("[products] Error in getStoreCategories:", e)
    return []
  }
}

/**
 * Genera un slug único para un producto
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}
