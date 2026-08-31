import { NextResponse } from "next/server"
import { rmSync, existsSync } from "fs"
import { join } from "path"
import { createClient } from "@supabase/supabase-js"
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
export async function POST(req: Request) {
  const { url } = await req.json()
  if (!url) return NextResponse.json({ error: "Falta url" }, { status: 400, headers: { "Cache-Control": "no-store" } })
  // Protección — no permitir borrar páginas críticas
  const protegidas = ["/", "/admin", "/admin2", "/api", "/checkout", "/tienda", "/producto"]
  if (protegidas.includes(url) || protegidas.some(p => url.startsWith(p + "/"))) {
    return NextResponse.json({ error: "No se puede borrar páginas del sistema" }, { status: 403, headers: { "Cache-Control": "no-store" } })
  }
  // 1. Borrar carpeta en dev (cwd = /var/www/tol.ar-dev)
  const pageDirDev = join(process.cwd(), "app", url)
  if (existsSync(pageDirDev)) {
    rmSync(pageDirDev, { recursive: true, force: true })
  }
  // 2. Borrar carpeta en prod
  const pageDirProd = join("/var/www/tol.ar/app", url)
  if (existsSync(pageDirProd)) {
    rmSync(pageDirProd, { recursive: true, force: true })
  }
  // 3. Limpiar caché .next de prod
  const nextCacheProd = join("/var/www/tol.ar/.next/server/app", url)
  if (existsSync(nextCacheProd)) {
    rmSync(nextCacheProd, { recursive: true, force: true })
  }
  // 4. Borrar fila de Supabase
  await supabase.from("seo_pages").delete().eq("url", url)
  return NextResponse.json({ ok: true, msg: "Página eliminada de dev, prod y Supabase" }, { headers: { "Cache-Control": "no-store" } })
}
