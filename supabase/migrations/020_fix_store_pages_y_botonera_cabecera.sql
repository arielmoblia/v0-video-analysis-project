-- 1) Arregla store_pages: la tabla real en Supabase quedó creada con otras
-- columnas (active, sin display_order/updated_at) que NO coinciden con las
-- que usa todo el código (lib/services/store-pages.ts, app/api/admin/store-pages/*,
-- components/admin/store-pages-manager.tsx), que esperan is_published,
-- display_order y updated_at tal como las define 018_store_pages.sql. Por este
-- desfasaje, crear o listar páginas desde el panel tiraba error 500 real
-- (columna inexistente) — la "botonera" nunca llegó a funcionar en ningún
-- temple, ni siquiera en Moderno, que ya la tenía conectada en el header.
ALTER TABLE public.store_pages
  ADD COLUMN IF NOT EXISTS is_published BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS display_order INT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

-- La tabla había quedado con Row Level Security prendido sin ninguna política
-- (visible en \d store_pages). El servicio siempre entra con la service role
-- key (bypassea RLS igual), pero para que quede como el resto de las tablas
-- de este mismo patrón (store_pages fue pensada "sin RLS, control por
-- server" según el comentario de 018_store_pages.sql) se apaga explícito.
ALTER TABLE public.store_pages DISABLE ROW LEVEL SECURITY;

-- 2) Cosita nueva: "Botonera Cabecera" ($1 USD/mes, páginas propias sin
-- límite en el menú de la tienda — Quiénes somos, Cómo comprar, Guía de
-- talles, etc.). Antes de esto, crear páginas en el panel era gratis para
-- cualquier tienda (el tab "Páginas" no tenía ningún candado); pasa a ser
-- paga como el resto de las cositas.
-- store_features no tiene constraint UNIQUE en code (confirmado con \d), por
-- eso el guard de "ya existe" va con WHERE NOT EXISTS en vez de ON CONFLICT.
INSERT INTO public.store_features (code, name, description, price, icon, is_active, categoria, price_type)
SELECT 'botonera_cabecera', 'Botonera Cabecera',
  'Agregá un menú con páginas propias (Quiénes somos, Cómo comprar, Guía de talles, etc.) en la cabecera de tu tienda. Páginas ilimitadas.',
  1.00, 'FileText', true, 'Producción', 'mes'
WHERE NOT EXISTS (SELECT 1 FROM public.store_features WHERE code = 'botonera_cabecera');

-- Verificar:
-- SELECT * FROM store_features WHERE code = 'botonera_cabecera';
-- SELECT column_name FROM information_schema.columns WHERE table_name = 'store_pages';
