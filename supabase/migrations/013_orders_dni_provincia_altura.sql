-- Migración: campos extra en orders para armar la guía de envío sin pedir datos a mano.
-- DNI, provincia y altura (número de la calle, separado de la dirección) se cargan ahora
-- en el checkout cuando el cliente elige envío a domicilio, y quedan guardados en el
-- pedido para que "Guía automática (test)" en el panel los traiga ya completos.
-- Pedidos viejos quedan con estos campos NULL — el formulario de guía los sigue pidiendo
-- a mano en ese caso, como ya hacía antes.
-- tol.ar y tol.ar-dev comparten el mismo proyecto Supabase, alcanza con correrlo una vez.

ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_dni TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipping_province TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipping_street_number TEXT;
