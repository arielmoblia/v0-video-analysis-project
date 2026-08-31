import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
const env = fs.readFileSync('.env.local', 'utf8')
const get = (k) => env.split('\n').find(l=>l.startsWith(k+'='))?.split('=').slice(1).join('=').trim()
const url = get('NEXT_PUBLIC_SUPABASE_URL')
const service = get('SUPABASE_SERVICE_ROLE_KEY')
const serviceClient = createClient(url, service)

const { data, error, count } = await serviceClient.from('stores').select('id, subdomain', {count: 'exact'}).limit(3)
console.log('data:', data, 'error:', error, 'count:', count)
