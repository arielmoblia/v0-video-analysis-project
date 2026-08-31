"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RefreshCw, ExternalLink, Package, TrendingUp, AlertCircle, Eye } from "lucide-react"

interface DropshipProduct {
  id: string
  name: string
  price: number
  stock: number
  image_url: string | null
  source_url: string | null
  sizes?: { size: string; stock: number }[]
}

interface DropshipManagerProps {
  storeId: string
  subdomain: string
  sourceUrl: string | null
  markupPercent: number
  isUnlocked?: boolean
  onActivate?: () => void
}

export function DropshipManager({ storeId, subdomain, sourceUrl: initialSourceUrl, markupPercent: initialMarkup, isUnlocked = false, onActivate }: DropshipManagerProps) {
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [markup, setMarkup] = useState(initialMarkup || 0)
  const [sourceUrl, setSourceUrl] = useState(initialSourceUrl || "")
  const [savingSource, setSavingSource] = useState(false)
  const [saving, setSaving] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [lastSync, setLastSync] = useState<string | null>(null)
  const [products, setProducts] = useState<DropshipProduct[]>([])
  const [loadingProducts, setLoadingProducts] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`/api/admin/products?storeId=${storeId}`)
        const data = await res.json()
        setProducts(data.products || [])
      } catch {
        console.error("Error fetching products")
      } finally {
        setLoadingProducts(false)
      }
    }
    fetchProducts()
  }, [storeId])

  const handleSaveSource = async () => {
    setSavingSource(true)
    setMessage(null)
    try {
      const res = await fetch("/api/admin/dropship/update-source", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storeId, sourceUrl }),
      })
      const data = await res.json()
      if (data.success) {
        setSourceUrl(data.sourceUrl)
        setMessage({ type: "success", text: "Tienda madre actualizada." })
      } else {
        setMessage({ type: "error", text: data.error || "Error al guardar" })
      }
    } catch {
      setMessage({ type: "error", text: "Error de conexion" })
    }
    setSavingSource(false)
  }

  const handleSaveMarkup = async () => {
    setSaving(true)
    setMessage(null)
    try {
      const res = await fetch("/api/admin/dropship/update-markup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storeId, markupPercent: markup }),
      })
      const data = await res.json()
      if (data.success) {
        setMessage({ type: "success", text: "Margen actualizado. Los precios se actualizaran en la proxima sincronizacion." })
      } else {
        setMessage({ type: "error", text: data.error || "Error al guardar" })
      }
    } catch {
      setMessage({ type: "error", text: "Error de conexion" })
    }
    setSaving(false)
  }

  const handleSync = async () => {
    setSyncing(true)
    setMessage(null)
    try {
      const res = await fetch("/api/admin/dropship/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storeId, subdomain }),
      })
      const data = await res.json()
      if (data.success) {
        setMessage({ type: "success", text: `Sincronizacion completa: ${data.productsImported} productos importados` })
        setLastSync(new Date().toLocaleString("es-AR"))
        // Recargar productos
        const prodRes = await fetch(`/api/admin/products?storeId=${storeId}`)
        const prodData = await prodRes.json()
        setProducts(prodData.products || [])
      } else {
        setMessage({ type: "error", text: data.error || "Error al sincronizar" })
      }
    } catch {
      setMessage({ type: "error", text: "Error de conexion" })
    }
    setSyncing(false)
  }

  return (
    <div style={{ position: "relative" }}>
      {!isUnlocked && (
        <div style={{
          position: "absolute", inset: 0, zIndex: 10,
          background: "rgba(255,255,255,0.75)",
          backdropFilter: "blur(3px)",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: "16px",
          borderRadius: "12px",
        }}>
          <div style={{ fontSize: "32px" }}>📦</div>
          <p style={{ fontSize: "16px", fontWeight: 500, color: "#1a1a1a", margin: 0, textAlign: "center" }}>
            El Dropshipping es parte del Plan Cositas
          </p>
          <p style={{ fontSize: "13px", color: "#666", margin: 0, textAlign: "center", maxWidth: "280px" }}>
            Tu tienda es gratis. La importación automática desde la tienda madre se activa por separado.
          </p>
          <label style={{
            display: "flex", alignItems: "flex-start", gap: "8px",
            maxWidth: "300px", cursor: "pointer",
          }}>
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              style={{ marginTop: "3px" }}
            />
            <span style={{ fontSize: "12px", color: "#666", textAlign: "left" }}>
              Declaro contar con autorización del titular del sitio para extraer su contenido. tol.ar no se responsabiliza por infracciones derivadas del uso indebido de esta herramienta. Acepto los{" "}
              <a href="/terminos" target="_blank" rel="noopener noreferrer" style={{ color: "#f97316", textDecoration: "underline" }}>
                Términos y Condiciones
              </a>.
            </span>
          </label>
          <button onClick={onActivate} disabled={!acceptedTerms} style={{
            marginTop: "8px", padding: "12px 32px",
            background: acceptedTerms ? "#f97316" : "#d1d5db", color: "#fff",
            border: "none", borderRadius: "8px",
            fontSize: "15px", fontWeight: 600,
            cursor: acceptedTerms ? "pointer" : "not-allowed",
          }}>
            ACTIVAR DROPSHIPPING
          </button>
        </div>
      )}
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-neutral-900">Dropshipping</h2>
        <p className="text-sm text-neutral-500 mt-1">
          Los productos de tu tienda se importan automaticamente desde la tienda madre.
        </p>
      </div>

      {/* Info de la tienda madre */}
      <div className="bg-violet-50 border border-violet-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Package className="w-5 h-5 text-violet-600 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-medium text-violet-900">Tienda madre</h3>
            <p className="text-sm text-violet-700 mt-1">
              La tienda de la que se importan los productos.
            </p>
            <div className="mt-3 flex items-end gap-4">
              <div className="flex-1 max-w-md">
                <Label htmlFor="sourceUrl" className="text-sm">URL de la tienda madre</Label>
                <Input
                  id="sourceUrl"
                  type="text"
                  placeholder="https://ejemplo.com"
                  value={sourceUrl}
                  onChange={(e) => setSourceUrl(e.target.value)}
                  className="mt-1"
                />
              </div>
              <Button onClick={handleSaveSource} disabled={savingSource}>
                {savingSource ? "Guardando..." : "Guardar"}
              </Button>
            </div>
            {sourceUrl && (
              <a
                href={sourceUrl.startsWith("http") ? sourceUrl : `https://${sourceUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-violet-600 hover:text-violet-800 mt-3"
              >
                Ver tienda <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Configuracion del margen */}
      <div className="bg-white border border-neutral-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <TrendingUp className="w-5 h-5 text-green-600 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-medium text-neutral-900">Margen de ganancia</h3>
            <p className="text-sm text-neutral-500 mt-1">
              El porcentaje que se agrega sobre el precio original de la tienda madre.
            </p>
            <div className="mt-4 flex items-end gap-4">
              <div className="flex-1 max-w-[200px]">
                <Label htmlFor="markup" className="text-sm">Porcentaje (%)</Label>
                <Input
                  id="markup"
                  type="number"
                  min="0"
                  max="500"
                  value={markup}
                  onChange={(e) => setMarkup(Number(e.target.value))}
                  className="mt-1"
                />
              </div>
              <Button onClick={handleSaveMarkup} disabled={saving}>
                {saving ? "Guardando..." : "Guardar margen"}
              </Button>
            </div>
            <p className="text-xs text-neutral-400 mt-2">
              Ejemplo: Si el producto cuesta $10.000 y pones 20%, se vendera a $12.000
            </p>
          </div>
        </div>
      </div>

      {/* Sincronizacion */}
      <div className="bg-white border border-neutral-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <RefreshCw className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-medium text-neutral-900">Sincronizar productos</h3>
            <p className="text-sm text-neutral-500 mt-1">
              Actualiza los productos desde la tienda madre. Esto puede tardar unos minutos.
            </p>
            <div className="mt-4 flex items-center gap-4">
              <Button onClick={handleSync} disabled={syncing} variant="outline">
                <RefreshCw className={`w-4 h-4 mr-2 ${syncing ? "animate-spin" : ""}`} />
                {syncing ? "Sincronizando..." : "Sincronizar ahora"}
              </Button>
              {lastSync && (
                <span className="text-sm text-neutral-500">
                  Ultima sincronizacion: {lastSync}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mensajes */}
      {message && (
        <div className={`flex items-start gap-2 p-4 rounded-lg ${
          message.type === "success"
            ? "bg-green-50 border border-green-200 text-green-800"
            : "bg-red-50 border border-red-200 text-red-800"
        }`}>
          <AlertCircle className="w-5 h-5 mt-0.5" />
          <p className="text-sm">{message.text}</p>
        </div>
      )}

      {/* Aviso importante */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-amber-900">Como funciona</h3>
            <ul className="text-sm text-amber-700 mt-2 space-y-1 list-disc pl-4">
              <li>Cuando alguien compra en tu tienda, recibis una notificacion por email</li>
              <li>La notificacion incluye todos los datos del pedido y la direccion de envio</li>
              <li>Vos compras el producto en la tienda madre y mandas a la direccion del cliente</li>
              <li>Tu ganancia es la diferencia entre lo que cobras y lo que pagas</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Lista de productos (solo lectura) */}
      <div className="bg-white border border-neutral-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-medium text-neutral-900">Productos importados</h3>
            <p className="text-sm text-neutral-500">
              Estos productos vienen de la tienda madre. No se pueden editar.
            </p>
          </div>
          <span className="text-sm text-neutral-400">{products.length} productos</span>
        </div>

        {loadingProducts ? (
          <div className="text-center py-8 text-neutral-500">Cargando productos...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-8 text-neutral-500">
            <Package className="w-12 h-12 mx-auto text-neutral-300 mb-2" />
            <p>No hay productos importados todavia</p>
            <p className="text-sm">Usa el boton "Sincronizar ahora" para importar productos</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-sm text-neutral-500">
                  <th className="pb-3 font-medium">Imagen</th>
                  <th className="pb-3 font-medium">Nombre</th>
                  <th className="pb-3 font-medium">Precio</th>
                  <th className="pb-3 font-medium">Stock</th>
                  <th className="pb-3 font-medium">Variantes</th>
                  <th className="pb-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-neutral-50">
                    <td className="py-3">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-neutral-100 rounded flex items-center justify-center">
                          <Package className="w-6 h-6 text-neutral-300" />
                        </div>
                      )}
                    </td>
                    <td className="py-3">
                      <span className="font-medium text-sm">{product.name}</span>
                    </td>
                    <td className="py-3">
                      <span className="font-semibold">${product.price.toLocaleString()}</span>
                    </td>
                    <td className="py-3">
                      <span className={`text-sm ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}>
                        {product.stock > 0 ? `${product.stock} u.` : "Sin stock"}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className="text-xs text-neutral-500">
                        {product.sizes && product.sizes.length > 0
                          ? product.sizes.map((s) => s.size).join(", ")
                          : "-"}
                      </span>
                    </td>
                    <td className="py-3">
                      {product.source_url && (
                        <a
                          href={product.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-violet-600 hover:text-violet-800"
                          title="Ver en tienda madre"
                        >
                          <Eye className="w-4 h-4" />
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
    </div>
  )
}
