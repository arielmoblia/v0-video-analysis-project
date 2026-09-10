-- Migración: botón "Ver Productos" del banner principal, ahora opcional.
-- Por defecto queda visible (true) para no cambiar el comportamiento de las
-- tiendas existentes; el dueño lo puede apagar desde el panel de Apariencia.
--
-- tol.ar y tol.ar-dev comparten el mismo proyecto Supabase, alcanza con correrlo una vez.

ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS show_products_button BOOLEAN NOT NULL DEFAULT true;

-- Verificar que se agregó correctamente:
-- SELECT show_products_button FROM public.stores LIMIT 1;
