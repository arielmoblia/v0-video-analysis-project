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
  // prev-next) pero nunca su JS — sacamos todo <script> por seguridad, así
  // que sin esto las fotos quedan apiladas en una sola fila que desborda y
  // las flechas no hacen nada. En vez de reimplementar el motor original,
  // lo convertimos en un carrusel por scroll nativo: si el contenido
  // realmente desborda su contenedor, lo hacemos deslizable y las flechas
  // (detectadas por clase, cualquiera sea el tema de origen) mueven el
  // scroll un "página" a la vez. Si el tema de origen ya lo mostraba como
  // grilla sin desborde, no se toca nada.
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const wrappers = root.querySelectorAll<HTMLElement>(".swiper-wrapper")
    const cleanups: Array<() => void> = []

    wrappers.forEach((wrap) => {
      // Las grillas de producto (Destacados, Novedades, Ofertas) reusan la
      // misma clase "swiper-wrapper" que los sliders decorativos, pero traen
      // "grid" + data-desktop-columns/data-mobile-columns: en el sitio
      // original eso lo arma el JS de Swiper (slides al 20% de ancho,
      // paginado con puntitos), que nosotros no corremos. Sin este caso
      // aparte, la regla de abajo (desbordó → convertilo en carrusel de una
      // foto gigante por vez) se comía también estas grillas — bug real
      // visto en prueba99 (Destacados mostraba un solo producto enorme en
      // vez de la grilla completa). Para estas, mostramos todos los
      // productos en una grilla que ajusta sola las columnas, sin scroll.
      if (wrap.classList.contains("grid")) {
        wrap.style.display = "grid"
        wrap.style.gridTemplateColumns = "repeat(auto-fit, minmax(160px, 1fr))"
        wrap.style.gap = "1rem"
        return
      }

      if (wrap.scrollWidth <= wrap.clientWidth + 4) return

      wrap.style.display = "flex"
      wrap.style.flexWrap = "nowrap"
      wrap.style.overflowX = "auto"
      wrap.style.scrollSnapType = "x mandatory"
      wrap.style.scrollBehavior = "smooth"
      Array.from(wrap.children).forEach((child) => {
        const slide = child as HTMLElement
        slide.style.flexShrink = "0"
        slide.style.scrollSnapAlign = "start"
      })

      const section = wrap.closest("section") || wrap.parentElement
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
