-- Migración: consentimiento de la tienda para recibir WhatsApp de marketing de tol.ar
-- Ejecutar UNA sola vez en: https://supabase.com/dashboard/project/tuznlaqncbrsbokbbzhy/sql/new

ALTER TABLE public.stores
  ADD COLUMN IF NOT EXISTS whatsapp_marketing_consent BOOLEAN NOT NULL DEFAULT false;

-- Verificar que se creó correctamente:
-- SELECT subdomain, whatsapp_marketing_consent FROM public.stores LIMIT 5;
