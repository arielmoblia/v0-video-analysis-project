-- Migración: consentimiento específico para "Diseño Customizado de Portada"
-- (clonación de otro sitio pegando su URL, /plan-cositas/portada-especial).
-- El checkbox general de alta de tienda no alcanza (dictamen del Jurista,
-- 03/10/2026): la clonación es una acción posterior sobre una URL de terceros
-- que no existía como pedido al momento de aceptar los Términos generales,
-- así que necesita su propio registro con fecha, hora, IP y la URL puntual.
-- Ejecutar UNA sola vez en: https://supabase.com/dashboard/project/tuznlaqncbrsbokbbzhy/sql/new

CREATE TABLE IF NOT EXISTS public.portada_clone_consent (
  id                UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id          UUID        NOT NULL,
  store_name        TEXT,
  subdomain         TEXT,
  url               TEXT        NOT NULL,
  terminos_version  TEXT        NOT NULL,
  ip_address        TEXT,
  user_agent        TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS portada_clone_consent_store_id_idx
  ON public.portada_clone_consent (store_id);

-- Verificar que se creó correctamente:
-- SELECT count(*) FROM public.portada_clone_consent;
