"use client"

import React from "react"

import { useState, useRef, useEffect } from "react"
import { usePathname } from "next/navigation"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { MessageCircle, X, Send, Minimize2, Maximize2, User, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

// Asistentes que van rotando
const ASISTENTES = [
  { nombre: "Tomi", foto: "/asistentes/tomi.jpg" },
  { nombre: "Ariel", foto: "/asistentes/ariel.jpg" },
  { nombre: "Belkis", foto: "/asistentes/belkis.jpg" },
  { nombre: "Franchesca", foto: "/asistentes/franchesca.jpg" },
  { nombre: "Guada", foto: "/asistentes/guada.jpg" },
  { nombre: "Dante", foto: "/asistentes/dante.jpg" },
]

// Detectar si estamos en un subdominio de tienda
function isStoreSubdomain(): boolean {
  if (typeof window === "undefined") return false
  const hostname = window.location.hostname
  // Si es un subdominio de tol.ar (ej: prueba2.tol.ar) pero NO es el principal
  if (hostname.endsWith(".tol.ar") && hostname !== "tol.ar" && hostname !== "www.tol.ar") {
    return true
  }
  return false
}

export function ChatFlotante() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [input, setInput] = useState("")
  const [isStore, setIsStore] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  // Detectar subdominio en el cliente
  useEffect(() => {
    setIsStore(isStoreSubdomain())
  }, [])
  
  // Seleccionar asistente aleatorio solo en el cliente (evita hydration mismatch)
  const [asistente, setAsistente] = useState(ASISTENTES[0])
  useEffect(() => {
    const index = Math.floor(Math.random() * ASISTENTES.length)
    setAsistente(ASISTENTES[index])
  }, [])

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat-soporte" }),
  })

  const isLoading = status === "streaming" || status === "submitted"
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // No mostrar el chat en las tiendas del cliente final
  // Incluye: subdominios de tienda, /tienda/*, /producto/*, /categoria/*, /checkout
  const isStorePage = 
    isStore ||
    pathname?.startsWith("/tienda/") || 
    pathname?.startsWith("/producto/") ||
    pathname?.startsWith("/categoria/") ||
    pathname === "/checkout"
  
  if (isStorePage) {
    return null
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    sendMessage({ text: input })
    setInput("")
  }

  // Extraer texto de las partes del mensaje
  const getMessageText = (parts: Array<{ type: string; text?: string }>) => {
    return parts
      .filter((p) => p.type === "text")
      .map((p) => p.text)
      .join("")
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 group"
        aria-label="Abrir chat"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
          1
        </span>
        <div className="absolute bottom-full right-0 mb-2 bg-white text-gray-800 px-3 py-2 rounded-lg shadow-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
          Hola! Soy {asistente.nombre}, en que te puedo ayudar?
        </div>
      </button>
    )
  }

  return (
    <Card
      className={cn(
        "fixed z-50 shadow-2xl transition-all duration-300 overflow-hidden",
        isMinimized 
          ? "bottom-6 right-6 w-72 h-14" 
          : "bottom-6 right-6 w-96 h-[500px] max-h-[80vh]",
        "flex flex-col"
      )}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/30">
            <Image
              src={asistente.foto || "/placeholder.svg"}
              alt={asistente.nombre}
              width={40}
              height={40}
              className="w-full h-full object-cover"
              loading="lazy"
              quality={75}
            />
          </div>
          <div>
            <h3 className="font-semibold">{asistente.nombre}</h3>
            <p className="text-xs text-white/80">Soporte tol.ar - Online</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20 h-8 w-8"
            onClick={() => setIsMinimized(!isMinimized)}
            aria-label={isMinimized ? "Maximizar chat" : "Minimizar chat"}
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20 h-8 w-8"
            onClick={() => setIsOpen(false)}
            aria-label="Cerrar chat"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full overflow-hidden mx-auto mb-4 border-2 border-green-200">
                  <Image
                    src={asistente.foto || "/placeholder.svg"}
                    alt={asistente.nombre}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    quality={75}
                  />
                </div>
                <h4 className="font-semibold mb-2">Hola, como estas?</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Soy {asistente.nombre} de tol.ar. En que te puedo ayudar? Preguntame lo que necesites.
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {[
                    "Como creo mi tienda?",
                    "Cuanto cuesta?",
                    "Como recibo pagos?",
                  ].map((q) => (
                    <button
                      key={q}
                      onClick={() => {
                        setInput(q)
                        sendMessage({ text: q })
                      }}
                      className="text-xs bg-white border rounded-full px-3 py-1.5 hover:bg-gray-100 transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-2",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {message.role === "assistant" && (
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-2 text-sm",
                    message.role === "user"
                      ? "bg-green-500 text-white rounded-br-sm"
                      : "bg-white border rounded-bl-sm"
                  )}
                >
                  {getMessageText(message.parts)}
                </div>
                {message.role === "user" && (
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2 justify-start">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white border rounded-2xl rounded-bl-sm px-4 py-2">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t bg-white shrink-0">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribi tu mensaje..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-center text-muted-foreground mt-2">
              Respuesta inmediata 24/7
            </p>
          </form>
        </>
      )}
    </Card>
  )
}
