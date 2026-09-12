"use client"

import { useState, type CSSProperties } from "react"
import { Pencil } from "lucide-react"

interface EditableInlineProps {
  value: string
  editMode: boolean
  onChange: (value: string) => void
  as?: "span" | "h1" | "h2" | "h3" | "h4" | "p"
  className?: string
  style?: CSSProperties
  multiline?: boolean
}

// Mismo mecanismo que ya usan el título/subtítulo del hero (click → input →
// onBlur guarda en el estado del padre) pero reutilizable para cualquier
// texto fijo de las secciones de cada temple (features, testimonios,
// beneficios, franjas de promo).
export function EditableInline({ value, editMode, onChange, as = "span", className = "", style, multiline = false }: EditableInlineProps) {
  const [editing, setEditing] = useState(false)

  if (editing) {
    if (multiline) {
      return (
        <textarea
          autoFocus
          defaultValue={value}
          rows={3}
          onBlur={(e) => { onChange(e.target.value); setEditing(false) }}
          onKeyDown={(e) => { if (e.key === "Escape") setEditing(false) }}
          className={`${className} bg-transparent border border-current/40 rounded outline-none w-full resize-y`}
        />
      )
    }
    return (
      <input
        autoFocus
        defaultValue={value}
        onBlur={(e) => { onChange(e.target.value); setEditing(false) }}
        onKeyDown={(e) => {
          if (e.key === "Enter") (e.target as HTMLInputElement).blur()
          if (e.key === "Escape") setEditing(false)
        }}
        className={`${className} bg-transparent border-b border-current/40 outline-none w-full`}
      />
    )
  }

  const Tag = as as any
  return (
    <Tag
      className={`${className} ${editMode ? "cursor-pointer hover:opacity-80" : ""}`}
      style={style}
      onClick={() => editMode && setEditing(true)}
    >
      {value}
      {editMode && <Pencil className="inline-block ml-1.5 h-3.5 w-3.5 align-middle opacity-60" />}
    </Tag>
  )
}
