'use server'

import { getStripe } from '@/lib/stripe'

const COSITAS_PRICES: Record<string, { name: string; priceInCents: number }> = {
  multi_images: { name: 'Galería de Imágenes', priceInCents: 100 },
  whatsapp_chat: { name: 'Chat WhatsApp', priceInCents: 100 },
  custom_variants: { name: 'Variantes Personalizables', priceInCents: 300 },
  csv_import: { name: 'Importar CSV/Excel', priceInCents: 100 },
  marketing_pro: { name: 'Marketing Pro', priceInCents: 150000 },
  google_shopping: { name: 'Google Shopping', priceInCents: 150000 },
  diseno_ai: { name: 'Diseño AI', priceInCents: 150000 },
  video_portada: { name: 'Video de portada', priceInCents: 150000 },
  chat_ai: { name: 'Chat con AI', priceInCents: 150000 },
  soporte_prioritario: { name: 'Soporte prioritario', priceInCents: 150000 },
  dominio_propio: { name: 'Dominio propio', priceInCents: 150000 },
  estadisticas: { name: 'Estadísticas', priceInCents: 150000 },
  dolar_pesos: { name: 'Dolar pesos', priceInCents: 150000 },
  productos_ilimitados: { name: 'Productos ilimitados', priceInCents: 150000 },
  mayoristas: { name: 'MAYORISTAS', priceInCents: 150000 },
}

export async function startCositasCheckout(cositasCodes: string[], storeId?: string) {
  const validCositas = cositasCodes.filter(code => code !== 'socio_ventas' && COSITAS_PRICES[code])
  if (validCositas.length === 0) throw new Error('No hay cositas válidas seleccionadas')

  const totalCents = validCositas.reduce((sum, code) => sum + COSITAS_PRICES[code].priceInCents, 0)
  const description = validCositas.map(code => COSITAS_PRICES[code].name).join(', ')

  const stripe = await getStripe()
  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalCents,
    currency: 'ars',
    description,
    metadata: {
      storeId: storeId || '',
      cositas: validCositas.join(','),
    },
  })

  return paymentIntent.client_secret
}
