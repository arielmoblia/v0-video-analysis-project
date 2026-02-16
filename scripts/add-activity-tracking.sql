-- Agregar campos para tracking de actividad en stores
ALTER TABLE stores 
ADD COLUMN IF NOT EXISTS last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS warning_emails_sent INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS trial_expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'),
ADD COLUMN IF NOT EXISTS is_trial BOOLEAN DEFAULT TRUE;

-- Comentarios
COMMENT ON COLUMN stores.last_activity_at IS 'Ultima actividad del usuario (login, editar producto, etc)';
COMMENT ON COLUMN stores.warning_emails_sent IS 'Cantidad de emails de advertencia enviados';
COMMENT ON COLUMN stores.trial_expires_at IS 'Fecha en que expira el periodo de prueba de 7 dias';
COMMENT ON COLUMN stores.is_trial IS 'Si la tienda esta en periodo de prueba';
