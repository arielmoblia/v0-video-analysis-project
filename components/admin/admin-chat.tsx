"use client"

import { useState, useRef, useEffect } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { X, Send, User } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface AdminChatProps {
  storeName: string
  subdomain: string
}

// Mismo elenco que el chat de soporte general (components/chat-flotante.tsx)
const ASISTENTES = [
  { nombre: "Tomi", foto: "/asistentes/tomi.jpg" },
  { nombre: "Ariel", foto: "/asistentes/ariel.jpg" },
  { nombre: "Belkis", foto: "/asistentes/belkis.jpg" },
  { nombre: "Franchesca", foto: "/asistentes/franchesca.jpg" },
  { nombre: "Guada", foto: "/asistentes/guada.jpg" },
  { nombre: "Dante", foto: "/asistentes/dante.jpg" },
]

export function AdminChat({ storeName, subdomain }: AdminChatProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const agenteNombreRef = useRef<string>("Tomi")
  const [asistente, setAsistente] = useState<typeof ASISTENTES[0] | null>(null)
  const [displayedTexts, setDisplayedTexts] = useState<Record<string, string>>({})
  const typewriterRefs = useRef<Record<string, NodeJS.Timeout>>({})

  // Elegir asistente al azar solo en el cliente (evita hydration mismatch)
  useEffect(() => {
    const a = ASISTENTES[Math.floor(Math.random() * ASISTENTES.length)]
    setAsistente(a)
    agenteNombreRef.current = a.nombre
  }, [])

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat-admin",
      fetch: (url, init) =>
        fetch(
          `${url}?storeName=${encodeURIComponent(storeName)}&subdomain=${encodeURIComponent(subdomain)}&agent=${encodeURIComponent(agenteNombreRef.current)}`,
          init!
        ),
    }),
  })

  const isLoading = status === "streaming" || status === "submitted"

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const getMessageText = (parts: Array<{ type: string; text?: string }>) =>
    parts.filter((p) => p.type === "text").map((p) => p.text).join("")

  // Efecto typewriter, igual al chat de soporte general — solo cuando terminó de streamear
  useEffect(() => {
    if (isLoading) return
    messages.forEach((message) => {
      if (message.role !== "assistant") return
      const fullText = getMessageText(message.parts)
      if (displayedTexts[message.id] === fullText) return
      if (typewriterRefs.current[message.id]) return
      let i = 0
      setDisplayedTexts((prev) => ({ ...prev, [message.id]: "" }))
      const type = () => {
        i++
        setDisplayedTexts((prev) => ({ ...prev, [message.id]: fullText.slice(0, i) }))
        if (i < fullText.length) {
          const char = fullText[i - 1]
          const isPunct = [".", ",", "!", "?", ")", "(", ";"].includes(char)
          const isWordBreak = i % 4 === 0
          const delay = isPunct ? 180 + Math.random() * 120 : isWordBreak ? 80 + Math.random() * 60 : 30 + Math.random() * 25
          typewriterRefs.current[message.id] = setTimeout(type, delay)
        } else {
          delete typewriterRefs.current[message.id]
        }
      }
      typewriterRefs.current[message.id] = setTimeout(type, 30)
    })
  }, [isLoading, messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    sendMessage({ text: input })
    setInput("")
  }

  const AvatarImg = ({ size }: { size: number }) => (
    <Image
      src={asistente?.foto || "/asistentes/tomi.jpg"}
      alt={asistente?.nombre || "Tomi"}
      width={size}
      height={size}
      className="w-full h-full object-cover"
      loading="lazy"
      quality={75}
    />
  )

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 group overflow-hidden border-2 border-white"
        aria-label="Abrir asistente del panel"
      >
        <AvatarImg size={64} />
        <div className="absolute bottom-full right-0 mb-2 bg-white text-gray-800 px-3 py-2 rounded-lg shadow-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
          ¿Dudas con el panel? Preguntame
        </div>
      </button>
    )
  }

  return (
    <Card className="fixed z-50 shadow-2xl bottom-6 right-6 w-96 h-[500px] max-h-[80vh] flex flex-col overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-500 to-violet-600 text-white p-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/30">
            <AvatarImg size={40} />
          </div>
          <div>
            <h3 className="font-semibold">{asistente?.nombre || "Tomi"}</h3>
            <p className="text-xs text-white/80">Te ayudo a usar tu tienda</p>
          </div>
        </div>
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

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full overflow-hidden mx-auto mb-4 border-2 border-indigo-200">
              <AvatarImg size={64} />
            </div>
            <h4 className="font-semibold mb-2">Hola, soy {asistente?.nombre || "Tomi"}</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Preguntame cómo usar cualquier parte del panel de tu tienda.
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {[
                "¿Cómo cargo un producto?",
                "¿Cómo configuro los envíos?",
                "¿Cómo recibo pagos?",
              ].map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage({ text: q })}
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
            className={cn("flex gap-2", message.role === "user" ? "justify-end" : "justify-start")}
          >
            {message.role === "assistant" && (
              <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-indigo-200">
                <AvatarImg size={32} />
              </div>
            )}
            <div
              className={cn(
                "max-w-[80%] rounded-2xl px-4 py-2 text-sm whitespace-pre-wrap",
                message.role === "user"
                  ? "bg-indigo-500 text-white rounded-br-sm"
                  : "bg-white border rounded-bl-sm"
              )}
            >
              {message.role === "assistant" ? (displayedTexts[message.id] || "") : getMessageText(message.parts)}
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
            <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-indigo-200">
              <AvatarImg size={32} />
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

      <form onSubmit={handleSubmit} className="p-4 border-t bg-white shrink-0">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribí tu pregunta..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </Card>
  )
}
