ALTER TABLE public.geo_preguntas
  ADD COLUMN IF NOT EXISTS volumen_busqueda INTEGER,
  ADD COLUMN IF NOT EXISTS volumen_fecha DATE,
  ADD COLUMN IF NOT EXISTS volumen_fuente TEXT;

NOTIFY pgrst, 'reload schema';
