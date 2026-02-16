// ===========================================
// STORE CONTEXT - tol.ar
// ===========================================
// Este archivo re-exporta los servicios para mantener
// compatibilidad con los imports existentes.
// Para nuevos desarrollos, usar directamente:
// import { ... } from "@/lib/services"
// ===========================================

// Re-exportar tipos
export type { Store, Product, Category, CartItem } from "@/lib/types"

// Re-exportar servicios
export {
  getStoreBySubdomain,
  getStoreProducts,
  getStoreCategories,
  getFeaturedProducts,
  getProductBySlug,
  getProductsByCategory,
} from "@/lib/services"

export { getStorePurchasedFeatures } from "@/lib/services/stores"
