// ===========================================
// REENVÍO AUTOMÁTICO DE PEDIDOS A LA TIENDA DE ORIGEN
// ===========================================
// Prueba armada con Ariel (13/07/2026): cuando una tienda clon (ej. diva1.tol.ar) se marca
// como "conectada" en scraping.tol.ar, cada pedido nuevo se reenvía automáticamente como
// un pedido más a la tienda de origen (ej. mayoristasdivas.tol.ar), que es quien lo entrega.
//
// Reglas por defecto de esta prueba (no es facturación real entre tiendas):
//  - El pedido en la tienda de origen nace directamente en estado "pagado".
//  - Si no hay stock suficiente en origen, el pedido se crea igual con una nota de alerta
//    (nunca bloquea ni revierte la venta ya confirmada en la tienda clon).
//  - No se genera ningún movimiento de facturación entre las dos tiendas.
//
// No afecta a ninguna otra tienda de tol.ar: solo actúa si scraping.tol.ar marcó
// "connected: true" para el subdominio de la tienda del pedido.

import { createClient } from "@supabase/supabase-js"
import fs from "fs"
import type { OrderItem } from "@/lib/types"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

const CLONE_REGISTRY_FILE = "/var/www/scraping.tol.ar/data/clone-registry.json"

function loadCloneRegistryEntry(subdomain: string): { sourceUrl: string; connected?: boolean } | null {
  try {
    const registry = JSON.parse(fs.readFileSync(CLONE_REGISTRY_FILE, "utf8"))
    return registry[subdomain] || null
  } catch {
    return null
  }
}

export async function forwardOrderToSupplierIfConnected(
  storeId: string,
  orderId: string,
  items: OrderItem[],
): Promise<void> {
  const { data: store } = await supabase.from("stores").select("subdomain").eq("id", storeId).single()
  if (!store?.subdomain) return

  const entry = loadCloneRegistryEntry(store.subdomain)
  if (!entry || entry.connected !== true) return

  let sourceSubdomain: string
  try {
    const host = new URL(entry.sourceUrl).hostname.toLowerCase()
    if (!host.endsWith(".tol.ar")) return
    sourceSubdomain = host.replace(/\.tol\.ar$/, "")
  } catch {
    return
  }

  const { data: supplierStore } = await supabase.from("stores").select("id").eq("subdomain", sourceSubdomain).single()
  if (!supplierStore?.id) return

  const { data: supplierProducts } = await supabase
    .from("products")
    .select("id, name, price, stock")
    .eq("store_id", supplierStore.id)

  const forwardedItems: OrderItem[] = []
  const alerts: string[] = []

  for (const item of items) {
    const match = (supplierProducts || []).find(
      (p) => p.name.trim().toLowerCase() === String(item.name || "").trim().toLowerCase(),
    )
    if (!match) {
      alerts.push(`"${item.name}" no se encontró en la tienda de origen (${sourceSubdomain}.tol.ar)`)
      continue
    }
    if (typeof match.stock === "number" && match.stock < item.quantity) {
      alerts.push(`"${match.name}": stock insuficiente en origen (pedido ${item.quantity}, disponible ${match.stock})`)
    }
    forwardedItems.push({
      productId: match.id,
      name: match.name,
      price: match.price,
      quantity: item.quantity,
      image_url: item.image_url,
    })
    if (typeof match.stock === "number") {
      await supabase.from("products").update({ stock: Math.max(0, match.stock - item.quantity) }).eq("id", match.id)
    }
  }

  if (forwardedItems.length === 0) return

  const total = forwardedItems.reduce((sum, it) => sum + it.price * it.quantity, 0)
  const notes = [
    `Pedido automático generado desde ${store.subdomain}.tol.ar (pedido #${orderId}) — prueba de conexión mayorista↔minorista.`,
    ...alerts.map((a) => `ALERTA: ${a}`),
  ].join("\n")

  const { error } = await supabase.from("orders").insert({
    store_id: supplierStore.id,
    customer_name: "Pedido automático (tienda conectada)",
    items: forwardedItems,
    total,
    status: "pagado",
    payment_method: "conexion_automatica",
    shipping_address: null,
    notes,
  })
  if (error) console.error("[order-forwarding] Error creando pedido en tienda de origen:", error)
}
