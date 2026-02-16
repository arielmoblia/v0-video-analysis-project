-- Agregar feature "Variantes Combinadas" (Pronto) a store_features
INSERT INTO store_features (code, name, description, price, is_active)
VALUES (
  'combined_variants',
  'Variantes Combinadas',
  'Cruza talles con colores, aromas o cualquier variante. Stock individual por cada combinacion (ej: S-Rojo: 1, M-Negro: 34). Ideal para indumentaria y productos con multiples opciones.',
  2160,
  true
)
ON CONFLICT (code) DO NOTHING;
