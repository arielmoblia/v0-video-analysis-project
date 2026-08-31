import 'server-only'
import Stripe from 'stripe'
import { getPaymentsConfig } from '@/lib/payments-config'

async function getStripeSecretKey(): Promise<string> {
  try {
    const config = await getPaymentsConfig()
    if (config.stripe_secret_key) return config.stripe_secret_key
  } catch (e) {}
  return process.env.STRIPE_SECRET_KEY || ''
}

export async function getStripe(): Promise<Stripe> {
  const key = await getStripeSecretKey()
  return new Stripe(key)
}
