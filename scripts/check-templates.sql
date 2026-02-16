-- Verificar que templates existen
SELECT subdomain, site_title, template, is_trial, created_at 
FROM stores 
WHERE subdomain IN ('perfumes', 'ropa', 'zapatos', 'electronicos', 'base', 'pruebas', 'template', 'arielmobilia')
ORDER BY subdomain;
