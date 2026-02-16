-- Arreglar imagenes de las tiendas template
-- Usar URLs de imagenes reales de Unsplash
-- Nota: stores usa banner_image, y logos van en store_design_config

-- Actualizar banner de ZAPATOS
UPDATE stores SET 
  banner_image = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&h=400&fit=crop'
WHERE subdomain = 'zapatos';

-- Actualizar banner de ROPA
UPDATE stores SET 
  banner_image = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop'
WHERE subdomain = 'ropa';

-- Actualizar banner de PERFUMES
UPDATE stores SET 
  banner_image = 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=1200&h=400&fit=crop'
WHERE subdomain = 'perfumes';

-- Actualizar banner de ELECTRONICOS
UPDATE stores SET 
  banner_image = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=400&fit=crop'
WHERE subdomain = 'electronicos';

-- Actualizar banner de BASE
UPDATE stores SET 
  banner_image = 'https://images.unsplash.com/photo-1557821552-17105176677c?w=1200&h=400&fit=crop'
WHERE subdomain = 'base';

-- Actualizar banner de PRUEBAS
UPDATE stores SET 
  banner_image = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=400&fit=crop'
WHERE subdomain = 'pruebas';

-- Actualizar banner de TEMPLATE
UPDATE stores SET 
  banner_image = 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=400&fit=crop'
WHERE subdomain = 'template';

-- Insertar o actualizar logos en store_design_config
INSERT INTO store_design_config (store_id, logo_url)
SELECT id, 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200&h=200&fit=crop'
FROM stores WHERE subdomain = 'zapatos'
ON CONFLICT (store_id) DO UPDATE SET logo_url = EXCLUDED.logo_url;

INSERT INTO store_design_config (store_id, logo_url)
SELECT id, 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=200&h=200&fit=crop'
FROM stores WHERE subdomain = 'ropa'
ON CONFLICT (store_id) DO UPDATE SET logo_url = EXCLUDED.logo_url;

INSERT INTO store_design_config (store_id, logo_url)
SELECT id, 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=200&h=200&fit=crop'
FROM stores WHERE subdomain = 'perfumes'
ON CONFLICT (store_id) DO UPDATE SET logo_url = EXCLUDED.logo_url;

INSERT INTO store_design_config (store_id, logo_url)
SELECT id, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200&h=200&fit=crop'
FROM stores WHERE subdomain = 'electronicos'
ON CONFLICT (store_id) DO UPDATE SET logo_url = EXCLUDED.logo_url;

INSERT INTO store_design_config (store_id, logo_url)
SELECT id, 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=200&h=200&fit=crop'
FROM stores WHERE subdomain = 'base'
ON CONFLICT (store_id) DO UPDATE SET logo_url = EXCLUDED.logo_url;

INSERT INTO store_design_config (store_id, logo_url)
SELECT id, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop'
FROM stores WHERE subdomain = 'pruebas'
ON CONFLICT (store_id) DO UPDATE SET logo_url = EXCLUDED.logo_url;

-- Actualizar imagenes de productos de ZAPATOS
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop'
WHERE store_id = (SELECT id FROM stores WHERE subdomain = 'zapatos') AND name LIKE '%Deportiv%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop'
WHERE store_id = (SELECT id FROM stores WHERE subdomain = 'zapatos') AND name LIKE '%Nautico%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=400&h=400&fit=crop'
WHERE store_id = (SELECT id FROM stores WHERE subdomain = 'zapatos') AND name LIKE '%Bota%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=400&fit=crop'
WHERE store_id = (SELECT id FROM stores WHERE subdomain = 'zapatos') AND name LIKE '%Sandalia%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop'
WHERE store_id = (SELECT id FROM stores WHERE subdomain = 'zapatos') AND name LIKE '%Taco%';

-- Actualizar todos los productos que tengan placeholder.svg
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop'
WHERE image_url LIKE '%placeholder%';

-- Actualizar productos de ROPA
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop'
WHERE store_id = (SELECT id FROM stores WHERE subdomain = 'ropa') AND name LIKE '%Remera%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=400&fit=crop'
WHERE store_id = (SELECT id FROM stores WHERE subdomain = 'ropa') AND name LIKE '%Jean%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=400&fit=crop'
WHERE store_id = (SELECT id FROM stores WHERE subdomain = 'ropa') AND name LIKE '%Campera%';

-- Actualizar productos de PERFUMES
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop'
WHERE store_id = (SELECT id FROM stores WHERE subdomain = 'perfumes');

-- Actualizar productos de ELECTRONICOS
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop'
WHERE store_id = (SELECT id FROM stores WHERE subdomain = 'electronicos') AND name LIKE '%Celular%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop'
WHERE store_id = (SELECT id FROM stores WHERE subdomain = 'electronicos') AND name LIKE '%Notebook%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop'
WHERE store_id = (SELECT id FROM stores WHERE subdomain = 'electronicos') AND name LIKE '%Auricular%';

-- Actualizar cualquier producto restante sin imagen valida
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop'
WHERE image_url IS NULL OR image_url = '' OR image_url LIKE '%placeholder%';
