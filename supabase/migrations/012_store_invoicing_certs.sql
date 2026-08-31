-- Migración: certificado digital propio de cada tienda para Facturación Electrónica (ARCA/AFIP)
-- Modelo B: el dueño genera SU propio certificado con SU Clave Fiscal (no delegación a tol.ar
-- como tercero autorizado). Certificado y clave privada se guardan cifrados (ver lib/crypto.ts)
-- y el sistema los usa para facturar en nombre del dueño, igual que si lo hiciera él a mano.
-- Un registro por tienda (UNIQUE store_id).
-- Ejecutar UNA sola vez en: https://supabase.com/dashboard/project/tuznlaqncbrsbokbbzhy/sql/new
-- (tol.ar y tol.ar-dev comparten ese mismo proyecto Supabase, así que alcanza con correrlo ahí una vez).

CREATE TABLE IF NOT EXISTS public.store_invoicing_certs (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id    UUID        NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  cuit        TEXT        NOT NULL,
  cert_pem    TEXT        NOT NULL,
  key_pem     TEXT        NOT NULL,
  status      TEXT        NOT NULL DEFAULT 'active',
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (store_id)
);

CREATE INDEX IF NOT EXISTS store_invoicing_certs_store_idx
  ON public.store_invoicing_certs (store_id);

-- Verificar que se creó correctamente:
-- SELECT store_id, cuit, status, uploaded_at FROM public.store_invoicing_certs;
