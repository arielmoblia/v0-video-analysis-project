const { createClient } = require('./node_modules/@supabase/supabase-js')
const fs = require('fs')

// Leer .env.local manualmente
const env = fs.readFileSync('.env.local', 'utf8')
env.split('\n').forEach(line => {
  const [key, ...val] = line.split('=')
  if (key) process.env[key.trim()] = val.join('=').trim()
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function test() {
  console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
  const { data, error } = await supabase
    .from('store_features')
    .select('*')
    .eq('enabled', true)
  console.log('Error:', JSON.stringify(error))
  console.log('Data:', JSON.stringify(data?.slice(0,2)))
}

test()
