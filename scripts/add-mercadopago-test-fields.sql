-- Agregar campos para modo de prueba de MercadoPago
ALTER TABLE payment_methods 
ADD COLUMN IF NOT EXISTS mercadopago_test_mode boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS mercadopago_test_token text;
