-- Crear tabla store_legal_content si no existe
-- Guarda SOLO lo que una tienda edito de sus paginas legales (terminos, privacidad, devoluciones).
-- Si una tienda no tiene fila para una key, esa key hereda el default de tol.ar (tabla page_content).
CREATE TABLE IF NOT EXISTS store_legal_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  page TEXT NOT NULL,
  key TEXT NOT NULL,
  value TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(store_id, page, key)
);

CREATE INDEX IF NOT EXISTS idx_store_legal_content_store_page
ON store_legal_content(store_id, page);

-- Habilitar RLS
ALTER TABLE store_legal_content ENABLE ROW LEVEL SECURITY;

-- Eliminar politicas existentes si existen
DROP POLICY IF EXISTS "Lectura publica de contenido legal" ON store_legal_content;
DROP POLICY IF EXISTS "API gestiona contenido legal" ON store_legal_content;

-- Politica para leer (paginas legales son publicas)
CREATE POLICY "Lectura publica de contenido legal"
ON store_legal_content FOR SELECT
USING (true);

-- Politica para insertar/actualizar (solo desde API server, con service role)
CREATE POLICY "API gestiona contenido legal"
ON store_legal_content FOR ALL
USING (true)
WITH CHECK (true);
