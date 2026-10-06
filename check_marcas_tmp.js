const fs = require('fs');
const env = {};
fs.readFileSync('.env.local', 'utf8').split('\n').forEach(line => {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) env[m[1]] = m[2];
});
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
(async () => {
  const { data, error } = await supabase
    .from('stores')
    .select('id, subdomain, clonedIndexHtml')
    .eq('subdomain', 'pinkonlineoficial')
    .single();
  if (error) { console.error(error); return; }
  const html = data.clonedIndexHtml || '';
  const idx = html.indexOf('section-brands-home');
  console.log('LEN', html.length, 'IDX', idx);
  console.log(html.slice(Math.max(0,idx-1200), idx+2500));
})();
