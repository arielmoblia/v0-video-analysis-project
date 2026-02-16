"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Search, Play, Square, Download, RefreshCw, Mail, Phone,
  Globe, ExternalLink, Loader2, AlertCircle, CheckCircle,
  Trash2, Send, Filter
} from "lucide-react"

const VPS_URL = process.env.NEXT_PUBLIC_VPS_SCRAPER_URL || "https://vps.tol.ar:3500"

interface ScraperResult {
  url: string
  title: string
  description: string
  emails: string[]
  phones: string[]
  whatsapps: string[]
  socialLinks: {
    instagram?: string
    facebook?: string
    tiktok?: string
  }
  scrapedAt: string
  error?: string
}

interface ScraperStatus {
  running: boolean
  progress: number
  total: number
  found: number
  currentUrl: string
  startedAt: string | null
  finishedAt: string | null
  errors: string[]
  totalResults: number
  resultsWithEmail: number
}

export function ScraperAdmin() {
  const [status, setStatus] = useState<ScraperStatus | null>(null)
  const [results, setResults] = useState<ScraperResult[]>([])
  const [totalResults, setTotalResults] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")
  const [onlyWithEmail, setOnlyWithEmail] = useState(false)
  const [page, setPage] = useState(1)
  const [platform, setPlatform] = useState("tiendanube")
  const [keywords, setKeywords] = useState("ropa, calzado, accesorios, deportes, hogar, cosmeticos")
  const [customUrls, setCustomUrls] = useState("")
  const [connected, setConnected] = useState(false)
  const [selectedEmails, setSelectedEmails] = useState<Set<string>>(new Set())
  const [sendingToPromo, setSendingToPromo] = useState(false)

  const fetchApi = useCallback(async (endpoint: string, options?: RequestInit) => {
    try {
      const res = await fetch(`${VPS_URL}${endpoint}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return await res.json()
    } catch (e: any) {
      throw new Error(e.message || "Error de conexion con el VPS")
    }
  }, [])

  // Cargar estado y resultados
  const loadData = useCallback(async () => {
    try {
      setError("")
      const [statusData, resultsData] = await Promise.all([
        fetchApi("/api/status"),
        fetchApi(`/api/results?page=${page}&limit=50&onlyWithEmail=${onlyWithEmail}&search=${encodeURIComponent(search)}`),
      ])
      setStatus(statusData)
      setResults(resultsData.results || [])
      setTotalResults(resultsData.total || 0)
      setConnected(true)
    } catch (e: any) {
      setError(e.message)
      setConnected(false)
    } finally {
      setLoading(false)
    }
  }, [fetchApi, page, onlyWithEmail, search])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Auto-refresh mientras scrapea
  useEffect(() => {
    if (!status?.running) return
    const interval = setInterval(loadData, 5000)
    return () => clearInterval(interval)
  }, [status?.running, loadData])

  // Iniciar scraping
  const startScraping = async () => {
    try {
      setError("")
      const keywordList = keywords.split(",").map((k) => k.trim()).filter(Boolean)
      const urls = customUrls.split("\n").map((u) => u.trim()).filter(Boolean)

      await fetchApi("/api/start", {
        method: "POST",
        body: JSON.stringify({
          platform,
          keywords: keywordList,
          maxPages: 3,
          customUrls: urls,
        }),
      })
      loadData()
    } catch (e: any) {
      setError(e.message)
    }
  }

  // Detener scraping
  const stopScraping = async () => {
    try {
      await fetchApi("/api/stop", { method: "POST" })
      loadData()
    } catch (e: any) {
      setError(e.message)
    }
  }

  // Limpiar resultados
  const clearResults = async () => {
    if (!window.confirm("Eliminar todos los resultados?")) return
    try {
      await fetchApi("/api/results", { method: "DELETE" })
      loadData()
    } catch (e: any) {
      setError(e.message)
    }
  }

  // Toggle seleccionar email
  const toggleEmail = (email: string) => {
    setSelectedEmails((prev) => {
      const next = new Set(prev)
      if (next.has(email)) next.delete(email)
      else next.add(email)
      return next
    })
  }

  // Seleccionar todos los emails visibles
  const selectAllEmails = () => {
    const allEmails = new Set(selectedEmails)
    for (const r of results) {
      for (const e of r.emails || []) {
        allEmails.add(e)
      }
    }
    setSelectedEmails(allEmails)
  }

  // Deseleccionar todos
  const deselectAll = () => setSelectedEmails(new Set())

  // Exportar CSV
  const exportCsv = () => {
    window.open(`${VPS_URL}/api/export-csv`, "_blank")
  }

  // Enviar seleccionados a Promo Mail (copia al clipboard)
  const copyEmailsForPromo = () => {
    const emails = Array.from(selectedEmails)
    navigator.clipboard.writeText(emails.join("\n"))
    alert(`${emails.length} emails copiados al portapapeles.\n\nPegalos en el Promo Mail para enviarles tu campana.`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
        <span className="ml-3 text-slate-500">Conectando con el VPS...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Scraper de Tiendas</h2>
          <p className="text-sm text-slate-500 mt-1">
            Busca tiendas de la competencia y extrae datos de contacto
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={connected ? "default" : "destructive"} className={connected ? "bg-green-100 text-green-800 border-green-200" : ""}>
            {connected ? "VPS Conectado" : "VPS Desconectado"}
          </Badge>
          <Button variant="outline" size="sm" onClick={loadData}>
            <RefreshCw className="w-4 h-4 mr-1" />
            Actualizar
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-red-800">Error de conexion</p>
            <p className="text-sm text-red-600 mt-1">{error}</p>
            <p className="text-xs text-red-500 mt-2">
              Asegura que el scraper este corriendo en el VPS: <code className="bg-red-100 px-1 rounded">cd vps-scraper && npm start</code>
            </p>
          </div>
        </div>
      )}

      {/* Stats */}
      {status && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-white border-slate-200">
            <CardContent className="p-4">
              <p className="text-sm text-slate-500">Total Tiendas</p>
              <p className="text-2xl font-bold text-slate-900">{status.totalResults}</p>
            </CardContent>
          </Card>
          <Card className="bg-white border-slate-200">
            <CardContent className="p-4">
              <p className="text-sm text-slate-500">Con Email</p>
              <p className="text-2xl font-bold text-green-600">{status.resultsWithEmail}</p>
            </CardContent>
          </Card>
          <Card className="bg-white border-slate-200">
            <CardContent className="p-4">
              <p className="text-sm text-slate-500">Seleccionados</p>
              <p className="text-2xl font-bold text-blue-600">{selectedEmails.size}</p>
            </CardContent>
          </Card>
          <Card className={`border ${status.running ? "bg-amber-50 border-amber-200" : "bg-white border-slate-200"}`}>
            <CardContent className="p-4">
              <p className="text-sm text-slate-500">Estado</p>
              {status.running ? (
                <div>
                  <p className="text-sm font-bold text-amber-700">Scrapeando...</p>
                  <p className="text-xs text-amber-600 mt-1">{status.progress}/{status.total}</p>
                </div>
              ) : (
                <p className="text-sm font-bold text-slate-700">Inactivo</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Progreso activo */}
      {status?.running && (
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
                <span className="font-medium text-amber-800">Scraping en curso</span>
              </div>
              <Button variant="destructive" size="sm" onClick={stopScraping}>
                <Square className="w-4 h-4 mr-1" />
                Detener
              </Button>
            </div>
            <div className="w-full bg-amber-200 rounded-full h-2 mb-2">
              <div
                className="bg-amber-600 h-2 rounded-full transition-all"
                style={{ width: status.total > 0 ? `${(status.progress / status.total) * 100}%` : "0%" }}
              />
            </div>
            <p className="text-xs text-amber-600 truncate">{status.currentUrl}</p>
            <p className="text-xs text-amber-700 mt-1">
              Progreso: {status.progress}/{status.total} | Encontrados: {status.found} | Errores: {status.errors.length}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Panel de control */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuracion */}
        <Card className="bg-white border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Configuracion</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">Plataforma</label>
              <div className="flex gap-2">
                <Button
                  variant={platform === "tiendanube" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPlatform("tiendanube")}
                  className={platform === "tiendanube" ? "bg-blue-600 text-white hover:bg-blue-700" : ""}
                >
                  Tiendanube
                </Button>
                <Button
                  variant={platform === "mercadoshops" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPlatform("mercadoshops")}
                  className={platform === "mercadoshops" ? "bg-yellow-600 text-white hover:bg-yellow-700" : ""}
                >
                  Mercado Shops
                </Button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">Keywords (separadas por coma)</label>
              <Input
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="ropa, calzado, accesorios..."
                className="text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">URLs personalizadas (una por linea)</label>
              <textarea
                value={customUrls}
                onChange={(e) => setCustomUrls(e.target.value)}
                placeholder={"https://mitienda.mitiendanube.com\nhttps://otratienda.mitiendanube.com"}
                className="w-full text-sm border border-slate-200 rounded-lg p-3 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <Button
              onClick={startScraping}
              disabled={status?.running}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              {status?.running ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Scrapeando...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Iniciar Scraping
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Acciones rapidas */}
        <Card className="bg-white border-slate-200 lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Acciones</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" onClick={selectAllEmails} className="justify-start bg-transparent">
                <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                Seleccionar todos
              </Button>
              <Button variant="outline" onClick={deselectAll} className="justify-start bg-transparent">
                <Filter className="w-4 h-4 mr-2 text-slate-500" />
                Deseleccionar todos
              </Button>
              <Button variant="outline" onClick={exportCsv} className="justify-start bg-transparent">
                <Download className="w-4 h-4 mr-2 text-blue-600" />
                Exportar CSV
              </Button>
              <Button variant="outline" onClick={clearResults} className="justify-start text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent">
                <Trash2 className="w-4 h-4 mr-2" />
                Limpiar todo
              </Button>
            </div>

            {selectedEmails.size > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
                <p className="text-sm font-medium text-blue-800">
                  {selectedEmails.size} emails seleccionados
                </p>
                <Button
                  onClick={copyEmailsForPromo}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Copiar emails para Promo Mail
                </Button>
              </div>
            )}

            {/* Filtros */}
            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                  placeholder="Buscar por nombre, URL o email..."
                  className="text-sm"
                />
              </div>
              <Button
                variant={onlyWithEmail ? "default" : "outline"}
                size="sm"
                onClick={() => { setOnlyWithEmail(!onlyWithEmail); setPage(1) }}
                className={onlyWithEmail ? "bg-green-600 text-white hover:bg-green-700" : ""}
              >
                <Mail className="w-4 h-4 mr-1" />
                Solo con email
              </Button>
              <Button variant="outline" size="sm" onClick={loadData}>
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de resultados */}
      <Card className="bg-white border-slate-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Resultados ({totalResults})</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                Anterior
              </Button>
              <span className="text-sm text-slate-500">Pag {page}</span>
              <Button variant="outline" size="sm" disabled={results.length < 50} onClick={() => setPage(page + 1)}>
                Siguiente
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {results.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Globe className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No hay resultados todavia</p>
              <p className="text-sm mt-1">Inicia un scraping para encontrar tiendas</p>
            </div>
          ) : (
            <div className="space-y-2">
              {results.map((r, i) => (
                <div
                  key={`${r.url}-${i}`}
                  className={`border rounded-lg p-4 transition-colors ${
                    r.emails?.some((e) => selectedEmails.has(e))
                      ? "bg-blue-50 border-blue-200"
                      : "bg-white border-slate-100 hover:border-slate-200"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-slate-900 truncate">{r.title || "Sin nombre"}</h4>
                        <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-600 shrink-0">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                      <p className="text-xs text-slate-400 truncate mb-2">{r.url}</p>

                      <div className="flex flex-wrap gap-2">
                        {r.emails?.map((email) => (
                          <button
                            key={email}
                            type="button"
                            onClick={() => toggleEmail(email)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                              selectedEmails.has(email)
                                ? "bg-blue-100 text-blue-800 border border-blue-300"
                                : "bg-green-50 text-green-700 border border-green-200 hover:bg-green-100"
                            }`}
                          >
                            <Mail className="w-3 h-3" />
                            {email}
                          </button>
                        ))}
                        {r.phones?.map((phone) => (
                          <span key={phone} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-amber-50 text-amber-700 border border-amber-200">
                            <Phone className="w-3 h-3" />
                            {phone}
                          </span>
                        ))}
                        {r.whatsapps?.map((wa) => (
                          <a key={wa} href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-green-50 text-green-700 border border-green-200 hover:bg-green-100">
                            <Phone className="w-3 h-3" />
                            WhatsApp
                          </a>
                        ))}
                        {r.socialLinks?.instagram && (
                          <a href={`https://instagram.com/${r.socialLinks.instagram}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-pink-50 text-pink-700 border border-pink-200 hover:bg-pink-100">
                            @{r.socialLinks.instagram}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
