-- Agregar cargo por "Nuevo/Propio": armar un modelo a medida desde un link, pago único
-- Nota: store_features.code no tiene constraint UNIQUE en la base, por eso no se puede usar
-- ON CONFLICT acá. Para aplicar esto se usó scripts/add-theme-custom-url-feature.mjs (Node,
-- vía supabase-js), que primero chequea si el code ya existe antes de insertar/actualizar.
INSERT INTO store_features (code, name, description, full_description, price, price_type, icon, categoria, trial_days, is_active)
VALUES (
  'theme_custom_url',
  'Diseño Nuevo/Propio (por link)',
  'Pago único por armar un modelo de tienda a medida, copiando el estilo real de una página que elijas.',
  'Pegás el link de una tienda que te gusta y armamos un modelo nuevo con ese estilo (HTML, colores, tipografía), usando tus productos y fotos reales. Se cobra una sola vez por pedido, además de tu plan de Modelos/Templates.',
  5,
  'unica',
  'Globe',
  'Producción',
  0,
  true
);
