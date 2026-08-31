-- Migración: solicitudes de "botón de arrepentimiento" (Disposición 954/2025)
-- Registra cada solicitud de arrepentimiento de compra a distancia, con un código
-- que sirve de constancia tanto para el comprador como para la tienda.
-- Ejecutar UNA sola vez en: https://supabase.com/dashboard/project/tuznlaqncbrsbokbbzhy/sql/new

CREATE TABLE IF NOT EXISTS public.arrepentimiento_solicitudes (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id      UUID        NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  codigo        TEXT        NOT NULL UNIQUE,
  nombre        TEXT        NOT NULL,
  email         TEXT        NOT NULL,
  numero_pedido TEXT,
  motivo        TEXT,
  estado        TEXT        NOT NULL DEFAULT 'pendiente',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS arrepentimiento_solicitudes_store_idx
  ON public.arrepentimiento_solicitudes (store_id, created_at DESC);

-- Verificar que se creó correctamente:
-- SELECT count(*) FROM public.arrepentimiento_solicitudes;
