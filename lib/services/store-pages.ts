// ===========================================
// SERVICIO DE PÁGINAS PROPIAS POR TIENDA - tol.ar
// ===========================================

import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export interface StorePage {
  id: string
  store_id: string
  slug: string
  title: string
  content: string
  is_published: boolean
  display_order: number
  created_at: string
  updated_at: string
}

/**
 * Obtiene las páginas publicadas de una tienda, para la botonera del menú.
 */
export async function getStorePages(storeId: string): Promise<StorePage[]> {
  try {
    const { data, error } = await supabase
      .from("store_pages")
      .select("*")
      .eq("store_id", storeId)
      .eq("is_published", true)
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: true })

    if (error || !data) return []
    return data as StorePage[]
  } catch (e) {
    console.error("[store-pages] Error in getStorePages:", e)
    return []
  }
}

/**
 * Obtiene todas las páginas de una tienda (incluidas las no publicadas), para el admin.
 */
export async function getAllStorePages(storeId: string): Promise<StorePage[]> {
  try {
    const { data, error } = await supabase
      .from("store_pages")
      .select("*")
      .eq("store_id", storeId)
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: true })

    if (error || !data) return []
    return data as StorePage[]
  } catch (e) {
    console.error("[store-pages] Error in getAllStorePages:", e)
    return []
  }
}

export async function getStorePageBySlug(storeId: string, slug: string): Promise<StorePage | null> {
  try {
    const { data } = await supabase
      .from("store_pages")
      .select("*")
      .eq("store_id", storeId)
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle()

    return (data as StorePage) || null
  } catch (e) {
    console.error("[store-pages] Error in getStorePageBySlug:", e)
    return null
  }
}

/**
 * Genera un slug único para una página nueva (reusa productos.generateSlug).
 */
export function generatePageSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}
