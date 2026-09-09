"use client"
import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"

export function UtmTracker() {
  const searchParams = useSearchParams()
  const pathname = usePathname()

  useEffect(() => {
    const utm = searchParams.get("utm_campaign")
    if (utm) {
      document.cookie = `utm_campaign=${utm};path=/;max-age=2592000`
    }

    const utmSource = searchParams.get("utm_source")
    if (utmSource) {
      fetch("/api/utm-track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          utmSource,
          utmMedium: searchParams.get("utm_medium"),
          utmCampaign: searchParams.get("utm_campaign"),
          path: pathname,
        }),
      }).catch(() => {})
    }

    // Link de afiliado (tol.ar/?ref=CODIGO). 60 días, igual al plazo del
    // Programa de Afiliados (afiliados-terminos, cláusula 1). No pisa un
    // ref ya guardado si el visitante navega de nuevo sin el parámetro.
    const ref = searchParams.get("ref")
    if (ref) {
      document.cookie = `tol_ref=${ref};path=/;max-age=5184000`
    }
  }, [searchParams, pathname])
  return null
}
