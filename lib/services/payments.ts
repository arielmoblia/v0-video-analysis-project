// ===========================================
// SERVICIO DE PAGOS - tol.ar
// ===========================================

import { createClient } from "@/lib/supabase/server"
import type { PaymentMethods
 } from "@/lib/types"

/**
 * Obtiene los métodos de pago de una tienda
 */
export async function getPaymentMethods(storeId: string): Promise<PaymentMethods | null> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("payment_methods")
      .select("*")
      .eq("store_id", storeId)
      .single()

    if (error || !data) return null
    return data as PaymentMethods
  } catch (e) {
    console.error("[payments] Error in getPaymentMethods:", e)
    return null
  }
}

/**
 * Obtiene el Access Token de MercadoPago según el modo (test o producción)
 */
export async function getMercadoPagoToken(storeId: string): Promise<{ token: string; isTestMode: boolean; checkoutType: string } | null> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("payment_methods")
      .select("mercadopago_access_token, mercadopago_test_mode, mercadopago_test_token, mercadopago_checkout_type")
      .eq("store_id", storeId)
      .single()

    if (error || !data) return null

    const isTestMode = data.mercadopago_test_mode || false
    const token = isTestMode 
      ? data.mercadopago_test_token 
      : data.mercadopago_access_token

    if (!token) return null

    return {
      token,
      isTestMode,
      checkoutType: data.mercadopago_checkout_type || "redirect"
    }
  } catch (e) {
    console.error("[payments] Error in getMercadoPagoToken:", e)
    return null
  }
}

/**
 * Valida un Access Token de MercadoPago
 */
export function validateMPToken(token: string): { valid: boolean; type: "production" | "test" | "invalid" } {
  if (token.startsWith("APP_USR-")) {
    return { valid: true, type: "production" }
  }
  if (token.startsWith("TEST-")) {
    return { valid: true, type: "test" }
  }
  return { valid: false, type: "invalid" }
}

/**
 * Crea una preferencia de pago en MercadoPago
 */
export async function createMPPreference(
  accessToken: string,
  orderId: string,
  items: { name: string; price: number; quantity: number }[],
  customerEmail: string,
  backUrls: { success: string; failure: string; pending: string }
) {
  const preferenceData = {
    items: items.map(item => ({
      title: item.name,
      quantity: item.quantity,
      unit_price: item.price,
      currency_id: "ARS",
    })),
    payer: {
      email: customerEmail,
    },
    back_urls: backUrls,
    auto_return: "approved",
    external_reference: orderId,
    notification_url: `${process.env.NEXT_PUBLIC_APP_URL || "https://tol.ar"}/api/mercadopago/webhook`,
  }

  const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(preferenceData),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || "Error al crear preferencia de pago")
  }

  return response.json()
}
