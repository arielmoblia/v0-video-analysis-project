-- Crear tiendas PRUEBAS y BASE
-- PRUEBAS: Sandbox para probar ideas
-- BASE: Template que afecta a todos

-- Insertar tienda PRUEBAS
INSERT INTO stores (
  subdomain,
  username,
  email,
  site_title,
  admin_password,
  social_whatsapp,
  social_instagram,
  template,
  template_type,
  status,
  plan
) VALUES (
  'pruebas',
  'admin_pruebas',
  'pruebas@tol.ar',
  'PRUEBAS - Sandbox',
  'admin123',
  '5491112345678',
  '@tol.ar',
  'pruebas',
  'sandbox',
  'active',
  'free'
) ON CONFLICT (subdomain) DO UPDATE SET
  site_title = EXCLUDED.site_title,
  template = EXCLUDED.template,
  template_type = EXCLUDED.template_type;

-- Insertar tienda BASE
INSERT INTO stores (
  subdomain,
  username,
  email,
  site_title,
  admin_password,
  social_whatsapp,
  social_instagram,
  template,
  template_type,
  status,
  plan
) VALUES (
  'base',
  'admin_base',
  'base@tol.ar',
  'BASE - Template Principal',
  'admin123',
  '5491112345678',
  '@tol.ar',
  'base',
  'base',
  'active',
  'free'
) ON CONFLICT (subdomain) DO UPDATE SET
  site_title = EXCLUDED.site_title,
  template = EXCLUDED.template,
  template_type = EXCLUDED.template_type;

-- Insertar templates PRUEBAS y BASE en la tabla templates
INSERT INTO templates (name, slug, description, current_version, variantes, is_active)
VALUES 
  ('PRUEBAS', 'pruebas', 'Sandbox para probar ideas nuevas sin afectar nada', '1.0.0', '["test"]'::jsonb, true),
  ('BASE', 'base', 'Template base - Los cambios aca afectan a TODOS los templates y tiendas', '1.0.0', '["color", "cantidad"]'::jsonb, true)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- Actualizar los templates existentes para tener parent_template_id = 'base'
-- (esto hace que hereden los cambios de BASE)
ALTER TABLE templates ADD COLUMN IF NOT EXISTS parent_template_id TEXT;

UPDATE templates SET parent_template_id = 'base' 
WHERE slug IN ('zapatos', 'ropa', 'perfumes', 'electronicos');

-- Agregar productos de ejemplo a PRUEBAS
INSERT INTO products (store_id, name, description, price, stock, image_url, active, slug)
SELECT 
  s.id,
  'Producto de Prueba ' || n,
  'Este es un producto de prueba para experimentar.',
  (random() * 10000 + 1000)::numeric(10,2),
  floor(random() * 100 + 10)::int,
  '/placeholder.svg?height=300&width=300',
  true,
  'producto-prueba-' || n
FROM stores s, generate_series(1, 5) AS n
WHERE s.subdomain = 'pruebas'
ON CONFLICT DO NOTHING;

-- Agregar productos de ejemplo a BASE
INSERT INTO products (store_id, name, description, price, stock, image_url, active, slug)
SELECT 
  s.id,
  'Producto Base ' || n,
  'Producto del template base.',
  (random() * 10000 + 1000)::numeric(10,2),
  floor(random() * 100 + 10)::int,
  '/placeholder.svg?height=300&width=300',
  true,
  'producto-base-' || n
FROM stores s, generate_series(1, 5) AS n
WHERE s.subdomain = 'base'
ON CONFLICT DO NOTHING;
