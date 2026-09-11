-- Agregar feature de Modelos/Templates al plan Cositas
INSERT INTO store_features (code, name, description, full_description, price, price_type, icon, categoria, trial_days, is_active)
VALUES (
  'modelos_templates',
  'Modelos/Templates',
  'Elegí el diseño de tu tienda y editalo en vivo, tocando directo lo que ves. Sin editores aparte.',
  'Tu tienda usa un diseño (modelo) profesional. Activás el modo edición como dueño y cambiás fotos, categorías, textos y productos tocando directo sobre lo que el cliente ve — nada de paneles complicados. Guardás y se publica al instante.',
  1,
  'mes',
  'Palette',
  'Producción',
  7,
  true
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  full_description = EXCLUDED.full_description,
  price = EXCLUDED.price,
  price_type = EXCLUDED.price_type,
  icon = EXCLUDED.icon,
  categoria = EXCLUDED.categoria,
  trial_days = EXCLUDED.trial_days,
  is_active = EXCLUDED.is_active;
