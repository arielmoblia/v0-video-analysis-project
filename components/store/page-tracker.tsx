"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

interface PageTrackerProps {
  storeId: string
}

export function PageTracker({ storeId }: PageTrackerProps) {
  const pathname = usePathname()

  useEffect(() => {
    const trackPageView = async () => {
      // Generar o recuperar visitor ID
      let visitorId = localStorage.getItem("visitor_id")
      if (!visitorId) {
        visitorId = crypto.randomUUID()
        localStorage.setItem("visitor_id", visitorId)
      }

      try {
        await fetch("/api/analytics/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            storeId,
            pagePath: pathname,
            visitorId,
            referrer: document.referrer,
          }),
        })
      } catch (error) {
        // Silently fail
      }
    }

    trackPageView()
  }, [pathname, storeId])

  return null
}
