-- QR "Data Fiscal" de AFIP (Formulario 960/D). Obligatorio por tienda:
-- cada comerciante tiene el suyo propio, atado a su CUIT, no se puede generar genérico.
ALTER TABLE stores ADD COLUMN IF NOT EXISTS data_fiscal_url TEXT;
