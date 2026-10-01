"use client"

import { useState, useEffect } from "react"
import { User } from "lucide-react"

interface CustomerAccountButtonProps {
  subdomain: string
}

// Botón flotante de "Mi cuenta", igual que WhatsAppButton pero abajo a la
// izquierda. Vive en el layout (no en cada cabecera de tema) para que la
// cosita "customer_accounts" funcione en cualquier plantilla sin tener que
// tocar los ~10 headers distintos (moderno, elegante, bold, pink, etc).
export function CustomerAccountButton({ subdomain }: CustomerAccountButtonProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [name, setName] = useState<string | null>(null)
  const [basePath, setBasePath] = useState(`/tienda/${subdomain}`)

  useEffect(() => {
    const hostname = window.location.hostname
    if (hostname.includes("tol.ar") && !hostname.startsWith("www.") && hostname !== "tol.ar") {
      setBasePath("")
    } else if (!hostname.includes("localhost") && !hostname.includes("vercel.app")) {
      setBasePath("")
    }
  }, [])

  useEffect(() => {
    fetch(`/api/customer/me?subdomain=${subdomain}`)
      .then((r) => r.json())
      .then((data) => setName(data.customer?.name?.split(" ")[0] || null))
      .catch(() => {})
  }, [subdomain])

  return (
    <a
      href={`${basePath}/cuenta`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed bottom-6 left-6 z-50 flex items-center gap-2 bg-black hover:bg-neutral-800 text-white rounded-full shadow-lg transition-all duration-300 hover:scale-105"
      style={{ padding: isHovered ? "12px 20px" : "14px" }}
    >
      <User className="w-5 h-5" />
      {isHovered && <span className="text-sm font-medium whitespace-nowrap">{name ? `Hola, ${name}` : "Mi cuenta"}</span>}
    </a>
  )
}
