-- Crear tabla para guardar tiendas borradas por inactividad
CREATE TABLE IF NOT EXISTS deleted_stores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  original_store_id UUID,
  username TEXT,
  email TEXT,
  subdomain TEXT,
  site_title TEXT,
  template TEXT,
  plan TEXT,
  created_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_reason TEXT DEFAULT 'inactividad',
  last_login TIMESTAMPTZ
);

-- Crear indice para busquedas rapidas
CREATE INDEX IF NOT EXISTS idx_deleted_stores_deleted_at ON deleted_stores(deleted_at DESC);
CREATE INDEX IF NOT EXISTS idx_deleted_stores_subdomain ON deleted_stores(subdomain);
