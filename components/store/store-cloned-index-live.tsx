"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { createPortal } from "react-dom"
import type { Product, Store } from "@/lib/types"
import { formatPrice } from "@/lib/currency"
import type { CarouselBlock } from "@/components/store/store-carousels"

interface ClonedIndexData {
  active: boolean
  sourceUrl: string
  html: string
  stylesheetHrefs: string[]
  inlineStyles: string[]
}

interface StoreClonedIndexLiveProps {
  store: Store
  cloned: ClonedIndexData
  featuredProducts: Product[]
  ofertaDestacadaProducts?: Product[]
  // Catálogo completo (para resolver los productIds de la cosita
  // "Carruseles") + los bloques configurados ahí mismo (panel admin normal,
  // components/admin/carousels-manager.tsx). Opcionales para no romper
  // ningún caller viejo.
  products?: Product[]
  carousels?: CarouselBlock[] | null
}

// Mismo criterio que CAROUSEL_CONTAINER_HINT/markDynamicDestacadosContainer
// en scraping.tol.ar/server/clone-store.ts, pero corrido acá en vez de en el
// motor de clonado: el HTML de prueba99 ya está guardado en la base de datos
// sin estas marcas para ninguna sección salvo "Destacados" (la única que el
// clonado marca hoy), así que para las demás (Novedades, Ofertas, etc.) hay
// que detectarlas en vivo contra el DOM ya pintado, no en el momento del scrapeo.
const CAROUSEL_CONTAINER_HINT = /swiper|slick|splide|glide|owl-carousel|carousel|slider/i

function findCarouselContainers(root: HTMLElement): { el: HTMLElement; title: string }[] {
  const candidates = Array.from(
    root.querySelectorAll<HTMLElement>(
      "[class*='swiper' i], [class*='slick' i], [class*='splide' i], [class*='glide' i], [class*='carousel' i], [class*='slider' i]"
    )
  )
  const results: { el: HTMLElement; title: string }[] = []
  for (const el of candidates) {
    if (!CAROUSEL_CONTAINER_HINT.test(el.className || "")) continue
    if (/brand/i.test(el.className || "")) continue
    const nestedInsideAnother = el.parentElement?.closest(
      "[class*='swiper' i], [class*='slick' i], [class*='splide' i], [class*='glide' i], [class*='carousel' i], [class*='slider' i]"
    )
    if (nestedInsideAnother) continue

    let title = ""
    let prev = el.previousElementSibling
    while (prev) {
      if (/^H[1-4]$/.test(prev.tagName)) {
        title = prev.textContent?.trim() || ""
        break
      }
      prev = prev.previousElementSibling
    }
    if (!title && el.parentElement) {
      const heading = el.parentElement.querySelector(":scope > h1, :scope > h2, :scope > h3, :scope > h4")
      if (heading) title = heading.textContent?.trim() || ""
    }
    if (title) results.push({ el, title })
  }
  return results
}

// Un bloque configurado en la cosita "Carruseles" (panel admin) se conecta a
// una franja real del HTML clonado por título (sin importar mayúsculas):
// coincidencia exacta primero, si no, que uno contenga al otro — así "Ofertas"
// (cloned) matchea con un bloque titulado "Ofertas de la semana" o viceversa.
function matchCarouselBlock<T extends CarouselBlock>(title: string, blocks: T[]): T | null {
  const normalized = title.trim().toLowerCase()
  if (!normalized) return null
  const exact = blocks.find((b) => (b.title || "").trim().toLowerCase() === normalized)
  if (exact) return exact
  const partial = blocks.find((b) => {
    const bt = (b.title || "").trim().toLowerCase()
    return bt && (bt.includes(normalized) || normalized.includes(bt))
  })
  return partial || null
}

function CarouselProductsGrid({ products, subdomain, country }: { products: Product[]; subdomain: string; country?: string | null }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "1.5rem", padding: "1rem 0" }}>
      {products.map((product) => (
        <a
          key={product.id}
          href={`/tienda/${subdomain}/producto/${product.slug}`}
          style={{ display: "block", width: 220, textAlign: "center", textDecoration: "none", color: "inherit" }}
        >
          <img
            src={product.image_url || "/placeholder.svg"}
            alt={product.name}
            style={{ width: "100%", aspectRatio: "1 / 1", objectFit: "cover", borderRadius: 8 }}
          />
          <div style={{ marginTop: "0.5rem", fontSize: "0.95rem" }}>{product.name}</div>
          <div style={{ fontWeight: 600 }}>{formatPrice(product.price, country)}</div>
        </a>
      ))}
    </div>
  )
}

