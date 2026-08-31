import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
const env = fs.readFileSync('.env.local', 'utf8')
const get = (k) => env.split('\n').find(l=>l.startsWith(k+'='))?.split('=').slice(1).join('=').trim()
const url = get('NEXT_PUBLIC_SUPABASE_URL')
const anon = get('NEXT_PUBLIC_SUPABASE_ANON_KEY')
const service = get('SUPABASE_SERVICE_ROLE_KEY')

const anonClient = createClient(url, anon)
const serviceClient = createClient(url, service)

// Obtener una tienda real para probar
const { data: stores } = await serviceClient.from('stores').select('id, subdomain').limit(1)
console.log('Tienda de prueba:', stores)
const storeId = stores[0].id

console.log('\n=== INSERT en payment_methods con ANON key (como el navegador del merchant) ===')
const { data: insData, error: insErr } = await anonClient.from('payment_methods').insert({
  store_id: storeId,
  cash_enabled: true,
  cash_instructions: 'TEST DE DIAGNOSTICO - BORRAR'
}).select()
console.log('data:', insData, 'error:', insErr)

console.log('\n=== INSERT en shipping_methods con ANON key ===')
const { data: insShip, error: insShipErr } = await anonClient.from('shipping_methods').insert({
  store_id: storeId,
}).select()
console.log('data:', insShip, 'error:', insShipErr)
