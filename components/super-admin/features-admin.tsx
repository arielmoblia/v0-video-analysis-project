"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import {
  BarChart3,
  Video,
  MessageSquare,
  EyeOff,
  Globe,
  Package,
  Headphones,
  Save,
  Settings,
  RefreshCw,
  Plus,
  Trash2,
  Info,
  Check,
  X,
  DollarSign,
  Zap,
} from "lucide-react"

interface Feature {
  id: string
  code: string
  name: string
  description: string
  price: number
  icon: string
  is_active: boolean
  created_at: string
}

const ICON_MAP: { [key: string]: any } = {
  BarChart3: BarChart3,
  Video: Video,
  MessageSquare: MessageSquare,
  EyeOff: EyeOff,
  Globe: Globe,
  Package: Package,
  Headphones: Headphones,
}

const ICON_COLORS: { [key: string]: string } = {
  BarChart3: "bg-purple-500/20 text-purple-400",
  Video: "bg-pink-500/20 text-pink-400",
  MessageSquare: "bg-blue-500/20 text-blue-400",
  EyeOff: "bg-slate-500/20 text-slate-400",
  Globe: "bg-green-500/20 text-green-400",
  Package: "bg-orange-500/20 text-orange-400",
  Headphones: "bg-cyan-500/20 text-cyan-400",
}

