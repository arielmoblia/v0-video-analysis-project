const { createClient } = require("@supabase/supabase-js");
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function check() {
  // Buscar producto Campera Concordia
  const { data, error } = await supabase
    .from('products')
    .select('id, name, store_id, images, image_url')
    .ilike('name', '%concordia%')
    .limit(5);

  if (error) {
    console.log('Error:', error);
    return;
  }

  for (const p of data) {
    console.log('\n=== PRODUCTO:', p.name, '===');
    console.log('Store ID:', p.store_id);
    console.log('image_url:', p.image_url);
    console.log('images:');
    if (p.images && Array.isArray(p.images)) {
      p.images.forEach((img, i) => {
        // Verificar si tiene "concordia" en el nombre
        const hasConcordia = img.toLowerCase().includes('concordia');
        const mark = hasConcordia ? '[OK]' : '[MALO]';
        console.log('  ' + (i+1) + '. ' + mark + ' ' + img);
      });
    } else {
      console.log('  (no hay array de images)');
    }
  }
}

check();
