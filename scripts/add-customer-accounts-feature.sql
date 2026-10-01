-- Agregar feature de cuentas de cliente (login/registro propio para el comprador final,
-- con historial de pedidos y listado de clientes con gasto para el dueño) al plan Cositas
INSERT INTO store_features (code, name, description, price, icon, is_active)
VALUES (
  'customer_accounts',
  'Cuentas de Clientes',
  'Tus clientes se registran con email y contraseña, ven su historial de pedidos y cambian su contraseña. Vos ves el listado completo con cuánto gastó cada uno, para mandarles promos.',
  1,
  'Users',
  true
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  icon = EXCLUDED.icon,
  is_active = EXCLUDED.is_active;
