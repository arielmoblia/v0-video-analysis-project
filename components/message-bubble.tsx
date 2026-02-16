"use client"

import { User, Bot } from "lucide-react"

interface MessageBubbleProps {
  message: {
    id: string
    role: "user" | "assistant"
    parts?: { type: string; text: string }[]
  }
  shouldAnimate: boolean
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const fullText = message.parts?.find((p) => p.type === "text")?.text || ""

  return (
    <div className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}>
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
        <p className="text-sm whitespace-pre-wrap">{fullText}</p>
      </div>
    </div>
  )
}
