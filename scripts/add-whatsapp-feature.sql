-- Agregar feature de Chat WhatsApp al plan Cositas
INSERT INTO store_features (code, name, description, price, icon, is_active)
VALUES (
  'whatsapp_chat',
  'Chat de WhatsApp',
  'Muestra un botón flotante de WhatsApp en tu tienda para que tus clientes te contacten directamente.',
  1.00,
  'MessageCircle',
  true
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  icon = EXCLUDED.icon;

-- Agregar campo whatsapp_number a stores si no existe
ALTER TABLE stores ADD COLUMN IF NOT EXISTS whatsapp_number TEXT;
