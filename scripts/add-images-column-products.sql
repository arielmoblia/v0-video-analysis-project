-- Agregar columna images (array de URLs) a la tabla products si no existe
ALTER TABLE products ADD COLUMN IF NOT EXISTS images JSONB DEFAULT NULL;

-- Crear indice para busquedas
CREATE INDEX IF NOT EXISTS idx_products_images ON products USING GIN (images);
