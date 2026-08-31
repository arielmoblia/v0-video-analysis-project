const https = require('https');
const http = require('http');

const MARGIN = 0.20; // 20% de margen

async function fetchPage(url) {
    return new Promise((resolve, reject) => {
        const client = url.startsWith('https') ? https : http;
        client.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', reject);
    });
}

function extractProducts(html) {
    const products = [];

    // Buscar todos los data-variants que contienen info de productos
    const productBlocks = html.match(/data-variants="([^"]+)"/g) || [];

    // También buscar nombres y URLs
    const nameMatches = html.match(/title="([^"]+)"[^>]*class="[^"]*product/gi) || [];
    const urlMatches = html.match(/href="(https:\/\/www\.mochi\.com\.ar\/productos\/[^"]+)"/g) || [];

    // Buscar los bloques completos de productos
    const productRegex = /data-product-id="(\d+)"[\s\S]*?data-variants="([^"]+)"[\s\S]*?href="(https:\/\/www\.mochi\.com\.ar\/productos\/[^"]+)"[^>]*title="([^"]+)"/g;

    let match;
    while ((match = productRegex.exec(html)) !== null) {
        const productId = match[1];
        const variantsEncoded = match[2];
        const url = match[3];
        const name = match[4];

        try {
            const variantsJson = variantsEncoded
                .replace(/&quot;/g, '"')
                .replace(/&amp;/g, '&');

            const variants = JSON.parse(variantsJson);
            const firstVariant = variants[0] || {};

            // Extraer imagen
            let image = '';
            const imageMatch = html.match(new RegExp(`data-product-id="${productId}"[\\s\\S]*?src="([^"]+\\.webp)"`));
            if (imageMatch) {
                image = imageMatch[1].replace(/240-0|320-0|480-0/, '640-0');
                if (!image.startsWith('http')) {
                    image = 'https:' + image;
                }
            }

            products.push({
                external_id: productId,
                name: name,
                price: firstVariant.price_number || 0,
                original_url: url,
                image: image,
                available: firstVariant.available || false,
                sku: firstVariant.sku || null,
                variants: variants.map(v => ({
                    name: [v.option0, v.option1, v.option2].filter(Boolean).join(' / ') || 'Única',
                    price: v.price_number || 0,
                    sku: v.sku,
                    available: v.available
                }))
            });
        } catch (e) {
            console.error('Error parsing variants for product', productId, e.message);
        }
    }

    return products;
}

async function scrapeAllProducts() {
    const allProducts = [];
    let page = 1;
    let hasMore = true;

    console.log('Iniciando scraping de mochi.com.ar...\n');

    while (hasMore) {
        const url = page === 1
            ? 'https://www.mochi.com.ar/todo/'
            : `https://www.mochi.com.ar/todo/page/${page}/`;

        console.log(`Scrapeando página ${page}: ${url}`);

        try {
            const html = await fetchPage(url);
            const products = extractProducts(html);

            if (products.length === 0) {
                hasMore = false;
            } else {
                allProducts.push(...products);
                console.log(`  -> ${products.length} productos encontrados`);

                // Verificar si hay siguiente página
                hasMore = html.includes(`/todo/page/${page + 1}/`);
                page++;
            }
        } catch (e) {
            console.error(`Error en página ${page}:`, e.message);
            hasMore = false;
        }

        // Pequeña pausa para no sobrecargar
        await new Promise(r => setTimeout(r, 500));
    }

    console.log(`\n=== TOTAL: ${allProducts.length} productos ===\n`);

    // Agregar margen a todos los precios
    const productsWithMargin = allProducts.map(p => ({
        ...p,
        original_price: p.price,
        price: Math.round(p.price * (1 + MARGIN)),
        variants: p.variants.map(v => ({
            ...v,
            original_price: v.price,
            price: Math.round(v.price * (1 + MARGIN))
        }))
    }));

    return productsWithMargin;
}

// Ejecutar
scrapeAllProducts().then(products => {
    console.log('Primeros 5 productos:');
    products.slice(0, 5).forEach(p => {
        console.log(`- ${p.name}`);
        console.log(`  Precio original: $${p.original_price.toLocaleString()}`);
        console.log(`  Precio con margen: $${p.price.toLocaleString()}`);
        console.log(`  URL: ${p.original_url}`);
        console.log();
    });

    // Guardar JSON
    require('fs').writeFileSync('/tmp/mochi_products.json', JSON.stringify(products, null, 2));
    console.log('Guardado en /tmp/mochi_products.json');
}).catch(console.error);
