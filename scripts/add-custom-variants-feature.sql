-- Agregar feature de variantes personalizables al plan Cositas
INSERT INTO store_features (code, name, description, price, icon, is_active)
VALUES (
  'custom_variants',
  'Variantes Personalizables',
  'Creá opciones personalizadas para tus productos: aromas, colores, sabores, materiales y más. Ideal para sahumerios, velas, alimentos, artesanías.',
  3,
  'Sparkles',
  true
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  icon = EXCLUDED.icon,
  is_active = EXCLUDED.is_active;
