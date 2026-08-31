-- Sistema de Reactivación para tiendas inactivas +30 días
-- Agrega columnas a stores para tracking de campañas de reactivación

ALTER TABLE stores 
ADD COLUMN IF NOT EXISTS last_reactivation_campaign TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS reactivation_group VARCHAR(50) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS reactivation_stage INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS reactivation_coupon VARCHAR(100) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS reactivation_coupon_expires TIMESTAMP WITH TIME ZONE DEFAULT NULL,
ADD COLUMN IF NOT EXISTS reactivation_utm_campaign VARCHAR(255) DEFAULT NULL;

COMMENT ON COLUMN stores.last_reactivation_campaign IS 'Fecha del ultimo envio de campaña de reactivacion';
COMMENT ON COLUMN stores.reactivation_group IS 'Grupo de reactivacion: A (sin productos), B (0 ventas), C (ventas bajas), D (problema tecnico)';
COMMENT ON COLUMN stores.reactivation_stage IS 'Etapa actual: 0=sin campaña, 1=te extranamos, 2=oferta, 3=historia de exito, 4=ultimo aviso';
COMMENT ON COLUMN stores.reactivation_coupon IS 'Codigo de cupon personalizado para reactivacion';
COMMENT ON COLUMN stores.reactivation_coupon_expires IS 'Fecha de vencimiento del cupon de reactivacion';

-- Tabla de historial de campañas de reactivacion
CREATE TABLE IF NOT EXISTS reactivation_campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  campaign_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reactivation_group VARCHAR(50) NOT NULL,
  stage INTEGER NOT NULL,
  channel VARCHAR(50) NOT NULL, -- 'email', 'whatsapp'
  coupon_code VARCHAR(100),
  coupon_used BOOLEAN DEFAULT false,
  coupon_used_at TIMESTAMP WITH TIME ZONE,
  opened BOOLEAN DEFAULT false,
  clicked BOOLEAN DEFAULT false,
  reconnected BOOLEAN DEFAULT false,
  reconnected_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reactivation_campaigns_store ON reactivation_campaigns(store_id);
CREATE INDEX IF NOT EXISTS idx_reactivation_campaigns_date ON reactivation_campaigns(campaign_date);
CREATE INDEX IF NOT EXISTS idx_reactivation_campaigns_group ON reactivation_campaigns(reactivation_group);

COMMENT ON TABLE reactivation_campaigns IS 'Historial de todas las campañas de reactivacion enviadas';
COMMENT ON COLUMN reactivation_campaigns.reactivated IS 'Si el usuario volvio a la tienda despues de la campaña';
COMMENT ON COLUMN reactivation_campaigns.reactivated_at IS 'Cuando volvio el usuario';

-- Tabla de cupones de reactivacion
CREATE TABLE IF NOT EXISTS reactivation_coupons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code VARCHAR(100) NOT NULL UNIQUE,
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  discount_type VARCHAR(20) NOT NULL, -- 'percentage', 'free_months', 'feature_upgrade'
  discount_value INTEGER NOT NULL, -- porcentaje o cantidad de meses
  feature_name VARCHAR(100), -- nombre de la cosita si aplica
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT false,
  used_at TIMESTAMP WITH TIME ZONE,
  campaign_id UUID REFERENCES reactivation_campaigns(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reactivation_coupons_code ON reactivation_coupons(code);
CREATE INDEX IF NOT EXISTS idx_reactivation_coupons_store ON reactivation_coupons(store_id);

COMMENT ON TABLE reactivation_coupons IS 'Cupones personalizados para cada campaña de reactivacion';
