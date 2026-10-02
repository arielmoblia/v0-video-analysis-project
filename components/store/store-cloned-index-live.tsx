"use client"

import { useEffect, useRef } from "react"
import type { Store } from "@/lib/types"

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
}

// Render del "Clonado de Index": reemplaza TODA la portada (header/menú/grilla)
// por el HTML/CSS clonado del sitio de referencia (armado por
// cloneIndexDesign en scraping.tol.ar/server/clone-store.ts). Los links de
// producto de la grilla clonada ya vienen reescritos a nuestras fichas reales
// (/tienda/{subdomain}/producto/{slug}, productos placeholder "pendiente de
// completar") y el servidor neutraliza (href="#") cualquier otro link que
// apunte al dominio original (menú, redes, etc.) — el listener de abajo es
// una segunda red de contención por si algún link externo se escapa del
// sanitizado del servidor. Primera versión (02/10), solo para prueba99.
export function StoreClonedIndexLive({ store, cloned }: StoreClonedIndexLiveProps) {
  const rootRef = useRef<HTMLDivElement>(null)

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
    const wrappers = Array.from(root.querySelectorAll<HTMLElement>(".swiper-wrapper"))
    const cleanups: Array<() => void> = []

    const applyLayout = () => {
      const desktop = window.matchMedia("(min-width: 768px)").matches
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
        wrap.style.justifyContent = ""
        Array.from(wrap.children).forEach((child) => {
          ;(child as HTMLElement).style.flex = `0 0 ${100 / columns}%`
        })

        const overflowing = wrap.scrollWidth > wrap.clientWidth + 4
        wrap.style.overflowX = overflowing ? "auto" : ""
        wrap.style.scrollSnapType = overflowing ? "x mandatory" : ""
        wrap.style.scrollBehavior = overflowing ? "smooth" : ""
        Array.from(wrap.children).forEach((child) => {
          ;(child as HTMLElement).style.scrollSnapAlign = overflowing ? "start" : ""
        })
      })
    }

    applyLayout()
    window.addEventListener("resize", applyLayout)
    cleanups.push(() => window.removeEventListener("resize", applyLayout))

    // Las flechas prev/next se enganchan una sola vez (no en applyLayout,
    // que se vuelve a correr en cada resize) para no acumular listeners
    // duplicados cada vez que cambia el ancho de pantalla.
    wrappers.forEach((wrap) => {
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
    })

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
  // quedan en blanco. Hacemos acá el mismo swap a mano, una sola vez al
  // montar.
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
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
      img.classList.add("lazyloaded")
    })
  }, [cloned.html])

  return (
    <>
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
    </>
  )
}
