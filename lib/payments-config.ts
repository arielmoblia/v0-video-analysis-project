import 'server-only'
import { createClient } from '@supabase/supabase-js'
import { decryptFields } from '@/lib/crypto'

const ENCRYPTED_FIELDS = [
  'stripe_secret_key',
  'stripe_webhook_secret',
  'mp_access_token',
  'paypal_client_secret',
  'mobbex_api_key',
  'mobbex_access_token',
] as const

export type PaymentsConfig = {
  stripe_enabled?: boolean
  stripe_publishable_key?: string
  stripe_secret_key?: string
  stripe_webhook_secret?: string
  mp_access_token?: string
  paypal_client_secret?: string
  mobbex_api_key?: string
  mobbex_access_token?: string
  [key: string]: unknown
}

// Único punto de lectura de platform_settings.payments_config: siempre
// devuelve las credenciales ya descifradas, para no repetir (y romper)
// la lógica de descifrado en cada consumidor.
export async function getPaymentsConfig(): Promise<PaymentsConfig> {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
  const { data } = await supabase
    .from('platform_settings')
    .select('value')
    .eq('key', 'payments_config')
    .maybeSingle()

  const raw: PaymentsConfig = data?.value || {}
  return decryptFields(raw, ENCRYPTED_FIELDS as unknown as (keyof PaymentsConfig)[])
}
