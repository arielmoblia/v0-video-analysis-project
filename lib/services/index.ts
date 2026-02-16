// ===========================================
// SERVICIOS - tol.ar
// ===========================================
// Exportación centralizada de todos los servicios

// Tiendas
export {
  getStoreBySubdomain,
  getStoreById,
  getAllStores,
  updateLastLogin,
  getStoreFeatures,
  hasStoreFeature,
} from "./stores"

// Productos
export {
  getStoreProducts,
  getFeaturedProducts,
  getProductBySlug,
  getProductsByCategory,
  getStoreCategories,
  generateSlug,
} from "./products"

// Pedidos
export {
  getStoreOrders,
  getOrderById,
  updateOrderStatus,
  updateOrderPayment,
  getOrderStats,
} from "./orders"

// Pagos
export {
  getPaymentMethods,
  getMercadoPagoToken,
  validateMPToken,
  createMPPreference,
} from "./payments"
