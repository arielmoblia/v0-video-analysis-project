"use client"

import React from "react"

import { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
  Mail,
  Send,
  Search,
  CheckSquare,
  Square,
  ImageIcon,
  Bold,
  Italic,
  Underline,
  Link,
  AlignLeft,
  AlignCenter,
  Type,
  Code,
  Eye,
  Edit3,
  Loader2,
  CheckCircle2,
  XCircle,
  Users,
  Globe,
  Download,
  AlertCircle,
  RefreshCw,
} from "lucide-react"

const VPS_SCRAPER_URL = process.env.NEXT_PUBLIC_VPS_SCRAPER_URL

interface StoreData {
  id: string
  username: string
  email: string
  subdomain: string
  site_title: string
  plan: string
}

interface ScrapedEmail {
  storeName: string
  email: string
  source: string
  url?: string
}

interface PromoMailProps {
  stores: StoreData[]
  adminKey?: string
}

export function PromoMail({ stores, adminKey }: PromoMailProps) {
  // Tab izquierda: "destinatarios" o "buscador"
  const [leftTab, setLeftTab] = useState<"destinatarios" | "buscador">("destinatarios")

  const [selectedEmails, setSelectedEmails] = useState<Set<string>>(new Set())
  const [searchFilter, setSearchFilter] = useState("")
  const [subject, setSubject] = useState("")
  const [htmlContent, setHtmlContent] = useState("")
  const [showPreview, setShowPreview] = useState(false)
  const [sending, setSending] = useState(false)
  const [sendResult, setSendResult] = useState<{ success: number; failed: number } | null>(null)
  const editorRef = useRef<HTMLDivElement>(null)

  // Buscador de mails state
  const [scrapeQuery, setScrapeQuery] = useState("")
  const [scrapeResults, setScrapeResults] = useState<ScrapedEmail[]>([])
  const [scraping, setScraping] = useState(false)
  const [scrapeError, setScrapeError] = useState("")
  const [scrapeSearchFilter, setScrapeSearchFilter] = useState("")
  const [scrapeDepth, setScrapeDepth] = useState(3)

  // Filtrar tiendas con email valido
  const storesWithEmail = stores.filter((s) => s.email && s.email.includes("@"))
  const filteredStores = storesWithEmail.filter(
    (s) =>
      s.email.toLowerCase().includes(searchFilter.toLowerCase()) ||
      s.subdomain.toLowerCase().includes(searchFilter.toLowerCase()) ||
      s.username.toLowerCase().includes(searchFilter.toLowerCase())
  )

  // Filtrar resultados scrapeados
  const filteredScrapeResults = scrapeResults.filter(
    (r) =>
      r.email.toLowerCase().includes(scrapeSearchFilter.toLowerCase()) ||
      r.storeName.toLowerCase().includes(scrapeSearchFilter.toLowerCase())
  )

  // Seleccionar/deseleccionar todos
  const toggleSelectAll = () => {
    if (leftTab === "destinatarios") {
      if (selectedEmails.size === filteredStores.length) {
        setSelectedEmails(new Set())
      } else {
        setSelectedEmails(new Set(filteredStores.map((s) => s.email)))
      }
    } else {
      const scrapeEmails = filteredScrapeResults.map((r) => r.email)
      const allSelected = scrapeEmails.every((e) => selectedEmails.has(e))
      const next = new Set(selectedEmails)
      if (allSelected) {
        for (const e of scrapeEmails) next.delete(e)
      } else {
        for (const e of scrapeEmails) next.add(e)
      }
      setSelectedEmails(next)
    }
  }

  // Toggle individual
  const toggleEmail = (email: string) => {
    const next = new Set(selectedEmails)
    if (next.has(email)) {
      next.delete(email)
    } else {
      next.add(email)
    }
    setSelectedEmails(next)
  }

  // Buscar emails en el VPS
  const handleScrape = async () => {
    if (!scrapeQuery.trim()) {
      alert("Escribe un dominio para buscar, ej: mitiendanube.com")
      return
    }

    setScraping(true)
    setScrapeError("")
    setScrapeResults([])

    try {
      // Llamar al scraper del VPS via API proxy
      const res = await fetch("/api/super-admin/scrape-emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "scrape",
          domain: scrapeQuery.trim(),
          maxPages: scrapeDepth,
        }),
      })

      const data = await res.json()

      if (res.ok && data.results) {
        // Normalizar resultados del scraper
        const normalized = (data.results || []).map((item: any) => ({
          storeName: item.storeName || item.name || item.store || "Sin nombre",
          email: item.email,
          source: item.source || scrapeQuery.trim(),
          url: item.url || "",
        }))
        setScrapeResults(normalized)
        if (normalized.length === 0) {
          setScrapeError("No se encontraron emails. Proba con otro dominio.")
        }
      } else {
        setScrapeError(data.error || "Error al buscar emails")
      }
    } catch (err) {
      setScrapeError("Error de conexion. Verifica que el scraper del VPS este corriendo.")
    } finally {
      setScraping(false)
    }
  }

  // Ejecutar comando del editor
  const execCommand = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
  }, [])

  const [uploadingImage, setUploadingImage] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Subir imagen a Vercel Blob
  const uploadImage = async (file: File) => {
    setUploadingImage(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      const res = await fetch("/api/super-admin/upload-image", {
        method: "POST",
        body: formData,
      })
      if (res.ok) {
        const data = await res.json()
        const url = data.url
        execCommand("insertHTML", `<img src="${url}" alt="Imagen" style="max-width:100%;height:auto;border-radius:8px;margin:12px 0;" />`)
      } else {
        alert("Error al subir la imagen")
      }
    } catch {
      alert("Error al subir la imagen")
    } finally {
      setUploadingImage(false)
    }
  }

  // Insertar imagen por URL o archivo
  const insertImage = () => {
    const choice = window.confirm("Queres subir una imagen desde tu computadora?\n\n[Aceptar] = Subir archivo\n[Cancelar] = Pegar URL")
    if (choice) {
      fileInputRef.current?.click()
    } else {
      const url = prompt("URL de la imagen:")
      if (url) {
        execCommand("insertHTML", `<img src="${url}" alt="Imagen" style="max-width:100%;height:auto;border-radius:8px;margin:12px 0;" />`)
      }
    }
  }

  // Handle file input change
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith("image/")) {
      uploadImage(file)
    }
    e.target.value = ""
  }

  // Drag & drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }
  const handleDragLeave = () => setIsDragging(false)
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith("image/")) {
      uploadImage(file)
    }
  }

  // Insertar link
  const insertLink = () => {
    const url = prompt("URL del enlace:")
    if (url) {
      const text = window.getSelection()?.toString() || url
      execCommand("insertHTML", `<a href="${url}" style="color:#16a34a;text-decoration:underline;" target="_blank">${text}</a>`)
    }
  }

  // Obtener HTML del editor
  const getEditorHtml = () => {
    return editorRef.current?.innerHTML || ""
  }

  // Template del email
  const buildEmailHtml = (bodyContent: string) => {
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f4f4f5; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; margin-top: 20px; margin-bottom: 20px; }
    .header { background: #000000; padding: 24px; text-align: center; }
    .header img { height: 40px; }
    .header h1 { color: #ffffff; font-size: 24px; margin: 8px 0 0; }
    .body-content { padding: 32px 24px; line-height: 1.6; color: #27272a; font-size: 16px; }
    .body-content img { max-width: 100%; height: auto; border-radius: 8px; }
    .footer { background: #f4f4f5; padding: 20px 24px; text-align: center; font-size: 12px; color: #71717a; }
    .footer a { color: #16a34a; text-decoration: none; }
    a { color: #16a34a; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="color:#ffffff;font-size:24px;margin:0;">tol.ar</h1>
      <p style="color:#a1a1aa;font-size:14px;margin:4px 0 0;">Tu tienda online</p>
    </div>
    <div class="body-content">
      ${bodyContent}
    </div>
    <div class="footer">
      <p>Este email fue enviado desde <a href="https://tol.ar">tol.ar</a></p>
      <p>Si no queres recibir mas emails, responde con "DESUSCRIBIR"</p>
    </div>
  </div>
</body>
</html>`
  }

  // Guardar contenido del editor antes de cambiar a preview
  const [savedHtml, setSavedHtml] = useState("")

  const togglePreview = () => {
    if (!showPreview) {
      setSavedHtml(getEditorHtml())
    }
    setShowPreview(!showPreview)
  }

  // Obtener el contenido actual (del editor o guardado)
  const getCurrentHtml = () => {
    if (showPreview) return savedHtml
    return getEditorHtml()
  }

  // Enviar emails
  const handleSend = async () => {
    if (selectedEmails.size === 0) {
      alert("Selecciona al menos un destinatario.\n\nUsa la lista de la izquierda para tildar los emails a los que queres enviar, o usa 'Seleccionar todos'.")
      return
    }
    if (!subject.trim()) {
      alert("Escribe un asunto para el email")
      return
    }
    const bodyHtml = getCurrentHtml()
    if (!bodyHtml.trim()) {
      alert("Escribe el contenido del email antes de enviar")
      return
    }

    const emailList = Array.from(selectedEmails)
    const confirmSend = window.confirm(
      `Vas a enviar "${subject}" a ${emailList.length} destinatario(s):\n\n${emailList.slice(0, 5).join("\n")}${emailList.length > 5 ? `\n...y ${emailList.length - 5} mas` : ""}\n\nContinuar?`
    )
    if (!confirmSend) return

    setSending(true)
    setSendResult(null)

    try {
      const fullHtml = buildEmailHtml(bodyHtml)

      const res = await fetch("/api/super-admin/send-promo-mail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emails: emailList,
          subject,
          html: fullHtml,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        setSendResult({ success: data.sent || 0, failed: data.failed || 0 })
        if (data.sent > 0 && data.failed === 0) {
          alert(`Listo! ${data.sent} email(s) enviados correctamente.`)
        } else if (data.errors && data.errors.length > 0) {
          alert(`Enviados: ${data.sent}, Fallidos: ${data.failed}\n\nErrores:\n${data.errors.join("\n")}`)
        }
      } else {
        alert("Error: " + (data.error || "Error desconocido"))
      }
    } catch (error) {
      console.error("Error enviando emails:", error)
      alert("Error de conexion al enviar")
    } finally {
      setSending(false)
    }
  }

  // Exportar emails scrapeados a CSV
  const exportScrapedCsv = () => {
    if (scrapeResults.length === 0) return
    const csv = "nombre,email,fuente,url\n" + scrapeResults.map((r) => `"${r.storeName}","${r.email}","${r.source}","${r.url || ""}"`).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `emails-${scrapeQuery}-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const allSelected =
    leftTab === "destinatarios"
      ? filteredStores.length > 0 && filteredStores.every((s) => selectedEmails.has(s.email))
      : filteredScrapeResults.length > 0 && filteredScrapeResults.every((r) => selectedEmails.has(r.email))

  const currentListCount = leftTab === "destinatarios" ? filteredStores.length : filteredScrapeResults.length

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Panel izquierdo - Lista de emails */}
      <Card className="lg:col-span-1">
        <CardHeader className="pb-3">
          {/* Tabs de la izquierda */}
          <div className="flex border-b mb-3">
            <button
              type="button"
              onClick={() => setLeftTab("destinatarios")}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                leftTab === "destinatarios"
                  ? "border-green-500 text-green-700"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              <Users className="w-4 h-4" />
              Destinatarios
            </button>
            <button
              type="button"
              onClick={() => setLeftTab("buscador")}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                leftTab === "buscador"
                  ? "border-blue-500 text-blue-700"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              <Globe className="w-4 h-4" />
              Buscador de Mails
            </button>
          </div>

          {leftTab === "destinatarios" ? (
            <>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>Destinatarios</span>
                </div>
                <Badge variant="secondary">
                  {selectedEmails.size} / {storesWithEmail.length}
                </Badge>
              </CardTitle>

              {/* Buscador */}
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por email, tienda..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="pl-9"
                />
              </div>
            </>
          ) : (
            <>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-600" />
                  <span>Buscador de Mails</span>
                </div>
                <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                  {scrapeResults.length}
                </Badge>
              </CardTitle>

              {/* Buscador de dominios */}
              <div className="space-y-2 mt-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400" />
                  <Input
                    placeholder="Ej: mitiendanube.com"
                    value={scrapeQuery}
                    onChange={(e) => setScrapeQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleScrape()}
                    className="pl-9 border-blue-200 focus-visible:ring-blue-500"
                  />
                </div>
  <div className="flex gap-2">
  <select
  value={scrapeDepth}
  onChange={(e) => setScrapeDepth(Number(e.target.value))}
  className="h-8 rounded-md border border-blue-200 bg-background px-2 text-xs focus:ring-blue-500"
  aria-label="Profundidad de busqueda"
  >
  <option value={3}>Rapido (3 Pags)</option>
  <option value={10}>Medio (10 Pags)</option>
  <option value={20}>Profundo (20 Pags)</option>
  </select>
  <Button
  onClick={handleScrape}
  disabled={scraping}
  size="sm"
  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
  >
  {scraping ? (
  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
  ) : (
  <Search className="w-4 h-4 mr-2" />
  )}
  {scraping ? "Buscando..." : "Buscar emails"}
  </Button>
  </div>
  {scraping && scrapeDepth > 3 && (
  <p className="text-xs text-amber-600 font-medium text-center">Buscando a fondo... esto tomara unos minutos. No cierres la pestana.</p>
  )}

                {scrapeResults.length > 0 && (
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                      <Input
                        placeholder="Filtrar resultados..."
                        value={scrapeSearchFilter}
                        onChange={(e) => setScrapeSearchFilter(e.target.value)}
                        className="pl-8 h-8 text-xs"
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={exportScrapedCsv}
                      className="h-8 text-xs bg-transparent"
                      title="Exportar a CSV"
                    >
                      <Download className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Seleccionar todos - compartido */}
          {currentListCount > 0 && (
            <button
              type="button"
              onClick={toggleSelectAll}
              className="flex items-center gap-2 text-sm mt-2 px-2 py-1.5 rounded-md hover:bg-accent transition-colors w-full"
            >
              {allSelected ? (
                <CheckSquare className="w-4 h-4 text-green-600" />
              ) : (
                <Square className="w-4 h-4 text-muted-foreground" />
              )}
              <span className={allSelected ? "text-green-700 font-medium" : "text-muted-foreground"}>
                {allSelected ? "Deseleccionar todos" : "Seleccionar todos"}
              </span>
              <Badge variant="outline" className="ml-auto text-xs">
                {currentListCount}
              </Badge>
            </button>
          )}
        </CardHeader>

        <CardContent className="pt-0">
          {leftTab === "destinatarios" ? (
            /* Lista de tiendas tol.ar */
            <div className="space-y-1 max-h-[500px] overflow-y-auto pr-1">
              {filteredStores.map((store) => (
                <button
                  key={store.id}
                  type="button"
                  onClick={() => toggleEmail(store.email)}
                  className={`flex items-center gap-3 w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    selectedEmails.has(store.email)
                      ? "bg-green-50 border border-green-200"
                      : "hover:bg-accent border border-transparent"
                  }`}
                >
                  <Checkbox
                    checked={selectedEmails.has(store.email)}
                    className="pointer-events-none"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{store.subdomain}</p>
                    <p className="text-xs text-muted-foreground truncate">{store.email}</p>
                  </div>
                  <Badge variant="outline" className="text-xs shrink-0">
                    {store.plan || "free"}
                  </Badge>
                </button>
              ))}

              {filteredStores.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No se encontraron tiendas
                </p>
              )}
            </div>
          ) : (
            /* Lista de emails scrapeados */
            <div className="space-y-1 max-h-[500px] overflow-y-auto pr-1">
              {scrapeError && (
                <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg mb-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-amber-800">{scrapeError}</p>
                    {!VPS_SCRAPER_URL && (
                      <p className="text-xs text-amber-600 mt-1">
                        Configura la variable NEXT_PUBLIC_VPS_SCRAPER_URL con la URL de tu scraper en el VPS.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {scraping && (
                <div className="flex flex-col items-center justify-center py-8 gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
  <p className="text-sm text-muted-foreground">Buscando emails en {scrapeQuery} ({scrapeDepth} paginas)...</p>
  <p className="text-xs text-slate-400">{scrapeDepth > 3 ? "Busqueda profunda, esto puede tardar unos minutos" : "Esto puede tardar unos segundos"}</p>
                </div>
              )}

              {!scraping && scrapeResults.length === 0 && !scrapeError && (
                <div className="text-center py-8">
                  <Globe className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    Busca emails de tiendas escribiendo un dominio
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Ej: mitiendanube.com, mercadoshops.com.ar
                  </p>
                </div>
              )}

              {filteredScrapeResults.map((result, i) => (
                <button
                  key={`${result.email}-${i}`}
                  type="button"
                  onClick={() => toggleEmail(result.email)}
                  className={`flex items-center gap-3 w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    selectedEmails.has(result.email)
                      ? "bg-blue-50 border border-blue-200"
                      : "hover:bg-accent border border-transparent"
                  }`}
                >
                  <Checkbox
                    checked={selectedEmails.has(result.email)}
                    className="pointer-events-none"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{result.storeName}</p>
                    <p className="text-xs text-muted-foreground truncate">{result.email}</p>
                  </div>
                  <Badge variant="outline" className="text-xs shrink-0 bg-blue-50 text-blue-600 border-blue-200">
                    {result.source}
                  </Badge>
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Panel derecho - Editor de email */}
      <Card className="lg:col-span-2">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              <span>Redactar Email</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={togglePreview}
              >
                {showPreview ? <Edit3 className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
                {showPreview ? "Editar" : "Preview"}
              </Button>
              <Button
                onClick={handleSend}
                disabled={sending || selectedEmails.size === 0}
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {sending ? (
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                ) : (
                  <Send className="w-4 h-4 mr-1" />
                )}
                Enviar ({selectedEmails.size})
              </Button>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Resultado de envio */}
          {sendResult && (
            <div className={`p-4 rounded-lg border ${sendResult.failed === 0 ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"}`}>
              <div className="flex items-center gap-2">
                {sendResult.failed === 0 ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-amber-600" />
                )}
                <span className="font-medium">
                  {sendResult.success} enviados correctamente
                  {sendResult.failed > 0 && `, ${sendResult.failed} fallaron`}
                </span>
              </div>
            </div>
          )}

          {/* Asunto */}
          <div>
            <label className="text-sm font-medium mb-1 block">Asunto</label>
            <Input
              placeholder="Ej: Novedades en tol.ar - Nuevas funciones disponibles"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          {showPreview ? (
            /* Vista previa */
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-slate-100 px-4 py-2 border-b">
                <p className="text-sm text-muted-foreground">Vista previa del email</p>
              </div>
              <div
                className="bg-slate-50 p-4"
                dangerouslySetInnerHTML={{
                  __html: buildEmailHtml(savedHtml),
                }}
              />
            </div>
          ) : (
            /* Editor */
            <div>
              <label className="text-sm font-medium mb-1 block">Contenido</label>

              {/* Toolbar */}
              <div className="flex items-center gap-1 p-2 border border-b-0 rounded-t-lg bg-slate-50 flex-wrap">
                <button
                  type="button"
                  onClick={() => execCommand("bold")}
                  className="p-2 rounded hover:bg-slate-200 transition-colors"
                  title="Negrita"
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => execCommand("italic")}
                  className="p-2 rounded hover:bg-slate-200 transition-colors"
                  title="Italica"
                >
                  <Italic className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => execCommand("underline")}
                  className="p-2 rounded hover:bg-slate-200 transition-colors"
                  title="Subrayado"
                >
                  <Underline className="w-4 h-4" />
                </button>

                <div className="w-px h-6 bg-slate-300 mx-1" />

                <button
                  type="button"
                  onClick={() => execCommand("formatBlock", "h2")}
                  className="p-2 rounded hover:bg-slate-200 transition-colors"
                  title="Titulo"
                >
                  <Type className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => execCommand("justifyLeft")}
                  className="p-2 rounded hover:bg-slate-200 transition-colors"
                  title="Alinear izquierda"
                >
                  <AlignLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => execCommand("justifyCenter")}
                  className="p-2 rounded hover:bg-slate-200 transition-colors"
                  title="Centrar"
                >
                  <AlignCenter className="w-4 h-4" />
                </button>

                <div className="w-px h-6 bg-slate-300 mx-1" />

                <button
                  type="button"
                  onClick={insertLink}
                  className="p-2 rounded hover:bg-slate-200 transition-colors"
                  title="Insertar enlace"
                >
                  <Link className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={insertImage}
                  className="p-2 rounded hover:bg-slate-200 transition-colors"
                  title="Insertar imagen"
                >
                  <ImageIcon className="w-4 h-4" />
                </button>

                <div className="w-px h-6 bg-slate-300 mx-1" />

                {/* Color de texto */}
                <div className="relative">
                  <input
                    type="color"
                    className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                    title="Color de texto"
                    onChange={(e) => execCommand("foreColor", e.target.value)}
                    defaultValue="#000000"
                  />
                </div>

                {/* Tamano de fuente */}
                <select
                  onChange={(e) => execCommand("fontSize", e.target.value)}
                  className="text-sm border rounded px-2 py-1 bg-white"
                  defaultValue="3"
                  title="Tamano de fuente"
                >
                  <option value="1">Pequeno</option>
                  <option value="3">Normal</option>
                  <option value="5">Grande</option>
                  <option value="7">Muy grande</option>
                </select>

                <div className="w-px h-6 bg-slate-300 mx-1" />

                <button
                  type="button"
                  onClick={() => {
                    const html = getEditorHtml()
                    setHtmlContent(html)
                    const edit = prompt("Editar HTML directamente:", html)
                    if (edit !== null && editorRef.current) {
                      editorRef.current.innerHTML = edit
                    }
                  }}
                  className="p-2 rounded hover:bg-slate-200 transition-colors"
                  title="Editar HTML"
                >
                  <Code className="w-4 h-4" />
                </button>

                {/* Boton CTA predefinido */}
                <button
                  type="button"
                  onClick={() => {
                    const text = prompt("Texto del boton:", "EMPEZAR AHORA")
                    const url = prompt("URL del boton:", "https://tol.ar/registro")
                    if (text && url) {
                      execCommand(
                        "insertHTML",
                        `<div style="text-align:center;margin:24px 0;"><a href="${url}" style="display:inline-block;background:#16a34a;color:#ffffff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:16px;" target="_blank">${text}</a></div>`
                      )
                    }
                  }}
                  className="px-3 py-1.5 rounded bg-green-100 hover:bg-green-200 text-green-700 text-xs font-medium transition-colors"
                  title="Insertar boton CTA"
                >
                  + Boton CTA
                </button>
              </div>

              {/* Input file oculto */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
              />

              {/* Area editable con drag & drop */}
              <div className="relative">
                <div
                  ref={editorRef}
                  contentEditable
                  suppressContentEditableWarning
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`min-h-[350px] border rounded-b-lg p-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 prose prose-sm max-w-none bg-white transition-colors ${isDragging ? "border-green-400 bg-green-50" : ""}`}
                  style={{ lineHeight: 1.6 }}
                />

                {/* Overlay de drag */}
                {isDragging && (
                  <div className="absolute inset-0 border-2 border-dashed border-green-400 rounded-b-lg bg-green-50/80 flex items-center justify-center pointer-events-none">
                    <div className="text-center">
                      <ImageIcon className="w-10 h-10 text-green-500 mx-auto mb-2" />
                      <p className="text-green-700 font-medium">Soltar imagen aqui</p>
                    </div>
                  </div>
                )}

                {/* Loading de upload */}
                {uploadingImage && (
                  <div className="absolute inset-0 bg-white/80 rounded-b-lg flex items-center justify-center">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Subiendo imagen...</span>
                    </div>
                  </div>
                )}
              </div>

              <p className="text-xs text-muted-foreground mt-2">
                Arrastra y solta imagenes en el editor, o usa el boton de imagen en la barra de herramientas. Usa &quot;+ Boton CTA&quot; para agregar botones llamativos.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
