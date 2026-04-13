"use client"

import { useEffect } from "react"

export function LupaTracker({ subdomain, hasLupa }: { subdomain: string, hasLupa: boolean }) {
  useEffect(() => {
    // Tracker para smartcheck.tol.ar (vos ves TODAS las tiendas siempre)
    const s1 = document.createElement("script")
    s1.src = "https://smartcheck.tol.ar/smartcheck-tracker.js"
    s1.setAttribute("data-project", `${subdomain}.tol.ar`)
    s1.setAttribute("data-server", "https://smartcheck.tol.ar")
    document.head.appendChild(s1)

    // Tracker para lupa.tol.ar (solo si el cliente pagó)
    if (hasLupa) {
      const s2 = document.createElement("script")
      s2.src = "https://lupa.tol.ar/smartcheck-tracker.js"
      s2.setAttribute("data-project", `${subdomain}.tol.ar`)
      s2.setAttribute("data-server", "https://lupa.tol.ar")
      document.head.appendChild(s2)
    }
  }, [subdomain, hasLupa])

  return null
}
