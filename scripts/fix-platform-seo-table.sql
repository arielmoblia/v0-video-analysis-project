-- Agregar columna config_key a la tabla platform_seo_config
ALTER TABLE platform_seo_config 
ADD COLUMN IF NOT EXISTS config_key TEXT UNIQUE;

-- Crear indice unico en config_key si no existe
CREATE UNIQUE INDEX IF NOT EXISTS idx_platform_seo_config_key 
ON platform_seo_config(config_key);

-- Insertar configuracion inicial para tol.ar
INSERT INTO platform_seo_config (
  config_key,
  site_title,
  site_description,
  keywords,
  google_analytics_id,
  google_verification,
  google_verified,
  bing_verification,
  bing_verified,
  sitemap_submitted
) VALUES (
  'tol_ar_main',
  'tol.ar - Crea tu tienda online gratis',
  'Hace tu tienda online en 2 minutos. Sin conocimientos tecnicos. Empeza a vender hoy.',
  'tienda online, ecommerce, vender online, crear tienda',
  'G-521395180',
  NULL,
  false,
  NULL,
  false,
  false
) ON CONFLICT (config_key) DO UPDATE SET
  google_analytics_id = COALESCE(EXCLUDED.google_analytics_id, platform_seo_config.google_analytics_id);
