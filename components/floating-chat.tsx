"use client"

import React from "react"
import { useState, useRef, useEffect } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, X, Send, User, Bot, Minimize2, Maximize2, Phone, Mail } from "lucide-react"

// Componente que escribe texto letra por letra
function TypingText({ text, onComplete }: { text: string; onComplete?: () => void }) {
  const [displayedText, setDisplayedText] = useState("")
  const [isComplete, setIsComplete] = useState(false)
  
  useEffect(() => {
    if (isComplete) return
    
    let index = 0
    setDisplayedText("")
    
    const typeChar = () => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1))
        index++
        
        // Velocidad variable
        const char = text[index - 1]
        let delay = 50 + Math.random() * 30 // 50-80ms base
        
        if (char === "." || char === "!" || char === "?") {
          delay += 400 // Pausa larga despues de punto
        } else if (char === ",") {
          delay += 200 // Pausa media despues de coma
        }
        
        setTimeout(typeChar, delay)
      } else {
        setIsComplete(true)
        onComplete?.()
      }
    }
    
    // Empezar con delay inicial (simula que "piensa")
    const startDelay = setTimeout(typeChar, 100)
    
    return () => clearTimeout(startDelay)
  }, [text, onComplete, isComplete])
  
  return <>{displayedText}<span className={isComplete ? "hidden" : "animate-pulse"}>|</span></>
}

export function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [input, setInput] = useState("")
  const [typingMessageId, setTypingMessageId] = useState<string | null>(null)
  const [completedMessages, setCompletedMessages] = useState<Set<string>>(new Set(["welcome"]))
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat-soporte" }),
  })

  const isLoading = status === "streaming" || status === "submitted"
  
  // Detectar nuevo mensaje del asistente para animarlo
  useEffect(() => {
    const lastAssistantMsg = messages.filter(m => m.role === "assistant").pop()
    if (lastAssistantMsg && !completedMessages.has(lastAssistantMsg.id)) {
      // Delay de 1.5-2.5 segundos antes de empezar a escribir
      const delay = 1500 + Math.random() * 1000
      setTimeout(() => {
        setTypingMessageId(lastAssistantMsg.id)
      }, delay)
    }
  }, [messages, completedMessages])

  // Auto-scroll al ultimo mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    sendMessage({ text: input })
    setInput("")
  }

  // Mensaje de bienvenida
  const welcomeMessage = {
    id: "welcome",
    role: "assistant" as const,
    parts: [{ type: "text" as const, text: "Hola! Soy Tomi, del equipo de tol.ar. En que te puedo ayudar?" }]
  }

  const displayMessages = messages.length === 0 ? [welcomeMessage] : messages

  return (
    <>
      {/* Boton flotante */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-[#62162f] to-[#96305a] rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group hover:scale-110"
        >
          <MessageCircle className="w-7 h-7 text-white" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
          
          {/* Tooltip */}
          <div className="absolute right-full mr-3 px-3 py-2 bg-slate-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Chatea con nosotros
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 w-2 h-2 bg-slate-900 rotate-45" />
          </div>
        </button>
      )}

      {/* Ventana de chat */}
      {isOpen && (
        <Card className={`fixed z-50 shadow-2xl border-0 transition-all duration-300 ${
          isMinimized 
            ? "bottom-6 right-6 w-72 h-14" 
            : "bottom-6 right-6 w-96 h-[32rem] sm:w-96 sm:h-[32rem]"
        }`}>
          {/* Header */}
          <CardHeader className="bg-gradient-to-r from-[#62162f] to-[#96305a] text-white p-4 rounded-t-lg flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#62162f]" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">Tomi - Soporte tol.ar</CardTitle>
                <p className="text-xs text-white/80">Online</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-white hover:bg-white/20"
                onClick={() => setIsMinimized(!isMinimized)}
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-white hover:bg-white/20"
                onClick={() => setIsOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>

          {!isMinimized && (
            <CardContent className="p-0 flex flex-col h-[calc(100%-4rem)]">
              {/* Mensajes */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                {displayMessages.map((message) => {
                  const text = message.parts?.find((p: any) => p.type === "text")?.text || ""
                  const isTypingThis = message.id === typingMessageId && !completedMessages.has(message.id)
                  const shouldShow = message.role === "user" || completedMessages.has(message.id) || isTypingThis
                  
                  // No mostrar mensajes del asistente que aun no estan listos
                  if (!shouldShow) return null
                  
                  return (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.role === "user" 
                          ? "bg-[#62162f] text-white" 
                          : "bg-white border border-slate-200"
                      }`}>
                        {message.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-[#62162f]" />}
                      </div>
                      <div className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                        message.role === "user"
                          ? "bg-[#62162f] text-white rounded-tr-sm"
                          : "bg-white border border-slate-200 rounded-tl-sm"
                      }`}>
                        <p className="text-sm whitespace-pre-wrap">
                          {isTypingThis ? (
                            <TypingText 
                              text={text} 
                              onComplete={() => {
                                setCompletedMessages(prev => new Set(prev).add(message.id))
                                setTypingMessageId(null)
                              }}
                            />
                          ) : text}
                        </p>
                      </div>
                    </div>
                  )
                })}
                
                {/* Mostrar "pensando" cuando hay mensaje nuevo sin procesar */}
                {(isLoading || (messages.some(m => m.role === "assistant" && !completedMessages.has(m.id) && m.id !== typingMessageId))) && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-[#62162f]" />
                    </div>
                    <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                          <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                          <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                        <span className="text-xs text-slate-400 ml-1">Pensando...</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Opciones rapidas */}
              {messages.length === 0 && (
                <div className="px-4 py-2 border-t bg-white">
                  <p className="text-xs text-slate-500 mb-2">Preguntas frecuentes:</p>
                  <div className="flex flex-wrap gap-2">
                    {["Como crear mi tienda?", "Cuanto cuesta?", "Como recibo pagos?"].map((q) => (
                      <Badge 
                        key={q}
                        variant="outline" 
                        className="cursor-pointer hover:bg-[#ff9fc5]/20 hover:border-[#96305a] text-xs"
                        onClick={() => {
                          setInput(q)
                        }}
                      >
                        {q}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <form onSubmit={handleSubmit} className="p-3 border-t bg-white">
                <div className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Escribi tu mensaje..."
                    disabled={isLoading}
                    className="flex-1 text-sm"
                  />
                  <Button 
                    type="submit" 
                    size="icon"
                    disabled={isLoading || !input.trim()}
                    className="bg-[#62162f] hover:bg-[#96305a]"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </form>

              {/* Opciones de contacto alternativas */}
              <div className="px-3 py-2 bg-slate-100 border-t text-center">
                <p className="text-xs text-slate-500 mb-1">Otras formas de contacto:</p>
                <div className="flex justify-center gap-4">
                  <a href="https://wa.me/5491112345678" target="_blank" rel="noreferrer" className="text-xs text-[#62162f] hover:underline flex items-center gap-1">
                    <Phone className="w-3 h-3" /> WhatsApp
                  </a>
                  <a href="mailto:info@tiendaonline.com.ar" className="text-xs text-[#62162f] hover:underline flex items-center gap-1">
                    <Mail className="w-3 h-3" /> Email
                  </a>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      )}
    </>
  )
}
