-- Migración: dominio propio por tienda (ej. www.mitienda.com.ar en vez de mitienda.tol.ar)
-- Ejecutar UNA sola vez en: https://supabase.com/dashboard/project/tuznlaqncbrsbokbbzhy/sql/new
-- Nota: esta columna solo guarda el valor. Todavía falta la parte de infraestructura
-- (routing por dominio propio en middleware.ts + certificado SSL) para que el dominio
-- sirva la tienda de verdad. Ver conversación 2026-08-13 con Ariel.

ALTER TABLE public.stores
  ADD COLUMN IF NOT EXISTS custom_domain TEXT;

-- Verificar que se creó correctamente:
-- SELECT subdomain, custom_domain FROM public.stores LIMIT 5;
