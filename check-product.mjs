import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  'https://tuznlaqncbrsbokbbzhy.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1em5sYXFuY2Jyc2Jva2Jiemh5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDAyNzg0MiwiZXhwIjoyMDg5NjAzODQyfQ.LzSvnfBVSN_EqJTs7JqoRhIxa3dQ5CxFrxd4JmRER68'
);

// Buscar producto Campera Concordia
const { data, error } = await supabase
  .from('products')
  .select('id, name, store_id, images, image_url')
  .ilike('name', '%concordia%')
  .limit(5);

if (error) {
  console.log('Error:', error);
  process.exit(1);
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
