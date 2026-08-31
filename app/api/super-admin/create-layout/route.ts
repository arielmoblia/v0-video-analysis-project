import { NextResponse } from "next/server"
import { writeFileSync, mkdirSync, existsSync } from "fs"
import { join } from "path"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  const { pageId, url } = await req.json()
  if (!pageId || !url) return NextResponse.json({ error: "Faltan datos" }, { status: 400, headers: { "Cache-Control": "no-store" } })

  // 1. Verificar/crear fila en seo_pages
  const { data: existing } = await supabase
    .from("seo_pages")
    .select("id")
    .eq("url", url)
    .maybeSingle()

  let actualId = existing?.id
  if (!existing) {
    // Crear fila nueva con el pageId
    const { error } = await supabase
      .from("seo_pages")
      .insert({ id: pageId, url, noindex: true, show_in_header: false, show_in_footer: false })
    if (error) return NextResponse.json({ error: "Error creando en Supabase: " + error.message }, { status: 500, headers: { "Cache-Control": "no-store" } })
    actualId = pageId
  }

  // 2. Crear el layout.tsx con el ID real de Supabase
  const appDir = join(process.cwd(), "app")
  const pageDir = join(appDir, url)
  const layoutPath = join(pageDir, "layout.tsx")

  if (!existsSync(pageDir)) mkdirSync(pageDir, { recursive: true })
  if (existsSync(layoutPath)) return NextResponse.json({ ok: true, msg: "Ya existe" }, { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } })

  const fileContent = `import { createPageMetadata } from "@/lib/page-metadata"
export const { generateMetadata } = createPageMetadata("${actualId}")
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
`
  writeFileSync(layoutPath, fileContent)
  return NextResponse.json({ ok: true, msg: "Layout creado" }, { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } })
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const url = searchParams.get("url")
  if (!url) return NextResponse.json({ exists: false }, { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } })
  
  const { existsSync } = await import("fs")
  const { join } = await import("path")
  const layoutPath = join(process.cwd(), "app", url, "layout.tsx")
  return NextResponse.json({ exists: existsSync(layoutPath, { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } }) }, { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } })
}

export async function DELETE(req: Request) {
  const { url } = await req.json()
  if (!url) return NextResponse.json({ error: "Falta url" }, { status: 400 })

  const { unlinkSync, existsSync } = await import("fs")
  const { join } = await import("path")
  const layoutPath = join(process.cwd(), "app", url, "layout.tsx")

  if (!existsSync(layoutPath)) return NextResponse.json({ ok: true, msg: "No existía" }, { headers: { "Cache-Control": "no-store" } })

  unlinkSync(layoutPath)
  return NextResponse.json({ ok: true, msg: "Layout eliminado" }, { headers: { "Cache-Control": "no-store" } })
}
