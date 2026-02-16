-- RECREAR TODOS LOS TEMPLATES
-- IMPORTANTE: is_trial = false para que el cron NUNCA los borre

-- 1. ZAPATOS
INSERT INTO stores (
  subdomain, site_title, email, username, admin_password,
  template, template_type, status, plan, is_trial,
  social_whatsapp, social_instagram,
  banner_image, created_at
) VALUES (
  'zapatos', 'Calzado Online - Demo', 'admin@tol.ar', 'admin',
  '$2a$10$rQEY6j.YqXmLJ0xJzQv8qOEHxfBvZ1K5W5i8J5L5Y5v5Z5a5b5c5d',
  'zapatos', 'zapatos', 'active', 'enterprise', false,
  '5491112345678', '@tol.ar',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&h=400&fit=crop',
  NOW()
) ON CONFLICT (subdomain) DO UPDATE SET
  is_trial = false, status = 'active', plan = 'enterprise',
  template = 'zapatos', template_type = 'zapatos';

-- 2. ROPA
INSERT INTO stores (
  subdomain, site_title, email, username, admin_password,
  template, template_type, status, plan, is_trial,
  social_whatsapp, social_instagram,
  banner_image, created_at
) VALUES (
  'ropa', 'Indumentaria Online - Demo', 'admin@tol.ar', 'admin',
  '$2a$10$rQEY6j.YqXmLJ0xJzQv8qOEHxfBvZ1K5W5i8J5L5Y5v5Z5a5b5c5d',
  'ropa', 'ropa', 'active', 'enterprise', false,
  '5491112345678', '@tol.ar',
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop',
  NOW()
) ON CONFLICT (subdomain) DO UPDATE SET
  is_trial = false, status = 'active', plan = 'enterprise',
  template = 'ropa', template_type = 'ropa';

-- 3. PERFUMES
INSERT INTO stores (
  subdomain, site_title, email, username, admin_password,
  template, template_type, status, plan, is_trial,
  social_whatsapp, social_instagram,
  banner_image, created_at
) VALUES (
  'perfumes', 'Perfumeria Online - Demo', 'admin@tol.ar', 'admin',
  '$2a$10$rQEY6j.YqXmLJ0xJzQv8qOEHxfBvZ1K5W5i8J5L5Y5v5Z5a5b5c5d',
  'perfumes', 'perfumes', 'active', 'enterprise', false,
  '5491112345678', '@tol.ar',
  'https://images.unsplash.com/photo-1541643600914-78b084683601?w=1200&h=400&fit=crop',
  NOW()
) ON CONFLICT (subdomain) DO UPDATE SET
  is_trial = false, status = 'active', plan = 'enterprise',
  template = 'perfumes', template_type = 'perfumes';

-- 4. ELECTRONICOS
INSERT INTO stores (
  subdomain, site_title, email, username, admin_password,
  template, template_type, status, plan, is_trial,
  social_whatsapp, social_instagram,
  banner_image, created_at
) VALUES (
  'electronicos', 'Tecnologia Online - Demo', 'admin@tol.ar', 'admin',
  '$2a$10$rQEY6j.YqXmLJ0xJzQv8qOEHxfBvZ1K5W5i8J5L5Y5v5Z5a5b5c5d',
  'electronicos', 'electronicos', 'active', 'enterprise', false,
  '5491112345678', '@tol.ar',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=400&fit=crop',
  NOW()
) ON CONFLICT (subdomain) DO UPDATE SET
  is_trial = false, status = 'active', plan = 'enterprise',
  template = 'electronicos', template_type = 'electronicos';

-- 5. BASE
INSERT INTO stores (
  subdomain, site_title, email, username, admin_password,
  template, template_type, status, plan, is_trial,
  social_whatsapp, social_instagram,
  banner_image, created_at
) VALUES (
  'base', 'Template Base', 'admin@tol.ar', 'admin_base',
  '$2a$10$rQEY6j.YqXmLJ0xJzQv8qOEHxfBvZ1K5W5i8J5L5Y5v5Z5a5b5c5d',
  'base', 'base', 'active', 'enterprise', false,
  '5491112345678', '@tol.ar',
  'https://images.unsplash.com/photo-1557821552-17105176677c?w=1200&h=400&fit=crop',
  NOW()
) ON CONFLICT (subdomain) DO UPDATE SET
  is_trial = false, status = 'active', plan = 'enterprise',
  template = 'base', template_type = 'base';

