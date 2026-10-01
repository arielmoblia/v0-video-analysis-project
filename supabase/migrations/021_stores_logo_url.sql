-- Logo de la tienda (imagen que reemplaza el nombre en texto en el header)
ALTER TABLE stores ADD COLUMN IF NOT EXISTS logo_url TEXT;
