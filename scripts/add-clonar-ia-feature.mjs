import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

// No es una cosita pública del Plan Cositas (is_active:false, no aparece en
// /plan-cositas ni en "Todas las Cositas" de otras tiendas): es el catálogo de
// modalidades de clonado (portada sola, catálogo sin diseño, sistema vacío,
// snapshot completo, parte puntual, marca propia, dropshipping) que se activa
// a mano solo en la tienda clonar.tol.ar. No confundir con la cosita
// "theme_custom_url" (clonado automático de portada por IA, $10, ya existe y
// está disponible para cualquier tienda desde Modelos/Templates).
const FEATURE_CODE = "clonar_ia_catalogo"

const { data: existingFeature } = await supabase
  .from("store_features")
  .select("code")
  .eq("code", FEATURE_CODE)
  .maybeSingle()

const featureRow = {
  code: FEATURE_CODE,
  name: "Clonar con IA",
  description: "Catálogo de modalidades de clonado (portada sola, catálogo sin diseño, sistema vacío, snapshot completo, parte puntual, marca propia, dropshipping sincronizado) para gestionar pedidos de clientes.",
  price: 0,
  icon: "Wand2",
  is_active: false,
}

const { error: featureError } = existingFeature
  ? await supabase.from("store_features").update(featureRow).eq("code", FEATURE_CODE)
  : await supabase.from("store_features").insert(featureRow)

if (featureError) {
  console.error("Error creando/actualizando feature:", featureError)
  process.exit(1)
}
console.log(`OK: feature ${FEATURE_CODE} ${existingFeature ? "actualizada" : "creada"}`)

const { data: store, error: storeError } = await supabase
  .from("stores")
  .select("id")
  .eq("subdomain", "clonar")
  .single()

if (storeError || !store) {
  console.error("Error: no se encontró la tienda 'clonar'", storeError)
  process.exit(1)
}

const { error: activateError } = await supabase
  .from("store_purchased_features")
  .upsert(
    {
      store_id: store.id,
      feature_code: FEATURE_CODE,
      is_active: true,
      is_gifted: true,
      activated_at: new Date().toISOString(),
    },
    { onConflict: "store_id,feature_code" },
  )

if (activateError) {
  console.error("Error activando la feature en la tienda clonar:", activateError)
  process.exit(1)
}
console.log(`OK: feature ${FEATURE_CODE} activada en la tienda clonar (store_id=${store.id})`)
