import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

const { data: existing } = await supabase.from("store_features").select("code").eq("code", "theme_custom_url").maybeSingle()

const row = {
  code: "theme_custom_url",
  name: "Diseño Nuevo/Propio (por link)",
  description: "Pago único por armar un modelo de tienda a medida, copiando el estilo real de una página que elijas.",
  full_description:
    "Pegás el link de una tienda que te gusta y armamos un modelo nuevo con ese estilo (HTML, colores, tipografía), usando tus productos y fotos reales. Se cobra una sola vez por pedido, además de tu plan de Modelos/Templates.",
  price: 5,
  price_type: "unica",
  icon: "Globe",
  categoria: "Producción",
  trial_days: 0,
  is_active: true,
}

const { error } = existing
  ? await supabase.from("store_features").update(row).eq("code", "theme_custom_url")
  : await supabase.from("store_features").insert(row)

if (error) {
  console.error("Error:", error)
  process.exit(1)
}
console.log(`OK: feature theme_custom_url ${existing ? "actualizada" : "creada"}`)
