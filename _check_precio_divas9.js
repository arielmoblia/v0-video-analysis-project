const fs = require('fs');
const envContent = fs.readFileSync('.env.local', 'utf8');
for (const line of envContent.split('\n')) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) process.env[m[1]] = m[2];
}
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

(async () => {
  const { data: store, error: storeErr } = await supabase
    .from('stores')
    .select('*')
    .eq('subdomain', 'divas9')
    .maybeSingle();

  console.log('=== STORE ===');
  console.log(JSON.stringify(store, null, 2));
  if (storeErr) console.log('storeErr', storeErr);
  if (!store) return;

  const { data: products, error: prodErr } = await supabase
    .from('products')
    .select('*')
    .eq('store_id', store.id)
    .ilike('name', '%Ferrari%');

  console.log('=== PRODUCTS ===');
  console.log(JSON.stringify(products, null, 2));
  if (prodErr) console.log('prodErr', prodErr);
})();
