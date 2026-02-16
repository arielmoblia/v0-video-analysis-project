-- Buscar tienda "dante"
SELECT id, subdomain, email, username, created_at 
FROM stores 
WHERE subdomain = 'dante';

-- Eliminar la tienda dante
DELETE FROM stores WHERE subdomain = 'dante';