-- 6. TEMPLATE (laboratorio)
INSERT INTO stores (
  subdomain, site_title, email, username, admin_password,
  template, template_type, status, plan, is_trial,
  social_whatsapp, social_instagram,
  banner_image, created_at
) VALUES (
  'template', 'Template Laboratorio', 'admin@tol.ar', 'admin',
  '$2a$10$rQEY6j.YqXmLJ0xJzQv8qOEHxfBvZ1K5W5i8J5L5Y5v5Z5a5b5c5d',
  'base', 'laboratorio', 'active', 'enterprise', false,
  '5491112345678', '@tol.ar',
  'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=400&fit=crop',
  NOW()
) ON CONFLICT (subdomain) DO UPDATE SET
  is_trial = false, status = 'active', plan = 'enterprise';

-- 7. PRUEBAS (sandbox)
INSERT INTO stores (
  subdomain, site_title, email, username, admin_password,
  template, template_type, status, plan, is_trial,
  social_whatsapp, social_instagram,
  banner_image, created_at
) VALUES (
  'pruebas', 'PRUEBAS - Sandbox', 'pruebas@tol.ar', 'admin_pruebas',
  '$2a$10$rQEY6j.YqXmLJ0xJzQv8qOEHxfBvZ1K5W5i8J5L5Y5v5Z5a5b5c5d',
  'pruebas', 'sandbox', 'active', 'enterprise', false,
  '5491112345678', '@tol.ar',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=400&fit=crop',
  NOW()
) ON CONFLICT (subdomain) DO UPDATE SET
  is_trial = false, status = 'active', plan = 'enterprise',
  template = 'pruebas', template_type = 'sandbox';

-- ========================================
-- PRODUCTOS DE EJEMPLO PARA CADA TEMPLATE
-- ========================================

