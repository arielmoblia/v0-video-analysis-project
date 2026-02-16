-- Migrar datos SEO existentes de platform_settings a platform_seo_config
-- Este script copia los datos de la configuracion anterior a la nueva tabla dedicada

-- Primero insertar el registro si no existe
INSERT INTO platform_seo_config (id) 
VALUES ('default')
ON CONFLICT (id) DO NOTHING;

-- Migrar datos de SEO desde platform_settings
UPDATE platform_seo_config
SET 
  site_title = COALESCE(
    (SELECT value->>'site_title' FROM platform_settings WHERE key = 'platform_marketing_seo'),
    site_title
  ),
  site_description = COALESCE(
    (SELECT value->>'site_description' FROM platform_settings WHERE key = 'platform_marketing_seo'),
    site_description
  ),
  keywords = COALESCE(
    (SELECT value->>'keywords' FROM platform_settings WHERE key = 'platform_marketing_seo'),
    keywords
  ),
  google_verification = COALESCE(
    (SELECT value->>'google_verification' FROM platform_settings WHERE key = 'platform_marketing_seo'),
    google_verification
  ),
  google_verified = COALESCE(
    (SELECT (value->>'google_verified')::boolean FROM platform_settings WHERE key = 'platform_marketing_seo'),
    google_verified
  ),
  bing_verification = COALESCE(
    (SELECT value->>'bing_verification' FROM platform_settings WHERE key = 'platform_marketing_seo'),
    bing_verification
  ),
  bing_verified = COALESCE(
    (SELECT (value->>'bing_verified')::boolean FROM platform_settings WHERE key = 'platform_marketing_seo'),
    bing_verified
  ),
  sitemap_submitted = COALESCE(
    (SELECT (value->>'sitemap_submitted')::boolean FROM platform_settings WHERE key = 'platform_marketing_seo'),
    sitemap_submitted
  ),
  updated_at = NOW()
WHERE id = 'default';

-- Migrar Google Analytics ID desde pixels
UPDATE platform_seo_config
SET 
  google_analytics_id = COALESCE(
    (SELECT value->>'google_analytics_id' FROM platform_settings WHERE key = 'platform_marketing_pixels'),
    google_analytics_id
  ),
  updated_at = NOW()
WHERE id = 'default';

-- Mostrar los datos migrados
SELECT * FROM platform_seo_config WHERE id = 'default';
