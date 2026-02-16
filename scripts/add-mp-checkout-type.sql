-- Agregar campo para elegir tipo de checkout de MercadoPago (redirect o modal)
ALTER TABLE payment_methods 
ADD COLUMN IF NOT EXISTS mercadopago_checkout_type TEXT DEFAULT 'redirect';

-- Valores posibles: 'redirect' (sale de la página) o 'modal' (popup en la misma página)
