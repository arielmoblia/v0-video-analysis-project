import 'server-only'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

async function getStripeSecretKey(): Promise<string> {
  try {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
    const { data } = await supabase
      .from('platform_settings')
      .select('value')
      .eq('key', 'payments_config')
      .maybeSingle()
    const key = data?.value?.stripe_secret_key
    if (key) return key
  } catch (e) {}
  return process.env.STRIPE_SECRET_KEY || ''
}

export async function getStripe(): Promise<Stripe> {
  const key = await getStripeSecretKey()
  return new Stripe(key)
}
