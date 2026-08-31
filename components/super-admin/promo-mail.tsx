"use client"

import React from "react"
import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Mail, Send, Search, CheckSquare, Square, ImageIcon,
  Bold, Italic, Underline, Link, AlignLeft, AlignCenter,
  Type, Code, Eye, Edit3, Loader2, CheckCircle2, XCircle,
  Globe, Download, AlertCircle, Clock, Zap,
} from "lucide-react"

const VPS_SCRAPER_URL = process.env.NEXT_PUBLIC_VPS_SCRAPER_URL

interface StoreData {
  id: string
  username: string
  email: string
  subdomain: string
  site_title: string
  plan: string
  created_at?: string
  last_activity_at?: string
}

interface ScrapedEmail {
  storeName: string
  email: string
  source: string
  url?: string
}

interface AutoConfig {
  enabled: boolean
  time: string
  cadencia: string
}

interface PromoMailProps {
  stores: StoreData[]
  adminKey?: string
}

export function PromoMail({ stores, adminKey }: PromoMailProps) {
  const [activeTab, setActiveTab] = useState<"todos" | "activas" | "inactivas" | "buscador">("todos")
  const [selectedEmails, setSelectedEmails] = useState<Set<string>>(new Set())
  const [searchFilter, setSearchFilter] = useState("")
  const defaultSubjects: Record<string,string> = {
    todos: "Vendé más por internet — novedades de tol.ar",
    activas: "Nuevas funciones para tu tienda — cositas que suman",
    inactivas: "Tu tienda te extraña — hay novedades esperándote",
    buscador: ""
  }
  const defaultContents: Record<string,string> = {
    todos: `<p>Hola <strong>[nombre de la tienda]</strong>,</p><p>Tener una tienda online nunca fue tan fácil. En tol.ar podés vender tus productos las 24hs, recibir pagos con MercadoPago, ofrecer envíos y mucho más — <strong>sin pagar comisión por cada venta</strong>.</p><p>Este mes sumamos nuevas funciones para que tu tienda venda más y mejor. Entrá y explorá todo lo que tenés disponible.</p><div style="text-align:center;margin:24px 0"><a href="https://tol.ar" style="display:inline-block;background:#16a34a;color:#fff;padding:13px 30px;border-radius:8px;text-decoration:none;font-weight:700;font-size:15px;">Ver mi tienda →</a></div>`,
    activas: `<p>Hola <strong>[nombre de la tienda]</strong>,</p><p>Sabemos que estás activo vendiendo — y queremos ayudarte a vender todavía más.</p><p>Tenemos disponibles funciones extra que podés activar en un clic:</p><ul><li><strong>Estadísticas de tu tienda</strong> — sabé exactamente cuántas visitas tenés y de dónde vienen</li><li><strong>Modo Mayorista</strong> — precios especiales para compradores frecuentes</li><li><strong>Marketing por WhatsApp</strong> — contactá a tus clientes directamente</li></ul><p>Cada cosita cuesta <strong>USD 1 por mes</strong>. Sin sorpresas, sin contratos.</p><div style="text-align:center;margin:24px 0"><a href="https://tol.ar/plan-cositas" style="display:inline-block;background:#16a34a;color:#fff;padding:13px 30px;border-radius:8px;text-decoration:none;font-weight:700;font-size:15px;">Ver las cositas disponibles →</a></div>`,
    inactivas: `<p>Hola <strong>[nombre de la tienda]</strong>,</p><p>Hace unos días que no entrás a tu tienda y queríamos escribirte.</p><p>Mientras estuviste ausente, sumamos cosas nuevas que te van a interesar:</p><ul><li><strong>Envíos con Enviamelo</strong> — tus clientes eligen el punto de retiro más cercano, sin costo extra para vos</li><li><strong>Nuevas opciones de pago</strong> — más formas de cobrar, más ventas</li><li><strong>Mejoras en el checkout</strong> — menos abandono, más conversión</li></ul><p>Y recordá: tol.ar sigue siendo <strong>100% gratuito</strong>. Sin comisiones por venta. Tu tienda está lista, solo falta que vuelvas.</p><div style="text-align:center;margin:24px 0"><a href="https://tol.ar" style="display:inline-block;background:#16a34a;color:#fff;padding:13px 30px;border-radius:8px;text-decoration:none;font-weight:700;font-size:15px;">Entrar a mi tienda →</a></div>`,
    buscador: ""
  }
  const [subjects, setSubjects] = useState<Record<string,string>>(defaultSubjects)
  const [editorContents, setEditorContents] = useState<Record<string,string>>(defaultContents)
  const subject = subjects[activeTab] || ""
  const setSubject = (v: string) => setSubjects(prev => ({...prev, [activeTab]: v}))
  const [showPreview, setShowPreview] = useState(false)
  const [sending, setSending] = useState(false)
  const [sendResult, setSendResult] = useState<{ success: number; failed: number } | null>(null)
  const editorRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  React.useEffect(() => {
    if(editorRef.current) editorRef.current.innerHTML = defaultContents[activeTab] || ""
  }, [])
  const [uploadingImage, setUploadingImage] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [savedHtml, setSavedHtml] = useState("")
  const [aiLoading, setAiLoading] = useState(false)
  const [aiBrief, setAiBrief] = useState("")

  // Buscador state
  const [scrapeQuery, setScrapeQuery] = useState("")
  const [scrapeResults, setScrapeResults] = useState<ScrapedEmail[]>([])
  const [scraping, setScraping] = useState(false)
  const [scrapeError, setScrapeError] = useState("")
  const [scrapeSearchFilter, setScrapeSearchFilter] = useState("")

  // Auto config por segmento
  const [autoConfig, setAutoConfig] = useState<Record<string, AutoConfig>>({
    todos:     { enabled: false, time: "10:00", cadencia: "30" },
    activas:   { enabled: false, time: "10:00", cadencia: "30" },
    inactivas: { enabled: false, time: "10:00", cadencia: "7"  },
  })
  const [autoSaved, setAutoSaved] = useState<Record<string, boolean>>({})

  // Segmentacion
  const storesWithEmail = stores.filter((s) => s.email && s.email.includes("@"))
  const now = new Date()
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const isInactive = (s: StoreData) => {
    const lastActivity = s.last_activity_at ? new Date(s.last_activity_at) : null
    const created = s.created_at ? new Date(s.created_at) : null
    if (lastActivity) return lastActivity < sevenDaysAgo
    if (created) return created < sevenDaysAgo
    return false
  }
  const storesByTab = {
    todos:     storesWithEmail,
    activas:   storesWithEmail.filter(s => !isInactive(s)),
    inactivas: storesWithEmail.filter(s => isInactive(s)),
    buscador:  [],
  }
  const filteredStores = (storesByTab[activeTab] || []).filter(
    (s) =>
      s.email.toLowerCase().includes(searchFilter.toLowerCase()) ||
      s.subdomain.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (s.username || "").toLowerCase().includes(searchFilter.toLowerCase())
  )
  const filteredScrapeResults = scrapeResults.filter(
    (r) =>
      r.email.toLowerCase().includes(scrapeSearchFilter.toLowerCase()) ||
      r.storeName.toLowerCase().includes(scrapeSearchFilter.toLowerCase())
  )

  const toggleSelectAll = () => {
    if (activeTab === "buscador") {
      const scrapeEmails = filteredScrapeResults.map((r) => r.email)
      const allSelected = scrapeEmails.every((e) => selectedEmails.has(e))
      const next = new Set(selectedEmails)
      if (allSelected) { for (const e of scrapeEmails) next.delete(e) }
      else { for (const e of scrapeEmails) next.add(e) }
      setSelectedEmails(next)
    } else {
      if (selectedEmails.size === filteredStores.length) setSelectedEmails(new Set())
      else setSelectedEmails(new Set(filteredStores.map((s) => s.email)))
    }
  }

  const toggleEmail = (email: string) => {
    const next = new Set(selectedEmails)
    if (next.has(email)) next.delete(email)
    else next.add(email)
    setSelectedEmails(next)
  }

  const execCommand = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
  }, [])

  const getEditorHtml = () => editorRef.current?.innerHTML || ""

  // Template branded tol.ar
  const buildEmailHtml = (bodyContent: string) => {
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin:0; padding:0; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif; background:#f4f4f5; }
    .container { max-width:600px; margin:20px auto; border-radius:12px; overflow:hidden; }
    .header { background:#000; padding:20px 28px; display:flex; align-items:center; gap:14px; }
    .header-brand { color:#fff; font-size:22px; font-weight:700; letter-spacing:-0.5px; margin:0; }
    .header-tagline { color:#bbb; font-size:12px; margin:2px 0 0; }
    .strip { height:4px; background:linear-gradient(90deg,#4ade80,#16a34a,#166534); }
    .body-content { background:#fff; padding:32px 28px; line-height:1.7; color:#27272a; font-size:15px; }
    .body-content img { max-width:100%; height:auto; border-radius:8px; }
    .body-content a { color:#16a34a; }
    .footer { background:#18181b; padding:20px 28px; }
    .footer-top { display:flex; align-items:center; gap:10px; padding-bottom:12px; margin-bottom:12px; border-bottom:1px solid #27272a; }
    .footer-brand { color:#fff; font-size:15px; font-weight:700; }
    .footer-tagline { color:#fff; font-size:10px; }
    .footer-links { margin-bottom:10px; }
    .footer-links a { color:#4ade80; font-size:11px; text-decoration:none; margin-right:14px; }
    .footer-legal { font-size:10px; color:#fff; line-height:1.5; }
    .footer-legal a { color:#4ade80; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://tol.ar/tol-logo.png" alt="tol.ar" width="40" height="40" style="display:block;">
      <div>
        <p class="header-brand">tol.ar</p>
        <p class="header-tagline">Tu tienda online · 100% gratis</p>
      </div>
    </div>
    <div class="strip"></div>
    <div class="body-content">
      ${bodyContent}
    </div>
    <div class="footer">
      <div class="footer-top">
        <img src="https://tol.ar/tol-logo.png" alt="tol.ar" width="24" height="24" style="display:block;">
        <div>
          <div class="footer-brand">tol.ar</div>
          <div class="footer-tagline">Tienda Online Argentina</div>
        </div>
      </div>
      <div class="footer-links">
        <a href="https://tol.ar">tol.ar</a>
      </div>
      <div class="footer-legal">
        Recibís este mail porque tenés una tienda en tol.ar · Argentina<br>
      </div>
    </div>
  </div>
</body>
</html>`
  }

  const togglePreview = () => {
    if (!showPreview) setSavedHtml(getEditorHtml())
    setShowPreview(!showPreview)
  }

  const getCurrentHtml = () => showPreview ? savedHtml : getEditorHtml()

  // Subir imagen
  const uploadImage = async (file: File) => {
    setUploadingImage(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      const res = await fetch("/api/super-admin/upload-image", { method: "POST", body: formData })
      if (res.ok) {
        const data = await res.json()
        execCommand("insertHTML", `<img src="${data.url}" alt="Imagen" style="max-width:100%;height:auto;border-radius:8px;margin:12px 0;" />`)
      } else { alert("Error al subir la imagen") }
    } catch { alert("Error al subir la imagen") }
    finally { setUploadingImage(false) }
  }

  const insertImage = () => {
    const choice = window.confirm("Subir imagen desde tu computadora?\n\n[Aceptar] = Subir archivo\n[Cancelar] = Pegar URL")
    if (choice) { fileInputRef.current?.click() }
    else {
      const url = prompt("URL de la imagen:")
      if (url) execCommand("insertHTML", `<img src="${url}" alt="Imagen" style="max-width:100%;height:auto;border-radius:8px;margin:12px 0;" />`)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith("image/")) uploadImage(file)
    e.target.value = ""
  }

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true) }
  const handleDragLeave = () => setIsDragging(false)
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith("image/")) uploadImage(file)
  }

  const insertLink = () => {
    const url = prompt("URL del enlace:")
    if (url) {
      const text = window.getSelection()?.toString() || url
      execCommand("insertHTML", `<a href="${url}" style="color:#16a34a;text-decoration:underline;" target="_blank">${text}</a>`)
    }
  }

  // Generar con IA
  const generateWithAI = async () => {
    if (!aiBrief.trim()) { alert("Escribí un brief antes de generar"); return }
    setAiLoading(true)
    const segLabels: Record<string, string> = {
      todos: "todos los merchants de tol.ar",
      activas: "merchants activos de tol.ar (usaron la plataforma en los últimos 7 días)",
      inactivas: "merchants inactivos de tol.ar (no entraron en los últimos 7 días)",
    }
    try {
      const res = await fetch("/api/anthropic/generate-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brief: aiBrief,
          segment: segLabels[activeTab] || segLabels.todos,
        }),
      })
      const data = await res.json()
      if (data.subject) setSubject(data.subject)
      if (data.body && editorRef.current) editorRef.current.innerHTML = data.body
    } catch { alert("Error al generar con IA") }
    finally { setAiLoading(false) }
  }

  // Guardar config auto
  const saveAutoConfig = async (tab: string) => {
    const cfg = autoConfig[tab]
    try {
      await fetch("/api/super-admin/auto-email-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ segment: tab, ...cfg }),
      })
      setAutoSaved(prev => ({ ...prev, [tab]: true }))
      setTimeout(() => setAutoSaved(prev => ({ ...prev, [tab]: false })), 2000)
    } catch { alert("Error al guardar") }
  }

  // Enviar emails
  const handleSend = async () => {
    if (selectedEmails.size === 0) { alert("Seleccioná al menos un destinatario"); return }
    if (!subject.trim()) { alert("Escribí un asunto"); return }
    const bodyHtml = getCurrentHtml()
    if (!bodyHtml.trim()) { alert("Escribí el contenido del email"); return }
    const emailList = Array.from(selectedEmails)
    const confirmSend = window.confirm(`Vas a enviar "${subject}" a ${emailList.length} destinatario(s).\n\nContinuar?`)
    if (!confirmSend) return
    setSending(true); setSendResult(null)
    try {
      const res = await fetch("/api/super-admin/send-promo-mail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emails: emailList, subject, html: buildEmailHtml(bodyHtml), stores: Array.from(selectedEmails).map(email => {
        const store = storesWithEmail.find(s => s.email === email)
        return { email, subdomain: store?.subdomain || email }
      }) }),
      })
      const data = await res.json()
      if (res.ok) {
        setSendResult({ success: data.sent || 0, failed: data.failed || 0 })
        if (data.sent > 0 && data.failed === 0) alert(`Listo! ${data.sent} email(s) enviados.`)
      } else { alert("Error: " + (data.error || "Error desconocido")) }
    } catch { alert("Error de conexión al enviar") }
    finally { setSending(false) }
  }

  // Scraper
  const handleScrape = async () => {
    if (!scrapeQuery.trim()) { alert("Escribí un dominio"); return }
    setScraping(true); setScrapeError(""); setScrapeResults([])
    try {
      const res = await fetch("/api/super-admin/scrape-emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "scrape", domain: scrapeQuery.trim(), maxPages: 5 }),
      })
      const data = await res.json()
      if (res.ok && data.results) {
        const normalized = data.results.map((item: any) => ({
          storeName: item.storeName || item.name || "Sin nombre",
          email: item.email, source: item.source || scrapeQuery.trim(), url: item.url || "",
        }))
        setScrapeResults(normalized)
        if (normalized.length === 0) setScrapeError("No se encontraron emails.")
      } else { setScrapeError(data.error || "Error al buscar") }
    } catch { setScrapeError("Error de conexión.") }
    finally { setScraping(false) }
  }

  const exportScrapedCsv = () => {
    if (!scrapeResults.length) return
    const csv = "nombre,email,fuente,url\n" + scrapeResults.map(r => `"${r.storeName}","${r.email}","${r.source}","${r.url}"`).join("\n")
    const a = document.createElement("a")
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }))
    a.download = `emails-${scrapeQuery}-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
  }

  const tabConfig = {
    todos:     { label: "TODOS",     count: storesByTab.todos.length,     color: "border-zinc-800 text-zinc-800",   activeBg: "" },
    activas:   { label: "ACTIVAS",   count: storesByTab.activas.length,   color: "border-blue-500 text-blue-700",   activeBg: "" },
    inactivas: { label: "INACTIVAS", count: storesByTab.inactivas.length, color: "border-amber-500 text-amber-700", activeBg: "" },
    buscador:  { label: "BUSCADOR",  count: scrapeResults.length,         color: "border-violet-500 text-violet-700", activeBg: "" },
  }

  const autoColors: Record<string, string> = {
    todos:     "border-zinc-300 bg-zinc-50",
    activas:   "border-blue-300 bg-blue-50",
    inactivas: "border-amber-300 bg-amber-50",
  }
  const autoLabelColors: Record<string, string> = {
    todos: "text-zinc-600", activas: "text-blue-700", inactivas: "text-amber-700",
  }
  const autoSaveColors: Record<string, string> = {
    todos: "bg-zinc-600 hover:bg-zinc-700", activas: "bg-blue-600 hover:bg-blue-700", inactivas: "bg-amber-600 hover:bg-amber-700",
  }
  const cadenciaOptions: Record<string, string[]> = {
    todos:     ["15", "30", "60"],
    activas:   ["15", "30", "60"],
    inactivas: ["7",  "14", "30"],
  }
  const cadenciaLabels: Record<string, string> = {
    "7": "Cada 7 días", "14": "Cada 14 días", "15": "Cada 15 días",
    "30": "Cada 30 días", "60": "Cada 60 días",
  }

  const allSelected = activeTab === "buscador"
    ? filteredScrapeResults.length > 0 && filteredScrapeResults.every(r => selectedEmails.has(r.email))
    : filteredStores.length > 0 && filteredStores.every(s => selectedEmails.has(s.email))
  const currentCount = activeTab === "buscador" ? filteredScrapeResults.length : filteredStores.length

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* ---- PANEL IZQUIERDO ---- */}
      <div className="lg:col-span-1 border rounded-xl overflow-hidden bg-card flex flex-col">

        {/* Tabs principales */}
        <div className="flex border-b">
          {(["todos", "activas", "inactivas", "buscador"] as const).map((tab) => {
            const cfg = tabConfig[tab]
            const isActive = activeTab === tab
            return (
              <button
                key={tab}
                type="button"
                onClick={() => { if(editorRef.current) setEditorContents(prev => ({...prev, [activeTab]: editorRef.current!.innerHTML})); setActiveTab(tab); setSearchFilter(""); setSelectedEmails(new Set()); setTimeout(()=>{ if(editorRef.current) editorRef.current.innerHTML = editorContents[tab] || "" },50) }}
                className={`flex-1 py-2.5 text-[10px] font-bold tracking-wide border-b-2 transition-colors ${
                  isActive ? cfg.color : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {cfg.label}
                <div className="text-[9px] font-normal opacity-60">{cfg.count}</div>
              </button>
            )
          })}
        </div>

        {/* Lista destinatarios */}
        {activeTab !== "buscador" && (
          <>
            <div className="flex items-center justify-between px-3 py-2 border-b text-xs text-muted-foreground">
              <span>Destinatarios</span>
              <span className="font-medium text-foreground">{selectedEmails.size} / {storesByTab[activeTab].length}</span>
            </div>
            <div className="px-3 py-2 border-b">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <Input placeholder="Buscar por email, tienda..." value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)} className="pl-8 h-8 text-xs" />
              </div>
            </div>
            <button type="button" onClick={toggleSelectAll}
              className="flex items-center gap-2 text-xs px-3 py-2 border-b hover:bg-accent transition-colors w-full">
              {allSelected ? <CheckSquare className="w-3.5 h-3.5 text-green-600" /> : <Square className="w-3.5 h-3.5 text-muted-foreground" />}
              <span className={allSelected ? "text-green-700 font-medium" : "text-muted-foreground"}>
                {allSelected ? "Deseleccionar todos" : "Seleccionar todos"}
              </span>
              <Badge variant="outline" className="ml-auto text-[10px] px-1.5">{currentCount}</Badge>
            </button>
            <div className="overflow-y-auto flex-1 max-h-[420px]">
              {filteredStores.map((store) => (
                <div key={store.id} onClick={() => toggleEmail(store.email)}
                  className={`flex items-center gap-2.5 px-3 py-2 border-b cursor-pointer transition-colors ${
                    selectedEmails.has(store.email) ? "bg-green-50 border-l-2 border-l-green-400" : "hover:bg-accent"
                  }`}>
                  <div className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center flex-shrink-0 ${
                    selectedEmails.has(store.email) ? "bg-green-600 border-green-600" : "border-muted-foreground"
                  }`}>
                    {selectedEmails.has(store.email) && <span className="text-white text-[8px] font-bold">✓</span>}
                  </div>
                  <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isInactive(store) ? "bg-amber-500" : "bg-green-500"}`} />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium truncate">{store.subdomain}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{store.email}</p>
                  </div>
                  {activeTab === "inactivas" && store.last_activity_at && (
                    <span className="text-[9px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded flex-shrink-0">
                      {Math.floor((now.getTime() - new Date(store.last_activity_at).getTime()) / 86400000)}d
                    </span>
                  )}
                  {activeTab !== "inactivas" && (
                    <Badge variant="outline" className="text-[10px] px-1.5 flex-shrink-0">{store.plan || "free"}</Badge>
                  )}
                </div>
              ))}
              {filteredStores.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-6">No se encontraron tiendas</p>
              )}
            </div>
          </>
        )}

        {/* Buscador */}
        {activeTab === "buscador" && (
          <div className="flex flex-col flex-1 overflow-hidden">
            <div className="p-3 border-b space-y-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-blue-400" />
                <Input placeholder="Ej: mitiendanube.com" value={scrapeQuery}
                  onChange={(e) => setScrapeQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleScrape()}
                  className="pl-8 h-8 text-xs border-blue-200" />
              </div>
              <Button onClick={handleScrape} disabled={scraping} size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white h-8 text-xs">
                {scraping ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <Search className="w-3.5 h-3.5 mr-1.5" />}
                {scraping ? "Buscando..." : "Buscar emails"}
              </Button>
              {scrapeResults.length > 0 && (
                <div className="flex gap-2">
                  <Input placeholder="Filtrar..." value={scrapeSearchFilter}
                    onChange={(e) => setScrapeSearchFilter(e.target.value)} className="h-7 text-xs flex-1" />
                  <Button variant="outline" size="sm" onClick={exportScrapedCsv} className="h-7 px-2">
                    <Download className="w-3 h-3" />
                  </Button>
                </div>
              )}
            </div>
            <div className="overflow-y-auto flex-1">
              {scrapeError && (
                <div className="flex gap-2 p-2.5 m-2 bg-amber-50 border border-amber-200 rounded-lg">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-800">{scrapeError}</p>
                </div>
              )}
              {!scraping && !scrapeResults.length && !scrapeError && (
                <div className="text-center py-8">
                  <Globe className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">Escribí un dominio para buscar</p>
                </div>
              )}
              {filteredScrapeResults.map((result, i) => (
                <button key={`${result.email}-${i}`} type="button" onClick={() => toggleEmail(result.email)}
                  className={`flex items-center gap-2.5 w-full text-left px-3 py-2 border-b transition-colors ${
                    selectedEmails.has(result.email) ? "bg-blue-50 border-l-2 border-l-blue-400" : "hover:bg-accent"
                  }`}>
                  <div className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center flex-shrink-0 ${
                    selectedEmails.has(result.email) ? "bg-blue-600 border-blue-600" : "border-muted-foreground"
                  }`}>
                    {selectedEmails.has(result.email) && <span className="text-white text-[8px] font-bold">✓</span>}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium truncate">{result.storeName}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{result.email}</p>
                  </div>
                  <Badge variant="outline" className="text-[10px] px-1.5 bg-blue-50 text-blue-600 border-blue-200 flex-shrink-0">{result.source}</Badge>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ---- PANEL DERECHO ---- */}
      <div className="lg:col-span-2 border rounded-xl overflow-hidden bg-card flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Mail className="w-4 h-4 text-muted-foreground" />
            Redactar Email
            {activeTab !== "buscador" && (
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                activeTab === "inactivas" ? "bg-amber-100 text-amber-700" :
                activeTab === "activas"   ? "bg-blue-100 text-blue-700" :
                "bg-zinc-100 text-zinc-600"
              }`}>
                {activeTab === "todos" ? "Todos" : activeTab === "activas" ? "Activas" : "Inactivas"}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={togglePreview} className="h-8 text-xs">
              {showPreview ? <><Edit3 className="w-3.5 h-3.5 mr-1" />Editar</> : <><Eye className="w-3.5 h-3.5 mr-1" />Preview</>}
            </Button>
            <Button onClick={handleSend} disabled={sending || selectedEmails.size === 0} size="sm"
              className="bg-green-600 hover:bg-green-700 text-white h-8 text-xs">
              {sending ? <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" /> : <Send className="w-3.5 h-3.5 mr-1" />}
              Enviar ({selectedEmails.size})
            </Button>
          </div>
        </div>

        {/* Caja de automatizacion */}
        {activeTab !== "buscador" && (
          <div className={`mx-4 mt-3 rounded-lg border overflow-hidden ${autoColors[activeTab]}`}>
            <div className={`flex items-center justify-between px-3 py-2 ${autoColors[activeTab]}`}>
              <div className={`flex items-center gap-2 text-xs font-medium ${autoLabelColors[activeTab]}`}>
                <Clock className="w-3.5 h-3.5" />
                Envío automático — {activeTab === "todos" ? "Todos" : activeTab === "activas" ? "Activas" : "Inactivas"}
                <span className={`text-[9px] text-white px-1.5 py-0.5 rounded-full ${
                  activeTab === "inactivas" ? "bg-amber-500" : activeTab === "activas" ? "bg-blue-500" : "bg-zinc-500"
                }`}>AUTO</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] ${autoConfig[activeTab].enabled ? "text-green-600 font-medium" : "text-muted-foreground"}`}>
                  {autoConfig[activeTab].enabled ? "Activo" : "Desactivado"}
                </span>
                <button type="button"
                  onClick={() => setAutoConfig(prev => ({ ...prev, [activeTab]: { ...prev[activeTab], enabled: !prev[activeTab].enabled } }))}
                  className={`w-8 h-4.5 rounded-full relative transition-colors flex-shrink-0 border-0 cursor-pointer ${autoConfig[activeTab].enabled ? "bg-green-600" : "bg-gray-300"}`}
                  style={{width:32,height:18}}
                >
                  <span className={`absolute top-0.5 w-3.5 h-3.5 rounded-full bg-white transition-all ${autoConfig[activeTab].enabled ? "left-4" : "left-0.5"}`} style={{display:"block"}} />
                </button>
              </div>
            </div>
            <div className="flex gap-3 px-3 py-2.5 bg-background border-t items-end">
              <div className="flex-shrink-0">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">A las</p>
                <input type="time" value={autoConfig[activeTab].time}
                  onChange={(e) => setAutoConfig(prev => ({ ...prev, [activeTab]: { ...prev[activeTab], time: e.target.value } }))}
                  className="text-xs border rounded px-2 py-1.5 bg-background w-24" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Cada cuánto</p>
                <select value={autoConfig[activeTab].cadencia}
                  onChange={(e) => setAutoConfig(prev => ({ ...prev, [activeTab]: { ...prev[activeTab], cadencia: e.target.value } }))}
                  className="text-xs border rounded px-2 py-1.5 bg-background w-full">
                  {cadenciaOptions[activeTab].map(v => (
                    <option key={v} value={v}>{cadenciaLabels[v]}</option>
                  ))}
                </select>
              </div>
              <button type="button" onClick={() => saveAutoConfig(activeTab)}
                className={`text-xs text-white px-3 py-1.5 rounded transition-colors flex-shrink-0 ${autoSaveColors[activeTab]}`}>
                {autoSaved[activeTab] ? "✓ Guardado" : "Guardar"}
              </button>
            </div>
            <div className={`px-3 py-1.5 text-[10px] border-t ${autoLabelColors[activeTab]}`}
              style={{background: activeTab==="inactivas"?"#FAEEDA44": activeTab==="activas"?"#E6F1FB44":"#f4f4f544"}}>
              {autoConfig[activeTab].enabled
                ? `✅ Activo — se envía todos los días a las ${autoConfig[activeTab].time} a tiendas con ${autoConfig[activeTab].cadencia} días de inactividad`
                : "⏸ Desactivado — guardá la configuración y activá el toggle para arrancar"}
            </div>
          </div>
        )}

        {/* Brief IA */}
        {activeTab !== "buscador" && (
          <div className="mx-4 mt-3 p-3 bg-violet-50 border border-violet-200 rounded-lg">
            <p className="text-[10px] text-violet-600 uppercase tracking-wide font-medium mb-1.5 flex items-center gap-1.5">
              <Zap className="w-3 h-3" /> Brief para la IA
            </p>
            <div className="flex gap-2">
              <Input placeholder="Ej: reconectar inactivas, mostrar novedad de Enviamelo, tono amigable..."
                value={aiBrief} onChange={(e) => setAiBrief(e.target.value)}
                className="h-8 text-xs border-violet-200 flex-1" />
              <Button onClick={generateWithAI} disabled={aiLoading} size="sm"
                className="bg-violet-600 hover:bg-violet-700 text-white h-8 text-xs flex-shrink-0">
                {aiLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "✦ Generar"}
              </Button>
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col mt-3 overflow-hidden">
          {/* Resultado envio */}
          {sendResult && (
            <div className={`mx-4 mb-3 p-3 rounded-lg border text-sm flex items-center gap-2 ${sendResult.failed === 0 ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"}`}>
              {sendResult.failed === 0
                ? <CheckCircle2 className="w-4 h-4 text-green-600" />
                : <XCircle className="w-4 h-4 text-amber-600" />}
              {sendResult.success} enviados{sendResult.failed > 0 && `, ${sendResult.failed} fallaron`}
            </div>
          )}

          {/* Asunto */}
          <div className="px-4 pb-3 border-b">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1 block">Asunto</label>
            <Input placeholder="Ej: Tu tienda te extraña — hay novedades esperándote"
              value={subject} onChange={(e) => setSubject(e.target.value)} />
          </div>

          {showPreview ? (
            <div className="flex-1 overflow-y-auto">
              <div className="bg-slate-100 px-4 py-2 border-b">
                <p className="text-xs text-muted-foreground">Vista previa del email</p>
              </div>
              <div className="p-4" dangerouslySetInnerHTML={{ __html: buildEmailHtml(savedHtml) }} />
            </div>
          ) : (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Toolbar */}
              <div className="flex items-center gap-0.5 px-3 py-2 border-b bg-slate-50 flex-wrap">
                {[
                  { title:"Negrita", icon:<Bold className="w-3.5 h-3.5"/>, cmd:()=>execCommand("bold") },
                  { title:"Italic",  icon:<Italic className="w-3.5 h-3.5"/>, cmd:()=>execCommand("italic") },
                  { title:"Subrayado", icon:<Underline className="w-3.5 h-3.5"/>, cmd:()=>execCommand("underline") },
                ].map(({title,icon,cmd}) => (
                  <button key={title} type="button" onClick={cmd} title={title}
                    className="p-1.5 rounded hover:bg-slate-200 transition-colors">{icon}</button>
                ))}
                <div className="w-px h-5 bg-slate-300 mx-0.5" />
                <button type="button" onClick={() => execCommand("formatBlock","h2")} title="Título"
                  className="p-1.5 rounded hover:bg-slate-200 transition-colors"><Type className="w-3.5 h-3.5"/></button>
                <button type="button" onClick={() => execCommand("justifyLeft")} title="Izquierda"
                  className="p-1.5 rounded hover:bg-slate-200 transition-colors"><AlignLeft className="w-3.5 h-3.5"/></button>
                <button type="button" onClick={() => execCommand("justifyCenter")} title="Centrar"
                  className="p-1.5 rounded hover:bg-slate-200 transition-colors"><AlignCenter className="w-3.5 h-3.5"/></button>
                <div className="w-px h-5 bg-slate-300 mx-0.5" />
                <button type="button" onClick={insertLink} title="Link"
                  className="p-1.5 rounded hover:bg-slate-200 transition-colors"><Link className="w-3.5 h-3.5"/></button>
                <button type="button" onClick={insertImage} title="Imagen"
                  className="p-1.5 rounded hover:bg-slate-200 transition-colors"><ImageIcon className="w-3.5 h-3.5"/></button>
                <div className="w-px h-5 bg-slate-300 mx-0.5" />
                <input type="color" className="w-7 h-7 rounded cursor-pointer border-0 p-0" title="Color de texto"
                  onChange={(e) => execCommand("foreColor", e.target.value)} defaultValue="#000000" />
                <select onChange={(e) => execCommand("fontSize", e.target.value)} defaultValue="3"
                  className="text-xs border rounded px-1.5 py-1 bg-white ml-0.5">
                  <option value="1">Pequeño</option>
                  <option value="3">Normal</option>
                  <option value="5">Grande</option>
                  <option value="7">Muy grande</option>
                </select>
                <div className="w-px h-5 bg-slate-300 mx-0.5" />
                <button type="button" title="Editar HTML"
                  onClick={() => { const html=getEditorHtml(); const edit=prompt("HTML:",html); if(edit!==null && editorRef.current) editorRef.current.innerHTML=edit }}
                  className="p-1.5 rounded hover:bg-slate-200 transition-colors"><Code className="w-3.5 h-3.5"/></button>
                <button type="button"
                  onClick={() => { const text=prompt("Texto del botón:","EMPEZAR AHORA"); const url=prompt("URL:","https://tol.ar"); if(text&&url) execCommand("insertHTML",`<div style="text-align:center;margin:20px 0;"><a href="${url}" style="display:inline-block;background:#16a34a;color:#fff;padding:13px 30px;border-radius:8px;text-decoration:none;font-weight:700;font-size:15px;">${text}</a></div>`) }}
                  className="px-2.5 py-1 rounded bg-green-100 hover:bg-green-200 text-green-700 text-xs font-medium transition-colors ml-0.5">
                  + Botón CTA
                </button>
              </div>

              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />

              {/* Email preview editable */}
              <div className="flex-1 overflow-y-auto bg-gray-100 p-3">
                <div className="max-w-xl mx-auto bg-white rounded-lg overflow-hidden shadow-sm font-[system-ui]">
                  {/* Header fijo tol.ar */}
                  <div style={{background:"#000",padding:"16px 22px",display:"flex",alignItems:"center",gap:"12px"}}>
                    <img src="/tol-logo.png" alt="tol.ar" style={{height:"40px",width:"auto"}} />
                    <div style={{marginLeft:"4px"}}>
                      <div style={{color:"white",fontSize:"18px",fontWeight:"700",letterSpacing:"-0.5px",lineHeight:"1"}}>tol.ar</div>
                      <div style={{color:"#ccc",fontSize:"12px",marginTop:"3px",fontWeight:"500"}}>Tu tienda online · 100% gratis</div>
                    </div>
                  </div>
                  <div style={{height:"3px",background:"linear-gradient(90deg,#4ade80,#16a34a,#166534)"}} />

                  {/* Cuerpo editable */}
                  <div className="relative">
                    <div
                      ref={editorRef}
                      contentEditable
                      suppressContentEditableWarning
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`min-h-[220px] p-5 focus:outline-none focus:ring-2 focus:ring-green-400 prose prose-sm max-w-none bg-white transition-colors text-[15px] leading-relaxed ${isDragging ? "bg-green-50 ring-2 ring-green-400" : ""}`}
                      style={{fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif",color:"#27272a"}}
                      data-placeholder="Escribí tu mensaje acá..."
                    />
                    {isDragging && (
                      <div className="absolute inset-0 border-2 border-dashed border-green-400 bg-green-50/80 flex items-center justify-center pointer-events-none rounded">
                        <div className="text-center"><ImageIcon className="w-8 h-8 text-green-500 mx-auto mb-1" /><p className="text-green-700 text-sm font-medium">Soltar imagen acá</p></div>
                      </div>
                    )}
                    {uploadingImage && (
                      <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                        <div className="flex items-center gap-2 text-slate-600 text-sm"><Loader2 className="w-4 h-4 animate-spin" />Subiendo imagen...</div>
                      </div>
                    )}
                  </div>

                  {/* Footer fijo tol.ar */}
                  <div style={{background:"#18181b",padding:"14px 22px"}}>
                    <div style={{display:"flex",alignItems:"center",gap:"8px",paddingBottom:"10px",marginBottom:"10px",borderBottom:"1px solid #27272a"}}>
                      <img src="/tol-logo.png" alt="tol.ar" style={{height:"22px",width:"auto"}} />
                      <div style={{marginLeft:"6px"}}>
                        <div style={{color:"white",fontSize:"13px",fontWeight:"700"}}>tol.ar</div>
                        <div style={{color:"#fff",fontSize:"11px",fontWeight:"500"}}>Tienda Online Argentina</div>
                      </div>
                    </div>
                    <div style={{marginBottom:"8px",display:"flex",gap:"12px"}}>
                      <a href="https://tol.ar" target="_blank" rel="noreferrer" style={{color:"#4ade80",fontSize:"11px",textDecoration:"none"}}>tol.ar</a>
                    </div>
                    <div style={{fontSize:"10px",color:"#fff",lineHeight:"1.5",fontWeight:"500"}}>
                      Recibís este mail porque tenés una tienda en tol.ar · Argentina
                    </div>
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground text-center mt-2">
                  Header y footer son fijos de tol.ar · Editá el cuerpo del mail directamente
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
