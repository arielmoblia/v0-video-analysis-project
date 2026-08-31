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
  }, [searchParams, pathname])
  return null
}
