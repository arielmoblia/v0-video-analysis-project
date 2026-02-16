-- Tabla para alertas y notificaciones de SEO
CREATE TABLE IF NOT EXISTS seo_alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tipo VARCHAR(50) NOT NULL, -- 'update', 'warning', 'tip', 'new_feature'
  titulo VARCHAR(255) NOT NULL,
  mensaje TEXT NOT NULL,
  prioridad VARCHAR(20) DEFAULT 'normal', -- 'low', 'normal', 'high', 'urgent'
  para_tiendas BOOLEAN DEFAULT false, -- Si aplica a tiendas individuales
  para_admin BOOLEAN DEFAULT true, -- Si aplica al super admin
  activa BOOLEAN DEFAULT true,
  fecha_inicio TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  fecha_fin TIMESTAMP WITH TIME ZONE, -- Opcional, para alertas temporales
  link_accion VARCHAR(255), -- URL opcional para mas info
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para trackear alertas leidas por usuario
CREATE TABLE IF NOT EXISTS seo_alerts_leidas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  alert_id UUID REFERENCES seo_alerts(id) ON DELETE CASCADE,
  user_id UUID, -- NULL para super admin
  tienda_id UUID, -- ID de tienda opcional
  leida_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(alert_id, user_id, tienda_id)
);

-- Insertar algunas alertas iniciales
INSERT INTO seo_alerts (tipo, titulo, mensaje, prioridad, para_admin) VALUES
('tip', 'Google Search Console conectado', 'Tu sitio esta verificado en Google Search Console. En unos dias empezaras a ver datos de busquedas.', 'normal', true),
('tip', 'Google Analytics 4 activo', 'Analytics esta trackeando visitas. Revisa el panel de Tiempo Real para ver visitantes en vivo.', 'normal', true),
('new_feature', 'SEO Profesional disponible', 'Ahora podes ofrecer SEO Profesional a tus clientes como una "cosita". Incluye meta tags, sitemap, JSON-LD y reportes.', 'high', true);

-- Indices para performance
CREATE INDEX IF NOT EXISTS idx_seo_alerts_activa ON seo_alerts(activa);
CREATE INDEX IF NOT EXISTS idx_seo_alerts_leidas_alert ON seo_alerts_leidas(alert_id);
