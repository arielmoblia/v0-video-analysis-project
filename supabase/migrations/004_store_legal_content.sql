-- Migración: contenido legal editable por tienda (terminos, privacidad, devoluciones)
-- Por defecto una tienda hereda el texto de tol.ar (tabla page_content).
-- Si el dueño edita una key puntual, queda guardada acá y no vuelve a heredar cambios de tol.ar para esa key.
-- Ejecutar UNA sola vez en: https://supabase.com/dashboard/project/tuznlaqncbrsbokbbzhy/sql/new

CREATE TABLE IF NOT EXISTS public.store_legal_content (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id    UUID        NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  page        TEXT        NOT NULL,
  key         TEXT        NOT NULL,
  value       TEXT        NOT NULL,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (store_id, page, key)
);

CREATE INDEX IF NOT EXISTS store_legal_content_store_page_idx
  ON public.store_legal_content (store_id, page);

-- Verificar que se creó correctamente:
-- SELECT count(*) FROM public.store_legal_content;
