// ===========================================
// SERVICIO DE TIENDAS - tol.ar
// ===========================================

import { createClient } from "@/lib/supabase/server"
import type { Store } from "@/lib/types"

/**
 * Obtiene una tienda por su subdominio
 */
export async function getStoreBySubdomain(subdomain: string): Promise<Store | null> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("stores")
      .select("*")
      .eq("subdomain", subdomain.toLowerCase())
      .eq("status", "active")
      .single()

    if (error || !data) return null
    return data as Store
  } catch (e) {
    console.error("[stores] Error in getStoreBySubdomain:", e)
    return null
  }
}

/**
 * Obtiene una tienda por su ID
 */
export async function getStoreById(storeId: string): Promise<Store | null> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("stores")
      .select("*")
      .eq("id", storeId)
      .single()

    if (error || !data) return null
    return data as Store
  } catch (e) {
    console.error("[stores] Error in getStoreById:", e)
    return null
  }
}

/**
 * Obtiene todas las tiendas (para super admin)
 */
export async function getAllStores(): Promise<Store[]> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("stores")
      .select("*")
      .order("created_at", { ascending: false })

    if (error || !data) return []
    return data as Store[]
  } catch (e) {
    console.error("[stores] Error in getAllStores:", e)
    return []
  }
}

/**
 * Actualiza el último login de una tienda
 */
export async function updateLastLogin(storeId: string): Promise<void> {
  try {
    const supabase = await createClient()

    await supabase
      .from("stores")
      .update({ last_login: new Date().toISOString() })
      .eq("id", storeId)
  } catch (e) {
    console.error("[stores] Error in updateLastLogin:", e)
  }
}

/**
 * Obtiene las features activas de una tienda (compradas o regaladas)
 */
export async function getStoreFeatures(storeId: string): Promise<string[]> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("store_purchased_features")
      .select("feature_code")
      .eq("store_id", storeId)
      .eq("is_active", true)

    if (error || !data) return []
    return data.map((f) => f.feature_code)
  } catch (e) {
    console.error("[stores] Error in getStoreFeatures:", e)
    return []
  }
}

/**
 * Verifica si una tienda tiene una feature especifica
 */
export async function hasStoreFeature(storeId: string, featureCode: string): Promise<boolean> {
  const features = await getStoreFeatures(storeId)
  return features.includes(featureCode)
}

/**
 * Obtiene las features compradas del Plan Cositas por una tienda
 */
export async function getStorePurchasedFeatures(storeId: string): Promise<string[]> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("store_purchased_features")
      .select("feature_code")
      .eq("store_id", storeId)
      .eq("is_active", true)

    if (error || !data) return []
    return data.map((f) => f.feature_code)
  } catch (e) {
    console.error("[stores] Error in getStorePurchasedFeatures:", e)
    return []
  }
}
