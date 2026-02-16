-- Ver TODAS las features compradas/regaladas
SELECT spf.*, s.subdomain
FROM store_purchased_features spf
LEFT JOIN stores s ON s.id = spf.store_id
ORDER BY s.subdomain, spf.feature_code;
