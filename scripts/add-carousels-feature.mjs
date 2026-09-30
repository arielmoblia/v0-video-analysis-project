import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

const { data: existing } = await supabase.from("store_features").select("code").eq("code", "carousels").maybeSingle()

const row = {
  code: "carousels",
  name: "Carruseles",
  description:
    "Agregá una franja de productos destacados que se desliza y/o una franja de texto con frases que van rotando (promociones, envíos, redes). Aparecen debajo del banner de tu portada.",
  price: 2,
  icon: "GalleryHorizontal",
  is_active: true,
}

const { error } = existing
  ? await supabase.from("store_features").update(row).eq("code", "carousels")
  : await supabase.from("store_features").insert(row)

if (error) {
  console.error("Error:", error)
  process.exit(1)
}
console.log(`OK: feature carousels ${existing ? "actualizada" : "creada"}`)
