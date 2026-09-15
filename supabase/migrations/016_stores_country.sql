-- Migración: país de la tienda (Argentina/Chile por ahora), elegido por el dueño al crearla,
-- preseleccionado por IP pero corregible a mano. Decide qué dominio (tol.ar/tiendabasica.com)
-- y qué bloques de contenido (pagos/envíos) se le muestran.
--
-- tol.ar y tol.ar-dev comparten el mismo proyecto Supabase, alcanza con correrlo una vez.

ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS country TEXT NOT NULL DEFAULT 'AR';

-- Verificar que se agregó correctamente:
-- SELECT country FROM public.stores LIMIT 1;
