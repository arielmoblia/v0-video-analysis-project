-- Agregar campo custom_variants a la tabla stores
ALTER TABLE stores ADD COLUMN IF NOT EXISTS custom_variants JSONB DEFAULT '{"variant_types": []}';
