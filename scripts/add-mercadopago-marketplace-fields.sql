-- Campos para la conexión OAuth de Mercado Pago (split de pagos / marketplace)
-- Se usan solo para las tiendas que conecten su cuenta con el botón nuevo;
-- las tiendas que no lo hagan siguen funcionando igual que hoy.
ALTER TABLE payment_methods
ADD COLUMN IF NOT EXISTS mercadopago_oauth_access_token text,
ADD COLUMN IF NOT EXISTS mercadopago_oauth_refresh_token text,
ADD COLUMN IF NOT EXISTS mercadopago_oauth_user_id text,
ADD COLUMN IF NOT EXISTS mercadopago_oauth_connected boolean DEFAULT false;
