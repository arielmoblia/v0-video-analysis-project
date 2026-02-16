-- Agregar campos de Mobbex a la tabla stores
ALTER TABLE stores ADD COLUMN IF NOT EXISTS mobbex_api_key TEXT;
ALTER TABLE stores ADD COLUMN IF NOT EXISTS mobbex_access_token TEXT;
ALTER TABLE stores ADD COLUMN IF NOT EXISTS payment_provider TEXT DEFAULT 'mercadopago';

-- Comentario: payment_provider puede ser 'mercadopago', 'mobbex', 'transfer' o 'all'
