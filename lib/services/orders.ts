// ===========================================
// SERVICIO DE PEDIDOS - tol.ar
// ===========================================

import { createClient } from "@/lib/supabase/server"
import type { Order, OrderStatus } from "@/lib/types"

/**
 * Obtiene todos los pedidos de una tienda
 */
export async function getStoreOrders(storeId: string): Promise<Order[]> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("store_id", storeId)
      .order("created_at", { ascending: false })

    if (error || !data) return []
    return data as Order[]
  } catch (e) {
    console.error("[orders] Error in getStoreOrders:", e)
    return []
  }
}

/**
 * Obtiene un pedido por su ID
 */
export async function getOrderById(orderId: string): Promise<Order | null> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single()

    if (error || !data) return null
    return data as Order
  } catch (e) {
    console.error("[orders] Error in getOrderById:", e)
    return null
  }
}

/**
 * Actualiza el estado de un pedido
 */
export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<boolean> {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", orderId)

    return !error
  } catch (e) {
    console.error("[orders] Error in updateOrderStatus:", e)
    return false
  }
}

/**
 * Actualiza el estado de pago de un pedido
 */
export async function updateOrderPayment(orderId: string, paymentId: string, status: OrderStatus = "pagado"): Promise<boolean> {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from("orders")
      .update({ 
        status,
        payment_id: paymentId 
      })
      .eq("id", orderId)

    return !error
  } catch (e) {
    console.error("[orders] Error in updateOrderPayment:", e)
    return false
  }
}

/**
 * Obtiene estadísticas de pedidos de una tienda
 */
export async function getOrderStats(storeId: string) {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("orders")
      .select("total, status, created_at")
      .eq("store_id", storeId)

    if (error || !data) return null

    const totalOrders = data.length
    const totalRevenue = data
      .filter(o => o.status === "pagado" || o.status === "entregado")
      .reduce((sum, o) => sum + (o.total || 0), 0)
    const pendingOrders = data.filter(o => o.status === "pendiente").length
    const paidOrders = data.filter(o => o.status === "pagado" || o.status === "entregado").length

    return {
      totalOrders,
      totalRevenue,
      pendingOrders,
      paidOrders
    }
  } catch (e) {
    console.error("[orders] Error in getOrderStats:", e)
    return null
  }
}
