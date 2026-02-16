-- Sistema de Templates con actualizaciones en cascada
-- TEMPLATE -> ZAPATOS/ROPA/etc -> Tiendas de clientes

-- Tabla de templates disponibles (zapatos, ropa, perfumes, etc.)
CREATE TABLE IF NOT EXISTS templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(50) UNIQUE NOT NULL, -- "zapatos", "ropa", "perfumes"
  name VARCHAR(100) NOT NULL, -- "Template Zapatos"
  description TEXT,
  current_version VARCHAR(20) DEFAULT '1.0.0',
  variantes JSONB DEFAULT '[]', -- ["34","35","36"] o ["S","M","L","XL"]
  variantes_label VARCHAR(50) DEFAULT 'Talle', -- "Talle", "Tamaño", "Capacidad"
  config JSONB DEFAULT '{}', -- Configuraciones especificas del template
  preview_image TEXT, -- URL de imagen preview
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Historial de versiones de cada template
CREATE TABLE IF NOT EXISTS template_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
  version VARCHAR(20) NOT NULL, -- "1.0.1", "1.0.2"
  title VARCHAR(200) NOT NULL, -- "Agregamos seccion contacto"
  changelog TEXT, -- Descripcion detallada de cambios
  breaking_changes BOOLEAN DEFAULT false,
  deployed_to_stores BOOLEAN DEFAULT false, -- Si ya se desplego a las tiendas
  deployed_at TIMESTAMPTZ,
  stores_updated INTEGER DEFAULT 0, -- Cantidad de tiendas actualizadas
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(template_id, version)
);

-- Agregar columna template_id a stores si no existe
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'stores' AND column_name = 'template_id') THEN
    ALTER TABLE stores ADD COLUMN template_id UUID REFERENCES templates(id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'stores' AND column_name = 'template_version') THEN
    ALTER TABLE stores ADD COLUMN template_version VARCHAR(20) DEFAULT '1.0.0';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'stores' AND column_name = 'auto_update') THEN
    ALTER TABLE stores ADD COLUMN auto_update BOOLEAN DEFAULT true;
  END IF;
END $$;

-- Historial de actualizaciones por tienda
CREATE TABLE IF NOT EXISTS store_update_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  template_version_id UUID NOT NULL REFERENCES template_versions(id),
  from_version VARCHAR(20),
  to_version VARCHAR(20),
  status VARCHAR(20) DEFAULT 'success', -- 'success', 'failed', 'pending'
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insertar templates iniciales
INSERT INTO templates (slug, name, description, variantes, variantes_label, preview_image) VALUES
  ('template', 'Template Base', 'Template de pruebas y desarrollo. Laboratorio para nuevas ideas.', '[]', 'Variante', '/templates/template-base.jpg'),
  ('zapatos', 'Template Zapatos', 'Ideal para zapaterias, tiendas de calzado y botas.', '["34","35","36","37","38","39","40","41","42","43","44"]', 'Talle', '/templates/zapatos.jpg'),
  ('ropa', 'Template Ropa', 'Perfecto para indumentaria, remeras, pantalones y moda en general.', '["XS","S","M","L","XL","XXL","XXXL"]', 'Talle', '/templates/ropa.jpg'),
  ('perfumes', 'Template Perfumes', 'Para perfumerias y cosmeticos con diferentes presentaciones.', '["30ml","50ml","100ml","150ml","200ml"]', 'Tamaño', '/templates/perfumes.jpg'),
  ('electronicos', 'Template Electronicos', 'Tiendas de tecnologia, celulares, computadoras y accesorios.', '["Negro","Blanco","Gris","Azul"]', 'Color', '/templates/electronicos.jpg')
ON CONFLICT (slug) DO NOTHING;

-- Insertar version inicial para cada template
INSERT INTO template_versions (template_id, version, title, changelog)
SELECT id, '1.0.0', 'Version inicial', 'Lanzamiento inicial del template'
FROM templates
ON CONFLICT (template_id, version) DO NOTHING;

-- Habilitar RLS
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE template_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_update_history ENABLE ROW LEVEL SECURITY;

-- Politicas
CREATE POLICY "Anyone can view templates" ON templates FOR SELECT USING (true);
CREATE POLICY "Anyone can view template versions" ON template_versions FOR SELECT USING (true);
CREATE POLICY "Stores can view their update history" ON store_update_history FOR SELECT USING (true);

-- Indices para performance
CREATE INDEX IF NOT EXISTS idx_template_versions_template_id ON template_versions(template_id);
CREATE INDEX IF NOT EXISTS idx_stores_template_id ON stores(template_id);
CREATE INDEX IF NOT EXISTS idx_store_update_history_store_id ON store_update_history(store_id);
