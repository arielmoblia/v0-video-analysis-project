const { createClient } = require('@supabase/supabase-js');
const https = require('https');

const s = createClient(
  'https://tuznlaqncbrsbokbbzhy.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1em5sYXFuY2Jyc2Jva2Jiemh5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDAyNzg0MiwiZXhwIjoyMDg5NjAzODQyfQ.LzSvnfBVSN_EqJTs7JqoRhIxa3dQ5CxFrxd4JmRER68'
);

function download(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve({ buffer: Buffer.concat(chunks), contentType: res.headers['content-type'] || 'image/jpeg' }));
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function migrar() {
  const { data: products } = await s.from('products').select('id, image_url').ilike('image_url', '%tnhtmgltyehnroaxdtjr%');
  console.log(`Total a migrar: ${products.length}`);
  for (const p of products) {
    try {
      const { buffer, contentType } = await download(p.image_url);
      const ext = p.image_url.split('.').pop().split('?')[0] || 'jpg';
      const filename = `migrated-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await s.storage.from('store-images').upload(filename, buffer, { contentType, upsert: false });
      if (error) { console.log(`ERROR ${p.id}:`, error.message); continue; }
      const { data: urlData } = s.storage.from('store-images').getPublicUrl(filename);
      await s.from('products').update({ image_url: urlData.publicUrl }).eq('id', p.id);
      console.log(`✅ ${p.id} migrado`);
    } catch(e) { console.log(`❌ ${p.id}:`, e.message); }
  }
  console.log('Listo!');
}
migrar();
