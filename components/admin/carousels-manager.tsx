"use client"
import { useEffect, useState } from "react"
import { Loader2, Check, GripVertical, Trash2, Plus, X, MessageCircle, Instagram } from "lucide-react"
import type { CarouselBlock, CarouselTextCard } from "@/components/store/store-carousels"

interface ProductLite {
  id: string
  name: string
  image_url: string | null
}

interface CarouselsManagerProps {
  storeId: string
  initialCarousels?: CarouselBlock[] | null
}

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`
}

export function CarouselsManager({ storeId, initialCarousels }: CarouselsManagerProps) {
  const [carouselsConfig, setCarouselsConfig] = useState<CarouselBlock[]>(initialCarousels || [])
  const [products, setProducts] = useState<ProductLite[]>([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [showAddMenu, setShowAddMenu] = useState(false)

  useEffect(() => {
    fetch(`/api/admin/products?storeId=${storeId}`)
      .then((r) => r.json())
      .then((data) =>
        setProducts((data.products || []).map((p: any) => ({ id: p.id, name: p.name, image_url: p.image_url })))
      )
      .catch(() => {})
  }, [storeId])

  const updateBlock = (id: string, patch: Partial<CarouselBlock>) => {
    setCarouselsConfig((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch } : b)))
  }

  const removeBlock = (id: string) => {
    setCarouselsConfig((prev) => prev.filter((b) => b.id !== id))
  }

  const addBlock = (type: "products" | "text") => {
    const block: CarouselBlock =
      type === "products"
        ? { id: uid("products"), type: "products", title: "Destacados", productIds: [] }
        : { id: uid("text"), type: "text", cards: [] }
    setCarouselsConfig((prev) => [...prev, block])
    setShowAddMenu(false)
  }

  const handleDropBlock = (dropIndex: number) => {
    if (dragIndex === null || dragIndex === dropIndex) return
    setCarouselsConfig((prev) => {
      const reordered = [...prev]
      const [moved] = reordered.splice(dragIndex, 1)
      reordered.splice(dropIndex, 0, moved)
      return reordered
    })
    setDragIndex(null)
  }

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storeId, carousels: carouselsConfig }),
      })
      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Carruseles</h1>
        <p className="text-xl text-muted-foreground mt-2">
          Armá las franjas que querés mostrar debajo del banner de tu portada: de productos o de texto. Agregá
          las que quieras, en el orden que quieras — arrastrá del ⠿ para reordenar.
        </p>
      </div>

      <div className="space-y-4">
        {carouselsConfig.length === 0 && (
          <p className="text-sm text-slate-400 italic">Todavía no agregaste ningún carrusel.</p>
        )}
        {carouselsConfig.map((block, index) => (
          <div
            key={block.id}
            draggable
            onDragStart={() => setDragIndex(index)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDropBlock(index)}
            className={`rounded-lg border border-slate-200 overflow-hidden bg-white ${
              dragIndex === index ? "opacity-40" : ""
            }`}
          >
            <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 border-b border-slate-200 cursor-grab">
              <GripVertical className="w-4 h-4 text-slate-400 shrink-0" />
              <p className="font-medium text-sm text-slate-800 flex-1">
                {block.type === "products"
                  ? "Carrusel de productos destacados"
                  : block.type === "text"
                    ? "Carrusel de textos"
                    : "Carrusel de texto (heredado del clonado)"}
              </p>
              <button onClick={() => removeBlock(block.id)} className="text-slate-400 hover:text-red-600">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5">
              {block.type === "products" ? (
                <ProductsBlockEditor
                  block={block}
                  products={products}
                  onChange={(patch) => updateBlock(block.id, patch)}
                />
              ) : block.type === "text" ? (
                <TextBlockEditor block={block} onChange={(patch) => updateBlock(block.id, patch)} />
              ) : (
                <CtaBlockViewer block={block} />
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="relative inline-block">
        <button
          onClick={() => setShowAddMenu((v) => !v)}
          className="flex items-center gap-2 px-4 py-2.5 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          <Plus className="w-4 h-4" /> Agregar carrusel
        </button>
        {showAddMenu && (
          <div className="absolute z-10 mt-1 w-56 rounded-lg border border-slate-200 bg-white shadow-lg overflow-hidden">
            <button
              onClick={() => addBlock("products")}
              className="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50"
            >
              Carrusel de productos
            </button>
            <button
              onClick={() => addBlock("text")}
              className="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 border-t border-slate-100"
            >
              Carrusel de textos
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-lg font-medium hover:bg-neutral-800 disabled:opacity-50 text-sm"
        >
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          Guardar
        </button>
        {saved && (
          <p className="text-sm text-green-700 flex items-center gap-1">
            <Check className="w-4 h-4" /> Guardado. Ya se ve en tu tienda.
          </p>
        )}
      </div>
    </div>
  )
}

function ProductsBlockEditor({
  block,
  products,
  onChange,
}: {
  block: CarouselBlock
  products: ProductLite[]
  onChange: (patch: Partial<CarouselBlock>) => void
}) {
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [showPicker, setShowPicker] = useState(false)
  const [search, setSearch] = useState("")

  const selectedIds = block.productIds || []
  const byId = new Map(products.map((p) => [p.id, p]))
  const selected = selectedIds.map((id) => byId.get(id)).filter((p): p is ProductLite => !!p)
  const available = products.filter(
    (p) => !selectedIds.includes(p.id) && p.name.toLowerCase().includes(search.toLowerCase())
  )

  const reorder = (dropIndex: number) => {
    if (dragIndex === null || dragIndex === dropIndex) return
    const reordered = [...selectedIds]
    const [moved] = reordered.splice(dragIndex, 1)
    reordered.splice(dropIndex, 0, moved)
    onChange({ productIds: reordered })
    setDragIndex(null)
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs text-slate-500">Título de la franja</label>
        <input
          value={block.title || ""}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="Ej: Destacados"
          className="mt-1 w-full max-w-xs rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
        />
      </div>

      <div>
        <label className="text-xs text-slate-500">Productos ({selected.length}) — arrastrá para ordenar</label>
        {selected.length === 0 ? (
          <p className="text-xs text-slate-400 italic mt-2">
            Sin productos elegidos: por ahora muestra tus destacados, o todos si no marcaste ninguno.
          </p>
        ) : (
          <div className="flex flex-wrap gap-3 mt-2">
            {selected.map((p, index) => (
              <div
                key={p.id}
                draggable
                onDragStart={() => setDragIndex(index)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => reorder(index)}
                className={`relative w-24 cursor-grab ${dragIndex === index ? "opacity-40" : ""}`}
              >
                <button
                  onClick={() => onChange({ productIds: selectedIds.filter((pid) => pid !== p.id) })}
                  className="absolute -top-2 -right-2 z-10 w-5 h-5 rounded-full bg-white border border-slate-300 text-slate-500 hover:text-red-600 hover:border-red-300 flex items-center justify-center shadow-sm"
                >
                  <X className="w-3 h-3" />
                </button>
                <div className="aspect-square rounded-md overflow-hidden bg-slate-100 border border-slate-200">
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300 text-xs">
                      Sin foto
                    </div>
                  )}
                </div>
                <p className="text-xs text-slate-600 mt-1 truncate" title={p.name}>
                  {p.name}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="relative">
        <button
          onClick={() => setShowPicker((v) => !v)}
          className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          <Plus className="w-4 h-4" /> Agregar producto
        </button>
        {showPicker && (
          <div className="absolute z-10 mt-1 w-72 max-h-72 overflow-auto rounded-lg border border-slate-200 bg-white shadow-lg">
            <div className="p-2 sticky top-0 bg-white border-b border-slate-100">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar producto..."
                className="w-full rounded-md border border-slate-200 px-2 py-1.5 text-sm outline-none focus:border-blue-400"
                autoFocus
              />
            </div>
            {available.length === 0 ? (
              <p className="text-xs text-slate-400 italic p-3">No hay más productos para agregar.</p>
            ) : (
              available.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    onChange({ productIds: [...selectedIds, p.id] })
                    setSearch("")
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm hover:bg-slate-50"
                >
                  <div className="w-8 h-8 rounded bg-slate-100 overflow-hidden shrink-0">
                    {p.image_url && <img src={p.image_url} alt="" className="w-full h-full object-cover" />}
                  </div>
                  <span className="truncate">{p.name}</span>
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function TextBlockEditor({
  block,
  onChange,
}: {
  block: CarouselBlock
  onChange: (patch: Partial<CarouselBlock>) => void
}) {
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const cards = block.cards || []
  const legacyPhrases = cards.length === 0 ? block.phrases?.filter(Boolean) || [] : []

  const updateCard = (id: string, patch: Partial<CarouselTextCard>) => {
    onChange({ cards: cards.map((c) => (c.id === id ? { ...c, ...patch } : c)) })
  }

  const removeCard = (id: string) => {
    onChange({ cards: cards.filter((c) => c.id !== id) })
  }

  const addCard = () => {
    onChange({ cards: [...cards, { id: uid("card"), title: "" }] })
  }

  const reorder = (dropIndex: number) => {
    if (dragIndex === null || dragIndex === dropIndex) return
    const reordered = [...cards]
    const [moved] = reordered.splice(dragIndex, 1)
    reordered.splice(dropIndex, 0, moved)
    onChange({ cards: reordered })
    setDragIndex(null)
  }

  const convertPhrasesToCards = () => {
    onChange({
      cards: legacyPhrases.map((phrase) => ({ id: uid("card"), title: phrase })),
      phrases: undefined,
    })
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs text-slate-500">Título de la franja (opcional)</label>
        <input
          value={block.title || ""}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="Ej: Por qué comprarnos"
          className="mt-1 w-full max-w-xs rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
        />
      </div>

      {legacyPhrases.length > 0 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 space-y-2">
          <p>
            Esta franja tiene frases cargadas a la antigua (sin tarjetas editables): {legacyPhrases.join(" · ")}
          </p>
          <button
            onClick={convertPhrasesToCards}
            className="font-medium underline underline-offset-2 hover:text-amber-900"
          >
            Convertir a tarjetas editables
          </button>
        </div>
      )}

      {cards.length === 0 && legacyPhrases.length === 0 && (
        <p className="text-xs text-slate-400 italic">Todavía no agregaste ninguna tarjeta.</p>
      )}

      <div className="space-y-3">
        {cards.map((card, index) => (
          <div
            key={card.id}
            draggable
            onDragStart={() => setDragIndex(index)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => reorder(index)}
            className={`flex items-start gap-2 rounded-lg border border-slate-200 p-3 ${
              dragIndex === index ? "opacity-40" : ""
            }`}
          >
            <GripVertical className="w-4 h-4 text-slate-400 mt-2 cursor-grab shrink-0" />
            <div className="flex-1 space-y-2">
              <input
                value={card.title}
                onChange={(e) => updateCard(card.id, { title: e.target.value })}
                placeholder="Título (Ej: Envíos a todo el país)"
                className="w-full rounded-md border border-slate-200 px-2.5 py-1.5 text-sm outline-none focus:border-blue-400"
              />
              <input
                value={card.description || ""}
                onChange={(e) => updateCard(card.id, { description: e.target.value })}
                placeholder="Descripción (opcional)"
                className="w-full rounded-md border border-slate-200 px-2.5 py-1.5 text-sm outline-none focus:border-blue-400"
              />
              <input
                value={card.link || ""}
                onChange={(e) => updateCard(card.id, { link: e.target.value })}
                placeholder="Link (opcional, ej: https://wa.me/549...)"
                className="w-full rounded-md border border-slate-200 px-2.5 py-1.5 text-sm outline-none focus:border-blue-400"
              />
            </div>
            <button onClick={() => removeCard(card.id)} className="text-slate-400 hover:text-red-600 mt-1">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <button onClick={addCard} className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700">
        <Plus className="w-4 h-4" /> Agregar tarjeta
      </button>
    </div>
  )
}

function CtaBlockViewer({ block }: { block: CarouselBlock }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3">
      {block.ctaKind === "whatsapp" ? (
        <MessageCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
      ) : (
        <Instagram className="w-4 h-4 text-pink-500 shrink-0 mt-0.5" />
      )}
      <p className="text-sm text-slate-600">{block.ctaText}</p>
    </div>
  )
}
