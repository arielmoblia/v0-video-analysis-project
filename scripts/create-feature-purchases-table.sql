-- Tabla para guardar las compras de features (cositas)
CREATE TABLE IF NOT EXISTS feature_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  features JSONB NOT NULL DEFAULT '[]',
  amount_ars DECIMAL(10,2) NOT NULL,
  amount_usd DECIMAL(10,2),
  external_reference TEXT UNIQUE,
  payment_id TEXT,
  payment_method TEXT NOT NULL DEFAULT 'mercadopago',
  status TEXT NOT NULL DEFAULT 'pending',
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indices
CREATE INDEX IF NOT EXISTS idx_feature_purchases_store ON feature_purchases(store_id);
CREATE INDEX IF NOT EXISTS idx_feature_purchases_status ON feature_purchases(status);
CREATE INDEX IF NOT EXISTS idx_feature_purchases_external_ref ON feature_purchases(external_reference);

-- RLS
ALTER TABLE feature_purchases ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own purchases" ON feature_purchases;
CREATE POLICY "Users can view own purchases"
ON feature_purchases FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own purchases" ON feature_purchases;
CREATE POLICY "Users can insert own purchases"
ON feature_purchases FOR INSERT
WITH CHECK (auth.uid() = user_id);
