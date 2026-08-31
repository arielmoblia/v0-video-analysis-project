"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FileText, Plus, X, ExternalLink, CheckCircle, TrendingUp, MousePointerClick, ShoppingCart, GripVertical, Sparkles, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type PageStatus = "diseno" | "codigo" | "publicada" | "revisar"

interface ContentPage {
  id: string
  title: string
  url: string
  keyword: string
  status: PageStatus
  publishedAt: string | null
  position: number | null
  clicks: number | null
  impressions: number | null
  visits: number | null
  conversions: number | null
  noindex: boolean
  show_in_header?: boolean
  show_in_footer?: boolean
  nav_label?: string
  ia?: { gpt?: boolean | null; gemini?: boolean | null; claude?: boolean | null }
  isAI?: boolean
  ubicacionAI?: string[]
}

const INITIAL_PAGES: ContentPage[] = [
  { id: "home", title: "Home", url: "/", keyword: "crear tienda online gratis argentina", status: "publicada", publishedAt: "2024", position: 5.1, clicks: 60, impressions: 1005, visits: 120, conversions: 18, noindex: false, ia: { gpt: false, gemini: false, claude: false } },
  { id: "plan-gratis", title: "Plan Gratis", url: "/plan-gratis", keyword: "tienda online gratis argentina", status: "publicada", publishedAt: "2024", position: 3.8, clicks: 1, impressions: 93, visits: null, conversions: null, noindex: false, ia: { gpt: false, gemini: false, claude: false } },
  { id: "plan-cositas", title: "Plan Cositas", url: "/plan-cositas", keyword: "funcionalidades tienda online argentina", status: "publicada", publishedAt: "2024", position: null, clicks: null, impressions: null, visits: null, conversions: null, noindex: false, ia: { gpt: null, gemini: null, claude: null } },
  { id: "plan-socio", title: "Plan Socio", url: "/plan-socio", keyword: "plan socio tol.ar", status: "publicada", publishedAt: "2024", position: 3.6, clicks: 4, impressions: 45, visits: null, conversions: null, noindex: true, ia: { gpt: false, gemini: false, claude: false } },
  { id: "plan-a-medida", title: "Plan a Medida", url: "/plan-a-medida", keyword: "tienda online a medida argentina", status: "publicada", publishedAt: "2024", position: null, clicks: null, impressions: null, visits: null, conversions: null, noindex: true, ia: { gpt: null, gemini: null, claude: null } },
  { id: "cobros", title: "Cobros", url: "/cobros", keyword: "cobros tienda online argentina", status: "publicada", publishedAt: "Mar 2025", position: 18.4, clicks: 14, impressions: 210, visits: 31, conversions: 2, noindex: true, ia: { gpt: false, gemini: false, claude: false } },
  { id: "contacto", title: "Contacto", url: "/contacto", keyword: "contacto tol.ar", status: "publicada", publishedAt: "2024", position: null, clicks: null, impressions: null, visits: null, conversions: null, noindex: true, ia: { gpt: null, gemini: null, claude: null } },
  { id: "privacidad", title: "Privacidad", url: "/privacidad", keyword: "privacidad tol.ar", status: "publicada", publishedAt: "2024", position: null, clicks: null, impressions: null, visits: null, conversions: null, noindex: false, ia: { gpt: null, gemini: null, claude: null } },
  { id: "terminos", title: "Términos", url: "/terminos", keyword: "terminos tol.ar", status: "publicada", publishedAt: "2024", position: 5.1, clicks: 5, impressions: 89, visits: null, conversions: null, noindex: false, ia: { gpt: null, gemini: null, claude: null } },
  { id: "alternativa-tiendanube", title: "Alternativa Tiendanube", url: "/comparar/tiendanube", keyword: "alternativa tiendanube argentina", status: "diseno", publishedAt: null, position: null, clicks: null, impressions: null, visits: null, conversions: null, noindex: true, ia: { gpt: null, gemini: null, claude: null } },
  { id: "alt-mercado-shops", title: "Alternativa Mercado Shops", url: "/alternativa-mercado-shops", keyword: "alternativa mercado shops argentina", status: "revisar", publishedAt: "Ene 2025", position: 34.1, clicks: 4, impressions: 190, visits: 8, conversions: 0, noindex: true, ia: { gpt: false, gemini: false, claude: false } },
  { id: "plan-migrar", title: "Migrar a tol.ar", url: "/plan-migrar", keyword: "migrar tienda mercado shops tol.ar", status: "publicada", publishedAt: "Ene 2025", position: null, clicks: null, impressions: null, visits: null, conversions: null, noindex: true, ia: { gpt: null, gemini: null, claude: null } },
  { id: "cositas", title: "Cositas (catálogo)", url: "/cositas", keyword: "funciones extra tienda online", status: "publicada", publishedAt: "2024", position: null, clicks: null, impressions: null, visits: null, conversions: null, noindex: true, ia: { gpt: null, gemini: null, claude: null } },
  { id: "blog", title: "Blog", url: "/blog", keyword: "blog ecommerce argentina", status: "diseno", publishedAt: null, position: null, clicks: null, impressions: null, visits: null, conversions: null, noindex: true, ia: { gpt: null, gemini: null, claude: null } },
  { id: "especialista", title: "Especialista", url: "/especialista", keyword: "que alguien me arme mi tienda online argentina", status: "publicada", publishedAt: "May 2026", position: null, clicks: null, impressions: null, visits: null, conversions: null, noindex: false, ia: { gpt: null, gemini: null, claude: null } },
  { id: "ayuda-mercadopago", title: "Ayuda Mercado Pago", url: "/ayuda/mercadopago", keyword: "como configurar mercado pago en mi tienda online", status: "publicada", publishedAt: "May 2026", position: null, clicks: null, impressions: null, visits: null, conversions: null, noindex: false, ia: { gpt: null, gemini: null, claude: null } },
  { id: "templates", title: "Templates", url: "/templates", keyword: "plantillas tienda online argentina", status: "publicada", publishedAt: "2024", position: null, clicks: null, impressions: null, visits: null, conversions: null, noindex: true, ia: { gpt: null, gemini: null, claude: null } },
  { id: "diseno-ia", title: "Diseño con IA", url: "/diseno-ia", keyword: "diseño tienda online inteligencia artificial", status: "publicada", publishedAt: "2024", position: null, clicks: null, impressions: null, visits: null, conversions: null, noindex: true, ia: { gpt: null, gemini: null, claude: null } },
  { id: "empleos", title: "Empleos", url: "/empleos", keyword: "empleos ecommerce argentina", status: "publicada", publishedAt: "2024", position: null, clicks: null, impressions: null, visits: null, conversions: null, noindex: true, ia: { gpt: null, gemini: null, claude: null } },
]

