-- Actualizar credenciales de todas las tiendas template
-- Usuario: arielmobilia
-- Password: 17798452

UPDATE stores 
SET 
  username = 'arielmobilia',
  admin_password = '17798452'
WHERE subdomain IN ('pruebas', 'base', 'template', 'zapatos', 'ropa', 'perfumes', 'electronicos');
