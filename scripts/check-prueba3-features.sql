-- Verificar features de prueba3
SELECT spf.feature_code, spf.is_active, spf.is_gifted
FROM store_purchased_features spf
JOIN stores s ON s.id = spf.store_id
WHERE s.subdomain = 'prueba3';

-- Verificar custom_variants de prueba3
SELECT s.subdomain, s.custom_variants
FROM stores s
WHERE s.subdomain = 'prueba3';
