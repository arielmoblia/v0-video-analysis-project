const { createClient } = require('@supabase/supabase-js');
const https = require('https');
const http = require('http');

const supabase = createClient('https://tuznlaqncbrsbokbbzhy.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1em5sYXFuY2Jyc2Jva2Jiemh5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDAyNzg0MiwiZXhwIjoyMDg5NjAzODQyfQ.LzSvnfBVSN_EqJTs7JqoRhIxa3dQ5CxFrxd4JmRER68');

function downloadImage(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return downloadImage(res.headers.location).then(resolve).catch(reject);
      }
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve({ buffer: Buffer.concat(chunks), contentType: res.headers['content-type'] || 'image/jpeg' }));
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function migrate() {
  const { data: stores, error } = await supabase
    .from('stores')
    .select('id, subdomain, banner_image')
    .or('banner_image.ilike.%vercel%,banner_image.ilike.%blob%');

  if (error) { console.error('Error:', error); return; }
  if (!stores || stores.length === 0) { console.log('No hay banners para migrar'); return; }

  console.log('Migrando ' + stores.length + ' banners...');
  const cache = {};

  for (const store of stores) {
    try {
      console.log('[' + store.subdomain + '] Descargando...');
      let newUrl;

      if (cache[store.banner_image]) {
        newUrl = cache[store.banner_image];
        console.log('[' + store.subdomain + '] Usando cache');
      } else {
        const { buffer, contentType } = await downloadImage(store.banner_image);
        const ext = contentType.includes('png') ? 'png' : 'jpg';
        const filename = 'banners/' + Date.now() + '-' + Math.random().toString(36).slice(2) + '.' + ext;

        const { error: uploadError } = await supabase.storage
          .from('store-images')
          .upload(filename, buffer, { contentType, upsert: false });

        if (uploadError) { console.error('[' + store.subdomain + '] Error:', uploadError.message); continue; }

        const { data: urlData } = supabase.storage.from('store-images').getPublicUrl(filename);
        newUrl = urlData.publicUrl;
        cache[store.banner_image] = newUrl;
      }

      await supabase.from('stores').update({ banner_image: newUrl }).eq('id', store.id);
      console.log('[' + store.subdomain + '] OK');
    } catch (e) {
      console.error('[' + store.subdomain + '] Error:', e.message);
    }
  }

  console.log('Migracion completa.');
}

migrate();
