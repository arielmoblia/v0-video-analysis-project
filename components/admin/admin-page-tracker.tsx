"use client"

import { useEffect } from "react"

interface AdminPageTrackerProps {
  storeId: string
}

// Se renderiza solo cuando el dueño de la tienda YA está autenticado en su panel
// (ver app/tienda/[subdomain]/admin/page.tsx y admin2/page.tsx). Antes de esto,
// no existía ningún registro de estas visitas.
export function AdminPageTracker({ storeId }: AdminPageTrackerProps) {
  useEffect(() => {
    fetch("/api/analytics/track-admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ storeId }),
    }).catch(() => {})
  }, [storeId])

  return null
}
