-- Tabla dedicada para configuracion SEO de la plataforma tol.ar
-- Esto evita que los datos se pierdan al usar la tabla generica platform_settings

CREATE TABLE IF NOT EXISTS platform_seo_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Meta tags basicos
  site_title TEXT DEFAULT 'tol.ar - Creá tu tienda online gratis',
  site_description TEXT DEFAULT 'Hacé tu tienda online en 2 minutos. Sin conocimientos técnicos. Empezá a vender hoy.',
  keywords TEXT DEFAULT 'tienda online, ecommerce, vender online, crear tienda',
  
  -- Google
  google_analytics_id TEXT,
  google_verification TEXT,
  google_verified BOOLEAN DEFAULT FALSE,
  
  -- Bing
  bing_verification TEXT,
  bing_verified BOOLEAN DEFAULT FALSE,
  
  -- Sitemap
  sitemap_submitted BOOLEAN DEFAULT FALSE,
  sitemap_last_generated TIMESTAMPTZ,
  
  -- Meta Pixel (Facebook)
  meta_pixel_id TEXT,
  
  -- TikTok Pixel
  tiktok_pixel_id TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insertar fila inicial si no existe
INSERT INTO platform_seo_config (id)
VALUES ('00000000-0000-0000-0000-000000000001')
ON CONFLICT (id) DO NOTHING;

-- Indice para busquedas rapidas
CREATE INDEX IF NOT EXISTS idx_platform_seo_config_id ON platform_seo_config(id);
