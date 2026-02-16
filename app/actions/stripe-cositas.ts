'use server'

import { stripe } from '@/lib/stripe'

// Precios de las cositas en centavos (para ARS)
const COSITAS_PRICES: Record<string, { name: string; priceInCents: number; type: 'recurring' | 'one_time' }> = {
  marketing_pro: { name: 'Marketing Pro', priceInCents: 150000, type: 'recurring' },
  google_shopping: { name: 'Google Shopping', priceInCents: 150000, type: 'one_time' },
  diseno_ai: { name: 'Diseño AI', priceInCents: 150000, type: 'one_time' },
  video_portada: { name: 'Video de portada', priceInCents: 150000, type: 'one_time' },
  chat_ai: { name: 'Chat con AI', priceInCents: 150000, type: 'recurring' },
  soporte_prioritario: { name: 'Soporte prioritario', priceInCents: 150000, type: 'recurring' },
  dominio_propio: { name: 'Dominio propio', priceInCents: 150000, type: 'recurring' },
  estadisticas: { name: 'Estadísticas', priceInCents: 150000, type: 'recurring' },
  dolar_pesos: { name: 'Dolar pesos', priceInCents: 150000, type: 'recurring' },
  productos_ilimitados: { name: 'Productos ilimitados', priceInCents: 150000, type: 'recurring' },
  mayoristas: { name: 'MAYORISTAS', priceInCents: 150000, type: 'recurring' },
}

export async function startCositasCheckout(cositasCodes: string[], storeId?: string) {
  // Filtrar cositas válidas (excluir socio_ventas que es porcentaje)
  const validCositas = cositasCodes.filter(code => code !== 'socio_ventas' && COSITAS_PRICES[code])
  
  if (validCositas.length === 0) {
    throw new Error('No hay cositas válidas seleccionadas')
  }

  // Separar items recurrentes y de pago único
  const recurringItems = validCositas.filter(code => COSITAS_PRICES[code].type === 'recurring')
  const oneTimeItems = validCositas.filter(code => COSITAS_PRICES[code].type === 'one_time')

  // Crear line items para Stripe
  const lineItems = validCositas.map(code => {
    const cosita = COSITAS_PRICES[code]
    
    if (cosita.type === 'recurring') {
      return {
        price_data: {
          currency: 'ars',
          product_data: {
            name: cosita.name,
            description: `Cosita mensual para tu tienda`,
          },
          unit_amount: cosita.priceInCents,
          recurring: {
            interval: 'month' as const,
          },
        },
        quantity: 1,
      }
    } else {
      return {
        price_data: {
          currency: 'ars',
          product_data: {
            name: cosita.name,
            description: `Pago único para tu tienda`,
          },
          unit_amount: cosita.priceInCents,
        },
        quantity: 1,
      }
    }
  })

  // Determinar el modo según si hay items recurrentes
  const hasRecurring = recurringItems.length > 0
  const mode = hasRecurring ? 'subscription' : 'payment'

  // Crear sesión de checkout
  const session = await stripe.checkout.sessions.create({
    ui_mode: 'embedded',
    redirect_on_completion: 'never',
    line_items: lineItems,
    mode: mode as 'payment' | 'subscription',
    metadata: {
      storeId: storeId || '',
      cositas: validCositas.join(','),
    },
  })

  return session.client_secret
}
