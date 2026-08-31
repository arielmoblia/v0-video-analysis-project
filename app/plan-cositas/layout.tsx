import { createClient } from "@supabase/supabase-js"
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
export async function generateMetadata() {
  const { data } = await supabase
    .from("seo_pages")
    .select("noindex, meta_title, meta_description")
    .eq("id", "plan-cositas")
    .single()
  if (data?.noindex) {
    return { robots: { index: false, follow: false } }
  }
  return {
    title: data?.meta_title || "Plan Cositas | Funcionalidades para tu tienda online",
    description: data?.meta_description || "Agregá galería de fotos, SEO profesional, precios en dólares y más a tu tienda online. Desde $1 USD por mes. Sin paquetes cerrados. Sin letra chica.",
    alternates: { canonical: "https://tol.ar/plan-cositas" },
  }
}
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
