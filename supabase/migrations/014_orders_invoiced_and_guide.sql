-- Migración: cronograma de estado del pedido en el panel de admin.
-- "Facturado" es un tilde manual de registro (sin integración real con AFIP todavía),
-- separado del campo `status` para no tocar los valores existentes (pending, confirmed,
-- purchased_at_source, shipped, delivered, cancelled, refunded) que ya lee el resto del
-- código (statusLabels/statusColors en components/admin/orders-manager.tsx, lib/pdf/remito.ts, etc).
-- invoiced_at NULL = no facturado todavía; con fecha = tildado desde el panel.
--
-- Las columnas shipping_guide_* guardan el resultado de "Guía de Transporte" (integración
-- real con Enviamelo que ya existe en app/api/shipping/enviamelo/operation/route.ts) para que
-- el cronograma quede en verde y el link al PDF real persista aunque se cierre el modal o se
-- recargue la página, en vez de perderse en estado local de React como pasa hoy.
--
-- tol.ar y tol.ar-dev comparten el mismo proyecto Supabase, alcanza con correrlo una vez.

ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS invoiced_at TIMESTAMPTZ;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipping_guide_id TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipping_guide_pdf_url TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipping_guide_amount NUMERIC;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipping_guide_generated_at TIMESTAMPTZ;

-- Verificar que se agregaron correctamente:
-- SELECT invoiced_at, shipping_guide_id, shipping_guide_pdf_url, shipping_guide_amount, shipping_guide_generated_at FROM public.orders LIMIT 1;
