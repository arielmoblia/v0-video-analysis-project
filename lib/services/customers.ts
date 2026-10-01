// ===========================================
// SERVICIO DE CUENTAS DE CLIENTE - tol.ar
// ===========================================
// Login propio por tienda para el comprador final (distinto del login del
// dueño en admin_password). Contraseña SIEMPRE hasheada con bcrypt.

import { createClient } from "@supabase/supabase-js"
import bcrypt from "bcryptjs"
import crypto from "crypto"
import type { Order } from "@/lib/types"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

const SESSION_DAYS = 30

export interface Customer {
  id: string
  store_id: string
  name: string
  email: string
  phone: string | null
  created_at: string
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

/**
 * Crea un cliente nuevo para una tienda. Devuelve null si ya existe un
 * cliente con ese email en esa tienda (UNIQUE store_id+email).
 */
export async function createCustomer(
  storeId: string,
  name: string,
  email: string,
  phone: string | null,
  password: string,
): Promise<Customer | null> {
  const passwordHash = await hashPassword(password)
  const { data, error } = await supabase
    .from("customers")
    .insert({ store_id: storeId, name, email: normalizeEmail(email), phone, password_hash: passwordHash })
    .select("id, store_id, name, email, phone, created_at")
    .single()

  if (error || !data) return null
  return data as Customer
}

export async function getCustomerByEmail(storeId: string, email: string): Promise<(Customer & { password_hash: string }) | null> {
  const { data, error } = await supabase
    .from("customers")
    .select("id, store_id, name, email, phone, password_hash, created_at")
    .eq("store_id", storeId)
    .eq("email", normalizeEmail(email))
    .maybeSingle()

  if (error || !data) return null
  return data as Customer & { password_hash: string }
}

export async function updateCustomerPassword(customerId: string, newPassword: string): Promise<boolean> {
  const passwordHash = await hashPassword(newPassword)
  const { error } = await supabase
    .from("customers")
    .update({ password_hash: passwordHash, updated_at: new Date().toISOString() })
    .eq("id", customerId)
  return !error
}

/**
 * Crea una sesión nueva (token aleatorio, 30 días) y la guarda en
 * customer_sessions. El token es lo que se guarda en la cookie.
 */
export async function createSession(customerId: string, storeId: string): Promise<string> {
  const token = crypto.randomBytes(32).toString("hex")
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000).toISOString()
  await supabase.from("customer_sessions").insert({ token, customer_id: customerId, store_id: storeId, expires_at: expiresAt })
  return token
}

export async function deleteSession(token: string): Promise<void> {
  await supabase.from("customer_sessions").delete().eq("token", token)
}

/**
 * Valida un token de sesión contra una tienda puntual (el token de Pink no
 * sirve para otra tienda aunque no haya expirado).
 */
export async function getCustomerBySession(token: string, storeId: string): Promise<Customer | null> {
  if (!token) return null

  const { data: session } = await supabase
    .from("customer_sessions")
    .select("customer_id, store_id, expires_at")
    .eq("token", token)
    .eq("store_id", storeId)
    .maybeSingle()

  if (!session || new Date(session.expires_at) < new Date()) return null

  const { data: customer } = await supabase
    .from("customers")
    .select("id, store_id, name, email, phone, created_at")
    .eq("id", session.customer_id)
    .maybeSingle()

  return (customer as Customer) || null
}

/**
 * Pedidos de un cliente dentro de una tienda. Matchea por email (no hay
 * customer_id en orders) — también muestra pedidos hechos como invitado
 * antes de crear la cuenta, con el mismo email.
 */
export async function getCustomerOrders(storeId: string, email: string): Promise<Order[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("store_id", storeId)
    .eq("customer_email", normalizeEmail(email))
    .order("created_at", { ascending: false })

  if (error || !data) return []
  return data as Order[]
}

export interface CustomerWithSpend extends Customer {
  orderCount: number
  totalSpent: number
}

/**
 * Lista de clientes de una tienda con cuánto gastaron en total (para el
 * admin — "ver quién gastó más para poder mandarle promos").
 */
export async function getStoreCustomersWithSpend(storeId: string): Promise<CustomerWithSpend[]> {
  const [{ data: customers }, { data: orders }] = await Promise.all([
    supabase
      .from("customers")
      .select("id, store_id, name, email, phone, created_at")
      .eq("store_id", storeId)
      .order("created_at", { ascending: false }),
    supabase.from("orders").select("customer_email, total").eq("store_id", storeId),
  ])

  const spendByEmail = new Map<string, { orderCount: number; totalSpent: number }>()
  for (const order of orders || []) {
    const email = normalizeEmail(order.customer_email || "")
    if (!email) continue
    const current = spendByEmail.get(email) || { orderCount: 0, totalSpent: 0 }
    current.orderCount += 1
    current.totalSpent += Number(order.total) || 0
    spendByEmail.set(email, current)
  }

  return (customers || []).map((c) => {
    const spend = spendByEmail.get(normalizeEmail(c.email)) || { orderCount: 0, totalSpent: 0 }
    return { ...c, ...spend } as CustomerWithSpend
  })
}
