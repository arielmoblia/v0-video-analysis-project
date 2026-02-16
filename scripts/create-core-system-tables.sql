-- Sistema de Templates Hibrido
-- Core: Se actualiza automaticamente en todas las tiendas
-- Diseño: Personalizacion individual de cada tienda

-- Tabla de versiones del core
CREATE TABLE IF NOT EXISTS core_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  version VARCHAR(20) NOT NULL,
  changelog TEXT,
  features JSONB DEFAULT '[]',
  breaking_changes BOOLEAN DEFAULT false,
  released_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de configuracion de diseño por tienda (NO se actualiza automaticamente)
CREATE TABLE IF NOT EXISTS store_design_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  
  -- Colores personalizados
  color_primario VARCHAR(7) DEFAULT '#000000',
  color_secundario VARCHAR(7) DEFAULT '#ffffff',
  color_acento VARCHAR(7) DEFAULT '#22c55e',
  color_fondo VARCHAR(7) DEFAULT '#ffffff',
  color_texto VARCHAR(7) DEFAULT '#1a1a1a',
  
  -- Tipografia
  fuente_titulos VARCHAR(100) DEFAULT 'Inter',
  fuente_cuerpo VARCHAR(100) DEFAULT 'Inter',
  
  -- Logo y branding
  logo_url TEXT,
  favicon_url TEXT,
  
  -- Layout
  layout_header VARCHAR(50) DEFAULT 'default',
  layout_footer VARCHAR(50) DEFAULT 'default',
  layout_productos VARCHAR(50) DEFAULT 'grid',
  productos_por_fila INTEGER DEFAULT 4,
  
  -- Estilos personalizados (CSS custom)
  custom_css TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(store_id)
);

-- Tabla de features del core habilitadas por tienda
CREATE TABLE IF NOT EXISTS store_core_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  
  -- Features del CORE (se actualizan automaticamente)
  checkout_enabled BOOLEAN DEFAULT true,
  mercadopago_enabled BOOLEAN DEFAULT true,
  stripe_enabled BOOLEAN DEFAULT false,
  carrito_enabled BOOLEAN DEFAULT true,
  wishlist_enabled BOOLEAN DEFAULT false,
  reviews_enabled BOOLEAN DEFAULT false,
  chat_enabled BOOLEAN DEFAULT false,
  analytics_enabled BOOLEAN DEFAULT true,
  seo_enabled BOOLEAN DEFAULT true,
  envios_andreani BOOLEAN DEFAULT false,
  envios_oca BOOLEAN DEFAULT false,
  notificaciones_email BOOLEAN DEFAULT true,
  notificaciones_whatsapp BOOLEAN DEFAULT false,
  
  -- Version del core que usa esta tienda
  core_version VARCHAR(20) DEFAULT '1.0.0',
  auto_update BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(store_id)
);

-- Tabla de actualizaciones pendientes (cuando hay breaking changes)
CREATE TABLE IF NOT EXISTS store_pending_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  from_version VARCHAR(20) NOT NULL,
  to_version VARCHAR(20) NOT NULL,
  requires_action BOOLEAN DEFAULT false,
  action_description TEXT,
  applied BOOLEAN DEFAULT false,
  applied_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insertar version inicial del core
INSERT INTO core_versions (version, changelog, features) VALUES 
('1.0.0', 'Version inicial del core tol.ar', '["checkout", "carrito", "mercadopago", "seo_basico", "analytics"]');

-- Indices para mejor performance
CREATE INDEX IF NOT EXISTS idx_store_design_config_store_id ON store_design_config(store_id);
CREATE INDEX IF NOT EXISTS idx_store_core_features_store_id ON store_core_features(store_id);
CREATE INDEX IF NOT EXISTS idx_store_pending_updates_store_id ON store_pending_updates(store_id);

-- RLS Policies
ALTER TABLE store_design_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_core_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_pending_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE core_versions ENABLE ROW LEVEL SECURITY;

-- Politicas para que cada tienda solo vea su config
CREATE POLICY "Stores can view design config" ON store_design_config
  FOR ALL USING (true);

CREATE POLICY "Stores can view core features" ON store_core_features
  FOR ALL USING (true);

CREATE POLICY "Stores can view pending updates" ON store_pending_updates
  FOR ALL USING (true);

CREATE POLICY "Anyone can view core versions" ON core_versions
  FOR SELECT USING (true);
