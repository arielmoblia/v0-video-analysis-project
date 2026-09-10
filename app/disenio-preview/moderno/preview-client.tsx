"use client"

import { useEffect, useState } from "react"
import { Pencil, Check, Loader2 } from "lucide-react"
import type { Store, Product, Category } from "@/lib/types"
import { CartProvider } from "@/components/store/cart-provider"
import { CartDrawer } from "@/components/store/cart-drawer"
import { StoreHeaderModern } from "@/components/store/store-header-modern"
import { StoreHeroModernEditable } from "@/components/store/store-hero-modern-editable"
import { CategoryShowcaseModern } from "@/components/store/category-showcase-modern"
import { ProductGridModern } from "@/components/store/product-grid-modern"
import { StoreFooter } from "@/components/store/store-footer"

const STORAGE_KEY = "tol-disenio-preview-moderno-banner"

interface PreviewClientProps {
  store: Store
  categories: Category[]
  products: Product[]
  accentColor: string
}

// Guarda los cambios del banner (foto/título/subtítulo) en localStorage, nada más:
// esto es la vidriera de edición para que Ariel pruebe la UX, todavía no está
// conectado a una tienda real en la base de datos.
export function ModernoPreviewClient({ store, categories, products, accentColor }: PreviewClientProps) {
  const [banner, setBanner] = useState({
    banner_image: store.banner_image || "",
    banner_title: store.banner_title || "",
    banner_subtitle: store.banner_subtitle || "",
  })
  const [savedBanner, setSavedBanner] = useState(banner)
  const [editMode, setEditMode] = useState(false)
  const [saving, setSaving] = useState(false)
  const [justSaved, setJustSaved] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const stored = JSON.parse(raw)
        setBanner(stored)
        setSavedBanner(stored)
      }
    } catch {}
  }, [])

  const dirty = JSON.stringify(banner) !== JSON.stringify(savedBanner)

  const handleSave = async () => {
    setSaving(true)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(banner))
    setSavedBanner(banner)
    setSaving(false)
    setJustSaved(true)
    setTimeout(() => setJustSaved(false), 2000)
  }

  const storeConEdicion: Store = { ...store, ...banner }

  return (
    <CartProvider country="AR">
      <div className="min-h-screen flex flex-col bg-white">
        <div className="bg-neutral-900 text-white text-center text-xs py-2 px-4 flex items-center justify-center gap-3 flex-wrap">
          <span>Propuesta de diseño "Moderno" — vista previa con datos de ejemplo, inspirada en storefront.saleor.io. No es una tienda real.</span>
          <button
            onClick={() => setEditMode((v) => !v)}
            className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold"
            style={{ backgroundColor: editMode ? accentColor : "rgba(255,255,255,0.15)" }}
          >
            <Pencil size={12} /> {editMode ? "Editando diseño" : "Editar diseño"}
          </button>
        </div>
        <StoreHeaderModern store={storeConEdicion} categories={categories} accentColor={accentColor} disableNav />
        <main className="flex-1">
          <StoreHeroModernEditable
            store={storeConEdicion}
            accentColor={accentColor}
            editMode={editMode}
            onChangeImage={(url) => setBanner((b) => ({ ...b, banner_image: url }))}
            onChangeTitle={(value) => setBanner((b) => ({ ...b, banner_title: value }))}
            onChangeSubtitle={(value) => setBanner((b) => ({ ...b, banner_subtitle: value }))}
          />
          <CategoryShowcaseModern categories={categories} subdomain={store.subdomain} disableNav />
          <section id="productos" className="container mx-auto px-6 py-14">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">Destacados</h2>
            <ProductGridModern products={products} subdomain={store.subdomain} accentColor={accentColor} country="AR" disableNav />
          </section>
        </main>
        <StoreFooter store={storeConEdicion} />
        <CartDrawer />

        {editMode && dirty && (
          <button
            onClick={handleSave}
            disabled={saving}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-105"
            style={{ backgroundColor: accentColor }}
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
        )}
        {justSaved && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white bg-emerald-600 shadow-lg">
            <Check size={16} /> Guardado
          </div>
        )}
      </div>
    </CartProvider>
  )
}
