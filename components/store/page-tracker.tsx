"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

interface PageTrackerProps {
  storeId: string
}

const IGNORED = ["/admin", "/arielmobilia", "/tienda/", "/api/"]

export function PageTracker({ storeId }: PageTrackerProps) {
  const pathname = usePathname()
  const viewIdRef = useRef<string | null>(null)
  const startRef = useRef<number>(0)

  useEffect(() => {
    // Solo trackear paginas publicas de la landing
    if (IGNORED.some(p => pathname.startsWith(p))) return

    // Generar o recuperar visitor ID
    let visitorId = localStorage.getItem("visitor_id")
    if (!visitorId) {
      visitorId = Math.random().toString(36).substring(2) + Date.now().toString(36)
      localStorage.setItem("visitor_id", visitorId)
    }

    const sendDuration = () => {
      if (!viewIdRef.current) return
      const seconds = Math.round((Date.now() - startRef.current) / 1000)
      const id = viewIdRef.current
      viewIdRef.current = null
      if (seconds < 1) return
      const payload = JSON.stringify({ viewId: id, durationSeconds: seconds })
      navigator.sendBeacon("/api/analytics/track-duration", new Blob([payload], { type: "application/json" }))
    }

    const handleVisibility = () => {
      if (document.visibilityState === "hidden") sendDuration()
    }

    const trackPageView = async () => {
      try {
        const res = await fetch("/api/analytics/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            storeId,
            pagePath: pathname,
            visitorId,
            referrer: document.referrer,
          }),
        })
        const data = await res.json()
        viewIdRef.current = data?.id || null
        startRef.current = Date.now()
      } catch (error) {
        // Silently fail
      }
    }

    trackPageView()

    document.addEventListener("visibilitychange", handleVisibility)
    window.addEventListener("pagehide", sendDuration)

    return () => {
      sendDuration()
      document.removeEventListener("visibilitychange", handleVisibility)
      window.removeEventListener("pagehide", sendDuration)
    }
  }, [pathname, storeId])

  return null
}
