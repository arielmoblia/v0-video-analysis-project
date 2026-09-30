-- Agregar feature de carruseles (productos destacados + franja de texto) al plan Cositas
INSERT INTO store_features (code, name, description, price, icon, is_active)
VALUES (
  'carousels',
  'Carruseles',
  'Agregá una franja de productos destacados que se desliza y/o una franja de texto con frases que van rotando (promociones, envíos, redes). Aparecen debajo del banner de tu portada.',
  2,
  'GalleryHorizontal',
  true
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  icon = EXCLUDED.icon,
  is_active = EXCLUDED.is_active;
