"use client"
import { useState, useRef, useEffect } from "react"
import { Video, Pencil, X } from "lucide-react"

interface EditableVideoProps {
  page: string
  field: string
  defaultValue: string
  isAdmin: boolean
  className?: string
  placeholderLabel?: string
}

function urlEmbebible(url: string): string | null {
  if (!url) return null
  const yt = url.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=|youtube\.com\/embed\/)([\w-]+)/)
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`
  return null
}

// Mismo patrón que EditableText/EditableImage: pegás un link (YouTube o un .mp4 directo)
// y se guarda en page_content. Sirve para meter un video dentro del Desarrollo de una nota.
export function EditableVideo({ page, field, defaultValue, isAdmin, className = "", placeholderLabel = "Pegar link de video" }: EditableVideoProps) {
  const [value, setValue] = useState(defaultValue)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(defaultValue)
  const [hover, setHover] = useState(false)
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => { if (editing && ref.current) ref.current.focus() }, [editing])

  const guardar = async () => {
    await fetch("/api/page-content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page, key: field, value: draft }),
    })
    setValue(draft)
    setEditing(false)
  }

  const embed = urlEmbebible(value)

  if (!isAdmin) {
    if (!value) return null
    if (embed) return <iframe src={embed} className={className} allowFullScreen style={{ border: 0 }} />
    return <video src={value} controls className={className} />
  }

  if (editing) {
    return (
      <span className={className} style={{ display: "flex", flexDirection: "column", gap: "8px", minHeight: "180px", background: "#f8fafc", border: "2px solid #2563eb", borderRadius: "12px", padding: "16px", justifyContent: "center" }}>
        <input
          ref={ref}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=... o link a un .mp4"
          style={{ width: "100%", padding: "8px 10px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px" }}
        />
        <span style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
          <button onClick={() => { setDraft(value); setEditing(false) }} style={{ padding: "4px 10px", borderRadius: "6px", border: "1px solid #e2e8f0", background: "white", fontSize: "12px", cursor: "pointer" }}>Cancelar</button>
          <button onClick={guardar} style={{ padding: "4px 12px", borderRadius: "6px", border: "none", background: "#2563eb", color: "white", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>Guardar</button>
        </span>
      </span>
    )
  }

  return (
    <span style={{ position: "relative", display: "block" }} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      {value ? (
        embed ? <iframe src={embed} className={className} allowFullScreen style={{ border: hover ? "2px dashed #2563eb" : "2px solid transparent" }} /> : <video src={value} controls className={className} />
      ) : (
        <span className={className} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "8px", minHeight: "180px", background: "#f8fafc", border: "2px dashed #cbd5e1", borderRadius: "12px", color: "#94a3b8", fontSize: "13px" }}>
          <Video size={28} />
          {placeholderLabel}
        </span>
      )}
      {(hover || !value) && (
        <button
          onClick={() => { setDraft(value); setEditing(true) }}
          style={{
            position: "absolute", top: value ? "10px" : "50%", right: value ? "10px" : undefined,
            left: value ? undefined : "50%", transform: value ? undefined : "translate(-50%, 40px)",
            background: "#2563eb", color: "white", border: "none", borderRadius: value ? "50%" : "8px",
            width: value ? "32px" : undefined, height: value ? "32px" : undefined,
            padding: value ? undefined : "6px 14px", display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "12px", cursor: "pointer", zIndex: 10,
          }}
        >
          {value ? <Pencil size={14} /> : "Agregar video"}
        </button>
      )}
      {value && hover && (
        <button
          onClick={() => { setDraft(""); setValue(""); fetch("/api/page-content", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ page, key: field, value: "" }) }) }}
          style={{ position: "absolute", top: "10px", right: "50px", background: "#dc2626", color: "white", border: "none", borderRadius: "50%", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 10 }}
        >
          <X size={14} />
        </button>
      )}
    </span>
  )
}
