-- Migración: autorización parental para uso de la plataforma por menores de edad
-- Un registro por tienda (UNIQUE store_id) — una vez creado no se edita ni se borra desde la app,
-- funciona como documento inmutable (el PDF generado queda en el bucket privado store-legal-docs).
-- Ejecutar UNA sola vez en: https://supabase.com/dashboard/project/tuznlaqncbrsbokbbzhy/sql/new

CREATE TABLE IF NOT EXISTS public.store_minor_consent (
  id                      UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id                UUID        NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  menor_nombre            TEXT        NOT NULL,
  menor_fecha_nacimiento  DATE        NOT NULL,
  menor_dni               TEXT        NOT NULL,
  adulto_nombre           TEXT        NOT NULL,
  adulto_dni              TEXT        NOT NULL,
  adulto_relacion         TEXT        NOT NULL,
  adulto_email            TEXT        NOT NULL,
  adulto_telefono         TEXT        NOT NULL,
  texto_autorizacion      TEXT        NOT NULL,
  terminos_version        TEXT        NOT NULL,
  ip_address              TEXT,
  user_agent              TEXT,
  pdf_path                TEXT        NOT NULL,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (store_id)
);

CREATE INDEX IF NOT EXISTS store_minor_consent_store_idx
  ON public.store_minor_consent (store_id);

-- Verificar que se creó correctamente:
-- SELECT count(*) FROM public.store_minor_consent;
