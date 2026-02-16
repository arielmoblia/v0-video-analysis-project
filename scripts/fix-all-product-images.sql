-- Arreglar TODAS las imagenes de productos en TODAS las tiendas

-- ZAPATOS - actualizar todos los productos
UPDATE products 
SET image_url = CASE 
  WHEN name ILIKE '%bota%' THEN 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=400&h=400&fit=crop'
  WHEN name ILIKE '%deportiv%' OR name ILIKE '%running%' THEN 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop'
  WHEN name ILIKE '%nautico%' OR name ILIKE '%mocasin%' THEN 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop'
  WHEN name ILIKE '%sandalia%' THEN 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=400&fit=crop'
  WHEN name ILIKE '%taco%' OR name ILIKE '%stiletto%' THEN 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=400&fit=crop'
  ELSE 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop'
END
WHERE store_id = (SELECT id FROM stores WHERE subdomain = 'zapatos');

-- ROPA - actualizar todos los productos
UPDATE products 
SET image_url = CASE 
  WHEN name ILIKE '%remera%' OR name ILIKE '%camiseta%' THEN 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop'
  WHEN name ILIKE '%jean%' OR name ILIKE '%pantalon%' THEN 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=400&fit=crop'
  WHEN name ILIKE '%campera%' OR name ILIKE '%abrigo%' THEN 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=400&fit=crop'
  WHEN name ILIKE '%vestido%' THEN 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop'
  WHEN name ILIKE '%camisa%' THEN 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=400&fit=crop'
  ELSE 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&h=400&fit=crop'
END
WHERE store_id = (SELECT id FROM stores WHERE subdomain = 'ropa');

-- PERFUMES - actualizar todos los productos
UPDATE products 
SET image_url = CASE 
  WHEN name ILIKE '%hombre%' OR name ILIKE '%masculin%' THEN 'https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?w=400&h=400&fit=crop'
  WHEN name ILIKE '%mujer%' OR name ILIKE '%feminin%' THEN 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop'
  WHEN name ILIKE '%set%' OR name ILIKE '%kit%' THEN 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&h=400&fit=crop'
  ELSE 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&h=400&fit=crop'
END
WHERE store_id = (SELECT id FROM stores WHERE subdomain = 'perfumes');

-- ELECTRONICOS - actualizar todos los productos
UPDATE products 
SET image_url = CASE 
  WHEN name ILIKE '%celular%' OR name ILIKE '%smartphone%' OR name ILIKE '%telefono%' THEN 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop'
  WHEN name ILIKE '%notebook%' OR name ILIKE '%laptop%' THEN 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop'
  WHEN name ILIKE '%auricular%' OR name ILIKE '%headphone%' THEN 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop'
  WHEN name ILIKE '%tablet%' THEN 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop'
  WHEN name ILIKE '%smart%' OR name ILIKE '%reloj%' THEN 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop'
  ELSE 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop'
END
WHERE store_id = (SELECT id FROM stores WHERE subdomain = 'electronicos');

-- BASE - actualizar todos los productos
UPDATE products 
SET image_url = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop'
WHERE store_id = (SELECT id FROM stores WHERE subdomain = 'base');

-- PRUEBAS - actualizar todos los productos
UPDATE products 
SET image_url = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop'
WHERE store_id = (SELECT id FROM stores WHERE subdomain = 'pruebas');

-- TEMPLATE - actualizar todos los productos
UPDATE products 
SET image_url = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop'
WHERE store_id = (SELECT id FROM stores WHERE subdomain = 'template');

-- Actualizar cualquier producto que tenga placeholder o imagen invalida
UPDATE products 
SET image_url = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop'
WHERE image_url IS NULL 
   OR image_url = '' 
   OR image_url LIKE '%placeholder%'
   OR image_url NOT LIKE 'http%';