// El motor de clonado (extractSwiperColumnsMap/applySwiperColumnsToWrappers
// en clone-store.ts) ya graba cuántos productos van por fila en
// data-desktop-columns/data-mobile-columns de cada .swiper-wrapper. El
// useEffect de abajo usa ese dato para fijar el ancho real de cada
// producto, pero recién corre después de hidratar en el cliente — en el
// primer pixel pintado (HTML+CSS del servidor) el tema original trae
// ".swiper-slide { width: 100% }" (pensado para que el JS de Swiper, que
// nunca cargamos, mueva un slide a la vez), así que sin esto cada producto
// ocupaba toda la pantalla hasta que el JS "saltaba" al layout correcto
// (bug real visto en prueba99: flash de 1 producto gigante en Destacados
// antes del carrusel completo). Generamos acá las mismas reglas como CSS
// server-rendered para que el ancho correcto esté desde el primer pixel.
// Separación real entre productos del carrusel (antes no había gap ni
// margen entre slides, quedaban pegados uno con otro a diferencia del
// carrusel original). Mismo valor usado acá (CSS server-rendered) y en el
// useEffect de abajo (runtime), para que el ancho de cada producto deje
// lugar al gap y no se corte el último visible.
const CAROUSEL_GAP_REM = 1

const COLUMN_WIDTH_CSS = Array.from({ length: 12 }, (_, i) => i + 1)
  .map((n) => {
    const widthExpr = n === 1 ? "100%" : `calc((100% - ${(n - 1) * CAROUSEL_GAP_REM}rem) / ${n})`
    return [
      `@media (min-width: 768px) { .tol-cloned-index .swiper-wrapper[data-desktop-columns="${n}"] > * { flex: 0 0 ${widthExpr} !important; width: ${widthExpr} !important; } }`,
      `@media (max-width: 767.98px) { .tol-cloned-index .swiper-wrapper[data-mobile-columns="${n}"] > * { flex: 0 0 ${widthExpr} !important; width: ${widthExpr} !important; } }`,
    ].join("\n")
  })
  .join("\n")

