"use client"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Plus, Trash2, Eye, EyeOff, ExternalLink } from "lucide-react"

interface StorePagesManagerProps {
  storeId: string
  subdomain: string
}

interface StorePageRow {
  id: string
  slug: string
  title: string
  content: string
  is_published: boolean
}

export function StorePagesManager({ storeId, subdomain }: StorePagesManagerProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [pages, setPages] = useState<StorePageRow[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draftTitle, setDraftTitle] = useState("")
  const [draftContent, setDraftContent] = useState("")
  const [saving, setSaving] = useState(false)
  const [creating, setCreating] = useState(false)
  const [newTitle, setNewTitle] = useState("")

  const load = () => {
    fetch(`/api/admin/store-pages?storeId=${storeId}`)
      .then((r) => r.json())
      .then((data) => {
        setPages(data.pages || [])
        setLoading(false)
      })
  }

  useEffect(load, [storeId])

  const startEdit = (page: StorePageRow) => {
    setEditingId(page.id)
    setDraftTitle(page.title)
    setDraftContent(page.content)
  }

  const handleCreate = async () => {
    if (!newTitle.trim()) return
    setCreating(true)
    const res = await fetch("/api/admin/store-pages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ storeId, title: newTitle.trim(), content: "" }),
    })
    setCreating(false)
    if (res.ok) {
      setNewTitle("")
      const data = await res.json()
      setPages((p) => [...p, data.page])
      startEdit(data.page)
      toast({ title: "Página creada", description: `Ahora escribí el contenido de "${data.page.title}"` })
    } else {
      toast({ title: "Error", description: "No se pudo crear la página", variant: "destructive" })
    }
  }

  const handleSave = async () => {
    if (!editingId) return
    setSaving(true)
    const res = await fetch(`/api/admin/store-pages/${editingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: draftTitle, content: draftContent }),
    })
    setSaving(false)
    if (res.ok) {
      const data = await res.json()
      setPages((p) => p.map((pg) => (pg.id === editingId ? data.page : pg)))
      setEditingId(null)
      toast({ title: "Guardado" })
    } else {
      toast({ title: "Error", description: "No se pudo guardar", variant: "destructive" })
    }
  }

  const togglePublished = async (page: StorePageRow) => {
    const res = await fetch(`/api/admin/store-pages/${page.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_published: !page.is_published }),
    })
    if (res.ok) {
      const data = await res.json()
      setPages((p) => p.map((pg) => (pg.id === page.id ? data.page : pg)))
    }
  }

  const handleDelete = async (page: StorePageRow) => {
    if (!confirm(`¿Borrar la página "${page.title}"? No se puede deshacer.`)) return
    const res = await fetch(`/api/admin/store-pages/${page.id}`, { method: "DELETE" })
    if (res.ok) {
      setPages((p) => p.filter((pg) => pg.id !== page.id))
      if (editingId === page.id) setEditingId(null)
      toast({ title: "Página borrada" })
    } else {
      toast({ title: "Error", description: "No se pudo borrar", variant: "destructive" })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Páginas propias</h1>
        <p className="text-xl text-muted-foreground mt-2">
          Creá páginas como "Quiénes somos" o "Guía de talles". Aparecen como botones en el menú de tu tienda.
        </p>
      </div>

      <div className="flex gap-2">
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCreate()}
          placeholder="Título de la página nueva (ej: Quiénes somos)"
          className="flex-1 rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-400"
        />
        <button
          onClick={handleCreate}
          disabled={creating || !newTitle.trim()}
          className="flex items-center gap-2 px-5 py-3 bg-black text-white rounded-lg font-medium hover:bg-neutral-800 disabled:opacity-50 text-sm"
        >
          {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          Crear página
        </button>
      </div>

      {pages.length === 0 ? (
        <p className="text-sm text-slate-400">Todavía no creaste ninguna página.</p>
      ) : (
        <div className="space-y-3">
          {pages.map((page) => (
            <div key={page.id} className="rounded-lg border border-slate-200 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-slate-50">
                <div className="flex items-center gap-2 min-w-0">
                  <p className="font-medium text-sm text-slate-800 truncate">{page.title}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${page.is_published ? "bg-green-100 text-green-700" : "bg-slate-200 text-slate-500"}`}>
                    {page.is_published ? "Publicada" : "Oculta"}
                  </span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {page.is_published && (
                    <a
                      href={`https://${subdomain}.tol.ar/pagina/${page.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 text-slate-400 hover:text-slate-700"
                      title="Ver página"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  <button onClick={() => togglePublished(page)} className="p-2 text-slate-400 hover:text-slate-700" title={page.is_published ? "Ocultar" : "Publicar"}>
                    {page.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button onClick={() => handleDelete(page)} className="p-2 text-slate-400 hover:text-red-600" title="Borrar">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => (editingId === page.id ? setEditingId(null) : startEdit(page))}
                    className="ml-2 px-3 py-1.5 text-xs font-medium rounded-md border border-slate-300 hover:bg-white"
                  >
                    {editingId === page.id ? "Cerrar" : "Editar"}
                  </button>
                </div>
              </div>

              {editingId === page.id && (
                <div className="p-4 space-y-3">
                  <input
                    value={draftTitle}
                    onChange={(e) => setDraftTitle(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium outline-none focus:border-blue-400"
                  />
                  <textarea
                    value={draftContent}
                    onChange={(e) => setDraftContent(e.target.value)}
                    rows={10}
                    placeholder="Escribí el contenido de la página..."
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400 font-mono"
                  />
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-lg font-medium hover:bg-neutral-800 disabled:opacity-50 text-sm"
                  >
                    {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                    Guardar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
