-- Páginas propias por tienda (ej. "Quiénes somos", "Guía de talles",
-- "Cómo comprar"): cada dueño crea las suyas con slug libre desde su panel.
-- Sirve de base para la "botonera" de menú (components/store/store-pages-menu.tsx)
-- y para el clon pixel de prink.tol.ar.
--
-- tol.ar y tol.ar-dev comparten el mismo proyecto Supabase, alcanza con correrlo una vez.
-- Ejecutar en: https://supabase.com/dashboard/project/tuznlaqncbrsbokbbzhy/sql/new

CREATE TABLE IF NOT EXISTS public.store_pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  is_published BOOLEAN NOT NULL DEFAULT true,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (store_id, slug)
);

CREATE INDEX IF NOT EXISTS store_pages_store_id_idx ON public.store_pages (store_id);

-- Sin RLS, igual que store_legal_content: el control de acceso pasa por el
-- server (service role key). No activar RLS sin política — eso fue lo que
-- tumbó toda la plataforma el 24/09.

-- Verificar que se creó correctamente:
-- SELECT * FROM store_pages LIMIT 1;
