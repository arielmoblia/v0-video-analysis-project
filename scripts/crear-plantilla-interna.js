// Crea la tienda plantilla interna para clonado: estructura completa de
// producto/carrito/checkout (el ecommerce estándar de tol.ar) pero sin
// ningún producto ni categoría cargada. Es la base limpia que se usa como
// destino cuando se clona el diseño de una tienda externa (clone-index en
// scraping.tol.ar), para no repetir el bug de prueba99 (productos de
// perfumería del template "cosmetics" mezclados con el clonado de Pink).
//
// No se muestra a clientes: is_active=false la saca del sitemap, y
// plan='templates' la excluye de los conteos de "tiendas activas" usados
// en marketing/outreach. plan_features.es_plantilla_interna=true la marca
// para cualquier código futuro que necesite detectarla.
const { createClient } = require("@supabase/supabase-js")

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

function generatePassword(length = 12) {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let password = ""
  for (let i = 0; i < length; i++) password += charset.charAt(Math.floor(Math.random() * charset.length))
  return password
}

async function main() {
  const subdomain = "plantillainterna"

  const { data: existing } = await supabase.from("stores").select("id").eq("subdomain", subdomain).single()
  if (existing) {
    console.log("Ya existe, no se crea de nuevo:", existing.id)
    return
  }

  const { data: store, error } = await supabase
    .from("stores")
    .insert({
      subdomain,
      site_title: "Plantilla Interna (no publicar)",
      email: "plantilla-interna@tol.ar",
      username: "plantillainterna",
      admin_password: generatePassword(16),
      template: "base",
      template_type: "base",
      status: "active",
      plan: "templates",
      is_trial: false,
      is_active: false,
      allow_indexing: false,
      plan_features: { es_plantilla_interna: true, analytics: false },
    })
    .select()
    .single()

  if (error) {
    console.error("Error creando tienda plantilla interna:", error)
    process.exit(1)
  }

  console.log("Creada:", store.id, store.subdomain)
}

main()
