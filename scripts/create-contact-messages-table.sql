-- Tabla para guardar mensajes de contacto de tol.ar
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  subject VARCHAR(500) NOT NULL,
  message TEXT NOT NULL,
  tipo VARCHAR(50) DEFAULT 'tecnico', -- tecnico, comercial
  status VARCHAR(50) DEFAULT 'pendiente', -- pendiente, leido, respondido, archivado
  responded_at TIMESTAMP WITH TIME ZONE,
  response_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index para busquedas
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created ON contact_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_tipo ON contact_messages(tipo);

-- RLS
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Solo admin puede ver/modificar
CREATE POLICY "Admin can manage contact messages" ON contact_messages
  FOR ALL USING (true);
