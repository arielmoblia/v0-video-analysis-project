-- Migración: confirmación manual de pago a Enviamelo antes de generar la guía real.
-- shipping_guide_paid_at NULL = todavía no se confirmó la transferencia a Enviamelo.
-- Con fecha = el admin tildó "Ya transferí" desde el panel (components/admin/orders-manager.tsx,
-- pestaña Envío). No hay forma de verificar automáticamente que la plata llegó (no hay API de
-- movimientos de Mercado Pago ni de Enviamelo para eso), así que es un registro manual, igual
-- que invoiced_at (migración 014).
--
-- El botón "Generar guía con Enviamelo" (que genera un envío real y cobra en la cuenta de
-- Enviamelo) queda bloqueado en el panel hasta que esta columna tenga fecha.
--
-- tol.ar y tol.ar-dev comparten el mismo proyecto Supabase, alcanza con correrlo una vez.

ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipping_guide_paid_at TIMESTAMPTZ;

-- Verificar que se agregó correctamente:
-- SELECT shipping_guide_paid_at FROM public.orders LIMIT 1;
