-- Agregar columna purchased_at a store_purchased_features
ALTER TABLE store_purchased_features 
ADD COLUMN IF NOT EXISTS purchased_at TIMESTAMP WITH TIME ZONE;