-- ZAPATOS - Productos
INSERT INTO products (store_id, name, description, price, compare_price, stock, image_url, active, slug)
SELECT s.id, p.name, p.description, p.price, p.compare_price, p.stock, p.image_url, true, p.slug
FROM stores s,
(VALUES
  ('Zapatilla Deportiva Running', 'Zapatilla liviana ideal para correr. Suela de goma antideslizante.', 45000, 55000, 25, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop', 'zapatilla-deportiva-running'),
  ('Zapato Nautico Cuero', 'Zapato nautico de cuero genuino. Comodo para el dia a dia.', 38000, 42000, 15, 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop', 'zapato-nautico-cuero'),
  ('Bota Texana Mujer', 'Bota texana con bordado artesanal. Cuero premium.', 65000, 78000, 10, 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=400&h=400&fit=crop', 'bota-texana-mujer'),
  ('Sandalia Urbana', 'Sandalia comoda para el verano. Base anatomica.', 22000, 28000, 30, 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=400&fit=crop', 'sandalia-urbana'),
  ('Stiletto Taco Alto', 'Stiletto elegante para eventos. Taco de 10cm.', 42000, 52000, 12, 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop', 'stiletto-taco-alto'),
  ('Zapatilla Casual Blanca', 'Zapatilla blanca clasica. Combina con todo.', 35000, 40000, 40, 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&h=400&fit=crop', 'zapatilla-casual-blanca')
) AS p(name, description, price, compare_price, stock, image_url, slug)
WHERE s.subdomain = 'zapatos'
ON CONFLICT DO NOTHING;

-- ROPA - Productos
INSERT INTO products (store_id, name, description, price, compare_price, stock, image_url, active, slug)
SELECT s.id, p.name, p.description, p.price, p.compare_price, p.stock, p.image_url, true, p.slug
FROM stores s,
(VALUES
  ('Remera Basica Algodon', 'Remera 100% algodon peinado. Corte regular.', 12000, 15000, 50, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop', 'remera-basica-algodon'),
  ('Jean Slim Fit', 'Jean elastizado slim fit. Color azul clasico.', 32000, 38000, 30, 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=400&fit=crop', 'jean-slim-fit'),
  ('Campera Puffer', 'Campera puffer impermeable. Relleno termico.', 55000, 68000, 20, 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=400&fit=crop', 'campera-puffer'),
  ('Hoodie Oversize', 'Buzo con capucha oversize. Interior frizado.', 28000, 35000, 25, 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop', 'hoodie-oversize'),
  ('Pantalon Cargo', 'Pantalon cargo con bolsillos laterales. Tela resistente.', 26000, 32000, 35, 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&h=400&fit=crop', 'pantalon-cargo'),
  ('Vestido Casual', 'Vestido casual para el dia. Tela liviana y fresca.', 22000, 28000, 18, 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop', 'vestido-casual')
) AS p(name, description, price, compare_price, stock, image_url, slug)
WHERE s.subdomain = 'ropa'
ON CONFLICT DO NOTHING;

-- PERFUMES - Productos
INSERT INTO products (store_id, name, description, price, compare_price, stock, image_url, active, slug)
SELECT s.id, p.name, p.description, p.price, p.compare_price, p.stock, p.image_url, true, p.slug
FROM stores s,
(VALUES
  ('Perfume Oriental Amaderado', 'Fragancia oriental con notas de sandalo y vainilla. 100ml.', 35000, 42000, 20, 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop', 'perfume-oriental-amaderado'),
  ('Agua de Colonia Fresh', 'Colonia fresca con citricos y menta. Ideal para el verano. 200ml.', 18000, 22000, 35, 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&h=400&fit=crop', 'agua-colonia-fresh'),
  ('Perfume Floral Mujer', 'Fragancia floral con jazmin y rosa. Elegante y femenina. 80ml.', 42000, 50000, 15, 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=400&h=400&fit=crop', 'perfume-floral-mujer'),
  ('Set Regalo Premium', 'Set con perfume 100ml + crema corporal + neceser.', 65000, 80000, 10, 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=400&fit=crop', 'set-regalo-premium'),
  ('Body Splash Frutal', 'Splash corporal con aroma frutal. Frutilla y melon. 250ml.', 8500, 12000, 45, 'https://images.unsplash.com/photo-1619994403073-2cec844b8c63?w=400&h=400&fit=crop', 'body-splash-frutal'),
  ('Difusor Ambiental', 'Difusor de varillas con aroma a lavanda. 200ml.', 12000, 15000, 28, 'https://images.unsplash.com/photo-1602928321679-560bb453f190?w=400&h=400&fit=crop', 'difusor-ambiental')
) AS p(name, description, price, compare_price, stock, image_url, slug)
WHERE s.subdomain = 'perfumes'
ON CONFLICT DO NOTHING;

-- ELECTRONICOS - Productos
INSERT INTO products (store_id, name, description, price, compare_price, stock, image_url, active, slug)
SELECT s.id, p.name, p.description, p.price, p.compare_price, p.stock, p.image_url, true, p.slug
FROM stores s,
(VALUES
  ('Smartphone 128GB', 'Celular con pantalla 6.5 pulgadas AMOLED. 128GB almacenamiento.', 280000, 320000, 15, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop', 'smartphone-128gb'),
  ('Notebook 15.6 pulgadas', 'Notebook con procesador i5, 8GB RAM, 256GB SSD.', 450000, 520000, 8, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop', 'notebook-15-pulgadas'),
  ('Auriculares Bluetooth', 'Auriculares inalambricos con cancelacion de ruido. 30hs de bateria.', 45000, 55000, 30, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop', 'auriculares-bluetooth'),
  ('Smartwatch Deportivo', 'Reloj inteligente con GPS, monitor cardiaco y 50+ deportes.', 85000, 100000, 20, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop', 'smartwatch-deportivo'),
  ('Tablet 10 pulgadas', 'Tablet con pantalla 10.1 pulgadas, 64GB, ideal para entretenimiento.', 180000, 210000, 12, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop', 'tablet-10-pulgadas'),
  ('Parlante Portatil', 'Parlante bluetooth resistente al agua. 12hs de bateria.', 32000, 38000, 25, 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop', 'parlante-portatil')
) AS p(name, description, price, compare_price, stock, image_url, slug)
WHERE s.subdomain = 'electronicos'
ON CONFLICT DO NOTHING;

-- Verificar resultado
SELECT subdomain, site_title, template, is_trial, status, plan
FROM stores 
WHERE subdomain IN ('zapatos', 'ropa', 'perfumes', 'electronicos', 'base', 'template', 'pruebas')
ORDER BY subdomain;
