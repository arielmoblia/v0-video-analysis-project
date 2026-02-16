-- Crear tabla store_purchased_features si no existe
CREATE TABLE IF NOT EXISTS store_purchased_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  feature_code TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  is_gifted BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(store_id, feature_code)
);

-- Crear indices
CREATE INDEX IF NOT EXISTS idx_store_purchased_features_store 
ON store_purchased_features(store_id);

CREATE INDEX IF NOT EXISTS idx_store_purchased_features_code 
ON store_purchased_features(feature_code);

CREATE INDEX IF NOT EXISTS idx_store_purchased_features_gifted 
ON store_purchased_features(is_gifted);

-- Habilitar RLS
ALTER TABLE store_purchased_features ENABLE ROW LEVEL SECURITY;

-- Eliminar politicas existentes si existen
DROP POLICY IF EXISTS "Usuarios pueden ver sus propias features" ON store_purchased_features;
DROP POLICY IF EXISTS "API puede gestionar features" ON store_purchased_features;

-- Politica para leer
CREATE POLICY "Usuarios pueden ver sus propias features"
ON store_purchased_features FOR SELECT
USING (true);

-- Politica para insertar/actualizar (solo desde API server)
CREATE POLICY "API puede gestionar features"
ON store_purchased_features FOR ALL
USING (true)
WITH CHECK (true);