export function FeaturesAdmin() {
  const [features, setFeatures] = useState<Feature[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null)
  const [showNewFeature, setShowNewFeature] = useState(false)
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards")
  const [exchangeRate, setExchangeRate] = useState(1100)
  const [editingRate, setEditingRate] = useState(false)
  const [tempRate, setTempRate] = useState(1100)
  const [useAutoRate, setUseAutoRate] = useState(true)
  const [rateSource, setRateSource] = useState("mep")
  const [lastRateUpdate, setLastRateUpdate] = useState("")
  const [refreshingRate, setRefreshingRate] = useState(false)
  const [newFeature, setNewFeature] = useState({
    code: "",
    name: "",
    description: "",
    price: 1, // Ahora en USD
    icon: "Package",
  })

  const fetchFeatures = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/super-admin/features")
      if (res.ok) {
        const data = await res.json()
        setFeatures(data.features || [])
      }
      const rateRes = await fetch("/api/super-admin/exchange-rate")
      if (rateRes.ok) {
        const rateData = await rateRes.json()
        setExchangeRate(rateData.rate || 1100)
        setTempRate(rateData.rate || 1100)
        setUseAutoRate(rateData.useAutoRate !== false)
        setRateSource(rateData.source || "mep")
        setLastRateUpdate(rateData.lastUpdate || "")
      }
    } catch (error) {
      console.error("Error fetching features:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFeatures()
  }, [])

  const handleRefreshRate = async () => {
    setRefreshingRate(true)
    try {
      const res = await fetch("/api/super-admin/exchange-rate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ useAutoRate: true }),
      })
      if (res.ok) {
        const data = await res.json()
        setExchangeRate(data.rate)
        setUseAutoRate(true)
        setRateSource("mep")
        setLastRateUpdate(new Date().toISOString())
      }
    } catch (error) {
      console.error("Error refreshing rate:", error)
    } finally {
      setRefreshingRate(false)
    }
  }

  const handleSaveRate = async () => {
    try {
      await fetch("/api/super-admin/exchange-rate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rate: tempRate, useAutoRate: false }),
      })
      setExchangeRate(tempRate)
      setUseAutoRate(false)
      setRateSource("manual")
      setEditingRate(false)
    } catch (error) {
      console.error("Error saving rate:", error)
    }
  }

  const handleToggleActive = async (feature: Feature) => {
    setSaving(feature.id)
    try {
      const res = await fetch("/api/super-admin/features", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: feature.id,
          is_active: !feature.is_active,
        }),
      })
      if (res.ok) {
        setFeatures(features.map((f) => (f.id === feature.id ? { ...f, is_active: !f.is_active } : f)))
      }
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setSaving(null)
    }
  }

  const handleSaveFeature = async () => {
    if (!editingFeature) return
    setSaving(editingFeature.id)
    try {
      const res = await fetch("/api/super-admin/features", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingFeature.id,
          name: editingFeature.name,
          description: editingFeature.description,
          price: editingFeature.price,
          icon: editingFeature.icon,
        }),
      })
      if (res.ok) {
        setFeatures(features.map((f) => (f.id === editingFeature.id ? editingFeature : f)))
        setEditingFeature(null)
      }
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setSaving(null)
    }
  }

  const handleCreateFeature = async () => {
    setSaving("new")
    try {
      const res = await fetch("/api/super-admin/features", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newFeature),
      })
      if (res.ok) {
        const data = await res.json()
        setFeatures([...features, data.feature])
        setShowNewFeature(false)
        setNewFeature({
          code: "",
          name: "",
          description: "",
          price: 1, // Ahora en USD
          icon: "Package",
        })
      }
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setSaving(null)
    }
  }

  const handleDeleteFeature = async (feature: Feature) => {
    if (!confirm(`¿Estás seguro de eliminar "${feature.name}"?`)) return
    setSaving(feature.id)
    try {
      const res = await fetch(`/api/super-admin/features?id=${feature.id}`, {
        method: "DELETE",
      })
      if (res.ok) {
        setFeatures(features.filter((f) => f.id !== feature.id))
      }
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setSaving(null)
    }
  }

  const totalActive = features.filter((f) => f.is_active).length
  const totalInactive = features.filter((f) => !f.is_active).length

  const formatLastUpdate = (dateStr: string) => {
    if (!dateStr) return ""
    const date = new Date(dateStr)
    return date.toLocaleString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Plan Cositas</h2>
          <p className="text-slate-400">Administrá las funcionalidades que los clientes pueden comprar</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchFeatures}
            className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Actualizar
          </Button>
          <Button size="sm" onClick={() => setShowNewFeature(true)} className="bg-green-600 hover:bg-green-700">
            <Plus className="w-4 h-4 mr-2" />
            Nueva Cosita
          </Button>
        </div>
      </div>

      <Card className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/30 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-green-300 font-semibold">Cotización del dólar</p>
                  {useAutoRate && (
                    <Badge className="bg-emerald-500/30 text-emerald-300 border-0 text-xs">
                      <Zap className="w-3 h-3 mr-1" />
                      MEP Automático
                    </Badge>
                  )}
                  {!useAutoRate && <Badge className="bg-yellow-500/30 text-yellow-300 border-0 text-xs">Manual</Badge>}
                </div>
                <p className="text-xs text-green-400/70">
                  {useAutoRate
                    ? "Se actualiza automáticamente con la cotización del dólar MEP"
                    : "Cotización configurada manualmente"}
                  {lastRateUpdate && ` • Última actualización: ${formatLastUpdate(lastRateUpdate)}`}
                </p>
              </div>
            </div>

            {editingRate ? (
              <div className="flex items-center gap-2">
                <span className="text-green-300">1 USD =</span>
                <Input
                  type="number"
                  value={tempRate}
                  onChange={(e) => setTempRate(Number(e.target.value))}
                  className="w-28 bg-slate-700 border-green-500/50 text-white"
                />
                <span className="text-green-300">ARS</span>
                <Button size="sm" onClick={handleSaveRate} className="bg-green-600 hover:bg-green-700">
                  <Save className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setEditingRate(false)} className="text-slate-400">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-green-400">
                  1 USD = ${exchangeRate.toLocaleString("es-AR")} ARS
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleRefreshRate}
                  disabled={refreshingRate}
                  className="text-green-400 hover:bg-green-500/20"
                  title="Actualizar cotización MEP"
                >
                  <RefreshCw className={`w-4 h-4 ${refreshingRate ? "animate-spin" : ""}`} />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setEditingRate(true)}
                  className="text-yellow-400 hover:bg-yellow-500/20"
                  title="Configurar manualmente"
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-400 font-semibold">Activas</p>
                <p className="text-2xl font-bold text-white">{totalActive}</p>
              </div>
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Check className="w-5 h-5 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-400 font-semibold">Inactivas</p>
                <p className="text-2xl font-bold text-white">{totalInactive}</p>
              </div>
              <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                <X className="w-5 h-5 text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-400 font-semibold">Total</p>
                <p className="text-2xl font-bold text-white">{features.length}</p>
              </div>
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Explicación */}
      <Card className="bg-blue-500/10 border-blue-500/30">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-400 mt-0.5" />
            <div className="text-sm text-blue-200">
              <p className="font-semibold mb-1">¿Cómo funciona?</p>
              <p>
                Los precios se configuran en <strong>USD</strong> aquí. Los clientes ven los precios convertidos a{" "}
                <strong>ARS</strong> usando la cotización de arriba. Si cambiás la cotización, todos los precios se
                actualizan automáticamente para los clientes.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Features como tarjetas (igual que ve el cliente) */}
      {loading ? (
        <div className="text-center py-8 text-slate-400">Cargando cositas...</div>
      ) : features.length === 0 ? (
        <div className="text-center py-8 text-slate-400">No hay cositas configuradas</div>
      ) : (
        <div className="space-y-3">
          {features.map((feature) => {
            const IconComponent = ICON_MAP[feature.icon] || Package
            const iconColor = ICON_COLORS[feature.icon] || "bg-slate-500/20 text-slate-400"
            const priceARS = feature.price * exchangeRate

            return (
              <Card
                key={feature.id}
                className={`border transition-all ${
                  feature.is_active ? "bg-slate-800 border-slate-700" : "bg-slate-900/50 border-slate-800 opacity-60"
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Checkbox para activar/desactivar */}
                    <div className="flex items-center">
                      <Checkbox
                        checked={feature.is_active}
                        onCheckedChange={() => handleToggleActive(feature)}
                        disabled={saving === feature.id}
                        className="w-5 h-5 border-slate-500 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                      />
                    </div>

                    {/* Icono */}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconColor}`}>
                      <IconComponent className="w-6 h-6" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className={`font-semibold ${feature.is_active ? "text-white" : "text-slate-500"}`}>
                          {feature.name}
                        </h3>
                        <Badge variant="outline" className="border-slate-600 text-slate-500 font-mono text-xs">
                          {feature.code}
                        </Badge>
                        {!feature.is_active && <Badge className="bg-red-500/20 text-red-400 border-0">Oculta</Badge>}
                      </div>
                      <p className={`text-sm mt-1 ${feature.is_active ? "text-slate-400" : "text-slate-600"}`}>
                        {feature.description}
                      </p>
                    </div>

                    {/* Precio */}
                    <div className="text-right">
                      <p className={`text-xl font-bold ${feature.is_active ? "text-green-400" : "text-slate-600"}`}>
                        USD ${feature.price}
                      </p>
                      <p className="text-xs text-slate-500">≈ ${priceARS.toLocaleString("es-AR")} ARS/mes</p>
                    </div>

                    {/* Acciones */}
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingFeature(feature)}
                        className="text-slate-400 hover:text-white hover:bg-slate-700"
                      >
                        <Settings className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteFeature(feature)}
                        disabled={saving === feature.id}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Modal Editar Feature */}
      <Dialog open={!!editingFeature} onOpenChange={() => setEditingFeature(null)}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle>Editar Cosita</DialogTitle>
          </DialogHeader>
          {editingFeature && (
            <div className="space-y-4">
              <div>
                <Label className="text-slate-300">Nombre</Label>
                <Input
                  value={editingFeature.name}
                  onChange={(e) => setEditingFeature({ ...editingFeature, name: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>

              <div>
                <Label className="text-slate-300">Descripción</Label>
                <Textarea
                  value={editingFeature.description}
                  onChange={(e) => setEditingFeature({ ...editingFeature, description: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                  rows={3}
                />
              </div>

              <div>
                <Label className="text-slate-300">Precio mensual (USD)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={editingFeature.price}
                  onChange={(e) => setEditingFeature({ ...editingFeature, price: Number(e.target.value) })}
                  className="bg-slate-700 border-slate-600 text-white"
                />
                <p className="text-xs text-slate-500 mt-1">
                  El cliente verá: ${(editingFeature.price * exchangeRate).toLocaleString("es-AR")} ARS
                </p>
              </div>

              <div>
                <Label className="text-slate-300">Icono</Label>
                <div className="grid grid-cols-7 gap-2 mt-2">
                  {Object.entries(ICON_MAP).map(([name, Icon]) => (
                    <button
                      key={name}
                      onClick={() => setEditingFeature({ ...editingFeature, icon: name })}
                      className={`p-3 rounded-lg border ${
                        editingFeature.icon === name
                          ? "border-blue-500 bg-blue-500/20"
                          : "border-slate-600 bg-slate-700 hover:bg-slate-600"
                      }`}
                    >
                      <Icon className="w-5 h-5 text-slate-300" />
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleSaveFeature}
                disabled={saving === editingFeature.id}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving === editingFeature.id ? "Guardando..." : "Guardar cambios"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal Nueva Feature */}
      <Dialog open={showNewFeature} onOpenChange={setShowNewFeature}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle>Nueva Cosita</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-slate-300">Código (único, sin espacios)</Label>
              <Input
                value={newFeature.code}
                onChange={(e) =>
                  setNewFeature({ ...newFeature, code: e.target.value.toLowerCase().replace(/\s/g, "_") })
                }
                placeholder="ej: mi_nueva_cosita"
                className="bg-slate-700 border-slate-600 text-white font-mono"
              />
            </div>

            <div>
              <Label className="text-slate-300">Nombre</Label>
              <Input
                value={newFeature.name}
                onChange={(e) => setNewFeature({ ...newFeature, name: e.target.value })}
                placeholder="ej: Mi Nueva Cosita"
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>

            <div>
              <Label className="text-slate-300">Descripción</Label>
              <Textarea
                value={newFeature.description}
                onChange={(e) => setNewFeature({ ...newFeature, description: e.target.value })}
                placeholder="Explicación de qué hace esta cosita..."
                className="bg-slate-700 border-slate-600 text-white"
                rows={3}
              />
            </div>

            <div>
              <Label className="text-slate-300">Precio mensual (USD)</Label>
              <Input
                type="number"
                step="0.01"
                value={newFeature.price}
                onChange={(e) => setNewFeature({ ...newFeature, price: Number(e.target.value) })}
                className="bg-slate-700 border-slate-600 text-white"
              />
              <p className="text-xs text-slate-500 mt-1">
                El cliente verá: ${(newFeature.price * exchangeRate).toLocaleString("es-AR")} ARS
              </p>
            </div>

            <div>
              <Label className="text-slate-300">Icono</Label>
              <div className="grid grid-cols-7 gap-2 mt-2">
                {Object.entries(ICON_MAP).map(([name, Icon]) => (
                  <button
                    key={name}
                    onClick={() => setNewFeature({ ...newFeature, icon: name })}
                    className={`p-3 rounded-lg border ${
                      newFeature.icon === name
                        ? "border-blue-500 bg-blue-500/20"
                        : "border-slate-600 bg-slate-700 hover:bg-slate-600"
                    }`}
                  >
                    <Icon className="w-5 h-5 text-slate-300" />
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={handleCreateFeature}
              disabled={saving === "new" || !newFeature.code || !newFeature.name}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              {saving === "new" ? "Creando..." : "Crear Cosita"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
