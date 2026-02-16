-- Agregar columna is_gifted para marcar features regaladas
ALTER TABLE store_purchased_features 
ADD COLUMN IF NOT EXISTS is_gifted BOOLEAN DEFAULT false;

-- Crear indice para busquedas
CREATE INDEX IF NOT EXISTS idx_store_purchased_features_gifted 
ON store_purchased_features(is_gifted);
