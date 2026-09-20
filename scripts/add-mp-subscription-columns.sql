-- Suscripciones de Mercado Pago para trials de "cositas" (Plan Cositas)
-- Objetivo: cuando alguien prueba una cosita, guardamos la tarjeta vía un
-- "preapproval" de Mercado Pago con free_trial, para que MP cobre solo al
-- terminar la prueba, sin intervención humana.
--
-- IMPORTANTE: este archivo NO se ejecuta solo. Correrlo a mano contra la
-- base de producción cuando Ariel confirme el flujo (revisar antes en una
-- copia/staging si es posible).

ALTER TABLE store_purchased_features
  ADD COLUMN IF NOT EXISTS mp_preapproval_id TEXT,
  ADD COLUMN IF NOT EXISTS mp_subscription_status TEXT,
  ADD COLUMN IF NOT EXISTS mp_payer_email TEXT,
  ADD COLUMN IF NOT EXISTS charge_reminder_sent_at TIMESTAMP WITH TIME ZONE;

COMMENT ON COLUMN store_purchased_features.mp_preapproval_id IS 'ID del preapproval (suscripción) de Mercado Pago asociado a esta prueba/compra';
COMMENT ON COLUMN store_purchased_features.mp_subscription_status IS 'Último estado conocido del preapproval de MP: pending, authorized, paused, cancelled, processed, payment_rejected';
COMMENT ON COLUMN store_purchased_features.mp_payer_email IS 'Email que el cliente cargó en el formulario de tarjeta de Mercado Pago al iniciar la prueba';
COMMENT ON COLUMN store_purchased_features.charge_reminder_sent_at IS 'Cuándo se mandó el mail de aviso de cobro próximo (2-3 días antes de que termine el trial), para no mandarlo dos veces';

-- Búsqueda rápida desde el webhook de MP (llega el id del preapproval o del authorized_payment)
CREATE INDEX IF NOT EXISTS idx_store_purchased_features_mp_preapproval
ON store_purchased_features(mp_preapproval_id);

-- Búsqueda rápida desde el cron de recordatorio de cobro
CREATE INDEX IF NOT EXISTS idx_store_purchased_features_trial_ends
ON store_purchased_features(trial_ends_at) WHERE is_trial = true;
