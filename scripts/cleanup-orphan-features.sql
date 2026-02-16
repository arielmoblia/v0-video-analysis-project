-- Limpiar features que no fueron regaladas ni compradas legítimamente
-- Esto elimina registros que se crearon por error durante las pruebas

-- Primero ver que hay
SELECT spf.id, s.subdomain, spf.feature_code, spf.is_active, spf.is_gifted, spf.purchased_at
FROM store_purchased_features spf
JOIN stores s ON s.id = spf.store_id
ORDER BY s.subdomain, spf.feature_code;

-- Eliminar features que no fueron regaladas (is_gifted = false) y no fueron compradas (purchased_at IS NULL)
DELETE FROM store_purchased_features 
WHERE is_gifted = false 
AND purchased_at IS NULL;
