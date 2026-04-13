"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FileText, Plus, X, ExternalLink, CheckCircle, AlertCircle, TrendingUp, MousePointerClick, ShoppingCart } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type PageStatus = "diseno" | "codigo" | "publicada" | "revisar"

interface ContentPage {
  id: string
  title: string
  url: string
  keyword: string
  status: PageStatus
  publishedAt: string | null
  crawled: boolean | null
  indexed: boolean | null
  lastCrawl: string | null
  position: number | null
  ctr: number | null
  clicks: number | null
  impressions: number | null
  visits: number | null
  conversions: number | null
  noindex: boolean
}

const INITIAL_PAGES: ContentPage[] = [
  { id: "home", title: "Home", url: "/", keyword: "crear tienda online gratis argentina", status: "publicada", publishedAt: "2024", crawled: true, indexed: true, lastCrawl: "hace 1d", position: 22, ctr: 4.1, clicks: 31, impressions: 755, visits: 120, conversions: 18, noindex: false },
  { id: "plan-gratis", title: "Plan Gratis", url: "/plan-gratis", keyword: "tienda online gratis argentina", status: "publicada", publishedAt: "2024", crawled: true, indexed: true, lastCrawl: "hace 2d", position: null, ctr: null, clicks: null, impressions: null, visits: null, conversions: null, noindex: false },
  { id: "plan-cositas", title: "Plan Cositas", url: "/plan-cositas", keyword: "herramientas marketing tienda online", status: "publicada", publishedAt: "2024", crawled: true, indexed: true, lastCrawl: "hace 2d", position: null, ctr: null, clicks: null, impressions: null, visits: null, conversions: null, noindex: true },
  { id: "plan-socio", title: "Plan Socio", url: "/plan-socio", keyword: "plan socio tol.ar", status: "publicada", publishedAt: "2024", crawled: true, indexed: true, lastCrawl: "hace 3d", position: null, ctr: null, clicks: null, impressions: null, visits: null, conversions: null, noindex: true },
  { id: "plan-a-medida", title: "Plan a Medida", url: "/plan-a-medida", keyword: "tienda online a medida argentina", status: "publicada", publishedAt: "2024", crawled: true, indexed: true, lastCrawl: "hace 3d", position: null, ctr: null, clicks: null, impressions: null, visits: null, conversions: null, noindex: true },
  { id: "cobros", title: "Cobros", url: "/cobros", keyword: "cobros tienda online argentina", status: "publicada", publishedAt: "Mar 2025", crawled: true, indexed: true, lastCrawl: "hace 2d", position: 18.4, ctr: 6.7, clicks: 14, impressions: 210, visits: 31, conversions: 2, noindex: true },
  { id: "contacto", title: "Contacto", url: "/contacto", keyword: "contacto tol.ar", status: "publicada", publishedAt: "2024", crawled: true, indexed: true, lastCrawl: "hace 4d", position: null, ctr: null, clicks: null, impressions: null, visits: null, conversions: null, noindex: true },
  { id: "privacidad", title: "Privacidad", url: "/privacidad", keyword: "privacidad tol.ar", status: "publicada", publishedAt: "2024", crawled: true, indexed: true, lastCrawl: "hace 4d", position: null, ctr: null, clicks: null, impressions: null, visits: null, conversions: null, noindex: false },
  { id: "terminos", title: "Términos", url: "/terminos", keyword: "terminos tol.ar", status: "publicada", publishedAt: "2024", crawled: true, indexed: true, lastCrawl: "hace 4d", position: null, ctr: null, clicks: null, impressions: null, visits: null, conversions: null, noindex: false },
  { id: "alternativa-tiendanube", title: "Alternativa Tiendanube", url: "/comparar/tiendanube", keyword: "alternativa tiendanube argentina", status: "diseno", publishedAt: null, crawled: null, indexed: null, lastCrawl: null, position: null, ctr: null, clicks: null, impressions: null, visits: null, conversions: null, noindex: true },
  { id: "alt-mercado-shops", title: "Alternativa Mercado Shops", url: "/alternativa-mercado-shops", keyword: "alternativa mercado shops argentina", status: "revisar", publishedAt: "Ene 2025", crawled: true, indexed: false, lastCrawl: "hace 5d", position: 34.1, ctr: 2.1, clicks: 4, impressions: 190, visits: 8, conversions: 0, noindex: true },
  { id: "plan-migrar", title: "Migrar a tol.ar", url: "/plan-migrar", keyword: "migrar tienda mercado shops tol.ar", status: "publicada", publishedAt: "Ene 2025", crawled: true, indexed: true, lastCrawl: "hace 5d", position: null, ctr: null, clicks: null, impressions: null, visits: null, conversions: null, noindex: true },
  { id: "cositas", title: "Cositas (catálogo)", url: "/cositas", keyword: "funciones extra tienda online", status: "publicada", publishedAt: "2024", crawled: true, indexed: true, lastCrawl: "hace 3d", position: null, ctr: null, clicks: null, impressions: null, visits: null, conversions: null, noindex: true },
  { id: "blog", title: "Blog", url: "/blog", keyword: "blog ecommerce argentina", status: "diseno", publishedAt: null, crawled: null, indexed: null, lastCrawl: null, position: null, ctr: null, clicks: null, impressions: null, visits: null, conversions: null, noindex: true },
  { id: "templates", title: "Templates", url: "/templates", keyword: "plantillas tienda online argentina", status: "publicada", publishedAt: "2024", crawled: true, indexed: true, lastCrawl: "hace 4d", position: null, ctr: null, clicks: null, impressions: null, visits: null, conversions: null, noindex: true },
  { id: "diseno-ia", title: "Diseño con IA", url: "/diseno-ia", keyword: "diseño tienda online inteligencia artificial", status: "publicada", publishedAt: "2024", crawled: true, indexed: true, lastCrawl: "hace 4d", position: null, ctr: null, clicks: null, impressions: null, visits: null, conversions: null, noindex: true },
  { id: "empleos", title: "Empleos", url: "/empleos", keyword: "empleos ecommerce argentina", status: "publicada", publishedAt: "2024", crawled: true, indexed: true, lastCrawl: "hace 6d", position: null, ctr: null, clicks: null, impressions: null, visits: null, conversions: null, noindex: true },
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

function BoolIcon({ value }: { value: boolean | null }) {
  if (value === null) return <span className="text-slate-300 text-sm">—</span>
  if (value) return <CheckCircle className="w-4 h-4 text-green-500 mx-auto" />
  return <AlertCircle className="w-4 h-4 text-amber-500 mx-auto" />
}

function N({ v, s = "" }: { v: number | null; s?: string }) {
  if (v === null) return <span className="text-slate-300">—</span>
  return <span className="font-medium">{v}{s}</span>
}

export function SeoContenidoTab() {
  const { toast } = useToast()
  const [pages, setPages] = useState<ContentPage[]>(INITIAL_PAGES)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ title: "", url: "", keyword: "", status: "diseno" as PageStatus })

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
          return {
            ...p,
            clicks: match.clicks ?? p.clicks,
            impressions: match.impressions ?? p.impressions,
            position: match.position ? parseFloat(match.position.toFixed(1)) : p.position,
            ctr: match.ctr ? parseFloat((match.ctr * 100).toFixed(1)) : p.ctr,
          }
        }))
      } catch {}
    }
    loadGscData()
  }, [])

  useEffect(() => {
    async function loadNoindex() {
      try {
        const res = await fetch("/api/super-admin/seo-pages")
        if (!res.ok) return
        const data: { id: string; noindex: boolean }[] = await res.json()
        setPages(prev => prev.map(p => {
          const found = data.find(d => d.id === p.id)
          return found !== undefined ? { ...p, noindex: found.noindex } : p
        }))
      } catch {}
    }
    loadNoindex()
  }, [])

  const published = pages.filter(p => p.status === "publicada")
  const indexed   = pages.filter(p => p.indexed === true)
  const totalClicks = pages.reduce((s, p) => s + (p.clicks || 0), 0)
  const totalConv   = pages.reduce((s, p) => s + (p.conversions || 0), 0)
  const posPages    = published.filter(p => p.position !== null)
  const avgPos      = posPages.length > 0
    ? (posPages.reduce((s, p) => s + (p.position || 0), 0) / posPages.length).toFixed(1)
    : "—"

  const resetForm = () => {
    setForm({ title: "", url: "", keyword: "", status: "diseno" })
    setEditingId(null)
    setShowForm(false)
  }

  const handleEdit = (p: ContentPage) => {
    setForm({ title: p.title, url: p.url, keyword: p.keyword, status: p.status })
    setEditingId(p.id)
    setShowForm(true)
  }

  const handleSave = () => {
    if (!form.title || !form.url) return
    if (editingId) {
      setPages(pages.map(p => p.id === editingId ? { ...p, ...form } : p))
      toast({ title: "Página actualizada" })
    } else {
      setPages([...pages, {
        id: Date.now().toString(), ...form,
        publishedAt: null, crawled: null, indexed: null, lastCrawl: null,
        position: null, ctr: null, clicks: null, impressions: null, visits: null, conversions: null,
        noindex: true,
      }])
      toast({ title: "Página agregada" })
    }
    resetForm()
  }

  const handleDelete = (id: string) => {
    setPages(pages.filter(p => p.id !== id))
    toast({ title: "Página eliminada" })
  }

  const handleToggleNoindex = async (id: string, current: boolean) => {
    const newVal = !current
    setPages(pages.map(p => p.id === id ? { ...p, noindex: newVal } : p))
    try {
      await fetch("/api/super-admin/seo-pages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, noindex: newVal })
      })
      toast({ title: newVal ? "🔴 Google no ve esta página" : "🟢 Google puede ver esta página" })
    } catch {
      setPages(pages.map(p => p.id === id ? { ...p, noindex: current } : p))
      toast({ title: "Error al guardar", variant: "destructive" } as any)
    }
  }

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-500" />
            SEO Contenido
          </h3>
          <p className="text-sm text-slate-500">Páginas creadas para captar tráfico orgánico de Google</p>
        </div>
        <Button size="sm" variant="outline" onClick={() => { resetForm(); setShowForm(true) }} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nueva página
        </Button>
      </div>

      <div className="grid grid-cols-5 gap-3">
        {[
          { Icon: FileText,          label: "Páginas publicadas",   value: `${published.length}`,  note: `de ${pages.length} en total` },
          { Icon: CheckCircle,       label: "Indexadas por Google", value: `${indexed.length}`,     note: `de ${published.length} publicadas` },
          { Icon: TrendingUp,        label: "Posición promedio",    value: `${avgPos}`,             note: "meta: bajar a 5" },
          { Icon: MousePointerClick, label: "Clicks (28 días)",     value: `${totalClicks}`,        note: "desde Google" },
          { Icon: ShoppingCart,      label: "Conversiones",         value: `${totalConv}`,          note: "registros desde estas páginas" },
        ].map(s => (
          <div key={s.label} className="bg-slate-50 rounded-lg p-4">
            <div className="flex items-center gap-1.5 mb-1">
              <s.Icon className="w-3.5 h-3.5 text-slate-400" />
              <p className="text-xs text-slate-500">{s.label}</p>
            </div>
            <p className="text-2xl font-semibold text-slate-800">{s.value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{s.note}</p>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-700">{editingId ? "Editar página" : "Nueva página de contenido"}</p>
            <button onClick={resetForm} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Título</label>
              <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Ej: Alternativa Tiendanube" className="text-sm" />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">URL</label>
              <Input value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} placeholder="/alternativa-tiendanube" className="text-sm" />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Keyword objetivo</label>
              <Input value={form.keyword} onChange={e => setForm({ ...form, keyword: e.target.value })} placeholder="alternativa tiendanube argentina" className="text-sm" />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Estado</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as PageStatus })} className="w-full text-sm border border-input rounded-md px-3 py-2 bg-background">
                <option value="diseno">Diseño</option>
                <option value="codigo">En código</option>
                <option value="publicada">Publicada</option>
                <option value="revisar">Revisar</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSave}>Guardar</Button>
            <Button size="sm" variant="outline" onClick={resetForm}>Cancelar</Button>
          </div>
        </div>
      )}

      <div className="border border-slate-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm" style={{ minWidth: "0" }}>
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {["Página", "Keyword objetivo", "Estado", "Google", "Publicada", "Crawl", "Index", "Últ. crawl", "Pos.", "CTR", "Clicks", "Impr.", "Visitas", "Conv.", ""].map(h => (
                  <th key={h} className="text-left px-2 py-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap first:pl-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pages.map((page, i) => (
                <tr key={page.id} className={`hover:bg-slate-50 transition-colors ${i < pages.length - 1 ? "border-b border-slate-100" : ""}`}>
                  <td className="pl-3 pr-2 py-2">
                    <p className="font-medium text-slate-800 whitespace-nowrap text-xs">{page.title}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <p className="text-xs text-slate-400">{page.url}</p>
                      {page.status === "publicada" && (
                        <a href={`https://tol.ar${page.url}`} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-600">
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="px-2 py-2">
                    <span className="text-[11px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200 whitespace-nowrap max-w-[140px] truncate block">{page.keyword}</span>
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap"><StatusBadge status={page.status} /></td>
                  <td className="px-2 py-2 text-center">
                    <button
                      onClick={() => handleToggleNoindex(page.id, page.noindex)}
                      className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors whitespace-nowrap ${
                        page.noindex
                          ? "bg-red-100 text-red-700 hover:bg-red-200"
                          : "bg-green-100 text-green-700 hover:bg-green-200"
                      }`}
                    >
                      {page.noindex ? "No ve" : "Sí ve"}
                    </button>
                  </td>
                  <td className="px-2 py-2 text-xs text-slate-500 whitespace-nowrap">{page.publishedAt || <span className="text-slate-300">—</span>}</td>
                  <td className="px-2 py-2 text-center"><BoolIcon value={page.crawled} /></td>
                  <td className="px-2 py-2 text-center"><BoolIcon value={page.indexed} /></td>
                  <td className="px-2 py-2 text-xs text-slate-400 whitespace-nowrap">{page.lastCrawl || <span className="text-slate-300">—</span>}</td>
                  <td className="px-2 py-2 text-right text-xs"><N v={page.position} /></td>
                  <td className="px-2 py-2 text-right text-xs"><N v={page.ctr} s="%" /></td>
                  <td className="px-2 py-2 text-right text-xs"><N v={page.clicks} /></td>
                  <td className="px-2 py-2 text-right text-xs"><N v={page.impressions} /></td>
                  <td className="px-2 py-2 text-right text-xs"><N v={page.visits} /></td>
                  <td className="px-2 py-2 text-right text-xs"><N v={page.conversions} /></td>
                  <td className="px-2 py-2 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => handleEdit(page)} className="text-xs px-2 py-1 border border-slate-200 rounded hover:bg-slate-100 text-slate-600 transition-colors">Editar</button>
                      <button onClick={() => handleDelete(page.id)} className="text-xs px-2 py-1 border border-red-200 rounded hover:bg-red-50 text-red-500 transition-colors">×</button>
                    </div>
                  </td>
                </tr>
              ))}
              {pages.length === 0 && (
                <tr>
                  <td colSpan={15} className="text-center py-10 text-slate-400 text-sm">
                    No hay páginas todavía. Creá la primera con "+ Nueva página".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-wrap gap-5 pt-1">
        {(Object.entries(STATUS_CONFIG) as [PageStatus, { label: string; cls: string }][]).map(([key, { label, cls }]) => (
          <div key={key} className="flex items-center gap-1.5 text-xs text-slate-500">
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${cls}`}>{label}</span>
            {key === "diseno"    && "Mockup en aprobación"}
            {key === "codigo"    && "Siendo desarrollada"}
            {key === "publicada" && "Live en tol.ar"}
            {key === "revisar"   && "Publicada con problemas"}
          </div>
        ))}
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-green-100 text-green-700">Sí ve</span>
          Google indexa esta página
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-red-100 text-red-700">No ve</span>
          noindex activo
        </div>
      </div>
    </div>
  )
}
