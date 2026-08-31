import { createClient } from "@supabase/supabase-js"
import { unstable_noStore as noStore } from "next/cache"

interface SeoExtraBlockProps {
  page: string
}

async function getSeoExtra(page: string): Promise<string | null> {
  noStore()
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const { data } = await supabase
      .from("page_content")
      .select("value")
      .eq("page", page)
      .eq("key", "seo_extra")
      .single()
    return data?.value || null
  } catch {
    return null
  }
}

export async function SeoExtraBlock({ page }: SeoExtraBlockProps) {
  const content = await getSeoExtra(page)
  if (!content) return null

  const paragraphs = content.split("\n\n").filter(Boolean)

  return (
    <section className="bg-slate-50 border-t border-slate-100 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="prose prose-slate max-w-none text-slate-600 text-sm leading-relaxed space-y-4">
          {paragraphs.map((p, i) => {
            if (p.startsWith("## ")) {
              return <h2 key={i} className="text-lg font-semibold text-slate-800 mt-6 mb-2">{p.replace("## ", "")}</h2>
            }
            if (p.startsWith("### ")) {
              return <h3 key={i} className="text-base font-semibold text-slate-700 mt-4 mb-2">{p.replace("### ", "")}</h3>
            }
            return <p key={i}>{p}</p>
          })}
        </div>
      </div>
    </section>
  )
}
