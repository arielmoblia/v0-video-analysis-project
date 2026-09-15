// ===========================================
// FORMATO DE MONEDA - tol.ar
// ===========================================
// Único lugar central para formatear precios según el país de la tienda
// (mismo patrón que lib/brand-context.tsx para "brand").
//
// IMPORTANTE: esto NO convierte valores entre monedas. El dueño de una
// tienda de Chile carga sus precios directamente en pesos chilenos (CLP).
// Esta función solo cambia el formato visual (separador de miles, símbolo)
// según el país de la tienda. Sin decimales, igual que se usaba antes.
// ===========================================

export type StoreCountry = "AR" | "CL"

const CURRENCY_BY_COUNTRY: Record<StoreCountry, { locale: string; currency: string }> = {
  AR: { locale: "es-AR", currency: "ARS" },
  CL: { locale: "es-CL", currency: "CLP" },
}

function resolveCountry(country?: string | null): StoreCountry {
  return country === "CL" ? "CL" : "AR"
}

/**
 * Devuelve solo el número formateado (separadores de miles según el país),
 * sin el símbolo "$" adelante. Útil para textos tipo "Comprá X a $1.234".
 */
export function formatPriceNumber(amount: number, country?: string | null): string {
  const { locale } = CURRENCY_BY_COUNTRY[resolveCountry(country)]
  const value = Number.isFinite(amount) ? amount : 0
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(value)
}

/**
 * Formatea un precio completo con símbolo "$" para mostrar en el storefront
 * (carrito, checkout, grilla de productos, ficha de producto, envío, etc).
 * AR -> pesos argentinos (ARS, sin sufijo, como siempre se mostró).
 * CL -> pesos chilenos, con sufijo "CLP" para que se distinga a simple vista
 * (si no, "$50.000" se ve idéntico en las dos monedas). Sin dato -> AR.
 */
export function formatPrice(amount: number, country?: string | null): string {
  const resolved = resolveCountry(country)
  const base = `$${formatPriceNumber(amount, country)}`
  return resolved === "CL" ? `${base} CLP` : base
}

/** Código de moneda ISO según el país de la tienda (para JSON-LD, integraciones, etc). */
export function getCurrencyCode(country?: string | null): string {
  return CURRENCY_BY_COUNTRY[resolveCountry(country)].currency
}
