-- Actualizar el campo template de cada tienda para que coincida con su rubro

UPDATE stores SET template = 'zapatos' WHERE subdomain = 'zapatos';
UPDATE stores SET template = 'ropa' WHERE subdomain = 'ropa';
UPDATE stores SET template = 'perfumes' WHERE subdomain = 'perfumes';
UPDATE stores SET template = 'electronicos' WHERE subdomain = 'electronicos';
UPDATE stores SET template = 'base' WHERE subdomain = 'base';
UPDATE stores SET template = 'pruebas' WHERE subdomain = 'pruebas';
UPDATE stores SET template = 'template' WHERE subdomain = 'template';

-- Mostrar los templates actualizados
SELECT subdomain, template, site_title FROM stores 
WHERE subdomain IN ('zapatos', 'ropa', 'perfumes', 'electronicos', 'base', 'pruebas', 'template');
