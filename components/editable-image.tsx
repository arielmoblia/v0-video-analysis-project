"use client"
import { useState, useRef } from "react"
import { ImagePlus, Loader2, Pencil } from "lucide-react"

interface EditableImageProps {
  page: string
  field: string
  defaultValue: string
  isAdmin: boolean
  alt: string
  className?: string
  uploadType?: "banner" | "product"
  placeholderLabel?: string
}

// Mismo patrón que EditableText (hover -> lápiz -> editar), pero para subir una
// imagen en vez de tipear texto. Guarda la URL resultante en la misma tabla
// page_content, así que convive con el resto de los campos editables de la página.
export function EditableImage({
  page,
  field,
  defaultValue,
  isAdmin,
  alt,
  className = "",
  uploadType = "banner",
  placeholderLabel = "Agregar imagen",
}: EditableImageProps) {
  const [value, setValue] = useState(defaultValue)
  const [hover, setHover] = useState(false)
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const subirArchivo = async (file: File) => {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("type", uploadType)
      const res = await fetch("/api/upload", { method: "POST", body: formData })
      const data = await res.json()
      if (!res.ok || !data.url) {
        alert(data.error || "No se pudo subir la imagen")
        return
      }
      await fetch("/api/page-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page, key: field, value: data.url }),
      })
      setValue(data.url)
    } finally {
      setUploading(false)
    }
  }

  if (!isAdmin) {
    if (!value) return null
    return <img src={value} alt={alt} className={className} />
  }

  return (
    <span
      style={{ position: "relative", display: "block" }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {value ? (
        <img src={value} alt={alt} className={className} style={{ outline: hover ? "2px dashed #2563eb" : "2px dashed transparent", outlineOffset: "3px" }} />
      ) : (
        <span
          className={className}
          style={{
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            gap: "8px", minHeight: "180px", background: "#f8fafc", border: "2px dashed #cbd5e1",
            borderRadius: "12px", color: "#94a3b8", fontSize: "13px",
          }}
        >
          <ImagePlus size={28} />
          {placeholderLabel}
        </span>
      )}
      <input ref={inputRef} type="file" accept="image/*" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) subirArchivo(f) }} />
      {(hover || !value) && (
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          style={{
            position: "absolute", top: value ? "10px" : "50%", right: value ? "10px" : undefined,
            left: value ? undefined : "50%", transform: value ? undefined : "translate(-50%, 40px)",
            background: "#2563eb", color: "white", border: "none", borderRadius: value ? "50%" : "8px",
            width: value ? "32px" : undefined, height: value ? "32px" : undefined,
            padding: value ? undefined : "6px 14px", display: "flex", alignItems: "center", justifyContent: "center",
            gap: "6px", fontSize: "12px", cursor: "pointer", zIndex: 10,
          }}
        >
          {uploading ? <Loader2 size={14} className="animate-spin" /> : value ? <Pencil size={14} /> : <>Subir imagen</>}
        </button>
      )}
    </span>
  )
}
