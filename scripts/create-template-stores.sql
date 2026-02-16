-- Crear tiendas para los templates base
-- Estas tiendas sirven como "laboratorio" para probar cambios antes de desplegarlos

-- Template Base (Laboratorio)
INSERT INTO stores (
  id,
  subdomain,
  site_title,
  email,
  username,
  admin_password,
  template,
  template_type,
  status,
  plan,
  auto_update,
  created_at
) VALUES (
  gen_random_uuid(),
  'template',
  'Template Base - Laboratorio',
  'admin@tol.ar',
  'admin',
  '$2a$10$rQEY6j.YqXmLJ0xJzQv8qOEHxfBvZ1K5W5i8J5L5Y5v5Z5a5b5c5d', -- password: template123
  'base',
  'laboratorio',
  'active',
  'enterprise',
  false,
  NOW()
) ON CONFLICT (subdomain) DO NOTHING;

-- Template Zapatos
INSERT INTO stores (
  id,
  subdomain,
  site_title,
  email,
  username,
  admin_password,
  template,
  template_type,
  status,
  plan,
  auto_update,
  created_at
) VALUES (
  gen_random_uuid(),
  'zapatos',
  'Template Zapatos - Calzado',
  'admin@tol.ar',
  'admin',
  '$2a$10$rQEY6j.YqXmLJ0xJzQv8qOEHxfBvZ1K5W5i8J5L5Y5v5Z5a5b5c5d',
  'zapatos',
  'zapatos',
  'active',
  'enterprise',
  false,
  NOW()
) ON CONFLICT (subdomain) DO NOTHING;

-- Template Ropa
INSERT INTO stores (
  id,
  subdomain,
  site_title,
  email,
  username,
  admin_password,
  template,
  template_type,
  status,
  plan,
  auto_update,
  created_at
) VALUES (
  gen_random_uuid(),
  'ropa',
  'Template Ropa - Indumentaria',
  'admin@tol.ar',
  'admin',
  '$2a$10$rQEY6j.YqXmLJ0xJzQv8qOEHxfBvZ1K5W5i8J5L5Y5v5Z5a5b5c5d',
  'ropa',
  'ropa',
  'active',
  'enterprise',
  false,
  NOW()
) ON CONFLICT (subdomain) DO NOTHING;

-- Template Perfumes
INSERT INTO stores (
  id,
  subdomain,
  site_title,
  email,
  username,
  admin_password,
  template,
  template_type,
  status,
  plan,
  auto_update,
  created_at
) VALUES (
  gen_random_uuid(),
  'perfumes',
  'Template Perfumes - Cosmetica',
  'admin@tol.ar',
  'admin',
  '$2a$10$rQEY6j.YqXmLJ0xJzQv8qOEHxfBvZ1K5W5i8J5L5Y5v5Z5a5b5c5d',
  'perfumes',
  'perfumes',
  'active',
  'enterprise',
  false,
  NOW()
) ON CONFLICT (subdomain) DO NOTHING;

-- Template Electronicos
INSERT INTO stores (
  id,
  subdomain,
  site_title,
  email,
  username,
  admin_password,
  template,
  template_type,
  status,
  plan,
  auto_update,
  created_at
) VALUES (
  gen_random_uuid(),
  'electronicos',
  'Template Electronicos - Tecnologia',
  'admin@tol.ar',
  'admin',
  '$2a$10$rQEY6j.YqXmLJ0xJzQv8qOEHxfBvZ1K5W5i8J5L5Y5v5Z5a5b5c5d',
  'electronicos',
  'electronicos',
  'active',
  'enterprise',
  false,
  NOW()
) ON CONFLICT (subdomain) DO NOTHING;
