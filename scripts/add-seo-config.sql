-- Agregar campo seo_config a stores para guardar toda la configuración SEO
ALTER TABLE stores ADD COLUMN IF NOT EXISTS seo_config JSONB DEFAULT '{}'::jsonb;

-- Comentario descriptivo
COMMENT ON COLUMN stores.seo_config IS 'Configuración SEO completa: meta tags, open graph, twitter cards, verificaciones, etc.';
