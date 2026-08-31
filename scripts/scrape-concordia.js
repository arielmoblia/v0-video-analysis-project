const https = require('https');
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://tuznlaqncbrsbokbbzhy.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const STORE_ID = '57e881d2-eeef-4e3a-9c63-5ec785da57ee'; // mochi6
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads', 'scraped', 'mochi6');

// Crear directorio si no existe
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  console.log('Directorio creado:', UPLOADS_DIR);
}

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function downloadImage(imgUrl) {
  return new Promise((resolve, reject) => {
    const crypto = require('crypto');
    const hash = crypto.createHash('md5').update(imgUrl).digest('hex').substring(0, 12);
    const ext = imgUrl.match(/\.(jpg|jpeg|png|webp|gif)/i)?.[1] || 'webp';
    const filename = `${hash}.${ext}`;
    const localPath = path.join(UPLOADS_DIR, filename);

    // Si ya existe, no descargar
    if (fs.existsSync(localPath)) {
      console.log('Ya existe:', filename);
      return resolve(`/uploads/scraped/mochi6/${filename}`);
    }

    console.log('Descargando:', imgUrl.substring(0, 80) + '...');

    const protocol = imgUrl.startsWith('https') ? https : require('http');
    protocol.get(imgUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
        'Referer': 'https://mochi.com.ar/'
      }
    }, (res) => {
      if (res.statusCode !== 200) {
        console.log('Error HTTP:', res.statusCode);
        return resolve(null);
      }

      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => {
        const buffer = Buffer.concat(chunks);
        fs.writeFileSync(localPath, buffer);
        console.log('Guardada:', filename, `(${Math.round(buffer.length/1024)}KB)`);
        resolve(`/uploads/scraped/mochi6/${filename}`);
      });
    }).on('error', (e) => {
      console.log('Error:', e.message);
      resolve(null);
    });
  });
}

async function main() {
  console.log('=== SCRAPEANDO CAMPERA CONCORDIA ===\n');

  // 1. Fetch la página del producto
  const url = 'https://mochi.com.ar/productos/campera-concordia/';
  console.log('Fetching:', url);
  const html = await fetchUrl(url);
  console.log('HTML length:', html.length);

  // 2. Extraer LS.variants
  const variantsMatch = html.match(/LS\.variants\s*=\s*(\[[\s\S]*?\]);/m);
  let variants = [];
  if (variantsMatch) {
    variants = JSON.parse(variantsMatch[1]);
    console.log('\nVariantes encontradas:', variants.length);
  }

  // 3. Extraer TODAS las imágenes únicas de alta calidad
  // Método 1: data-fancybox (galería principal)
  const fancyRegex = /data-fancybox="product-gallery"[^>]*href="([^"]+)"/g;
  const images = [];
  let match;
  while ((match = fancyRegex.exec(html)) !== null) {
    let imgUrl = match[1];
    if (imgUrl.startsWith('//')) imgUrl = 'https:' + imgUrl;
    if (!images.includes(imgUrl)) images.push(imgUrl);
  }

  // Método 2: buscar imágenes 1024 directamente
  const img1024Regex = /(https?:)?\/\/acdn-us\.mitiendanube\.com\/stores\/[^"'\s]+-1024[^"'\s]*\.webp/g;
  while ((match = img1024Regex.exec(html)) !== null) {
    let imgUrl = match[0];
    if (imgUrl.startsWith('//')) imgUrl = 'https:' + imgUrl;
    if (!images.includes(imgUrl)) images.push(imgUrl);
  }

  console.log('\nImágenes encontradas:', images.length);
  images.forEach((img, i) => console.log(`  ${i+1}. ${img.substring(0, 80)}...`));

  // 4. Extraer descripción HTML
  const descMatch = html.match(/data-store="product-description[^"]*"[\s\S]*?<div class="user-content[^"]*">([\s\S]*?)<\/div>\s*<\/div>/i);
  let descriptionHtml = '';
  if (descMatch) {
    descriptionHtml = descMatch[1].trim()
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '');
    console.log('\nDescripción HTML encontrada:', descriptionHtml.length, 'chars');
  }

  // 5. Extraer nombre y precio
  const name = 'Campera Concordia';
  const price = variants.length > 0 ? variants[0].price_number : 37000;
  const comparePrice = variants.length > 0 ? variants[0].compare_at_price_number : null;

  console.log('\nProducto:', name);
  console.log('Precio:', price);
  console.log('Precio anterior:', comparePrice);

  // 6. Extraer talles/colores
  const sizes = variants.map(v => ({
    size: [v.option0, v.option1].filter(Boolean).join(' / '),
    stock: v.stock || 0,
    price: v.price_number || price
  }));
  console.log('\nTalles/variantes:', sizes.length);
  sizes.forEach(s => console.log(`  - ${s.size}: stock ${s.stock}`));

  // 7. Descargar imágenes al servidor local
  console.log('\n=== DESCARGANDO IMÁGENES ===');
  const localImages = [];
  for (const imgUrl of images) {
    const localUrl = await downloadImage(imgUrl);
    if (localUrl) localImages.push(localUrl);
    // Pequeña pausa
    await new Promise(r => setTimeout(r, 100));
  }
  console.log('\nImágenes descargadas:', localImages.length);

  // 8. Insertar en Supabase
  console.log('\n=== INSERTANDO EN MOCHI6 ===');

  const productData = {
    store_id: STORE_ID,
    name: name,
    slug: 'campera-concordia',
    description: descriptionHtml,
    price: price,
    compare_price: comparePrice,
    image_url: localImages[0] || images[0],
    images: localImages.length > 0 ? localImages : images,
    sizes: sizes,
    active: true
  };

  console.log('Insertando producto...');
  console.log('- Imágenes:', productData.images.length);
  console.log('- Primera imagen:', productData.image_url);

  const { data, error } = await supabase
    .from('products')
    .insert(productData)
    .select()
    .single();

  if (error) {
    console.error('Error insertando:', error);
  } else {
    console.log('\n✅ PRODUCTO INSERTADO');
    console.log('ID:', data.id);
    console.log('Slug:', data.slug);
  }

  console.log('\n=== LISTO ===');
  console.log('Verificar en: http://prueba.tol.ar/tienda/mochi6/producto/campera-concordia');
}

main().catch(console.error);
