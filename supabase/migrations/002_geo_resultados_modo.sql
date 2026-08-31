-- Migración: agregar columna "modo" a geo_resultados (memoria vs búsqueda web)
-- Ejecutar UNA sola vez en: https://supabase.com/dashboard/project/tuznlaqncbrsbokbbzhy/sql/new

ALTER TABLE public.geo_resultados
  ADD COLUMN IF NOT EXISTS modo TEXT NOT NULL DEFAULT 'memoria';

-- Refrescar el cache de schema de PostgREST (si no se corre esto, la API
-- puede tirar "Could not find column 'modo'" aunque la columna ya exista)
NOTIFY pgrst, 'reload schema';

-- Verificar que se agregó correctamente:
-- SELECT modo, count(*) FROM public.geo_resultados GROUP BY modo;
