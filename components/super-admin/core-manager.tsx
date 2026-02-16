"use client"

import React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Rocket, 
  Store, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle,
  Package,
  Paintbrush,
  Settings,
  Upload,
  History,
  Zap,
  Shield,
  CreditCard,
  ShoppingCart,
  Search,
  BarChart3,
  Truck,
  Bell,
  MessageCircle
} from "lucide-react"

interface CoreVersion {
  id: string
  version: string
  changelog: string
  features: string[]
  breaking_changes: boolean
  released_at: string
}

interface CoreFeature {
  key: string
  name: string
  description: string
  icon: React.ElementType
  category: "pagos" | "envios" | "marketing" | "funcionalidad"
  enabled: boolean
}

const CORE_FEATURES: CoreFeature[] = [
  // Pagos
  { key: "mercadopago_enabled", name: "MercadoPago", description: "Cobrar con tarjetas, transferencias y efectivo", icon: CreditCard, category: "pagos", enabled: true },
  { key: "stripe_enabled", name: "Stripe", description: "Pagos internacionales con tarjeta", icon: CreditCard, category: "pagos", enabled: false },
  
  // Envios
  { key: "envios_andreani", name: "Andreani", description: "Envios a todo el pais con Andreani", icon: Truck, category: "envios", enabled: false },
  { key: "envios_oca", name: "OCA", description: "Envios con OCA e-Pack", icon: Truck, category: "envios", enabled: false },
  
  // Marketing
  { key: "seo_enabled", name: "SEO Automatico", description: "Meta tags, sitemap y datos estructurados", icon: Search, category: "marketing", enabled: true },
  { key: "analytics_enabled", name: "Analytics", description: "Estadisticas de visitas y ventas", icon: BarChart3, category: "marketing", enabled: true },
  { key: "notificaciones_email", name: "Emails", description: "Notificaciones por email a clientes", icon: Bell, category: "marketing", enabled: true },
  { key: "notificaciones_whatsapp", name: "WhatsApp", description: "Notificaciones por WhatsApp", icon: MessageCircle, category: "marketing", enabled: false },
  
  // Funcionalidad
  { key: "checkout_enabled", name: "Checkout", description: "Proceso de compra optimizado", icon: ShoppingCart, category: "funcionalidad", enabled: true },
  { key: "carrito_enabled", name: "Carrito", description: "Carrito de compras persistente", icon: ShoppingCart, category: "funcionalidad", enabled: true },
  { key: "wishlist_enabled", name: "Lista de deseos", description: "Guardar productos favoritos", icon: Zap, category: "funcionalidad", enabled: false },
  { key: "reviews_enabled", name: "Reviews", description: "Reseñas de productos por clientes", icon: MessageCircle, category: "funcionalidad", enabled: false },
  { key: "chat_enabled", name: "Chat en vivo", description: "Chat con clientes en tiempo real", icon: MessageCircle, category: "funcionalidad", enabled: false },
]

