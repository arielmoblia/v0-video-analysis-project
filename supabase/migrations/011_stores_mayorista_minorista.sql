-- Migración: link cruzado entre tienda mayorista y minorista (cosita "Mayorista/Minorista")
-- Ejecutar UNA sola vez en: https://supabase.com/dashboard/project/tuznlaqncbrsbokbbzhy/sql/new
-- Guarda la URL de la tienda hermana y el texto del botón que se muestra en el header.

ALTER TABLE public.stores
  ADD COLUMN IF NOT EXISTS linked_store_url TEXT,
  ADD COLUMN IF NOT EXISTS linked_store_label TEXT;

-- Verificar que se creó correctamente:
-- SELECT subdomain, linked_store_url, linked_store_label FROM public.stores LIMIT 5;
