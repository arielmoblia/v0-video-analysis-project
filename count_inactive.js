const { createClient } = require('./node_modules/@supabase/supabase-js')
const fs = require('fs')
const env = fs.readFileSync('.env.local', 'utf8')
env.split('\n').forEach(line => {
  const [key, ...val] = line.split('=')
  if (key) process.env[key.trim()] = val.join('=').trim()
})
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
async function main() {
  const { data, error, count } = await supabase.from('stores').select('id', { count: 'exact', head: true }).eq('status', 'inactive')
  console.log('INACTIVAS:', count)
  const { data: all, error: e2 } = await supabase.from('stores').select('status').eq('status', 'inactive')
  console.log('LISTA:', all?.map(s => s.id))
}
main()
