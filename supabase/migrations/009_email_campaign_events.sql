-- Migración: eventos de los mails de campaña (Grupo 1-4) que manda Resend por webhook
-- (entregado, abierto, click, rebotado, marcado como spam). Sirve para armar el informe
-- automático que se le manda a Ariel por WhatsApp.
-- Ejecutar UNA sola vez en: https://supabase.com/dashboard/project/tuznlaqncbrsbokbbzhy/sql/new

CREATE TABLE IF NOT EXISTS public.email_campaign_events (
  id BIGSERIAL PRIMARY KEY,
  resend_email_id TEXT,
  email TEXT NOT NULL,
  grupo TEXT, -- g1, g2, g3, g4 (viene del tag "grupo" que se manda junto al mail)
  event_type TEXT NOT NULL, -- delivered, opened, clicked, bounced, complained
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  raw JSONB
);

CREATE INDEX IF NOT EXISTS email_campaign_events_grupo_idx ON public.email_campaign_events (grupo);
CREATE INDEX IF NOT EXISTS email_campaign_events_email_idx ON public.email_campaign_events (email);
CREATE INDEX IF NOT EXISTS email_campaign_events_created_at_idx ON public.email_campaign_events (created_at);

-- Verificar que se creó correctamente:
-- SELECT event_type, count(*) FROM public.email_campaign_events GROUP BY event_type;