export function CoreManager() {
  const [versions, setVersions] = useState<CoreVersion[]>([])
  const [currentVersion, setCurrentVersion] = useState("1.0.0")
  const [features, setFeatures] = useState(CORE_FEATURES)
  const [storesCount, setStoresCount] = useState(0)
  const [storesUpdated, setStoresUpdated] = useState(0)
  const [loading, setLoading] = useState(false)
  const [newVersion, setNewVersion] = useState({ version: "", changelog: "", breaking: false })

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      // Cargar versiones
      const versionsRes = await fetch("/api/admin/core/versions")
      if (versionsRes.ok) {
        const data = await versionsRes.json()
        setVersions(data.versions || [])
        if (data.versions?.length > 0) {
          setCurrentVersion(data.versions[0].version)
        }
      }
      
      // Cargar conteo de tiendas
      const storesRes = await fetch("/api/admin/stores/count")
      if (storesRes.ok) {
        const data = await storesRes.json()
        setStoresCount(data.total || 0)
        setStoresUpdated(data.updated || 0)
      }
    } catch (error) {
      console.error("Error loading core data:", error)
    }
  }

  async function releaseNewVersion() {
    if (!newVersion.version || !newVersion.changelog) return
    setLoading(true)
    
    try {
      const res = await fetch("/api/admin/core/release", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          version: newVersion.version,
          changelog: newVersion.changelog,
          breaking_changes: newVersion.breaking,
          features: features.filter(f => f.enabled).map(f => f.key)
        })
      })
      
      if (res.ok) {
        setNewVersion({ version: "", changelog: "", breaking: false })
        loadData()
      }
    } catch (error) {
      console.error("Error releasing version:", error)
    } finally {
      setLoading(false)
    }
  }

  async function updateAllStores() {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/core/update-all", { method: "POST" })
      if (res.ok) {
        loadData()
      }
    } catch (error) {
      console.error("Error updating stores:", error)
    } finally {
      setLoading(false)
    }
  }

  function toggleFeature(key: string) {
    setFeatures(features.map(f => 
      f.key === key ? { ...f, enabled: !f.enabled } : f
    ))
  }

  const featuresByCategory = {
    pagos: features.filter(f => f.category === "pagos"),
    envios: features.filter(f => f.category === "envios"),
    marketing: features.filter(f => f.category === "marketing"),
    funcionalidad: features.filter(f => f.category === "funcionalidad"),
  }

  return (
    <div className="space-y-6">
      {/* Header con stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Rocket className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Version actual</p>
                <p className="text-xl font-bold">{currentVersion}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Store className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tiendas totales</p>
                <p className="text-xl font-bold">{storesCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Actualizadas</p>
                <p className="text-xl font-bold">{storesUpdated}/{storesCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Package className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Features activas</p>
                <p className="text-xl font-bold">{features.filter(f => f.enabled).length}/{features.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="features" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="features">
            <Settings className="w-4 h-4 mr-2" />
            Features del Core
          </TabsTrigger>
          <TabsTrigger value="release">
            <Upload className="w-4 h-4 mr-2" />
            Nueva Version
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="w-4 h-4 mr-2" />
            Historial
          </TabsTrigger>
        </TabsList>

        {/* Features del Core */}
        <TabsContent value="features" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                Features del Core
              </CardTitle>
              <CardDescription>
                Estas funcionalidades se actualizan automaticamente en TODAS las tiendas cuando activas/desactivas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Pagos */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <CreditCard className="w-4 h-4" /> Pagos
                </h4>
                <div className="grid gap-3">
                  {featuresByCategory.pagos.map(feature => (
                    <div key={feature.key} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <feature.icon className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{feature.name}</p>
                          <p className="text-sm text-muted-foreground">{feature.description}</p>
                        </div>
                      </div>
                      <Switch 
                        checked={feature.enabled} 
                        onCheckedChange={() => toggleFeature(feature.key)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Envios */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Truck className="w-4 h-4" /> Envios
                </h4>
                <div className="grid gap-3">
                  {featuresByCategory.envios.map(feature => (
                    <div key={feature.key} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <feature.icon className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{feature.name}</p>
                          <p className="text-sm text-muted-foreground">{feature.description}</p>
                        </div>
                      </div>
                      <Switch 
                        checked={feature.enabled} 
                        onCheckedChange={() => toggleFeature(feature.key)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Marketing */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" /> Marketing y SEO
                </h4>
                <div className="grid gap-3">
                  {featuresByCategory.marketing.map(feature => (
                    <div key={feature.key} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <feature.icon className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{feature.name}</p>
                          <p className="text-sm text-muted-foreground">{feature.description}</p>
                        </div>
                      </div>
                      <Switch 
                        checked={feature.enabled} 
                        onCheckedChange={() => toggleFeature(feature.key)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Funcionalidad */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4" /> Funcionalidad
                </h4>
                <div className="grid gap-3">
                  {featuresByCategory.funcionalidad.map(feature => (
                    <div key={feature.key} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <feature.icon className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{feature.name}</p>
                          <p className="text-sm text-muted-foreground">{feature.description}</p>
                        </div>
                      </div>
                      <Switch 
                        checked={feature.enabled} 
                        onCheckedChange={() => toggleFeature(feature.key)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <Button className="w-full" onClick={updateAllStores} disabled={loading}>
                {loading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Rocket className="w-4 h-4 mr-2" />}
                Aplicar cambios a todas las tiendas
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Nueva Version */}
        <TabsContent value="release" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-blue-500" />
                Lanzar Nueva Version
              </CardTitle>
              <CardDescription>
                Crea una nueva version del core que se aplicara a todas las tiendas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Numero de version</Label>
                  <Input 
                    placeholder="ej: 1.1.0"
                    value={newVersion.version}
                    onChange={e => setNewVersion({ ...newVersion, version: e.target.value })}
                  />
                </div>
                <div className="space-y-2 flex items-end gap-4">
                  <div className="flex items-center gap-2">
                    <Switch 
                      id="breaking"
                      checked={newVersion.breaking}
                      onCheckedChange={v => setNewVersion({ ...newVersion, breaking: v })}
                    />
                    <Label htmlFor="breaking" className="flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4 text-yellow-500" />
                      Breaking changes
                    </Label>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Changelog (que cambio?)</Label>
                <Textarea 
                  placeholder="Describe los cambios de esta version..."
                  rows={4}
                  value={newVersion.changelog}
                  onChange={e => setNewVersion({ ...newVersion, changelog: e.target.value })}
                />
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Features incluidas en esta version:</strong>
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {features.filter(f => f.enabled).map(f => (
                    <Badge key={f.key} variant="secondary">{f.name}</Badge>
                  ))}
                </div>
              </div>

              <Button 
                className="w-full" 
                onClick={releaseNewVersion}
                disabled={loading || !newVersion.version || !newVersion.changelog}
              >
                {loading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Rocket className="w-4 h-4 mr-2" />}
                Lanzar Version {newVersion.version || "..."}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Historial */}
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5 text-purple-500" />
                Historial de Versiones
              </CardTitle>
            </CardHeader>
            <CardContent>
              {versions.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No hay versiones registradas todavia
                </p>
              ) : (
                <div className="space-y-3">
                  {versions.map((v, i) => (
                    <div key={v.id} className={`p-4 border rounded-lg ${i === 0 ? 'border-green-500 bg-green-50' : ''}`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant={i === 0 ? "default" : "secondary"}>
                            v{v.version}
                          </Badge>
                          {v.breaking_changes && (
                            <Badge variant="destructive" className="text-xs">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              Breaking
                            </Badge>
                          )}
                          {i === 0 && <Badge variant="outline" className="text-green-600">Actual</Badge>}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(v.released_at).toLocaleDateString('es-AR')}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{v.changelog}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Info sobre el sistema */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <h4 className="font-semibold flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-blue-600" />
            Como funciona el sistema hibrido
          </h4>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium text-blue-800">Core (se actualiza automaticamente):</p>
              <ul className="list-disc list-inside text-blue-700 mt-1">
                <li>Checkout y proceso de compra</li>
                <li>Integraciones de pago</li>
                <li>SEO y analytics</li>
                <li>Seguridad y performance</li>
                <li>Nuevas funcionalidades</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-blue-800">Diseño (NO se actualiza):</p>
              <ul className="list-disc list-inside text-blue-700 mt-1">
                <li>Colores y tipografia</li>
                <li>Logo y favicon</li>
                <li>Layout personalizado</li>
                <li>CSS custom</li>
                <li>Textos e imagenes</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
