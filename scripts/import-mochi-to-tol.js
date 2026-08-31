const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(
  'https://tuznlaqncbrsbokbbzhy.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1em5sYXFuY2Jyc2Jva2Jiemh5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDAyNzg0MiwiZXhwIjoyMDg5NjAzODQyfQ.LzSvnfBVSN_EqJTs7JqoRhIxa3dQ5CxFrxd4JmRER68'
);

const STORE_ID = '51a2791e-7eeb-4ad7-a76f-9287a69b2db5'; // mochi7

async function importProducts() {
    // Leer productos scrapeados
    const products = JSON.parse(fs.readFileSync('/tmp/mochi_products.json', 'utf8'));
    console.log(`Importando ${products.length} productos a mochi7.tol.ar...\n`);

    let imported = 0;
    let errors = 0;

    for (const product of products) {
        // Crear slug único
        const slug = product.name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '') + '-' + product.external_id.slice(-4);

        // Preparar variantes/talles
        const sizes = product.variants && product.variants.length > 1
            ? product.variants.map(v => ({
                name: v.name || 'Única',
                stock: v.available ? 10 : 0,
                price_adjustment: v.price - product.price // diferencia con precio base
            }))
            : null;

        // Preparar descripción con link al original
        const description = `Producto original: ${product.original_url}\n\nPrecio original en Mochi: $${product.original_price.toLocaleString('es-AR')}`;

        const productData = {
            store_id: STORE_ID,
            name: product.name,
            description: description,
            price: product.price,
            compare_price: null,
            image_url: product.image || null,
            slug: slug,
            category_id: null,
            featured: false,
            active: product.available,
            stock: 10,
            sizes: sizes,
            display_order: imported,
            images: product.image ? [product.image] : null,
            is_template: false
        };

        const { data, error } = await supabase
            .from('products')
            .insert(productData)
            .select()
            .single();

        if (error) {
            console.error(`❌ Error: ${product.name} - ${error.message}`);
            errors++;
        } else {
            console.log(`✅ ${product.name} - $${product.price.toLocaleString('es-AR')}`);
            imported++;
        }
    }

    console.log(`\n=== RESUMEN ===`);
    console.log(`Importados: ${imported}`);
    console.log(`Errores: ${errors}`);
    console.log(`\nTienda: https://mochi7.tol.ar`);
    console.log(`Admin: https://mochi7.tol.ar/admin`);
}

importProducts().catch(console.error);
