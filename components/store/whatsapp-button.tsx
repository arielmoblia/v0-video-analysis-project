"use client"

import { useState } from "react"
import { MessageCircle, X } from "lucide-react"

interface WhatsAppButtonProps {
  phoneNumber: string
  storeName?: string
}

export function WhatsAppButton({ phoneNumber, storeName }: WhatsAppButtonProps) {
  const [isHovered, setIsHovered] = useState(false)
  
  // Limpiar el numero de telefono (solo digitos)
  const cleanNumber = phoneNumber.replace(/\D/g, "")
  
  // Mensaje predeterminado
  const defaultMessage = storeName 
    ? `Hola! Estoy visitando ${storeName} y tengo una consulta.`
    : "Hola! Tengo una consulta."
  
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(defaultMessage)}`
  
  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full shadow-lg transition-all duration-300 hover:scale-105"
      style={{ padding: isHovered ? "12px 20px" : "14px" }}
    >
      <MessageCircle className="w-6 h-6" fill="white" />
      {isHovered && (
        <span className="text-sm font-medium whitespace-nowrap">
          Chatea con nosotros
        </span>
      )}
    </a>
  )
}
