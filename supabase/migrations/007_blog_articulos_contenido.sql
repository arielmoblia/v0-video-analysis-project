-- Migración: contenido editable de artículos del blog (título, bajada y cuerpo)
-- Por defecto el artículo usa el texto hardcodeado en su page.tsx.
-- Si Ariel edita algo desde el botón "Editar" del artículo, esa fila pisa el contenido
-- por defecto para ese slug. Sirve para cualquier artículo nuevo, no solo este.

CREATE TABLE IF NOT EXISTS public.blog_articulos_contenido (
  slug        TEXT        PRIMARY KEY,
  titulo      TEXT,
  bajada      TEXT,
  cuerpo_html TEXT,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Verificar que se creó correctamente:
-- SELECT count(*) FROM public.blog_articulos_contenido;
