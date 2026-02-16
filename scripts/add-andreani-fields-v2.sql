-- Agregar campos adicionales para Andreani a shipping_methods
ALTER TABLE shipping_methods 
ADD COLUMN IF NOT EXISTS andreani_user TEXT,
ADD COLUMN IF NOT EXISTS andreani_password TEXT,
ADD COLUMN IF NOT EXISTS andreani_account TEXT,
ADD COLUMN IF NOT EXISTS origin_postal_code TEXT,
ADD COLUMN IF NOT EXISTS origin_street TEXT,
ADD COLUMN IF NOT EXISTS origin_number TEXT,
ADD COLUMN IF NOT EXISTS origin_city TEXT,
ADD COLUMN IF NOT EXISTS origin_province TEXT;
