-- Agregar feature de multiples imagenes al plan Cositas
INSERT INTO store_features (code, name, description, price, icon, is_active)
VALUES (
  'multi_images',
  'Galería de Imágenes',
  'Subí múltiples fotos por producto con galería interactiva. Mostrá tus productos desde todos los ángulos.',
  1,
  'Images',
  true
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  icon = EXCLUDED.icon,
  is_active = EXCLUDED.is_active;
