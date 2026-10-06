"use client"

import { useEffect, useRef } from "react"

interface StoreClonedChromeLiveProps {
  headerHtml: string
  footerHtml: string
  stylesheetHrefs: string[]
  inlineStyles: string[]
}

// Mismas redes de contención que StoreClonedIndexLive (lazy images, links
// externos, forms) pero acotadas a header/footer sueltos — ver
// lib/cloned-chrome.ts para de dónde sale este HTML. No hace falta la lógica
// de carruseles/Destacados/Oferta Destacada de ahí: el menú y el pie no
// traen esos bloques.
function useClonedChromeSafety(rootRef: React.RefObject<HTMLDivElement | null>, html: string) {
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
        img.classList.add(img.classList.contains("swiper-lazy") ? "swiper-lazy-loaded" : "lazyloaded")
      })
    }

    const onClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement)?.closest("a[href]") as HTMLAnchorElement | null
      if (!link) return
      let url: URL
      try {
        url = new URL(link.href, window.location.href)
      } catch {
        return
      }
      // Mismo criterio que StoreClonedIndexLive: los links a wa.me/redes que
      // clone-store.ts reescribió a propósito vienen con target="_blank" —
      // bloquearlos acá rompía el WhatsApp real del menú/footer clonado
      // (bug real visto en pinkonlineoficial.tol.ar).
      if (url.hostname !== window.location.hostname && link.target !== "_blank") {
        e.preventDefault()
        e.stopPropagation()
      }
    }

    const onSubmit = (e: SubmitEvent) => {
      e.preventDefault()
      e.stopPropagation()
    }

    revealLazyImages()
    root.addEventListener("click", onClick)
    root.addEventListener("submit", onSubmit)
    const observer = new MutationObserver(revealLazyImages)
    observer.observe(root, { childList: true, subtree: true })

    return () => {
      root.removeEventListener("click", onClick)
      root.removeEventListener("submit", onSubmit)
      observer.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [html])
}

// Header clonado: también carga las hojas de estilo del tema de origen
// (stylesheetHrefs/inlineStyles) — se cargan acá una sola vez por página,
// StoreClonedFooterLive no las repite porque ya quedan aplicadas al documento
// completo apenas este componente se monta (CSS no depende de dónde esté el
// <link>/<style> en el body).
export function StoreClonedHeaderLive({ headerHtml, stylesheetHrefs, inlineStyles }: StoreClonedChromeLiveProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  useClonedChromeSafety(rootRef, headerHtml)

  return (
    <>
      {stylesheetHrefs.map((href) => (
        <link key={href} rel="stylesheet" href={href} />
      ))}
      {inlineStyles.map((css, i) => (
        // eslint-disable-next-line react/no-danger
        <style key={i} dangerouslySetInnerHTML={{ __html: css }} />
      ))}
      <div ref={rootRef} className="tol-cloned-index" dangerouslySetInnerHTML={{ __html: headerHtml }} />
    </>
  )
}

export function StoreClonedFooterLive({ footerHtml }: Pick<StoreClonedChromeLiveProps, "footerHtml">) {
  const rootRef = useRef<HTMLDivElement>(null)
  useClonedChromeSafety(rootRef, footerHtml)

  return <div ref={rootRef} className="tol-cloned-index" dangerouslySetInnerHTML={{ __html: footerHtml }} />
}