// Render del "Clonado de Index": reemplaza TODA la portada (header/menú/grilla)
// por el HTML/CSS clonado del sitio de referencia (armado por
// cloneIndexDesign en scraping.tol.ar/server/clone-store.ts). Los links de
// producto de la grilla clonada ya vienen reescritos a nuestras fichas reales
// (/tienda/{subdomain}/producto/{slug}, productos placeholder "pendiente de
// completar") y el servidor neutraliza (href="#") cualquier otro link que
// apunte al dominio original (menú, redes, etc.) — el listener de abajo es
// una segunda red de contención por si algún link externo se escapa del
// sanitizado del servidor. Primera versión (02/10), solo para prueba99.
export function StoreClonedIndexLive({
  store,
  cloned,
  featuredProducts,
  ofertaDestacadaProducts = [],
  products = [],
  carousels,
}: StoreClonedIndexLiveProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [destacadosNode, setDestacadosNode] = useState<HTMLElement | null>(null)
  const [destacadosOverride, setDestacadosOverride] = useState<Product[] | null>(null)
  const [otherCarouselTargets, setOtherCarouselTargets] = useState<{ el: HTMLElement; products: Product[] }[]>([])

  // useMemo (no un .filter() directo en cada render): sin esto, los efectos
  // de abajo que dependen de productBlocks lo ven como "cambiado" en TODOS
  // los renders (array nuevo aunque el contenido sea igual), entran en loop
  // infinito re-vaciando y re-pintando el contenedor — bug real visto en
  // prueba99 (el portal nunca llegaba a verse, quedaba vacío). Con useMemo,
  // la referencia solo cambia cuando "carousels" (la prop) cambia de verdad.
  const productBlocks = useMemo(
    () =>
      (carousels || []).filter(
        (b): b is CarouselBlock & { productIds: string[] } =>
          b.type === "products" && !!b.productIds && b.productIds.length > 0
      ),
    [carousels]
  )

  // El motor de clonado marca el contenedor de "Destacados" (y solo ese, ver
  // markDynamicDestacadosContainer en clone-store.ts) con data-tol-dynamic-
  // destacados. Si el comerciante configuró un bloque "Destacados" en la
  // cosita "Carruseles" (panel con buscador y checkboxes, hasta 11+
  // productos elegidos a mano), esos son los que se muestran — es el mismo
  // panel que ya usan las tiendas sin clonado. Sin ese bloque, caemos al
  // mecanismo viejo: los 3 productos marcados con la estrella ("Destacar en
  // el inicio"). El resto de la portada clonada (Novedades, Ofertas, Marcas,
  // etc.) se resuelve aparte, ver el useEffect de abajo.
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const node = root.querySelector<HTMLElement>("[data-tol-dynamic-destacados]")
    if (!node) {
      setDestacadosNode(null)
      return
    }
    const heading = (() => {
      let prev = node.previousElementSibling
      while (prev) {
        if (/^H[1-4]$/.test(prev.tagName)) return prev.textContent?.trim() || ""
        prev = prev.previousElementSibling
      }
      return ""
    })()
    const configuredBlock = matchCarouselBlock(heading || "Destacados", productBlocks)
    const configuredProducts = configuredBlock
      ? configuredBlock.productIds.map((id) => products.find((p) => p.id === id)).filter((p): p is Product => !!p)
      : null

    if ((configuredProducts && configuredProducts.length > 0) || featuredProducts.length > 0) {
      node.innerHTML = ""
    }
    setDestacadosOverride(configuredProducts && configuredProducts.length > 0 ? configuredProducts : null)
    setDestacadosNode(node)
  }, [cloned.html, featuredProducts, products, productBlocks])

  // Resto de franjas de carrusel que el HTML clonado trae estáticas
  // (Novedades, Ofertas, etc., con los productos ajenos del sitio original):
  // si el comerciante configuró un bloque con un título que coincide (ver
  // matchCarouselBlock), se reemplaza esa franja puntual por sus propios
  // productos reales de prueba99. Las franjas sin bloque configurado que las
  // matchee quedan intactas, igual que siempre.
  useEffect(() => {
    const root = rootRef.current
    if (!root || productBlocks.length === 0) {
      setOtherCarouselTargets([])
      return
    }
    const destacadosEl = root.querySelector<HTMLElement>("[data-tol-dynamic-destacados]")
    const usedBlockIds = new Set<string>()
    const targets: { el: HTMLElement; products: Product[] }[] = []

    for (const { el, title } of findCarouselContainers(root)) {
      if (el === destacadosEl) continue
      const block = productBlocks.find((b) => !usedBlockIds.has(b.id) && matchCarouselBlock(title, [b]))
      if (!block) continue
      const resolved = block.productIds.map((id) => products.find((p) => p.id === id)).filter((p): p is Product => !!p)
      if (resolved.length === 0) continue
      usedBlockIds.add(block.id)
      el.innerHTML = ""
      targets.push({ el, products: resolved })
    }
    setOtherCarouselTargets(targets)
  }, [cloned.html, products, productBlocks])

  // "Oferta Destacada": 1 producto elegido a mano (panel propio en el admin,
  // distinto de la estrella) mostrado completo (galería, precio con
  // descuento, botón) en el mismo lugar y con el mismo formato que tenía la
  // idea original de Pink (pinkonlineoficial.com.ar): después de la franja
  // "¿No encontraste lo que buscás?" (clase real del tema TiendaNube clonado,
  // .js-section-institutional-home, confirmada en el HTML de prueba99) y
  // antes de "Nuestras marcas" (.section-brands-home). Si el sitio clonado
  // no trae esa franja (otro tema de origen), caemos al mismo lugar que usa
  // "Destacados" como segunda opción, para no dejar el panel sin efecto. Sin
  // producto elegido no se inserta nada — una tienda que nunca usó este
  // panel no ve ningún cambio.
  // Nota: a diferencia de "Destacados" (arriba), este efecto NUNCA llama a
  // setState — solo escribe DOM a mano. Probado en vivo (prueba99, 03/10):
  // cualquier setState acá adentro terminaba en un loop infinito en dev
  // (cada reinserción disparaba un re-render que el motor de Fast Refresh
  // usaba como excusa para volver a pintar TODO el HTML clonado desde cero,
  // lo que borraba el nodo recién insertado, lo que volvía a disparar el
  // setState — así sin parar). Construyendo el contenido a mano y
  // reinsertándolo de forma puramente imperativa evita ese ciclo.
  useEffect(() => {
    const root = rootRef.current
    if (!root || ofertaDestacadaProducts.length === 0) return

    const product = ofertaDestacadaProducts[0]
    const productUrl = `/tienda/${store.subdomain}/producto/${product.slug}`
    const hasDiscount = !!(product.compare_price && product.compare_price > product.price)

    // Vista completa de 1 producto (galería con miniaturas, precio con
    // descuento, botón) — mismo formato que pinkonlineoficial.com.ar. El
    // link entero navega a la ficha real del producto (ahí sí funciona el
    // carrito, talles, etc.): este cuadro es una vidriera, no un carrito
    // embebido.
    const buildContent = (container: HTMLElement) => {
      container.innerHTML = ""

      const wrap = document.createElement("div")
      Object.assign(wrap.style, {
        display: "flex",
        flexWrap: "wrap",
        gap: "2.5rem",
        maxWidth: "900px",
        margin: "0 auto",
        textAlign: "left",
      })

      // --- Galería ---
      const images = ((product.images && product.images.length > 0 ? product.images : [product.image_url]).filter(
        Boolean
      ) as string[]) || []
      if (images.length === 0) images.push("/placeholder.svg")

      const galleryCol = document.createElement("div")
      Object.assign(galleryCol.style, { display: "flex", gap: "0.75rem", flex: "1 1 320px" })

      const mainImgLink = document.createElement("a")
      mainImgLink.href = productUrl
      Object.assign(mainImgLink.style, {
        position: "relative",
        display: "block",
        flex: "1",
        background: "#f5f5f5",
        borderRadius: "8px",
        overflow: "hidden",
        aspectRatio: "1 / 1",
      })

      const mainImg = document.createElement("img")
      mainImg.src = images[0]
      mainImg.alt = product.name
      Object.assign(mainImg.style, { width: "100%", height: "100%", objectFit: "cover", display: "block" })
      mainImgLink.appendChild(mainImg)

      if (hasDiscount) {
        const off = Math.round((1 - product.price / (product.compare_price as number)) * 100)
        const badge = document.createElement("span")
        badge.textContent = `${off}% OFF`
        Object.assign(badge.style, {
          position: "absolute",
          top: "0.75rem",
          left: "0.75rem",
          background: "#ef4444",
          color: "#fff",
          fontSize: "0.8rem",
          fontWeight: "600",
          padding: "0.25rem 0.6rem",
          borderRadius: "4px",
        })
        mainImgLink.appendChild(badge)
      }

      let counterEl: HTMLSpanElement | null = null
      if (images.length > 1) {
        counterEl = document.createElement("span")
        counterEl.textContent = `1/${images.length}`
        Object.assign(counterEl.style, {
          position: "absolute",
          bottom: "0.75rem",
          right: "0.75rem",
          background: "rgba(0,0,0,0.6)",
          color: "#fff",
          fontSize: "0.75rem",
          fontWeight: "600",
          padding: "0.2rem 0.55rem",
          borderRadius: "999px",
        })
        mainImgLink.appendChild(counterEl)
      }

      if (images.length > 1) {
        const thumbs = document.createElement("div")
        Object.assign(thumbs.style, { display: "flex", flexDirection: "column", gap: "0.5rem", flexShrink: "0" })
        images.slice(0, 5).forEach((src, i) => {
          const thumbBtn = document.createElement("button")
          thumbBtn.type = "button"
          Object.assign(thumbBtn.style, {
            width: "56px",
            height: "56px",
            borderRadius: "6px",
            overflow: "hidden",
            border: i === 0 ? "2px solid #111" : "2px solid transparent",
            padding: "0",
            cursor: "pointer",
            flexShrink: "0",
          })
          const thumbImg = document.createElement("img")
          thumbImg.src = src
          thumbImg.alt = `${product.name} ${i + 1}`
          Object.assign(thumbImg.style, { width: "100%", height: "100%", objectFit: "cover", display: "block" })
          thumbBtn.appendChild(thumbImg)
          thumbBtn.addEventListener("click", () => {
            mainImg.src = src
            if (counterEl) counterEl.textContent = `${i + 1}/${images.length}`
            Array.from(thumbs.children).forEach((c) => {
              ;(c as HTMLElement).style.border = "2px solid transparent"
            })
            thumbBtn.style.border = "2px solid #111"
          })
          thumbs.appendChild(thumbBtn)
        })
        galleryCol.append(thumbs, mainImgLink)
      } else {
        galleryCol.append(mainImgLink)
      }

      // --- Info ---
      const infoCol = document.createElement("div")
      Object.assign(infoCol.style, { flex: "1 1 280px", display: "flex", flexDirection: "column" })

      const nameLink = document.createElement("a")
      nameLink.href = productUrl
      nameLink.textContent = product.name
      Object.assign(nameLink.style, {
        fontSize: "1.4rem",
        fontWeight: "600",
        color: "inherit",
        textDecoration: "none",
        marginBottom: "0.75rem",
      })

      const priceRow = document.createElement("div")
      Object.assign(priceRow.style, { display: "flex", alignItems: "baseline", gap: "0.75rem", flexWrap: "wrap" })

      const priceEl = document.createElement("span")
      priceEl.textContent = formatPrice(product.price, store.country)
      Object.assign(priceEl.style, { fontSize: "1.5rem", fontWeight: "700" })
      priceRow.appendChild(priceEl)

      if (hasDiscount) {
        const compareEl = document.createElement("span")
        compareEl.textContent = formatPrice(product.compare_price as number, store.country)
        Object.assign(compareEl.style, { fontSize: "1rem", color: "#999", textDecoration: "line-through" })
        priceRow.appendChild(compareEl)
      }

      infoCol.append(nameLink, priceRow)

      if (hasDiscount) {
        const savingsEl = document.createElement("div")
        savingsEl.textContent = `Ahorrás: ${formatPrice((product.compare_price as number) - product.price, store.country)}`
        Object.assign(savingsEl.style, { fontSize: "0.85rem", color: "#16a34a", fontWeight: "600", marginTop: "0.25rem" })
        infoCol.appendChild(savingsEl)
      }

      if (product.description) {
        const desc = document.createElement("p")
        const fullText = product.description.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()
        const shortText = fullText.length > 160 ? `${fullText.slice(0, 160)}…` : fullText
        Object.assign(desc.style, { fontSize: "0.9rem", color: "#555", marginTop: "1rem", lineHeight: "1.5" })

        if (fullText.length > 160) {
          let expanded = false
          const textSpan = document.createElement("span")
          textSpan.textContent = shortText
          const toggleLink = document.createElement("button")
          toggleLink.type = "button"
          toggleLink.textContent = "Ver más"
          Object.assign(toggleLink.style, {
            display: "block",
            marginTop: "0.4rem",
            background: "none",
            border: "none",
            padding: "0",
            color: "#111",
            fontWeight: "600",
            textDecoration: "underline",
            cursor: "pointer",
            fontSize: "0.9rem",
          })
          toggleLink.addEventListener("click", () => {
            expanded = !expanded
            textSpan.textContent = expanded ? fullText : shortText
            toggleLink.textContent = expanded ? "Ver menos" : "Ver más"
          })
          desc.appendChild(textSpan)
          infoCol.append(desc, toggleLink)
        } else {
          desc.textContent = fullText
          infoCol.appendChild(desc)
        }
      }

      // Selector de cantidad: decorativo (ajusta solo el número mostrado acá);
      // la compra real (con el carrito funcionando de verdad) se hace en la
      // ficha del producto, a la que lleva el botón de abajo.
      let qty = 1
      const qtyRow = document.createElement("div")
      Object.assign(qtyRow.style, { display: "flex", alignItems: "center", gap: "0.75rem", margin: "1.25rem 0" })

      const makeStepBtn = (label: string): HTMLButtonElement => {
        const btn = document.createElement("button")
        btn.type = "button"
        btn.textContent = label
        Object.assign(btn.style, {
          width: "32px",
          height: "32px",
          borderRadius: "6px",
          border: "1px solid #ddd",
          background: "#fff",
          cursor: "pointer",
          fontSize: "1rem",
        })
        return btn
      }

      const minusBtn = makeStepBtn("−")
      const qtyLabel = document.createElement("span")
      qtyLabel.textContent = String(qty)
      Object.assign(qtyLabel.style, { minWidth: "1.5rem", textAlign: "center", fontWeight: "600" })
      const plusBtn = makeStepBtn("+")
      minusBtn.addEventListener("click", () => {
        qty = Math.max(1, qty - 1)
        qtyLabel.textContent = String(qty)
      })
      plusBtn.addEventListener("click", () => {
        qty += 1
        qtyLabel.textContent = String(qty)
      })
      qtyRow.append(minusBtn, qtyLabel, plusBtn)

      const buyBtn = document.createElement("a")
      buyBtn.href = productUrl
      buyBtn.textContent = "Agregar al carrito"
      Object.assign(buyBtn.style, {
        display: "inline-block",
        textAlign: "center",
        padding: "0.85rem 1.5rem",
        borderRadius: "8px",
        background: "#111",
        color: "#fff",
        fontSize: "0.95rem",
        fontWeight: "600",
        textDecoration: "none",
      })

      infoCol.append(qtyRow, buyBtn)
      wrap.append(galleryCol, infoCol)
      container.appendChild(wrap)
    }

    const ensureInserted = () => {
      let node = root.querySelector<HTMLElement>("[data-tol-oferta-destacada]")
      if (node) return
      node = document.createElement("div")
      node.setAttribute("data-tol-oferta-destacada", "1")
      node.style.padding = "2rem 1rem"
      node.style.textAlign = "center"
      buildContent(node)
      const institutionalSection = root.querySelector(".js-section-institutional-home")
      const destacadosSection = root.querySelector("[data-tol-dynamic-destacados]")?.closest("section")
      const anchor = institutionalSection || destacadosSection
      if (anchor) {
        anchor.insertAdjacentElement("afterend", node)
      } else {
        root.insertBefore(node, root.firstChild)
      }
    }

    ensureInserted()

    // Red de contención: si el HTML clonado se vuelve a pintar entero por
    // cualquier motivo (visto en pruebas reales en dev), el nodo recién
    // insertado desaparece con él. Lo reinsertamos apenas se detecta, sin
    // tocar React state, para no dejar el panel pagado sin efecto.
    const observer = new MutationObserver(() => {
      if (!root.querySelector("[data-tol-oferta-destacada]")) ensureInserted()
    })
    observer.observe(root, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [cloned.html, ofertaDestacadaProducts, store.subdomain, store.country])

  // El HTML clonado trae marcado de carruseles de la plataforma de origen
  // (ej. Swiper de TiendaNube: .swiper-wrapper / .swiper-slide / botones
  // prev-next) pero nunca su JS. El propio CSS base de Swiper (cargado vía
  // <link> del sitio original) define .swiper-wrapper con
  // flex-direction:column — es el JS de Swiper el que lo pasa a "row" al
  // inicializar según el modo (slider/grid). Sin ese JS, cualquier wrapper
  // que no forcemos a row queda con las fotos apiladas una debajo de la
  // otra (bug real visto en prueba99: Marcas "una en cada fila", Novedades/
  // Ofertas "una sola imagen" porque el contenedor recorta la columna).
  // Las secciones de producto (Destacados/Novedades/Ofertas) y los banners
  // (ej. home-banner) sí traen data-desktop-format/data-mobile-format +
  // data-desktop-columns/data-mobile-columns con la intención real de diseño
  // (ej. Destacados: slider de a 5 en desktop, grilla de a 2 en mobile) —
  // leemos esos atributos (propios del wrapper o de un ancestro, según el
  // tema) para decidir grilla fija (sin scroll) vs. carrusel de una fila
  // (con scroll) según el ancho de pantalla actual. Sliders sin esos datos
  // (ej. "Nuestras marcas", testimoniales) van siempre a carrusel de una
  // fila con todo su contenido en tamaño natural.
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const cleanups: Array<() => void> = []
    // Nodos ya enganchados con flechas/paginación — evita escuchas
    // duplicadas si bindControls se repite sobre el mismo wrapper (ver
    // MutationObserver más abajo).
    const boundWrappers = new WeakSet<HTMLElement>()

    const bindControls = (wrappers: HTMLElement[]) => {
      // Las flechas prev/next se enganchan una sola vez por wrapper (no en
      // applyLayout, que se vuelve a correr en cada resize o repaint) para
      // no acumular listeners duplicados.
      wrappers.forEach((wrap) => {
        if (boundWrappers.has(wrap)) return
        boundWrappers.add(wrap)

        const section = wrap.closest("section") || wrap.closest(".swiper-container") || wrap.parentElement
        const prevBtn = section?.querySelector<HTMLElement>('[class*="prev" i]')
        const nextBtn = section?.querySelector<HTMLElement>('[class*="next" i]')

        const goPrev = () => wrap.scrollBy({ left: -wrap.clientWidth * 0.9, behavior: "smooth" })
        const goNext = () => wrap.scrollBy({ left: wrap.clientWidth * 0.9, behavior: "smooth" })

        if (prevBtn) {
          prevBtn.style.cursor = "pointer"
          prevBtn.addEventListener("click", goPrev)
          cleanups.push(() => prevBtn.removeEventListener("click", goPrev))
        }
        if (nextBtn) {
          nextBtn.style.cursor = "pointer"
          nextBtn.addEventListener("click", goNext)
          cleanups.push(() => nextBtn.removeEventListener("click", goNext))
        }

        // Puntitos de paginación: el servidor ya los generó como HTML
        // estático (populateSwiperPaginationBullets en clone-store.ts,
        // misma cantidad de "páginas" que usaría Swiper real). Acá solo los
        // hacemos clickeables (saltan a esa página) y les sincronizamos
        // cuál está activo según el scroll real del carrusel — mismo
        // criterio que ya se usa para las flechas prev/next de arriba.
        const paginationEl = section?.querySelector<HTMLElement>('[class*="pagination-bullets" i]')
        const bullets = paginationEl
          ? Array.from(paginationEl.querySelectorAll<HTMLElement>(".swiper-pagination-bullet"))
          : []
        if (bullets.length > 0) {
          const formatHost =
            (wrap.closest("[data-desktop-format], [data-mobile-format]") as HTMLElement | null) || wrap
          const columnsFor = () => {
            const desktop = window.matchMedia("(min-width: 768px)").matches
            const attr = desktop ? formatHost.dataset.desktopColumns : formatHost.dataset.mobileColumns
            return Math.max(1, parseInt(attr || "1", 10) || 1)
          }
          const pageWidth = () => {
            const child = wrap.children[0] as HTMLElement | undefined
            const slideWidth = child ? child.getBoundingClientRect().width : wrap.clientWidth
            return columnsFor() * slideWidth
          }
          bullets.forEach((bullet, index) => {
            bullet.style.cursor = "pointer"
            const onClick = () => wrap.scrollTo({ left: index * pageWidth(), behavior: "smooth" })
            bullet.addEventListener("click", onClick)
            cleanups.push(() => bullet.removeEventListener("click", onClick))
          })
          const syncActiveBullet = () => {
            const width = pageWidth()
            const page = width > 0 ? Math.round(wrap.scrollLeft / width) : 0
            bullets.forEach((bullet, i) =>
              bullet.classList.toggle("swiper-pagination-bullet-active", i === page)
            )
          }
          wrap.addEventListener("scroll", syncActiveBullet)
          cleanups.push(() => wrap.removeEventListener("scroll", syncActiveBullet))
        }
      })
    }

    // Vuelve a calcular todo contra el DOM actual (no una lista capturada
    // una sola vez al montar): el HTML clonado puede volver a pintarse
    // entero por cualquier motivo (visto en vivo en pinkonlineoficial.tol.ar
    // — "Nuestras marcas" quedaba sin centrar y con flechas de scroll
    // porque este layout solo se había aplicado una vez, a nodos que ya no
    // eran los que quedaron en pantalla). Sin re-consultar wrappers acá,
    // reaplicar el layout después de un repaint no tendría efecto.
    const applyLayout = () => {
      const desktop = window.matchMedia("(min-width: 768px)").matches
      const wrappers = Array.from(root.querySelectorAll<HTMLElement>(".swiper-wrapper"))
      wrappers.forEach((wrap) => {
        const formatHost =
          (wrap.closest("[data-desktop-format], [data-mobile-format]") as HTMLElement | null) || wrap
        const format = (desktop ? formatHost.dataset.desktopFormat : formatHost.dataset.mobileFormat) || "slider"
        const columnsAttr = desktop ? formatHost.dataset.desktopColumns : formatHost.dataset.mobileColumns
        const columns = columnsAttr ? parseInt(columnsAttr, 10) : null

        if (format === "grid") {
          wrap.style.display = "grid"
          wrap.style.gridTemplateColumns =
            columns && columns > 0 ? `repeat(${columns}, 1fr)` : "repeat(auto-fit, minmax(160px, 1fr))"
          wrap.style.gap = "1rem"
          wrap.style.flexDirection = ""
          wrap.style.overflowX = ""
          return
        }

        wrap.style.display = "flex"
        wrap.style.flexDirection = "row"

        if (!columns || columns <= 0) {
          // Sin columnas declaradas (ej. "Nuestras marcas", testimoniales):
          // el tema trae ".swiper-slide { width: 100% }" pensado para que el
          // JS de Swiper mueva un slide a la vez. Angostamos cada uno a su
          // tamaño real de contenido y los dejamos pasar a la línea
          // siguiente en vez de forzarlos a una sola fila con scroll — con
          // pocos ítems (6-8 logos típico) entran todos a la vista de una,
          // sin que el visitante tenga que tocar flechas para verlos todos
          // (bug real visto en prueba99: "Marcas" solo mostraba 2 de 6 logos
          // por vez, el resto quedaba oculto detrás del borde recortado).
          wrap.style.flexWrap = "wrap"
          wrap.style.justifyContent = "center"
          wrap.style.overflowX = ""
          wrap.style.scrollSnapType = ""
          wrap.style.scrollBehavior = ""
          Array.from(wrap.children).forEach((child) => {
            const slide = child as HTMLElement
            slide.style.flexShrink = "0"
            slide.style.flexBasis = "auto"
            slide.style.width = "auto"
            slide.style.scrollSnapAlign = ""
          })
          return
        }

        wrap.style.flexWrap = "nowrap"
        wrap.style.gap = `${CAROUSEL_GAP_REM}rem`
        Array.from(wrap.children).forEach((child) => {
          ;(child as HTMLElement).style.flex =
            columns === 1
              ? "0 0 100%"
              : `0 0 calc((100% - ${(columns - 1) * CAROUSEL_GAP_REM}rem) / ${columns})`
        })

        const overflowing = wrap.scrollWidth > wrap.clientWidth + 4
        // Si hay menos ítems que columnas declaradas (ej. "Nuestras marcas"
        // con slidesPerView:10 del sitio original pero solo 6 logos reales),
        // la fila no llega a llenar el ancho y quedaba pegada a la izquierda
        // con un hueco vacío antes de la flecha derecha (bug real visto en
        // prueba99). Sin necesidad de scroll, centramos en vez de alinear a
        // la izquierda; con scroll real (carrusel de productos lleno) se
        // mantiene el alineado a la izquierda de siempre.
        wrap.style.justifyContent = overflowing ? "" : "center"
        wrap.style.overflowX = overflowing ? "auto" : ""
        wrap.style.scrollSnapType = overflowing ? "x mandatory" : ""
        wrap.style.scrollBehavior = overflowing ? "smooth" : ""
        Array.from(wrap.children).forEach((child) => {
          ;(child as HTMLElement).style.scrollSnapAlign = overflowing ? "start" : ""
        })
      })
      bindControls(wrappers)
    }

    applyLayout()
    window.addEventListener("resize", applyLayout)
    cleanups.push(() => window.removeEventListener("resize", applyLayout))

    // Red de contención (mismo patrón ya usado más abajo para "Oferta
    // Destacada" y las imágenes lazy): si el HTML clonado se vuelve a
    // pintar entero, reaplicamos el layout sobre los nodos reales que
    // quedaron en pantalla. Solo mira childList/subtree (no "attributes"),
    // así que los cambios de estilo que hace el propio applyLayout no
    // disparan este observer — sin loop.
    const observer = new MutationObserver(() => applyLayout())
    observer.observe(root, { childList: true, subtree: true })
    cleanups.push(() => observer.disconnect())

    // applyLayout mide wrap.scrollWidth para decidir centrar vs. dejar
    // scroll con flechas, pero corre antes de que las imágenes lazy (ej.
    // los logos de "Nuestras marcas") terminen de cargar su tamaño real —
    // bug real visto en pinkonlineoficial.tol.ar: la fila se centraba bien
    // un instante y después, cuando los logos cargaban y la fila crecía,
    // quedaba desbordada y pegada a la izquierda para siempre porque nada
    // volvía a medir. "load" de <img> no burbujea, por eso escuchamos acá
    // en fase de captura sobre root para enterarnos igual.
    const onImageLoad = () => applyLayout()
    root.addEventListener("load", onImageLoad, true)
    cleanups.push(() => root.removeEventListener("load", onImageLoad, true))

    return () => cleanups.forEach((fn) => fn())
  }, [cloned.html])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const onClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement)?.closest("a[href]") as HTMLAnchorElement | null
      if (!link) return
      let url: URL
      try {
        url = new URL(link.href, window.location.href)
      } catch {
        return
      }
      if (url.hostname !== window.location.hostname) {
        e.preventDefault()
        e.stopPropagation()
      }
    }
    root.addEventListener("click", onClick)
    return () => root.removeEventListener("click", onClick)
  }, [])

  // El HTML clonado trae formularios reales del sitio de origen (carrito,
  // "agregar al carrito" rápido desde la grilla) con action="/comprar/" u
  // otra ruta propia de la plataforma origen. Esa ruta no existe en tol.ar
  // (el carrito real es el drawer de cart-provider, no una página), así que
  // si el form llega a enviarse el navegador termina en un 404 real. Esta
  // es solo la portada clonada (diseño), no el carrito funcional, así que
  // cualquier submit originado acá se neutraliza — igual criterio que ya se
  // usa arriba para los links que escapan al dominio original.
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const onSubmit = (e: SubmitEvent) => {
      e.preventDefault()
      e.stopPropagation()
    }
    root.addEventListener("submit", onSubmit)
    return () => root.removeEventListener("submit", onSubmit)
  }, [])

  // El HTML clonado trae el lazy-load nativo de la plataforma de origen
  // (ej. TiendaNube: img con src de placeholder 1x1 transparente y la URL
  // real en data-srcset/data-src, más una clase "lazyloaded" que su propio
  // JS agrega para subir la opacidad de 0 a 1 vía CSS). Como sacamos todo
  // <script> del clonado por seguridad, ese JS nunca corre y las fotos
  // quedan en blanco. Hacemos acá el mismo swap a mano.
  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const revealLazyImages = () => {
      const lazyImgs = root.querySelectorAll<HTMLImageElement>("img[data-srcset], img[data-src]")
      lazyImgs.forEach((img) => {
        const srcset = img.getAttribute("data-srcset")
        const dataSrc = img.getAttribute("data-src")
        if (srcset) {
          img.srcset = srcset
          const last = srcset.split(",").map((s) => s.trim().split(" ")[0]).filter(Boolean).pop()
          if (last) img.src = last
        } else if (dataSrc) {
          img.src = dataSrc
        }
        img.removeAttribute("data-srcset")
        img.removeAttribute("data-src")
        // Swiper (carrusel de "Nuestras marcas") espera "swiper-lazy-loaded"
        // para revelar la imagen — agregarle "lazyloaded" (la convención de
        // lazysizes que usa el resto del clonado) activa la regla CSS
        // ".fade-in.lazyloaded{display:none}" del tema y la esconde.
        img.classList.add(img.classList.contains("swiper-lazy") ? "swiper-lazy-loaded" : "lazyloaded")
      })
      // Algunas imágenes (ej. "Nuestras marcas") ya vienen con srcset real
      // desde el scraping, sin data-srcset/data-src — el loop de arriba nunca
      // las toca. Pero igual tienen la clase "swiper-lazy" que Swiper usa
      // para esconderlas con opacity:0 hasta que su JS (que no corremos) les
      // agrega "swiper-lazy-loaded". Sin este segundo pase quedan en gris
      // para siempre.
      root.querySelectorAll<HTMLImageElement>("img.swiper-lazy:not(.swiper-lazy-loaded)").forEach((img) => {
        img.classList.add("swiper-lazy-loaded")
      })
    }

    revealLazyImages()

    // Red de contención (mismo patrón que "Oferta Destacada" más abajo): si
    // el HTML clonado se vuelve a pintar entero por cualquier motivo (visto
    // en vivo en pinkonlineoficial.tol.ar, no solo en dev — los logos de
    // "Nuestras marcas" volvían a quedar grises segundos después de que este
    // efecto ya los había revelado), las imágenes vuelven a su estado
    // original con data-srcset/data-src intactos y hay que re-aplicar el
    // swap, no alcanza con correrlo una sola vez al montar.
    const observer = new MutationObserver(revealLazyImages)
    observer.observe(root, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [cloned.html])

  return (
    <>
      {/* El CSS del tema original define .swiper-wrapper en flex-direction:
          column (es el JS de Swiper, que nunca cargamos, el que lo pasa a
          "row" al inicializar). Sin esto, hasta que el useEffect de arriba
          corre (puede tardar: ~1MB de HTML clonado + varias hojas de estilo
          externas), el visitante ve los carruseles apilados en columna —
          bug real visto en prueba99 (Destacados en 2 filas en vez de una
          sola scrolleable, Novedades/Ofertas mostrando una sola foto,
          Marcas una marca por fila). Este estilo va server-rendered (no por
          JS) para estar presente desde el primer pixel pintado. */}
      <style>{`
        .tol-cloned-index .swiper-wrapper {
          display: flex !important;
          flex-direction: row !important;
          flex-wrap: nowrap !important;
          overflow-x: auto !important;
          -webkit-overflow-scrolling: touch;
          gap: ${CAROUSEL_GAP_REM}rem !important;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .tol-cloned-index .swiper-wrapper::-webkit-scrollbar {
          display: none;
        }
        .tol-cloned-index .swiper-wrapper > * {
          flex-shrink: 0 !important;
        }
        ${COLUMN_WIDTH_CSS}
      `}</style>
      {cloned.stylesheetHrefs.map((href) => (
        <link key={href} rel="stylesheet" href={href} />
      ))}
      {cloned.inlineStyles.map((css, i) => (
        // eslint-disable-next-line react/no-danger
        <style key={i} dangerouslySetInnerHTML={{ __html: css }} />
      ))}
      <div
        ref={rootRef}
        className="tol-cloned-index"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: cloned.html }}
      />
      {destacadosNode &&
        (destacadosOverride ? destacadosOverride.length > 0 : featuredProducts.length > 0) &&
        createPortal(
          <CarouselProductsGrid
            products={destacadosOverride || featuredProducts.slice(0, 3)}
            subdomain={store.subdomain}
            country={store.country}
          />,
          destacadosNode
        )}
      {otherCarouselTargets.map(({ el, products: targetProducts }, i) =>
        createPortal(
          <CarouselProductsGrid products={targetProducts} subdomain={store.subdomain} country={store.country} />,
          el,
          `tol-other-carousel-${i}`
        )
      )}
    </>
  )
}
