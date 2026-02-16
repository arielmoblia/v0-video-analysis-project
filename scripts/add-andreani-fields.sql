-- Agregar campos para la integración con Andreani
ALTER TABLE shipping_config 
ADD COLUMN IF NOT EXISTS andreani_user VARCHAR(255),
ADD COLUMN IF NOT EXISTS andreani_password VARCHAR(255),
ADD COLUMN IF NOT EXISTS andreani_account VARCHAR(255),
ADD COLUMN IF NOT EXISTS andreani_contract VARCHAR(255),
ADD COLUMN IF NOT EXISTS origin_postal_code VARCHAR(10);

-- Comentarios para documentar
COMMENT ON COLUMN shipping_config.andreani_user IS 'Usuario de API Andreani';
COMMENT ON COLUMN shipping_config.andreani_password IS 'Contraseña de API Andreani';
COMMENT ON COLUMN shipping_config.andreani_account IS 'Número de cuenta/cliente Andreani';
COMMENT ON COLUMN shipping_config.andreani_contract IS 'Número de contrato/operativa (PAS o PAP)';
COMMENT ON COLUMN shipping_config.origin_postal_code IS 'Código postal de origen para envíos';
