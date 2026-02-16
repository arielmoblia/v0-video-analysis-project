-- Agregar campo payment_id a la tabla orders para guardar el ID de pago de MercadoPago
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_id TEXT;
