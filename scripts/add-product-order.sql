-- Agregar campo display_order a la tabla products
ALTER TABLE products ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Actualizar productos existentes con un orden basado en created_at
UPDATE products 
SET display_order = sub.row_num
FROM (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY store_id ORDER BY created_at) as row_num
  FROM products
) as sub
WHERE products.id = sub.id AND products.display_order = 0;
