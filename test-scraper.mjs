import { readFileSync } from 'fs';

const url = 'https://mochi.com.ar/productos/campera-concordia/';
const html = readFileSync('/tmp/concordia.html', 'utf8');

// ============================================
// EXTRACCIÓN DE PALABRA CLAVE DEL PRODUCTO
// ============================================
function extractProductKeyword(url) {
  try {
    const urlObj = new URL(url)
    const path = urlObj.pathname
    const slugMatch = path.match(/\/productos\/([^\/]+)/i)
    if (!slugMatch) return []
    const slug = slugMatch[1].replace(/\/$/, '').toLowerCase()
    const words = slug.split('-').filter(w => w.length > 2)
    const genericWords = [
      'campera', 'tapado', 'remera', 'pantalon', 'jean', 'short', 'vestido',
      'camisa', 'buzo', 'sweater', 'chomba', 'musculosa', 'top', 'body',
      'pollera', 'falda', 'blazer', 'saco', 'cardigan', 'chaleco', 'abrigo',
      'piloto', 'trench', 'parka', 'montgomery', 'sobretodo', 'capa',
      'algodon', 'lana', 'cuero', 'jean', 'denim', 'lino', 'seda', 'tweed',
      'negro', 'blanco', 'azul', 'rojo', 'verde', 'gris', 'beige', 'crema',
      'marron', 'rosa', 'naranja', 'amarillo', 'violeta', 'celeste',
      'hombre', 'mujer', 'unisex', 'niño', 'niña', 'bebe',
      'talle', 'unico', 'oversize', 'slim', 'fit', 'regular', 'largo', 'corto'
    ]
    const uniqueWords = words.filter(w => !genericWords.includes(w))
    if (uniqueWords.length > 0) return uniqueWords
    if (words.length >= 2) return [words[words.length - 1]]
    return words
  } catch (e) {
    console.log('[scrape-tn] Error extrayendo keyword:', e)
    return []
  }
}

// Verificar si una URL de imagen corresponde al producto actual
function imageMatchesProduct(imageUrl, keywords) {
  if (keywords.length === 0) return true
  const urlLower = imageUrl.toLowerCase()
  const filenameMatch = urlLower.match(/\/products\/([^\/]+?)(?:-[a-f0-9]{10,})?(?:-\d+)?\.(?:webp|jpg|jpeg|png)/i)
  if (!filenameMatch) {
    return keywords.some(kw => urlLower.includes(kw))
  }
  const filename = filenameMatch[1]
  return keywords.some(kw => filename.includes(kw))
}

// Extraer keywords
const productKeywords = extractProductKeyword(url);
console.log('Keywords:', productKeywords);
console.log('');

// Buscar TODAS las imágenes del CDN de Tiendanube en el HTML
const allImages = [];
const filteredImages = [];

const cdnRegex = /(\/\/acdn(?:-us)?\.mitiendanube\.com\/stores\/[^"'\s]+\.(?:webp|jpg|jpeg|png))/gi;
let cdnMatch;
while ((cdnMatch = cdnRegex.exec(html)) !== null) {
  let imgUrl = cdnMatch[1];
  if (imgUrl.startsWith('//')) imgUrl = 'https:' + imgUrl;

  // Solo imágenes 1024 (alta calidad) o imágenes de producto
  if (imgUrl.includes('/products/') && (imgUrl.includes('1024') || imgUrl.includes('640'))) {
    if (!allImages.includes(imgUrl)) {
      allImages.push(imgUrl);

      // Filtrar por keywords del producto
      if (imageMatchesProduct(imgUrl, productKeywords)) {
        filteredImages.push(imgUrl);
      }
    }
  }
}

console.log('=== TODAS las imágenes encontradas ===');
allImages.forEach((img, i) => {
  const name = img.split('/products/')[1];
  const matches = imageMatchesProduct(img, productKeywords);
  console.log(`${matches ? '✓' : '✗'} ${name.substring(0, 60)}`);
});

console.log('\n=== Imágenes FILTRADAS (las que se importarían) ===');
filteredImages.forEach((img, i) => {
  const name = img.split('/products/')[1];
  console.log(`${i+1}. ${name.substring(0, 60)}`);
});

// También excluir "paleta" que son las muestras de colores
const finalImages = filteredImages
  .filter(img => !img.toLowerCase().includes('paleta'))
  .slice(0, 10);

console.log('\n=== Imágenes FINALES (sin paleta, max 10) ===');
finalImages.forEach((img, i) => {
  const name = img.split('/products/')[1];
  console.log(`${i+1}. ${name.substring(0, 60)}`);
});
