-- Cuentas de cliente final (login por tienda): "cosita" customer_accounts ($1/mes).
-- Cada tienda tiene sus propios clientes (store_id), con contraseña hasheada
-- (bcrypt, ver lib/services/customers.ts) — nunca texto plano, a diferencia
-- del login de admin_password que ya existe para el dueño de la tienda.
--
-- Las sesiones son tokens aleatorios (no JWT: no hay librería JWT en el
-- proyecto) guardados en customer_sessions, igual de simple que el patrón
-- admin_<subdomain>=true por cookie, pero acá la cookie guarda el token
-- porque puede haber muchos clientes por tienda, no uno solo.
--
-- No se agrega customer_id a orders: los pedidos de un cliente se matchean
-- por email (orders.customer_email ya existe) contra customers.email, así
-- no hace falta tocar el checkout (archivo grande y crítico, maneja pagos).
--
-- tol.ar y tol.ar-dev comparten el mismo proyecto Supabase, alcanza con correrlo una vez.
-- Ejecutar en: https://supabase.com/dashboard/project/tuznlaqncbrsbokbbzhy/sql/new

CREATE TABLE IF NOT EXISTS public.customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (store_id, email)
);

CREATE INDEX IF NOT EXISTS customers_store_id_idx ON public.customers (store_id);

CREATE TABLE IF NOT EXISTS public.customer_sessions (
  token TEXT PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS customer_sessions_customer_id_idx ON public.customer_sessions (customer_id);

-- Sin RLS, igual que store_pages: el control de acceso pasa por el server
-- (service role key). No activar RLS sin política — eso fue lo que tumbó
-- toda la plataforma el 24/09.

-- Verificar que se creó correctamente:
-- SELECT * FROM customers LIMIT 1;
