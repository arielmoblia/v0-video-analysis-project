"use client"
import { useEffect, useRef, useState } from "react"
import { Loader2, Check, GripVertical, Trash2, Plus, X, MessageCircle, Instagram, Pencil, Link2 } from "lucide-react"
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

  // Autoguardado: sin esto, agregar productos y cambiar de pestaña del admin
  // antes de tocar "Guardar" perdía el cambio (el panel se remonta con los
  // datos viejos de cuando cargó la página). Guarda solo, sin el cartel de
  // "Guardando/Guardado" para no ser invasivo — el botón sigue sirviendo
  // para confirmar visualmente que quedó.
  const isFirstRender = useRef(true)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    const timer = setTimeout(() => {
      fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storeId, carousels: carouselsConfig }),
      }).catch(() => {})
    }, 1500)
    return () => clearTimeout(timer)
  }, [carouselsConfig, storeId])

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
            className={`rounded-lg border overflow-hidden bg-white ${
              block.type === "products" ? "border-blue-200" : "border-amber-200"
            } ${dragIndex === index ? "opacity-40" : ""}`}
          >
            <div
              className={`flex items-center gap-2 px-4 py-3 border-b cursor-grab ${
                block.type === "products"
                  ? "bg-blue-50 border-blue-200"
                  : block.type === "text"
                    ? "bg-amber-50 border-amber-200"
                    : "bg-slate-50 border-slate-200"
              }`}
            >
              <GripVertical className="w-4 h-4 text-slate-400 shrink-0" />
              <p className="font-medium text-sm text-slate-800 flex-1">
                {block.type === "products"
                  ? "🖼️ Carrusel de productos destacados"
                  : block.type === "text"
                    ? "📝 Carrusel de textos"
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
                <CtaBlockViewer block={block} onChange={(patch) => updateBlock(block.id, patch)} />
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
  const [search, setSearch] = useState("")

  const selectedIds = block.productIds || []
  const byId = new Map(products.map((p) => [p.id, p]))
  const selected = selectedIds.map((id) => byId.get(id)).filter((p): p is ProductLite => !!p)
  const filtered = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))

  const toggleProduct = (id: string) => {
    onChange({
      productIds: selectedIds.includes(id) ? selectedIds.filter((pid) => pid !== id) : [...selectedIds, id],
    })
  }

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
      <div className="flex flex-wrap gap-6">
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
          <label className="text-xs text-slate-500">Cuántos se ven a la vez (escritorio)</label>
          <select
            value={block.visibleCount || 5}
            onChange={(e) => onChange({ visibleCount: Number(e.target.value) })}
            className="mt-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400 bg-white"
          >
            {[2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
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

      <div>
        <label className="text-xs text-slate-500">Elegí productos para esta franja</label>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar producto..."
          className="mt-1 w-full max-w-xs rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
        />
        <div className="mt-2 max-h-64 overflow-auto rounded-lg border border-slate-200 bg-blue-50/30 p-2">
          {filtered.length === 0 ? (
            <p className="text-xs text-slate-400 italic p-2">No hay productos que coincidan con la búsqueda.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {filtered.map((p) => {
                const isSelected = selectedIds.includes(p.id)
                return (
                  <button
                    key={p.id}
                    onClick={() => toggleProduct(p.id)}
                    className={`flex items-center gap-2 rounded-md border px-2 py-1.5 text-left text-xs transition-colors ${
                      isSelected
                        ? "border-blue-400 bg-blue-100"
                        : "border-slate-200 bg-white hover:bg-slate-50"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-sm border flex items-center justify-center shrink-0 ${
                        isSelected ? "bg-blue-600 border-blue-600" : "border-slate-300 bg-white"
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <div className="w-8 h-8 rounded bg-slate-100 overflow-hidden shrink-0">
                      {p.image_url && <img src={p.image_url} alt="" className="w-full h-full object-cover" />}
                    </div>
                    <span className="truncate">{p.name}</span>
                  </button>
                )
              })}
            </div>
          )}
        </div>
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
  const [editing, setEditing] = useState<{ cardId: string; field: "title" | "description" | "link" | "linkLabel" } | null>(null)
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
            className={`flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50/30 p-3 ${
              dragIndex === index ? "opacity-40" : ""
            }`}
          >
            <GripVertical className="w-4 h-4 text-slate-400 mt-2 cursor-grab shrink-0" />
            <div className="flex-1 rounded-md border border-slate-200 bg-white p-3">
              {editing?.cardId === card.id && editing.field === "title" ? (
                <input
                  autoFocus
                  value={card.title}
                  onChange={(e) => updateCard(card.id, { title: e.target.value })}
                  onBlur={() => setEditing(null)}
                  onKeyDown={(e) => e.key === "Enter" && setEditing(null)}
                  placeholder="Título (Ej: Envíos a todo el país)"
                  className="w-full text-sm font-semibold text-slate-800 outline-none border-b border-amber-400"
                />
              ) : (
                <p
                  onClick={() => setEditing({ cardId: card.id, field: "title" })}
                  className={`text-sm font-semibold cursor-text hover:bg-amber-50 rounded px-0.5 -mx-0.5 ${
                    card.title ? "text-slate-800" : "text-slate-400 italic"
                  }`}
                >
                  {card.title || "Tocá para escribir el título"}
                </p>
              )}

              {editing?.cardId === card.id && editing.field === "description" ? (
                <input
                  autoFocus
                  value={card.description || ""}
                  onChange={(e) => updateCard(card.id, { description: e.target.value })}
                  onBlur={() => setEditing(null)}
                  onKeyDown={(e) => e.key === "Enter" && setEditing(null)}
                  placeholder="Descripción (opcional)"
                  className="w-full text-xs text-slate-500 outline-none border-b border-amber-400 mt-1"
                />
              ) : (
                <p
                  onClick={() => setEditing({ cardId: card.id, field: "description" })}
                  className={`text-xs cursor-text hover:bg-amber-50 rounded px-0.5 -mx-0.5 mt-1 ${
                    card.description ? "text-slate-500" : "text-slate-300 italic"
                  }`}
                >
                  {card.description || "Tocá para escribir la descripción (opcional)"}
                </p>
              )}

              <div className="flex items-center gap-1.5 mt-1.5">
                {editing?.cardId === card.id && editing.field === "link" ? (
                  <input
                    autoFocus
                    value={card.link || ""}
                    onChange={(e) => updateCard(card.id, { link: e.target.value })}
                    onBlur={() => setEditing(null)}
                    onKeyDown={(e) => e.key === "Enter" && setEditing(null)}
                    placeholder="https://wa.me/549... o /pagina/contacto"
                    className="flex-1 text-xs outline-none border-b border-amber-400 py-0.5"
                  />
                ) : (
                  <>
                    {card.link ? (
                      <Link2 className="w-3 h-3 text-blue-600 shrink-0" />
                    ) : null}
                    <p className={`text-xs truncate ${card.link ? "text-blue-600 underline" : "text-slate-300 italic"}`}>
                      {card.link || "Sin link"}
                    </p>
                  </>
                )}
                <button
                  onClick={() => setEditing({ cardId: card.id, field: "link" })}
                  className="text-slate-400 hover:text-amber-600 shrink-0"
                  title="Editar link"
                >
                  <Pencil className="w-3 h-3" />
                </button>
              </div>

              {card.link && (
                <div className="flex items-center gap-1.5 mt-1">
                  {editing?.cardId === card.id && editing.field === "linkLabel" ? (
                    <input
                      autoFocus
                      value={card.linkLabel || ""}
                      onChange={(e) => updateCard(card.id, { linkLabel: e.target.value })}
                      onBlur={() => setEditing(null)}
                      onKeyDown={(e) => e.key === "Enter" && setEditing(null)}
                      placeholder="Texto del link (Ej: SEGUÍ NUESTRO CANAL)"
                      className="flex-1 text-xs outline-none border-b border-amber-400 py-0.5"
                    />
                  ) : (
                    <p
                      onClick={() => setEditing({ cardId: card.id, field: "linkLabel" })}
                      className={`text-xs underline cursor-text hover:bg-amber-50 rounded px-0.5 -mx-0.5 ${
                        card.linkLabel ? "text-slate-700" : "text-slate-300 italic"
                      }`}
                    >
                      {card.linkLabel || "Ver más (tocá para cambiar el texto)"}
                    </p>
                  )}
                  <button
                    onClick={() => setEditing({ cardId: card.id, field: "linkLabel" })}
                    className="text-slate-400 hover:text-amber-600 shrink-0"
                    title="Editar texto del link"
                  >
                    <Pencil className="w-3 h-3" />
                  </button>
                </div>
              )}
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

function CtaBlockViewer({
  block,
  onChange,
}: {
  block: CarouselBlock
  onChange: (patch: Partial<CarouselBlock>) => void
}) {
  const [editing, setEditing] = useState(false)

  return (
    <div className="space-y-2">
      <div className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3">
        {block.ctaKind === "whatsapp" ? (
          <MessageCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
        ) : (
          <Instagram className="w-4 h-4 text-pink-500 shrink-0 mt-0.5" />
        )}
        {editing ? (
          <input
            autoFocus
            value={block.ctaText || ""}
            onChange={(e) => onChange({ ctaText: e.target.value })}
            onBlur={() => setEditing(false)}
            onKeyDown={(e) => e.key === "Enter" && setEditing(false)}
            placeholder="Texto del cartel"
            className="flex-1 text-sm text-slate-600 outline-none border-b border-slate-400"
          />
        ) : (
          <p
            onClick={() => setEditing(true)}
            className="flex-1 text-sm text-slate-600 cursor-text hover:bg-slate-100 rounded px-0.5 -mx-0.5"
          >
            {block.ctaText || "Tocá para escribir el texto"}
          </p>
        )}
        <Pencil className="w-3 h-3 text-slate-400 shrink-0 mt-1" />
      </div>
      <p className="text-xs text-slate-400 italic px-1">
        El link de este cartel es el {block.ctaKind === "whatsapp" ? "WhatsApp" : "Instagram"} que cargaste en Ajustes, no se edita acá.
      </p>
    </div>
  )
}
