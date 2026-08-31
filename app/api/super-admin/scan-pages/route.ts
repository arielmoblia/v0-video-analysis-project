import { NextResponse } from "next/server"
import { readdirSync, existsSync } from "fs"
import { join } from "path"

const EXCLUDED = ["api", "arielmobilia", "tienda", "producto", "(home)", "_next", "node_modules", "admin", "admin2", "checkout", "cositas", "pagos", "migrar"]

function scanPages(dir: string, basePath = ""): string[] {
  const results: string[] = []
  try {
    const entries = readdirSync(dir, { withFileTypes: true })
    for (const entry of entries) {
      if (!entry.isDirectory()) continue
      if (EXCLUDED.includes(entry.name)) continue
      if (entry.name.startsWith("_") || entry.name.startsWith(".")) continue
      if (entry.name.startsWith("[")) continue // rutas dinámicas
      const fullPath = join(dir, entry.name)
      const urlPath = `${basePath}/${entry.name}`
      if (existsSync(join(fullPath, "page.tsx")) || existsSync(join(fullPath, "page.ts"))) {
        results.push(urlPath)
      }
      // buscar subpáginas
      results.push(...scanPages(fullPath, urlPath))
    }
  } catch {}
  return results
}

export async function GET() {
  const appDir = join(process.cwd(), "app")
  const urls = scanPages(appDir)
  const allUrls = ["/", ...urls]
  return NextResponse.json({ urls: allUrls }, { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } })
}
