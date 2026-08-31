"use client"
import { useState, useEffect, useRef } from "react"

function renderFormattedText(text: string) {
  const parts: React.ReactNode[] = []
  const regex = /\*\*(.+?)\*\*|\*(.+?)\*/g
  let lastIndex = 0
  let key = 0
  let match: RegExpExecArray | null
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index))
    if (match[1] !== undefined) parts.push(<strong key={key++}>{match[1]}</strong>)
    else parts.push(<em key={key++}>{match[2]}</em>)
    lastIndex = regex.lastIndex
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex))
  return parts
}

interface EditableTextProps {
  page: string
  field: string
  defaultValue: string
  isAdmin: boolean
  tag?: string
  className?: string
  accentColor?: string
  endpoint?: string
  extraBody?: Record<string, string>
}

export function EditableText({ page, field, defaultValue, isAdmin, tag = "span", className = "", accentColor = "#d97706", endpoint = "/api/page-content", extraBody }: EditableTextProps) {
  const [value, setValue] = useState(defaultValue)
  const [editing, setEditing] = useState(false)
  const [hover, setHover] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState(false)
  const ref = useRef<HTMLTextAreaElement>(null)

  useEffect(() => { setValue(defaultValue) }, [defaultValue])
  useEffect(() => { if (editing && ref.current) { ref.current.focus(); ref.current.select() } }, [editing])

  const handleSave = async () => {
    setSaving(true); setSaveError(false)
    try {
      const res = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ page, key: field, value, ...extraBody }) })
      if (!res.ok) throw new Error(await res.text().catch(() => res.statusText))
      setSaving(false); setSaved(true); setEditing(false)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      setSaving(false); setSaveError(true)
      alert("No se pudo guardar. Puede que la sesión de administrador haya vencido en este sitio. Volvé a iniciar sesión como admin acá y probá de nuevo.")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSave() }
    if (e.key === "Escape") { setValue(defaultValue); setEditing(false) }
    if ((e.ctrlKey || e.metaKey) && e.key === "b") { e.preventDefault(); applyFormat("**") }
    if ((e.ctrlKey || e.metaKey) && e.key === "i") { e.preventDefault(); applyFormat("*") }
  }

  const applyFormat = (marker: string) => {
    const textarea = ref.current
    if (!textarea) return
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selected = value.slice(start, end) || "texto"
    const newValue = value.slice(0, start) + marker + selected + marker + value.slice(end)
    setValue(newValue)
    requestAnimationFrame(() => {
      if (!ref.current) return
      const cursorPos = start + marker.length + selected.length + marker.length
      ref.current.focus()
      ref.current.setSelectionRange(cursorPos, cursorPos)
    })
  }

  if (!isAdmin) { const Tag = tag as any; return <Tag className={className}>{renderFormattedText(value)}</Tag> }

  if (editing) return (
    <span style={{ display: "inline-block", width: "100%" }}>
      <span style={{ display: "flex", gap: "6px", marginBottom: "4px", justifyContent: "center" }}>
        <button type="button" title="Negrita (Ctrl+B)" onMouseDown={e => e.preventDefault()} onClick={() => applyFormat("**")}
          style={{ padding: "2px 10px", borderRadius: "6px", border: "1px solid #e2e8f0", background: "white", cursor: "pointer", fontSize: "13px", fontWeight: 700 }}>N</button>
        <button type="button" title="Itálica (Ctrl+I)" onMouseDown={e => e.preventDefault()} onClick={() => applyFormat("*")}
          style={{ padding: "2px 10px", borderRadius: "6px", border: "1px solid #e2e8f0", background: "white", cursor: "pointer", fontSize: "13px", fontStyle: "italic" }}>I</button>
      </span>
      <textarea ref={ref} value={value} onChange={e => setValue(e.target.value)} onKeyDown={handleKeyDown} rows={3}
        style={{ width: "100%", padding: "6px 10px", fontSize: "inherit", fontFamily: "inherit", fontWeight: "inherit",
          background: "rgba(255,255,255,0.95)", border: `2px solid ${accentColor}`, borderRadius: "8px",
          resize: "vertical", outline: "none", lineHeight: "1.5", textAlign: "center" }} />
      <span style={{ display: "flex", gap: "8px", marginTop: "4px", justifyContent: "center" }}>
        <button onClick={() => { setValue(defaultValue); setEditing(false) }}
          style={{ padding: "3px 10px", borderRadius: "6px", border: "1px solid #e2e8f0", background: "white", cursor: "pointer", fontSize: "12px" }}>Cancelar</button>
        <button onClick={handleSave} disabled={saving}
          style={{ padding: "3px 12px", borderRadius: "6px", border: "none", background: saveError ? "#dc2626" : accentColor, color: "white", cursor: "pointer", fontSize: "12px", fontWeight: 600 }}>
          {saving ? "Guardando..." : saveError ? "Error, reintentar" : "Guardar"}</button>
      </span>
    </span>
  )

  const Tag = tag as any
  return (
    <span style={{ position: "relative", display: "inline-block" }}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <Tag className={className}
        style={{ cursor: "text", borderRadius: "4px", transition: "all 0.15s",
          outline: hover ? `2px dashed ${accentColor}` : "2px dashed transparent", outlineOffset: "3px" }}>
        {renderFormattedText(value)}
      </Tag>
      {hover && <span onClick={(e) => { e.preventDefault(); e.stopPropagation(); setEditing(true) }}
        style={{ position: "absolute", top: "-12px", right: "-12px", background: accentColor, color: "white",
          border: "none", borderRadius: "50%", width: "26px", height: "26px", cursor: "pointer", fontSize: "12px",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10, userSelect: "none" }}>✏️</span>}
      {saved && <span style={{ position: "absolute", top: "-12px", right: "20px", background: "#10b981",
        color: "white", fontSize: "10px", padding: "2px 6px", borderRadius: "4px" }}>✓</span>}
    </span>
  )
}

export function usePageContent(page: string) {
  const [content, setContent] = useState<Record<string, string>>({})
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    fetch(`/api/page-content?page=${page}`).then(r => r.json()).then(setContent).catch(() => {})
    fetch("/api/super-admin/check-auth").then(r => r.json()).then(d => setIsAdmin(d?.authenticated === true)).catch(() => {})
  }, [page])

  const get = (key: string, fallback: string) => content[key] || fallback

  return { content, isAdmin, get }
}

export function useStorePageContent(subdomain: string, page: string) {
  const [content, setContent] = useState<Record<string, string>>({})
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    fetch(`/api/store-page-content?subdomain=${subdomain}&page=${page}`).then(r => r.json()).then(setContent).catch(() => {})
    fetch(`/api/store-admin/check-auth?subdomain=${subdomain}`).then(r => r.json()).then(d => setIsAdmin(d?.authenticated === true)).catch(() => {})
  }, [subdomain, page])

  const get = (key: string, fallback: string) => content[key] || fallback

  return { content, isAdmin, get }
}
