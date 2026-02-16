-- Crear tabla payment_methods si no existe
CREATE TABLE IF NOT EXISTS payment_methods (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE UNIQUE,
  
  -- Efectivo
  cash_enabled BOOLEAN DEFAULT FALSE,
  cash_instructions TEXT DEFAULT '',
  
  -- Tarjeta
  card_enabled BOOLEAN DEFAULT FALSE,
  card_instructions TEXT DEFAULT '',
  
  -- Transferencia bancaria
  transfer_enabled BOOLEAN DEFAULT FALSE,
  transfer_bank_name TEXT DEFAULT '',
  transfer_account_holder TEXT DEFAULT '',
  transfer_cbu TEXT DEFAULT '',
  transfer_alias TEXT DEFAULT '',
  
  -- MercadoPago
  mercadopago_enabled BOOLEAN DEFAULT FALSE,
  mercadopago_link TEXT DEFAULT '',
  mercadopago_access_token TEXT DEFAULT '',
  mercadopago_test_mode BOOLEAN DEFAULT FALSE,
  mercadopago_test_token TEXT DEFAULT '',
  mercadopago_checkout_type TEXT DEFAULT 'redirect',
  
  -- Mobbex
  mobbex_enabled BOOLEAN DEFAULT FALSE,
  mobbex_api_key TEXT DEFAULT '',
  mobbex_access_token TEXT DEFAULT '',
  
  -- MODO
  modo_enabled BOOLEAN DEFAULT FALSE,
  modo_phone TEXT DEFAULT '',
  
  -- Uala
  uala_enabled BOOLEAN DEFAULT FALSE,
  uala_link TEXT DEFAULT '',
  
  -- RapiPago
  rapipago_enabled BOOLEAN DEFAULT FALSE,
  rapipago_instructions TEXT DEFAULT '',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Agregar columnas faltantes si la tabla ya existe
DO $$ 
BEGIN
  -- Efectivo
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payment_methods' AND column_name = 'cash_enabled') THEN
    ALTER TABLE payment_methods ADD COLUMN cash_enabled BOOLEAN DEFAULT FALSE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payment_methods' AND column_name = 'cash_instructions') THEN
    ALTER TABLE payment_methods ADD COLUMN cash_instructions TEXT DEFAULT '';
  END IF;
  
  -- Transferencia
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payment_methods' AND column_name = 'transfer_enabled') THEN
    ALTER TABLE payment_methods ADD COLUMN transfer_enabled BOOLEAN DEFAULT FALSE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payment_methods' AND column_name = 'transfer_bank_name') THEN
    ALTER TABLE payment_methods ADD COLUMN transfer_bank_name TEXT DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payment_methods' AND column_name = 'transfer_account_holder') THEN
    ALTER TABLE payment_methods ADD COLUMN transfer_account_holder TEXT DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payment_methods' AND column_name = 'transfer_cbu') THEN
    ALTER TABLE payment_methods ADD COLUMN transfer_cbu TEXT DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payment_methods' AND column_name = 'transfer_alias') THEN
    ALTER TABLE payment_methods ADD COLUMN transfer_alias TEXT DEFAULT '';
  END IF;
  
  -- MercadoPago
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payment_methods' AND column_name = 'mercadopago_enabled') THEN
    ALTER TABLE payment_methods ADD COLUMN mercadopago_enabled BOOLEAN DEFAULT FALSE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payment_methods' AND column_name = 'mercadopago_link') THEN
    ALTER TABLE payment_methods ADD COLUMN mercadopago_link TEXT DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payment_methods' AND column_name = 'mercadopago_access_token') THEN
    ALTER TABLE payment_methods ADD COLUMN mercadopago_access_token TEXT DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payment_methods' AND column_name = 'mercadopago_test_mode') THEN
    ALTER TABLE payment_methods ADD COLUMN mercadopago_test_mode BOOLEAN DEFAULT FALSE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payment_methods' AND column_name = 'mercadopago_test_token') THEN
    ALTER TABLE payment_methods ADD COLUMN mercadopago_test_token TEXT DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payment_methods' AND column_name = 'mercadopago_checkout_type') THEN
    ALTER TABLE payment_methods ADD COLUMN mercadopago_checkout_type TEXT DEFAULT 'redirect';
  END IF;
  
  -- Mobbex
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payment_methods' AND column_name = 'mobbex_enabled') THEN
    ALTER TABLE payment_methods ADD COLUMN mobbex_enabled BOOLEAN DEFAULT FALSE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payment_methods' AND column_name = 'mobbex_api_key') THEN
    ALTER TABLE payment_methods ADD COLUMN mobbex_api_key TEXT DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payment_methods' AND column_name = 'mobbex_access_token') THEN
    ALTER TABLE payment_methods ADD COLUMN mobbex_access_token TEXT DEFAULT '';
  END IF;
  
  -- MODO
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payment_methods' AND column_name = 'modo_enabled') THEN
    ALTER TABLE payment_methods ADD COLUMN modo_enabled BOOLEAN DEFAULT FALSE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payment_methods' AND column_name = 'modo_phone') THEN
    ALTER TABLE payment_methods ADD COLUMN modo_phone TEXT DEFAULT '';
  END IF;
  
  -- Uala
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payment_methods' AND column_name = 'uala_enabled') THEN
    ALTER TABLE payment_methods ADD COLUMN uala_enabled BOOLEAN DEFAULT FALSE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payment_methods' AND column_name = 'uala_link') THEN
    ALTER TABLE payment_methods ADD COLUMN uala_link TEXT DEFAULT '';
  END IF;
  
  -- RapiPago
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payment_methods' AND column_name = 'rapipago_enabled') THEN
    ALTER TABLE payment_methods ADD COLUMN rapipago_enabled BOOLEAN DEFAULT FALSE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payment_methods' AND column_name = 'rapipago_instructions') THEN
    ALTER TABLE payment_methods ADD COLUMN rapipago_instructions TEXT DEFAULT '';
  END IF;
  
  -- Tarjeta
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payment_methods' AND column_name = 'card_enabled') THEN
    ALTER TABLE payment_methods ADD COLUMN card_enabled BOOLEAN DEFAULT FALSE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payment_methods' AND column_name = 'card_instructions') THEN
    ALTER TABLE payment_methods ADD COLUMN card_instructions TEXT DEFAULT '';
  END IF;
END $$;

-- Habilitar RLS
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;

-- Eliminar politicas existentes
DROP POLICY IF EXISTS "Usuarios pueden ver sus payment_methods" ON payment_methods;
DROP POLICY IF EXISTS "Usuarios pueden gestionar sus payment_methods" ON payment_methods;

-- Politica para ver
CREATE POLICY "Usuarios pueden ver sus payment_methods"
ON payment_methods FOR SELECT
USING (true);

-- Politica para gestionar
CREATE POLICY "Usuarios pueden gestionar sus payment_methods"
ON payment_methods FOR ALL
USING (true)
WITH CHECK (true);
