-- Agregar feature de importacion CSV/Excel a store_features
INSERT INTO store_features (code, name, description, price, icon, is_active)
VALUES (
  'csv_import',
  'Importar Productos (CSV/Excel)',
  'Subi todos tus productos de una sola vez desde un archivo Excel o CSV. Ideal para migrar desde otra plataforma o cargar catalogos grandes.',
  1,
  'FileSpreadsheet',
  true
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  icon = EXCLUDED.icon,
  is_active = EXCLUDED.is_active;
