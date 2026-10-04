import type { Store } from "@/lib/types"

interface ClonedChrome {
  headerHtml: string
  footerHtml: string
  stylesheetHrefs: string[]
  inlineStyles: string[]
}

// Extrae un tag balanceado (ej. todo el <header>...</header>) de un string de
// HTML ya sanitizado. No usamos un parser DOM acá (este archivo corre en
// server components, sin cheerio como dependencia de tol.ar) — alcanza con
// contar aperturas/cierres del mismo tag, igual que hace cualquier parser
// real para tags sin auto-cierre.
function extractBalancedTag(html: string, tagName: string): string | null {
  const openRe = new RegExp(`<${tagName}(?:\\s[^>]*)?>`, "i")
  const openMatch = openRe.exec(html)
  if (!openMatch) return null

  const tagRe = new RegExp(`<(/?)${tagName}(?:\\s[^>]*)?>`, "gi")
  tagRe.lastIndex = openMatch.index + openMatch[0].length
  let depth = 1
  let match: RegExpExecArray | null
  while ((match = tagRe.exec(html))) {
    depth += match[1] === "/" ? -1 : 1
    if (depth === 0) {
      return html.slice(openMatch.index, tagRe.lastIndex)
    }
  }
  return null
}

// El "Clonado de Index" (store.plan_features.cloned_index, ver
// store-cloned-index-live.tsx) guarda el body entero del sitio scrapeado como
// un solo blob de HTML — header y footer del diseño real del cliente van
// adentro, pegados al resto. Las rutas que no son el index (/pagina/[slug],
// /categoria/[slug], /producto/[slug], /cuenta, /privacidad, /terminos,
// /devoluciones) necesitan ESE mismo header/footer, no el genérico de tol.ar
// — si no, el cliente ve su tienda con dos diseños distintos según en qué
// página esté (bug real reportado en pinkonlineoficial.tol.ar: el botón
// "Contacto" del menú clonado llevaba a una página con header/footer
// genéricos). sanitizeClonedDom (clone-store.ts) nunca saca los tags
// <header>/<footer>, así que separarlos acá es solo extraerlos del HTML ya
// guardado, sin volver a scrapear nada.
export function getClonedChrome(store: Store): ClonedChrome | null {
  const cloned = store.plan_features?.cloned_index
  if (!cloned?.active || !cloned.html) return null

  const headerHtml = extractBalancedTag(cloned.html, "header")
  const footerHtml = extractBalancedTag(cloned.html, "footer")
  if (!headerHtml || !footerHtml) return null

  return {
    headerHtml,
    footerHtml,
    stylesheetHrefs: cloned.stylesheetHrefs || [],
    inlineStyles: cloned.inlineStyles || [],
  }
}
