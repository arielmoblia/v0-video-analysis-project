import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export function createPageMetadata(pageId: string) {
  return {
    generateMetadata: async () => {
      const { data } = await supabase
        .from("seo_pages")
        .select("noindex, meta_title, meta_description, url")
        .eq("id", pageId)
        .single()

      if (data?.noindex) {
        return { robots: { index: false, follow: false } }
      }

      return {
        title: data?.meta_title || undefined,
        description: data?.meta_description || undefined,
        alternates: {
          canonical: data?.url ? `https://tol.ar${data.url}` : undefined,
        },
      }
    }
  }
}
