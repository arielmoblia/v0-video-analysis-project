import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function generateMetadata() {
  const { data } = await supabase
    .from("seo_pages")
    .select("noindex")
    .eq("id", "comparar-tiendanube")
    .single()

  if (data?.noindex) {
    return { robots: { index: false, follow: false } }
  }
  return {}
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
