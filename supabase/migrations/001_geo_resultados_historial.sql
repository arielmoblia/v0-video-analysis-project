-- Migración: crear tabla de historial de escaneos GEO IA
-- Ejecutar UNA sola vez en: https://supabase.com/dashboard/project/tuznlaqncbrsbokbbzhy/sql/new

CREATE TABLE IF NOT EXISTS public.geo_resultados_historial (
  id              UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  pregunta_id     UUID        REFERENCES public.geo_preguntas(id) ON DELETE CASCADE,
  ia              TEXT        NOT NULL,
  menciona_tolar       BOOLEAN NOT NULL DEFAULT false,
  menciona_tiendanube  BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS geo_resultados_historial_created_idx
  ON public.geo_resultados_historial (created_at);

-- Verificar que se creó correctamente:
-- SELECT count(*) FROM public.geo_resultados_historial;