const STATUS_CONFIG: Record<PageStatus, { label: string; cls: string }> = {
  diseno:    { label: "Diseño",     cls: "bg-blue-100 text-blue-800" },
  codigo:    { label: "En código",  cls: "bg-amber-100 text-amber-800" },
  publicada: { label: "Publicada",  cls: "bg-green-100 text-green-800" },
  revisar:   { label: "Revisar",    cls: "bg-red-100 text-red-800" },
}

function StatusBadge({ status }: { status: PageStatus }) {
  const { label, cls } = STATUS_CONFIG[status]
  return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cls}`}>{label}</span>
}

function N({ v, s = "" }: { v: number | null; s?: string }) {
  if (v === null) return <span className="text-slate-300">—</span>
  return <span className="font-medium">{v}{s}</span>
}

function IaDot({ value }: { value: boolean | null | undefined }) {
  if (value === null || value === undefined) return <span className="inline-block w-2.5 h-2.5 rounded-full bg-slate-200 mx-auto" title="Sin datos" />
  if (value) return <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-500 mx-auto" title="Nos menciona" />
  return <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-400 mx-auto" title="No aparecemos" />
}

export function SeoContenidoTab() {
  const { toast } = useToast()
  const [pages, setPages] = useState<ContentPage[]>([])
  useEffect(() => {
    Promise.all([
      fetch("/api/super-admin/seo-pages").then(r => r.json()),
      fetch("/api/super-admin/geo-publicar").then(r => r.json()),
    ]).then(([seoData, geoData]) => {
      const seoPages: ContentPage[] = Array.isArray(seoData) ? seoData.map((s: any) => ({
        id: s.id,
        title: s.nav_label || s.meta_title || s.url,
        url: s.url,
        keyword: s.keyword || "",
        status: "publicada" as PageStatus,
        publishedAt: null,
        position: null,
        clicks: null,
        impressions: null,
        visits: null,
        conversions: null,
        noindex: s.noindex,
        show_in_header: s.show_in_header,
        show_in_footer: s.show_in_footer,
        nav_label: s.nav_label,
        meta_title: s.meta_title || "",
        meta_description: s.meta_description || "",
      })) : []
      const seoUrlSet = new Set(seoPages.map(p => p.url))
      const aiPages: ContentPage[] = (geoData.data || []).filter((p: any) => !seoUrlSet.has(`/${p.slug}`)).map((p: any) => ({
        id: `ai-${p.slug}`,
        title: p.nombre_link || p.slug,
        url: `/${p.slug}`,
        keyword: p.frase || p.slug,
        status: (p.estado === "publicada" ? "publicada" : "codigo") as PageStatus,
        publishedAt: null,
        position: null,
        clicks: null,
        impressions: null,
        visits: null,
        conversions: null,
        noindex: false,
        isAI: true,
        ubicacionAI: p.ubicacion || ["escondida"],
      }))
      setPages([...seoPages, ...aiPages])
      setSeoLoaded(true)
    }).catch(() => {})
  }, [])

  const [seoLoaded, setSeoLoaded] = useState(false)
  const [layoutsExistentes, setLayoutsExistentes] = useState<Set<string>>(new Set())
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ title: "", url: "", keyword: "", status: "diseno" as PageStatus, meta_title: "", meta_description: "" })
  const [sortCol, setSortCol] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")
  const [generandoPagina, setGenerandoPagina] = useState<string | null>(null)
  const [showVisibilityMenu, setShowVisibilityMenu] = useState<string | null>(null)
  const [deployingPageId, setDeployingPageId] = useState<string | null>(null)
  const [prodPages, setProdPages] = useState<Set<string>>(new Set())
  const dragItem = useRef<number | null>(null)
  const dragOver = useRef<number | null>(null)

  useEffect(() => {
    async function loadVisits() {
      try {
        const res = await fetch("/api/super-admin/page-visits")
        if (!res.ok) return
        const data = await res.json()
        if (!data.visits) return
        setPages(prev => prev.map(p => ({
          ...p,
          visits: data.visits[p.url] ?? p.visits
        })))
      } catch {}
    }
    if (seoLoaded) loadVisits()
  }, [seoLoaded])

  useEffect(() => {
    async function loadGscData() {
      try {
        const res = await fetch("/api/super-admin/search-console")
        if (!res.ok) return
        const data = await res.json()
        if (!data.topPages) return
        setPages(prev => prev.map(p => {
          const match = data.topPages.find((gp: any) =>
            gp.page.replace("https://tol.ar", "") === p.url ||
            gp.page === `https://tol.ar${p.url}`
          )
          if (!match) return p
          return { ...p, clicks: match.clicks ?? p.clicks, impressions: match.impressions ?? p.impressions, position: match.position ? parseFloat(match.position.toFixed(1)) : p.position }
        }))
      } catch {}
    }
    if (seoLoaded) loadGscData()
  }, [seoLoaded])

  useEffect(() => {
    async function loadGeoResultados() {
      try {
        const [pregRes, resRes] = await Promise.all([
          fetch("/api/super-admin/geo-preguntas").then(r => r.json()),
          fetch("/api/super-admin/geo-resultados").then(r => r.json())
        ])
        if (!pregRes.success || !resRes.success) return
        setPages(prev => prev.map(p => {
          const kwLower = p.keyword.toLowerCase()
          const matchPreg = pregRes.data.find((q: any) => q.pregunta.toLowerCase().includes(kwLower.split(" ")[0]) || kwLower.includes(q.pregunta.toLowerCase().split(" ")[0]))
          if (!matchPreg) return p
          const gpt = resRes.data.find((r: any) => r.pregunta_id === matchPreg.id && r.ia === "chatgpt")
          const gemini = resRes.data.find((r: any) => r.pregunta_id === matchPreg.id && r.ia === "gemini")
          const claude = resRes.data.find((r: any) => r.pregunta_id === matchPreg.id && r.ia === "claude")
          return { ...p, ia: { gpt: gpt?.menciona_tolar ?? null, gemini: gemini?.menciona_tolar ?? null, claude: claude?.menciona_tolar ?? null } }
        }))
      } catch {}
    }
    loadGeoResultados()
  }, [])

  const published = pages.filter(p => p.status === "publicada")
  const totalClicks = pages.reduce((s, p) => s + (p.clicks || 0), 0)
  const totalConv = pages.reduce((s, p) => s + (p.conversions || 0), 0)
  const posPages = published.filter(p => p.position !== null)
  const avgPos = posPages.length > 0 ? (posPages.reduce((s, p) => s + (p.position || 0), 0) / posPages.length).toFixed(1) : "—"

  const handleSort = (col: string) => {
    if (sortCol === col) {
      setSortDir(d => d === "asc" ? "desc" : "asc")
    } else {
      setSortCol(col)
      setSortDir("asc")
    }
  }

  const sortedPages = [...pages].sort((a, b) => {
    if (!sortCol) return 0
    let av: any, bv: any
    if (sortCol === "title") { av = a.title; bv = b.title }
    else if (sortCol === "status") { av = a.status; bv = b.status }
    else if (sortCol === "position") { av = a.position ?? 9999; bv = b.position ?? 9999 }
    else if (sortCol === "clicks") { av = a.clicks ?? -1; bv = b.clicks ?? -1 }
    else if (sortCol === "impressions") { av = a.impressions ?? -1; bv = b.impressions ?? -1 }
    else if (sortCol === "visits") { av = a.visits ?? -1; bv = b.visits ?? -1 }
    else if (sortCol === "conversions") { av = a.conversions ?? -1; bv = b.conversions ?? -1 }
    else if (sortCol === "noindex") { av = a.noindex ? 1 : 0; bv = b.noindex ? 1 : 0 }
    else if (sortCol === "ubicacion") {
      const aLoc = a.show_in_header && a.show_in_footer ? "menu+footer" : a.show_in_header ? "menu" : a.show_in_footer ? "footer" : "escondida"
      const bLoc = b.show_in_header && b.show_in_footer ? "menu+footer" : b.show_in_header ? "menu" : b.show_in_footer ? "footer" : "escondida"
      av = aLoc; bv = bLoc
    }
    else if (sortCol === "seo") {
      av = layoutsExistentes.has(a.url) ? 1 : 0
      bv = layoutsExistentes.has(b.url) ? 1 : 0
    }
    else return 0
    if (av < bv) return sortDir === "asc" ? -1 : 1
    if (av > bv) return sortDir === "asc" ? 1 : -1
    return 0
  })

  const [busqueda, setBusqueda] = useState("")
  const [sugerencias, setSugerencias] = useState<{frase: string}[]>([])
  const [seleccionadas, setSeleccionadas] = useState<string[]>([])
  const [prompt, setPrompt] = useState("")
  const [buscando, setBuscando] = useState(false)
  const [ultimaGenerada, setUltimaGenerada] = useState<string | null>(null)
  const [nombreLink, setNombreLink] = useState('')
  const [ubicacion, setUbicacion] = useState<string[]>(['escondida'])

  const buscarSugerencias = async (q?: string) => {
    const query = q || busqueda
    if (!query.trim()) return
    setBuscando(true)
    try {
      const res = await fetch(`https://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(query)}&hl=es&callback=cb`, { mode: "no-cors" })
      .catch(() => null)
      
      const res2 = await fetch(`/api/super-admin/google-suggest?q=${encodeURIComponent(query)}`)
      const data = await res2.json()
      setSugerencias(data.sugerencias || [])
    } catch {
      toast({ title: "Error al buscar sugerencias" })
    } finally {
      setBuscando(false)
    }
  }

  const buscarEnTiempoReal = async (valor: string) => {
    setBusqueda(valor)
    if (valor.length < 3) { setSugerencias([]); return }
    setBuscando(true)
    try {
      const res = await fetch(`/api/super-admin/google-suggest?q=${encodeURIComponent(valor)}`)
      const data = await res.json()
      setSugerencias(data.sugerencias || [])
    } catch {} finally {
      setBuscando(false)
    }
  }

  const toggleSeleccion = (frase: string) => {
    setSeleccionadas(prev => prev.includes(frase) ? prev.filter(f => f !== frase) : [...prev, frase])
  }

  const handleGenerarPagina = async () => {
    if (seleccionadas.length === 0) return
    setGenerandoPagina("generando")
    try {
      const res = await fetch("/api/super-admin/geo-generar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ frase: seleccionadas[0], frases: seleccionadas, prompt })
      })
      const data = await res.json()
      if (data.success) {
        const { slug, ...contenido } = data.content
        for (const [key, value] of Object.entries(contenido)) {
          await fetch("/api/geo-pagina", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ slug, key, value })
          })
        }
        setUltimaGenerada(slug)
                toast({ title: "Página generada — revisá y editá antes de publicar" })
      }
    } catch {
      toast({ title: "Error al generar", variant: "destructive" } as any)
    } finally {
      setGenerandoPagina(null)
    }
  }

  const handleDragSort = () => {
    if (dragItem.current === null || dragOver.current === null) return
    const newPages = [...pages]
    const dragged = newPages.splice(dragItem.current, 1)[0]
    newPages.splice(dragOver.current, 0, dragged)
    dragItem.current = null
    dragOver.current = null
    setPages(newPages)
  }

  const resetForm = () => { setForm({ title: "", url: "", keyword: "", status: "diseno" }); setEditingId(null); setShowForm(false) }

  const handleEdit = (p: ContentPage) => {
    setForm({ title: p.title, url: p.url, keyword: p.keyword, status: p.status, meta_title: (p as any).meta_title || "", meta_description: (p as any).meta_description || "" })
    setEditingId(p.id)
    setShowForm(true)
  }

  const handleSave = async () => {
    if (!form.title || !form.url) return
    if (editingId) {
      // Guardar en Supabase
      await fetch("/api/super-admin/seo-pages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingId, meta_title: form.meta_title, meta_description: form.meta_description, keyword: form.keyword })
      })
      setPages(pages.map(p => p.id === editingId ? { ...p, ...form } : p))
      toast({ title: "Página actualizada" })
    } else {
      const newPage = { id: Date.now().toString(), ...form, publishedAt: null, position: null, clicks: null, impressions: null, visits: null, conversions: null, noindex: true, ia: { gpt: null, gemini: null, claude: null } }
      setPages([...pages, newPage])
      // Guardar en Supabase
      await fetch("/api/super-admin/seo-pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: newPage.id, url: form.url, keyword: form.keyword, meta_title: (form as any).meta_title || "", meta_description: (form as any).meta_description || "" })
      })
      toast({ title: "Página agregada" })
    }
    resetForm()
  }

  const handleDelete = async (page: any) => {
    if (!confirm(`¿Borrar la página ${page.url}?\n\nEsto va a eliminar PARA SIEMPRE:\n- La carpeta del VPS\n- La fila de Supabase\n- El layout SEO`)) return
    if (!confirm(`¿Estás SEGURO de borrar ${page.url}?\n\nEsta acción NO se puede deshacer.`)) return
    try {
      const res = await fetch("/api/super-admin/delete-page", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: page.url })
      })
      const data = await res.json()
      if (data.ok) {
        setPages(pages.filter(p => p.id !== page.id))
        setLayoutsExistentes(prev => {
          const next = new Set(prev)
          next.delete(page.url)
          return next
        })
        toast({ title: "✅ Página eliminada — recordá hacer deploy" })
      } else {
        toast({ title: data.error || "Error al borrar página" })
      }
    } catch {
      toast({ title: "Error al borrar página" })
    }
  }

  const handleActivarSEO = async (page: any) => {
    const isActive = layoutsExistentes.has(page.url)
    if (isActive) {
      if (!confirm(`¿Desactivar SEO de ${page.url}?\n\nLa página dejará de tener meta title y description para Google.`)) return
      try {
        const res = await fetch("/api/super-admin/create-layout", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: page.url })
        })
        const data = await res.json()
        if (data.ok) {
          setLayoutsExistentes(prev => {
            const next = new Set(prev)
            next.delete(page.url)
            return next
          })
          toast({ title: "SEO desactivado" })
        } else {
          toast({ title: "Error al desactivar SEO" })
        }
      } catch {
        toast({ title: "Error al desactivar SEO" })
      }
      return
    }
    try {
      const res = await fetch("/api/super-admin/create-layout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageId: page.id, url: page.url })
      })
      const data = await res.json()
      if (data.ok) {
        setLayoutsExistentes(prev => new Set([...prev, page.url]))
        toast({ title: data.msg === "Ya existe" ? "SEO ya estaba activo" : "✅ SEO activado — recordá hacer deploy" })
      } else {
        toast({ title: "Error al activar SEO" })
      }
    } catch {
      toast({ title: "Error al activar SEO" })
    }
  }

  const handleToggleNoindex = async (id: string, current: boolean) => {
    const newVal = !current
    setPages(pages.map(p => p.id === id ? { ...p, noindex: newVal } : p))
    try {
      await fetch("/api/super-admin/seo-pages", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, noindex: newVal }) })
      toast({ title: newVal ? "🔴 Google no ve esta página" : "🟢 Google puede ver esta página" })
    } catch {
      setPages(pages.map(p => p.id === id ? { ...p, noindex: current } : p))
    }
  }
  const handleUpdateVisibility = async (id: string, field: "show_in_header" | "show_in_footer", value: boolean, navLabel?: string) => {
    setPages(pages.map(p => p.id === id ? { ...p, [field]: value, ...(navLabel !== undefined ? { nav_label: navLabel } : {}) } : p))
    try {
      await fetch("/api/super-admin/seo-pages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, [field]: value, ...(navLabel !== undefined ? { nav_label: navLabel } : {}) })
      })
      toast({ title: "✅ Visibilidad actualizada" })
    } catch {
      toast({ title: "Error al guardar", variant: "destructive" })
    }
  }

  const handleDeployPage = async (pageId: string) => {
    if (deployingPageId) return
    setDeployingPageId(pageId)
    try {
      await fetch("/api/super-admin/deploy", { method: "POST" })
      const poll = setInterval(async () => {
        try {
          const r = await fetch("/api/super-admin/deploy")
          const d = await r.json()
          if (d.status === "done") {
            clearInterval(poll)
            setDeployingPageId(null)
            setProdPages(prev => new Set([...prev, pageId]))
            toast({ title: "✅ Página publicada en producción" })
          } else if (d.status === "error") {
            clearInterval(poll)
            setDeployingPageId(null)
            toast({ title: "❌ Error al publicar", variant: "destructive" })
          }
        } catch {}
      }, 4000)
    } catch {
      setDeployingPageId(null)
      toast({ title: "❌ Error al publicar", variant: "destructive" })
    }
  }

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2"><FileText className="w-5 h-5 text-blue-500" />SEO Contenido</h3>
          <p className="text-sm text-slate-500">Páginas creadas para captar tráfico orgánico de Google</p>
        </div>
        <Button size="sm" variant="outline" onClick={() => { resetForm(); setShowForm(true) }} className="flex items-center gap-2"><Plus className="w-4 h-4" />Nueva página</Button>
      </div>

      <div className="grid grid-cols-5 gap-3">
        {[
          { Icon: FileText, label: "Páginas publicadas", value: `${published.length}`, note: `de ${pages.length} en total` },
          { Icon: CheckCircle, label: "Indexadas Google", value: `${published.length}`, note: `de ${published.length} publicadas` },
          { Icon: TrendingUp, label: "Posición promedio", value: `${avgPos}`, note: "meta: bajar a 5" },
          { Icon: MousePointerClick, label: "Clicks (28 días)", value: `${totalClicks}`, note: "desde Google" },
          { Icon: ShoppingCart, label: "Conversiones", value: `${totalConv}`, note: "registros desde estas páginas" },
        ].map(s => (
          <div key={s.label} className="bg-slate-50 rounded-lg p-4">
            <div className="flex items-center gap-1.5 mb-1"><s.Icon className="w-3.5 h-3.5 text-slate-400" /><p className="text-xs text-slate-500">{s.label}</p></div>
            <p className="text-2xl font-semibold text-slate-800">{s.value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{s.note}</p>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={resetForm}>
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3 max-w-3xl w-full shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between">
            <p className="text-base font-semibold text-slate-700">{editingId ? "Editar página" : "Nueva página de contenido"}</p>
            <button onClick={resetForm} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs text-slate-500 mb-1 block">Título</label><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Ej: Alternativa Tiendanube" className="text-sm" /></div>
            <div><label className="text-xs text-slate-500 mb-1 block">URL</label><Input value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} placeholder="/alternativa-tiendanube" className="text-sm" /></div>
            <div><label className="text-xs text-slate-500 mb-1 block">Keyword objetivo</label><Input value={form.keyword} onChange={e => setForm({ ...form, keyword: e.target.value })} placeholder="alternativa tiendanube argentina" className="text-sm" /></div>
            <div className="col-span-2"><label className="text-xs text-slate-500 mb-1 block">Meta Title (para Google)</label><Input value={form.meta_title} onChange={e => setForm({ ...form, meta_title: e.target.value })} placeholder="Ej: Plan Cositas | Funcionalidades para tu tienda online — tol.ar" className="text-sm" /></div>
            <div className="col-span-2"><label className="text-xs text-slate-500 mb-1 block">Meta Description (para Google)</label><Input value={form.meta_description} onChange={e => setForm({ ...form, meta_description: e.target.value })} placeholder="Describí la página en 150 caracteres" className="text-sm" /></div>
            <div><label className="text-xs text-slate-500 mb-1 block">Estado</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as PageStatus })} className="w-full text-sm border border-input rounded-md px-3 py-2 bg-background">
                <option value="diseno">Diseño</option><option value="codigo">En código</option><option value="publicada">Publicada</option><option value="revisar">Revisar</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2"><Button size="sm" onClick={handleSave}>Guardar</Button><Button size="sm" variant="outline" onClick={resetForm}>Cancelar</Button></div>
        </div>
        </div>
      )}

      <div className="rounded-xl overflow-hidden border border-amber-200" style={{ background: "#FFF8F0" }}>
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-amber-200" style={{ background: "#FEF0DC" }}>
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span className="text-xs font-semibold text-amber-800 uppercase tracking-wide">Crear página con IA para Google</span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">Google Autocomplete</span>
        </div>

        <div className="flex gap-2 p-4 border-b border-amber-100">
          <Input
            value={busqueda}
            onChange={e => buscarEnTiempoReal(e.target.value)}
            onKeyDown={e => e.key === "Enter" && buscarSugerencias()}
            placeholder="Ej: vender online argentina, tienda gratis..."
            className="flex-1 text-sm bg-white"
          />
          <Button size="sm" variant="outline" onClick={buscarSugerencias} disabled={buscando} className="border-amber-300 text-amber-800 hover:bg-amber-50">
            {buscando ? <RefreshCw className="w-3 h-3 animate-spin" /> : "Buscar en Google"}
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4 p-4 border-b border-amber-100">
          <div>
            {sugerencias.length > 0 ? (
              <div className="space-y-1">
                {sugerencias.map((s, i) => (
                  <div key={i} onClick={() => toggleSeleccion(s.frase)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-amber-100 hover:border-amber-300 cursor-pointer transition-colors">
                    <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${seleccionadas.includes(s.frase) ? "bg-amber-500 border-amber-500" : "border-slate-300"}`}>
                      {seleccionadas.includes(s.frase) && <span className="text-white text-[10px]">✓</span>}
                    </div>
                    <span className="text-sm text-slate-700 flex-1">{s.frase}</span>
                    {(s as any).pct !== undefined && (
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full">
                          <div className="h-1.5 rounded-full" style={{ width: `${(s as any).pct}%`, background: (s as any).color }} />
                        </div>
                        <span className="text-[11px] font-medium w-7 text-right" style={{ color: (s as any).color }}>{(s as any).pct}%</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-amber-400 italic py-8">
                Buscá una frase para ver las sugerencias de Google
              </div>
            )}
          </div>
          <div>
            <p className="text-xs font-medium text-amber-800 mb-1">Brief para Claude <span className="text-amber-400 font-normal">(opcional)</span></p>
            <p className="text-[11px] text-amber-600 mb-2">Contale de qué trata la página y qué querés que diga</p>
            <textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="Ej: Esta página es para emprendedores que quieren vender online pero no saben cómo. tol.ar les da todo listo sin que tengan que saber de tecnología..."
              className="w-full text-sm border border-amber-200 rounded-lg px-3 py-2 resize-none bg-white"
              style={{ height: "160px" }}
            />
          </div>
        </div>

        <div className="px-4 py-3 border-t border-amber-100">
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <p className="text-xs font-medium text-amber-800 mb-2">¿Dónde va el link?</p>
              <div className="flex gap-2 flex-wrap">
                {[
                  { key: "escondida", label: "Escondida", sub: "Solo Google y las IAs" },
                  { key: "menu", label: "Menú", sub: "En la cabecera" },
                  { key: "footer", label: "Footer", sub: "Abajo del sitio" },
                  { key: "solo-link", label: "Solo link", sub: "Para compartir" },
                ].map(op => (
                  <div key={op.key}
                    onClick={() => setUbicacion((prev: string[]) => prev.includes(op.key) ? prev.filter((u: string) => u !== op.key) : [...prev, op.key])}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors select-none ${ubicacion.includes(op.key) ? "border-amber-400 bg-amber-50" : "border-amber-200 bg-white"}`}>
                    <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center flex-shrink-0 ${ubicacion.includes(op.key) ? "bg-amber-500 border-amber-500" : "border-slate-300"}`}>
                      {ubicacion.includes(op.key) && <span className="text-white text-[9px]">✓</span>}
                    </div>
                    <div>
                      <div className="text-xs font-medium text-amber-900">{op.label}</div>
                      <div className="text-[10px] text-amber-600">{op.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-amber-800 mb-1">Nombre del link <span className="font-normal text-amber-500">(lo que ve el humano)</span></p>
              <Input value={nombreLink} onChange={e => setNombreLink(e.target.value)} placeholder="Ej: Cómo vender sin comisiones" className="text-sm bg-white border-amber-200" />
              {ultimaGenerada && <p className="text-[11px] text-amber-600 mt-1">URL: tol.ar/{ultimaGenerada}</p>}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 px-4 py-3 border-t border-amber-100">
          <Button size="sm" onClick={handleGenerarPagina} disabled={!!generandoPagina || seleccionadas.length === 0} className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white border-0">
            <Sparkles className="w-3 h-3" />
            {generandoPagina ? "Generando..." : "Generar página"}
          </Button>
          {ultimaGenerada && (
            <a href={`/arielmobilia/${ultimaGenerada}`} target="_blank" rel="noopener noreferrer" className="text-sm px-4 py-1.5 rounded-lg border border-amber-300 bg-white text-amber-700 hover:bg-amber-50 transition-colors">
              Ver página
            </a>
          )}
          {ultimaGenerada && (
            <button onClick={async () => {
              await fetch("/api/super-admin/geo-publicar", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug: ultimaGenerada, ubicacion, nombreLink }) })
              toast({ title: "¡Página publicada! Google recibirá el ping." })
            }} className="text-sm px-4 py-1.5 rounded-lg border border-green-300 bg-white text-green-700 hover:bg-green-50 transition-colors">
              Publicar en tol.ar
            </button>
          )}
          {seleccionadas.length > 0 && <span className="text-xs text-amber-600">{seleccionadas.length} frases seleccionadas</span>}
        </div>
      </div>

      <div className="border border-slate-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <div>
            <table className="w-full text-sm">
              <thead className="sticky top-0 z-10">
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="w-6 px-2 py-2"></th>
                  {[
                    { label: "Página", col: "title" },
                    { label: "Estado", col: "status" },
                    { label: "Ve Google", col: "noindex" },
                    { label: "Pos.", col: "position" },
                    { label: "Clicks", col: "clicks" },
                    { label: "Impr.", col: "impressions" },
                    { label: "Visitas", col: "visits" },
                    { label: "Conv.", col: "conversions" },
                    { label: "GPT", col: null },
                    { label: "Gemini", col: null },
                    { label: "Claude", col: null },
                    { label: "Ubicación", col: "ubicacion" },
                    { label: "", col: null },
                    { label: "SEO", col: "seo" },
                    { label: "", col: null },
                    { label: "", col: null },
                  ].map(({ label, col }, idx) => (
                    <th key={`th-${idx}-${label}`} onClick={col ? () => handleSort(col) : undefined}
                      className={`text-left px-2 py-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap ${col ? "cursor-pointer hover:text-slate-800 select-none" : ""}`}>
                      {label}{col && sortCol === col ? (sortDir === "asc" ? " ↑" : " ↓") : ""}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedPages.map((page, i) => (
                  <tr key={page.id}
                    draggable
                    onDragStart={() => { dragItem.current = i }}
                    onDragEnter={() => { dragOver.current = i }}
                    onDragEnd={handleDragSort}
                    onDragOver={e => e.preventDefault()}
                    className={`transition-colors cursor-grab active:cursor-grabbing ${page.isAI ? "" : "hover:bg-slate-50"} ${i < pages.length - 1 ? "border-b border-slate-100" : ""}`}
                    style={page.isAI ? { backgroundColor: "#e0f2fe" } : {}}>
                    <td className="px-2 py-2 text-slate-300 hover:text-slate-500"><GripVertical className="w-3.5 h-3.5" /></td>
                    <td className="pl-2 pr-2 py-2">
                      {page.isAI ? (
                        <input
                          defaultValue={page.title}
                          onBlur={async (e) => {
                            const val = e.target.value.trim()
                            if (!val || val === page.title) return
                            await fetch("/api/super-admin/geo-publicar", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug: page.url.replace("/",""), nombreLink: val }) })
                            setPages(prev => prev.map(p => p.id === page.id ? { ...p, title: val } : p))
                          }}
                          className="font-medium text-slate-800 text-xs border-0 border-b border-dashed border-sky-300 bg-transparent focus:outline-none focus:border-sky-500 w-full"
                        />
                      ) : (
                        <p className="font-medium text-slate-800 text-xs max-w-[140px] truncate">{page.title}</p>
                      )}
                      <div className="flex items-center gap-1 mt-0.5">
                        <p className="text-xs text-slate-400">{page.url}</p>
                        <a href={page.isAI ? `/arielmobilia${page.url}` : `https://tol.ar${page.url}`} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-600"><ExternalLink className="w-3 h-3" /></a>
                      </div>
                    </td>
                    <td className="px-2 py-2 whitespace-nowrap">
                      {page.isAI && page.status === "publicada" && !prodPages.has(page.id) ? (
                        deployingPageId === page.id ? (
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-orange-100 text-orange-700 animate-pulse cursor-wait">Subiendo...</span>
                        ) : (
                          <button onClick={() => handleDeployPage(page.id)} disabled={!!deployingPageId} className="text-xs px-2 py-0.5 rounded-full font-medium bg-orange-100 text-orange-700 hover:bg-orange-200 transition-colors cursor-pointer disabled:opacity-50">DEV →</button>
                        )
                      ) : (
                        <StatusBadge status={page.status} />
                      )}
                    </td>
                    <td className="px-2 py-2 text-center">
                      <button onClick={() => handleToggleNoindex(page.id, page.noindex)} className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors whitespace-nowrap ${!seoLoaded ? "bg-slate-100 text-slate-400" : page.noindex ? "bg-red-100 text-red-700 hover:bg-red-200" : "bg-green-100 text-green-700 hover:bg-green-200"}`}>
                        {!seoLoaded ? "..." : page.noindex ? "No" : "Sí"}
                      </button>
                    </td>
                    <td className="px-2 py-2 text-right text-xs"><N v={page.position} /></td>
                    <td className="px-2 py-2 text-right text-xs"><N v={page.clicks} /></td>
                    <td className="px-2 py-2 text-right text-xs"><N v={page.impressions} /></td>
                    <td className="px-2 py-2 text-right text-xs"><N v={page.visits} /></td>
                    <td className="px-2 py-2 text-right text-xs"><N v={page.conversions} /></td>
                    <td className="px-2 py-2 text-center"><IaDot value={page.ia?.gpt} /></td>
                    <td className="px-2 py-2 text-center"><IaDot value={page.ia?.gemini} /></td>
                    <td className="px-2 py-2 text-center"><IaDot value={page.ia?.claude} /></td>
                    <td className="px-2 py-2 text-right">
                      <div className="flex items-center justify-end gap-1 relative">
                        <button
                          onClick={() => setShowVisibilityMenu(showVisibilityMenu === page.id ? null : page.id)}
                          className={`text-xs px-2 py-1 border rounded transition-colors ${page.show_in_header || page.show_in_footer ? "border-green-200 bg-green-50 text-green-700 hover:bg-green-100" : "border-slate-200 hover:bg-slate-100 text-slate-600"}`}
                        >
                          {page.show_in_header && page.show_in_footer ? "Menú+Footer" : page.show_in_header ? "Menú" : page.show_in_footer ? "Footer" : "Ubicación"} ▾
                        </button>
                        {showVisibilityMenu === page.id && (
                          <div className="absolute right-6 top-6 z-50 bg-white border border-slate-200 rounded-lg shadow-lg p-3 w-52 space-y-2">
                            <p className="text-xs font-medium text-slate-500 mb-2">¿Dónde aparece?</p>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input type="checkbox" checked={!!page.show_in_header} onChange={e => handleUpdateVisibility(page.id, "show_in_header", e.target.checked)} className="rounded" />
                              <span className="text-xs">Menú principal</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input type="checkbox" checked={!!page.show_in_footer} onChange={e => handleUpdateVisibility(page.id, "show_in_footer", e.target.checked)} className="rounded" />
                              <span className="text-xs">Footer</span>
                            </label>
                            {!page.show_in_header && !page.show_in_footer && (
                              <p className="text-xs text-slate-400 pt-1 border-t">Solo por link directo</p>
                            )}
                            <div className="pt-2 border-t">
                              <p className="text-xs text-slate-500 mb-1">Texto en el menú</p>
                              <input
                                type="text"
                                placeholder={page.title}
                                defaultValue={page.nav_label || ""}
                                onBlur={e => handleUpdateVisibility(page.id, "show_in_header", !!page.show_in_header, e.target.value)}
                                className="w-full text-xs border border-slate-200 rounded px-2 py-1"
                              />
                            </div>
                            <button onClick={() => setShowVisibilityMenu(null)} className="w-full text-xs text-slate-400 hover:text-slate-600 pt-1">cerrar</button>
                          </div>
                        )}
                        {!page.isAI && (
                          <button onClick={() => handleEdit(page)} className="text-xs px-2 py-1 border border-slate-200 rounded hover:bg-slate-100 text-slate-600 transition-colors">Editar</button>
                        )}
                        <button onClick={() => handleActivarSEO(page)} className={`text-xs px-2 py-1 border rounded transition-colors ${layoutsExistentes.has(page.url) ? "border-green-300 bg-green-50 text-green-700 hover:bg-red-50 hover:border-red-300 hover:text-red-600" : "border-amber-200 hover:bg-amber-50 text-amber-700"}`} title={layoutsExistentes.has(page.url) ? "Click para desactivar SEO" : "Activar SEO para esta página"}>{layoutsExistentes.has(page.url) ? "✅ SEO activo" : "⚡ Activar SEO"}</button>
                        <a href={`https://search.google.com/search-console/inspect?resource_id=sc-domain%3Atol.ar&id=https://tol.ar${page.url}`} target="_blank" rel="noopener" className="text-xs px-2 py-1 border border-blue-200 rounded hover:bg-blue-50 text-blue-600 transition-colors" title="Solicitar indexación en Google">📋 Indexación</a>
                        <button onClick={() => handleDelete(page)} className="text-xs px-2 py-1 border border-red-200 rounded hover:bg-red-50 text-red-500 transition-colors" title="Borrar página">×</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>



      <div className="flex flex-wrap gap-5 pt-1">
        {(Object.entries(STATUS_CONFIG) as [PageStatus, { label: string; cls: string }][]).map(([key, { label, cls }]) => (
          <div key={key} className="flex items-center gap-1.5 text-xs text-slate-500">
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${cls}`}>{label}</span>
            {key === "diseno" && "Mockup en aprobación"}
            {key === "codigo" && "Siendo desarrollada"}
            {key === "publicada" && "Live en tol.ar"}
            {key === "revisar" && "Publicada con problemas"}
          </div>
        ))}
        <div className="flex items-center gap-3 text-xs text-slate-500 ml-auto">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block"></span>IA nos menciona</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block"></span>No aparecemos</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-slate-200 inline-block"></span>Sin datos</span>
        </div>
      </div>
    </div>
  )
}
