// ===========================================
// TIPOS CENTRALIZADOS - tol.ar
// ===========================================

// ----- TIENDAS -----
export interface Store {
  id: string
  username: string
  subdomain: string
  site_title: string
  template: string
  status: string
  email: string
  plan?: string
  admin_password?: string
  banner_image?: string | null
  banner_title?: string | null
  banner_subtitle?: string | null
  top_bar_text?: string | null
  top_bar_enabled?: boolean
  social_instagram?: string | null
  social_facebook?: string | null
  social_twitter?: string | null
  social_tiktok?: string | null
  social_whatsapp?: string | null
  social_youtube?: string | null
  footer_subtitle?: string | null
  created_at?: string
  last_login?: string
}

// ----- PRODUCTOS -----
export interface Product {
  id: string
  store_id?: string
  name: string
  slug: string
  description: string | null
  price: number
  compare_price: number | null
  stock: number
  image_url: string | null
  images?: string[] | null
  featured: boolean
  active: boolean
  category_id: string | null
  sizes: string[] | null
  category?: Category
  selectedSize?: string
  created_at?: string
}

// ----- CATEGORIAS -----
export interface Category {
  id: string
  store_id: string
  name: string
  slug: string
  created_at?: string
}

// ----- PEDIDOS -----
export interface Order {
  id: string
  store_id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  shipping_method: string
  shipping_address?: string
  shipping_city?: string
  shipping_postal_code?: string
  shipping_notes?: string
  payment_method: string
  payment_id?: string
  items: OrderItem[]
  subtotal: number
  shipping_cost: number
  total: number
  status: OrderStatus
  created_at: string
}

export interface OrderItem {
  productId: string
  name: string
  price: number
  quantity: number
  size?: string | null
  image_url?: string | null
}

export type OrderStatus = 
  | "pendiente" 
  | "pendiente_pago" 
  | "pagado" 
  | "preparando" 
  | "enviado" 
  | "entregado" 
  | "cancelado"

// ----- CARRITO -----
export interface CartItem {
  product: Product
  quantity: number
}

// ----- PAGOS -----
export interface PaymentMethods {
  id?: string
  store_id: string
  // Efectivo
  cash_enabled: boolean
  cash_instructions?: string
  // Transferencia
  transfer_enabled: boolean
  transfer_cbu?: string
  transfer_alias?: string
  transfer_bank?: string
  transfer_holder?: string
  // MercadoPago
  mercadopago_enabled: boolean
  mercadopago_access_token?: string
  mercadopago_test_mode?: boolean
  mercadopago_test_token?: string
  mercadopago_link?: string
  mercadopago_checkout_type?: "redirect" | "modal"
}

// ----- ENVIOS -----
export interface ShippingMethods {
  id?: string
  store_id: string
  pickup_enabled: boolean
  pickup_address?: string
  pickup_hours?: string
  local_enabled: boolean
  local_price?: number
  local_zones?: string
  local_estimated_time?: string
  national_enabled: boolean
  national_price?: number
  national_estimated_time?: string
}

// ----- PLANES -----
export interface Plan {
  id: string
  name: string
  price: number
  features: string[]
  limits: PlanLimits
}

export interface PlanLimits {
  products: number
  images_per_product: number
  categories: number
  custom_domain: boolean
  analytics: boolean
  priority_support: boolean
}

// ----- ANALYTICS -----
export interface StoreAnalytics {
  store_id: string
  total_visits: number
  total_orders: number
  total_revenue: number
  conversion_rate: number
  top_products: { id: string; name: string; sales: number }[]
}

// ----- API RESPONSES -----
export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

// ----- MERCADOPAGO -----
export interface MPPreference {
  preferenceId: string
  initPoint: string
  sandboxInitPoint?: string
  isTestMode: boolean
  checkoutType: "redirect" | "modal"
}
