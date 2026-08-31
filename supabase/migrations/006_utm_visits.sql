-- Migración: registro simple de visitas con parámetros UTM (prensa/directorios externos)
-- Ejecutar UNA sola vez en: https://supabase.com/dashboard/project/tuznlaqncbrsbokbbzhy/sql/new

CREATE TABLE IF NOT EXISTS public.utm_visits (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  utm_source   TEXT        NOT NULL,
  utm_medium   TEXT,
  utm_campaign TEXT,
  path         TEXT
);

CREATE INDEX IF NOT EXISTS utm_visits_source_idx ON public.utm_visits (utm_source);

-- Verificar que se creó correctamente:
-- SELECT count(*) FROM public.utm_visits;
