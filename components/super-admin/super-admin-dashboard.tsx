"use client"

import React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Store,
  TrendingUp,
  BarChart3,
  AlertTriangle,
  ExternalLink,
  LogOut,
  RefreshCw,
  Calendar,
  Globe,
  Trash2,
  CreditCard,
  DollarSign,
  Megaphone,
  Plug,
  Rocket,
  Layers,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Gift,
  X,
  Check,
  Images,
  MessageCircle,
  Palette,
  FileSpreadsheet,
  Mail // Declared Mail variable
} from "lucide-react"
import { createClient } from "@supabase/supabase-js"
import { AnalyticsDashboard } from "./analytics-dashboard"

// Cliente Supabase con service role para super-admin
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
import { FeaturesAdmin } from "./features-admin"
import { PaymentsConfig } from "./payments-config"
import { PlatformMarketing } from "./platform-marketing"
import { SeoModule } from "./seo-module"
import { CoreManager } from "./core-manager"
import { TemplateManager } from "./template-manager"
import { PromoMail } from "./promo-mail"
import { ScraperAdmin } from "./scraper-admin"

interface StoreData {
  id: string
  username: string
  email: string
  subdomain: string
  site_title: string
  status: string
  template: string
  plan: string
  created_at: string
  last_login?: string
  admin_password?: string
}

interface DeletedStoreData {
  id: string
  username: string
  email: string
  subdomain: string
  site_title: string
  plan: string
  deleted_at: string
  reason: string
}

// Features disponibles para regalar
const AVAILABLE_FEATURES = [
  { code: "multi_images", name: "Galeria de Imagenes", description: "Hasta 5 fotos por producto", icon: Images },
  { code: "whatsapp_chat", name: "Chat WhatsApp", description: "Boton flotante de WhatsApp", icon: MessageCircle },
  { code: "custom_variants", name: "Variantes Personalizables", description: "Aromas, colores, sabores", icon: Palette },
  { code: "csv_import", name: "Importar Productos CSV/Excel", description: "Carga masiva de productos", icon: FileSpreadsheet },
]

export function SuperAdminDashboard() {
  const [stores, setStores] = useState<StoreData[]>([])
  const [deletedStores, setDeletedStores] = useState<DeletedStoreData[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  
  // Estado para modal de features
  const [selectedStore, setSelectedStore] = useState<StoreData | null>(null)
  const [storeFeatures, setStoreFeatures] = useState<string[]>([])
  const [loadingFeatures, setLoadingFeatures] = useState(false)
  const [savingFeature, setSavingFeature] = useState<string | null>(null)

  const fetchStores = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/super-admin/stores")
      if (res.ok) {
        const data = await res.json()
        setStores(data.stores || [])
      }
    } catch (error) {
      console.error("Error fetching stores:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchDeletedStores = async () => {
    try {
      const res = await fetch("/api/super-admin/deleted-stores")
      if (res.ok) {
        const data = await res.json()
        setDeletedStores(data.stores || [])
      }
    } catch (error) {
      console.error("Error fetching deleted stores:", error)
    }
  }

  useEffect(() => {
    fetchStores()
    fetchDeletedStores()
  }, [])

  const handleLogout = async () => {
    await fetch("/api/super-admin/logout", { method: "POST" })
    window.location.reload()
  }

  const handleChangePlan = async (storeId: string, newPlan: string) => {
    try {
      const res = await fetch("/api/super-admin/update-store-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storeId, plan: newPlan }),
      })
      if (res.ok) {
        setStores(stores.map(s => s.id === storeId ? { ...s, plan: newPlan } : s))
      }
    } catch (error) {
      console.error("Error cambiando plan:", error)
    }
  }

  const handleDeleteStore = async (storeId: string, storeName: string) => {
    if (!confirm(`¿Estás seguro de que querés borrar la tienda "${storeName}"? Esta acción no se puede deshacer.`)) {
      return
    }

    setDeleting(storeId)
    try {
      const res = await fetch(`/api/super-admin/stores?id=${storeId}`, {
        method: "DELETE",
      })
      if (res.ok) {
        setStores(stores.filter((s) => s.id !== storeId))
      } else {
        alert("Error al borrar la tienda")
      }
    } catch (error) {
      console.error("Error deleting store:", error)
      alert("Error al borrar la tienda")
    } finally {
      setDeleting(null)
    }
  }

  const [planFilter, setPlanFilter] = useState<string>("all")
  const [sortColumn, setSortColumn] = useState<string>("created_at")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  // Funciones para gestionar features regaladas
  const openFeaturesModal = async (store: StoreData) => {
    setSelectedStore(store)
    setLoadingFeatures(true)
    try {
      // Consulta directa a Supabase sin depender de cookie
      const { data: features, error } = await supabaseAdmin
        .from("store_purchased_features")
        .select("feature_code")
        .eq("store_id", store.id)
        .eq("is_active", true)
      
      if (error) {
        console.error("[v0] Error consultando features:", error)
        setStoreFeatures([])
      } else {
        const activeCodes = (features || []).map((f) => f.feature_code)
        setStoreFeatures(activeCodes)
      }
    } catch (error) {
      console.error("[v0] Error cargando features:", error)
      setStoreFeatures([])
    } finally {
      setLoadingFeatures(false)
    }
  }

  const toggleFeature = async (featureCode: string) => {
    if (!selectedStore) return
    setSavingFeature(featureCode)
    const isActive = storeFeatures.includes(featureCode)
    
    try {
      if (isActive) {
        // Quitar feature
        const { error } = await supabaseAdmin
          .from("store_purchased_features")
          .delete()
          .eq("store_id", selectedStore.id)
          .eq("feature_code", featureCode)
        
        if (error) {
          alert("Error al quitar feature: " + error.message)
        } else {
          setStoreFeatures(storeFeatures.filter(f => f !== featureCode))
        }
      } else {
        // Regalar feature - verificar si existe
        const { data: existing } = await supabaseAdmin
          .from("store_purchased_features")
          .select("*")
          .eq("store_id", selectedStore.id)
          .eq("feature_code", featureCode)
          .single()
        
        let error
        if (existing) {
          const result = await supabaseAdmin
            .from("store_purchased_features")
            .update({ is_active: true, is_gifted: true })
            .eq("store_id", selectedStore.id)
            .eq("feature_code", featureCode)
          error = result.error
        } else {
          const result = await supabaseAdmin
            .from("store_purchased_features")
            .insert({
              store_id: selectedStore.id,
              feature_code: featureCode,
              is_active: true,
              is_gifted: true,
            })
          error = result.error
        }
        
        if (error) {
          alert("Error al regalar feature: " + error.message)
        } else {
          setStoreFeatures([...storeFeatures, featureCode])
        }
      }
    } catch (error) {
      console.error("Error toggling feature:", error)
      alert("Error de conexion")
    } finally {
      setSavingFeature(null)
    }
  }

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const SortableHeader = ({ column, children }: { column: string; children: React.ReactNode }) => (
    <th 
      className="text-left py-2 px-2 text-xs font-medium text-slate-500 cursor-pointer hover:bg-slate-50 select-none whitespace-nowrap"
      onClick={() => handleSort(column)}
    >
      <div className="flex items-center gap-0.5">
        {children}
        {sortColumn === column ? (
          sortDirection === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
        ) : (
          <ArrowUpDown className="w-3 h-3 opacity-30" />
        )}
      </div>
    </th>
  )
  
  const freeStores = stores.filter((s) => !s.plan || s.plan === "free").length
  const paidStores = stores.filter((s) => s.plan === "paid" || s.plan === "pro").length
  const templates = stores.filter((s) => s.plan === "templates").length
  const cositas = stores.filter((s) => s.plan === "cositas").length
  const socios = stores.filter((s) => s.plan === "socios").length
  const custom = stores.filter((s) => s.plan === "custom").length
  const mayoristas = stores.filter((s) => s.plan === "mayoristas").length

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const abandonedStores = stores.filter((s) => {
    const createdDate = new Date(s.created_at)
    return createdDate < thirtyDaysAgo && s.status === "active"
  }).length
  
  // Filtrar tiendas segun el plan seleccionado
  const filteredStores = stores
    .filter((s) => {
      if (planFilter === "all") return true
      if (planFilter === "templates") return s.plan === "templates"
      if (planFilter === "free") return !s.plan || s.plan === "free"
      if (planFilter === "cositas") return s.plan === "cositas"
      if (planFilter === "socios") return s.plan === "socios"
      if (planFilter === "custom") return s.plan === "custom"
      if (planFilter === "mayoristas") return s.plan === "mayoristas"
      return true
    })
    .sort((a, b) => {
      let aVal: string | number = ""
      let bVal: string | number = ""
      
      switch (sortColumn) {
        case "subdomain":
          aVal = a.subdomain?.toLowerCase() || ""
          bVal = b.subdomain?.toLowerCase() || ""
          break
        case "email":
          aVal = a.email?.toLowerCase() || ""
          bVal = b.email?.toLowerCase() || ""
          break
        case "password":
          aVal = a.admin_password || ""
          bVal = b.admin_password || ""
          break
        case "template":
          aVal = a.template?.toLowerCase() || "modelo1"
          bVal = b.template?.toLowerCase() || "modelo1"
          break
        case "plan":
          aVal = a.plan?.toLowerCase() || "free"
          bVal = b.plan?.toLowerCase() || "free"
          break
        case "status":
          aVal = a.status || ""
          bVal = b.status || ""
          break
        case "created_at":
          aVal = new Date(a.created_at).getTime()
          bVal = new Date(b.created_at).getTime()
          break
        default:
          aVal = a.subdomain?.toLowerCase() || ""
          bVal = b.subdomain?.toLowerCase() || ""
      }
      
      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1
      return 0
    })

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Store className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">tol.ar Admin</h1>
              <p className="text-sm text-slate-400">Panel de administración</p>
            </div>
          </div>
          <Button variant="ghost" onClick={handleLogout} className="text-slate-300 hover:text-white hover:bg-slate-700">
            <LogOut className="w-4 h-4 mr-2" />
            Salir
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs for Stores, Plans, Analytics, and Payments */}
        <Tabs defaultValue="stores" className="space-y-6">
          <TabsList className="bg-white border border-slate-200 shadow-sm">
            <TabsTrigger value="stores" className="data-[state=active]:bg-slate-100 text-slate-600 data-[state=active]:text-slate-900">
              <Store className="w-4 h-4 mr-2" />
              Tiendas
            </TabsTrigger>
            <TabsTrigger value="plans" className="data-[state=active]:bg-slate-100 text-slate-600 data-[state=active]:text-slate-900">
              <CreditCard className="w-4 h-4 mr-2" />
              Planes
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-slate-100 text-slate-600 data-[state=active]:text-slate-900">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="payments" className="data-[state=active]:bg-slate-100 text-slate-600 data-[state=active]:text-slate-900">
              <CreditCard className="w-4 h-4 mr-2" />
              Pagos
            </TabsTrigger>
            <TabsTrigger value="marketing" className="data-[state=active]:bg-slate-100 text-slate-600 data-[state=active]:text-slate-900">
              <Megaphone className="w-4 h-4 mr-2" />
              Marketing
            </TabsTrigger>
            <TabsTrigger value="seo" className="data-[state=active]:bg-slate-100 text-slate-600 data-[state=active]:text-slate-900">
              <Globe className="w-4 h-4 mr-2" />
              SEO
            </TabsTrigger>
            <TabsTrigger value="integraciones" className="data-[state=active]:bg-slate-100 text-slate-600 data-[state=active]:text-slate-900">
              <Plug className="w-4 h-4 mr-2" />
              Integraciones
            </TabsTrigger>
            <TabsTrigger value="core" className="data-[state=active]:bg-slate-100 text-slate-600 data-[state=active]:text-slate-900">
              <RefreshCw className="w-4 h-4 mr-2" />
              Core
            </TabsTrigger>
            <TabsTrigger value="templates" className="data-[state=active]:bg-slate-100 text-slate-600 data-[state=active]:text-slate-900">
              <Layers className="w-4 h-4 mr-1" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="promo-mail" className="data-[state=active]:bg-slate-100 text-slate-600 data-[state=active]:text-slate-900">
              <Mail className="w-4 h-4 mr-1" />
              Promo Mail
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stores" className="space-y-6">
            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-white border-slate-200 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-600 font-semibold">Tiendas Gratis</p>
                      <p className="text-3xl font-bold text-slate-900">{freeStores}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <Store className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-slate-200 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-600 font-semibold">Tiendas Pagas</p>
                      <p className="text-3xl font-bold text-slate-900">{paidStores}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-slate-200 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-yellow-600 font-semibold">Tiendas Abandonadas</p>
                      <p className="text-3xl font-bold text-slate-900">{abandonedStores}</p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6 text-yellow-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-slate-200 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-purple-600 font-semibold">Total Tiendas</p>
                      <p className="text-3xl font-bold text-slate-900">{stores.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filtros por Plan */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              <Button
                variant={planFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setPlanFilter("all")}
                className={planFilter === "all" ? "bg-slate-800 text-white" : "bg-transparent border-slate-300 text-slate-600 hover:bg-slate-100"}
              >
                TODAS ({stores.length})
              </Button>
              <Button
                variant={planFilter === "templates" ? "default" : "outline"}
                size="sm"
                onClick={() => setPlanFilter("templates")}
                className={planFilter === "templates" ? "bg-slate-800 text-white" : "bg-transparent border-slate-300 text-slate-600 hover:bg-slate-100"}
              >
                TEMPLATES ({templates})
              </Button>
              <Button
                variant={planFilter === "free" ? "default" : "outline"}
                size="sm"
                onClick={() => setPlanFilter("free")}
                className={planFilter === "free" ? "bg-green-600 text-white" : "bg-transparent border-slate-300 text-slate-600 hover:bg-slate-100"}
              >
                PLAN GRATIS ({freeStores})
              </Button>
              <Button
                variant={planFilter === "cositas" ? "default" : "outline"}
                size="sm"
                onClick={() => setPlanFilter("cositas")}
                className={planFilter === "cositas" ? "bg-orange-500 text-white" : "bg-transparent border-slate-300 text-slate-600 hover:bg-slate-100"}
              >
                PLAN COSITAS ({cositas})
              </Button>
              <Button
                variant={planFilter === "socios" ? "default" : "outline"}
                size="sm"
                onClick={() => setPlanFilter("socios")}
                className={planFilter === "socios" ? "bg-blue-600 text-white" : "bg-transparent border-slate-300 text-slate-600 hover:bg-slate-100"}
              >
                PLAN SOCIOS ({socios})
              </Button>
              <Button
                variant={planFilter === "custom" ? "default" : "outline"}
                size="sm"
                onClick={() => setPlanFilter("custom")}
                className={planFilter === "custom" ? "bg-purple-600 text-white" : "bg-transparent border-slate-300 text-slate-600 hover:bg-slate-100"}
              >
                PLAN COSTUMIZADAS ({custom})
              </Button>
              <Button
                variant={planFilter === "mayoristas" ? "default" : "outline"}
                size="sm"
                onClick={() => setPlanFilter("mayoristas")}
                className={planFilter === "mayoristas" ? "bg-amber-600 text-white" : "bg-transparent border-slate-300 text-slate-600 hover:bg-slate-100"}
              >
                MAYORISTAS ({mayoristas})
              </Button>
              <Button
                variant={planFilter === "deleted" ? "default" : "outline"}
                size="sm"
                onClick={() => setPlanFilter("deleted")}
                className={planFilter === "deleted" ? "bg-red-600 text-white" : "bg-transparent border-red-300 text-red-600 hover:bg-red-50"}
              >
                BORRADAS POR INACTIVIDAD ({deletedStores.length})
              </Button>
            </div>

            {/* Stores List */}
            <Card className="bg-white border-slate-200 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-slate-900">Tiendas Registradas</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchStores}
                  className="border-slate-300 text-slate-600 hover:bg-slate-100 bg-transparent"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                  Actualizar
                </Button>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8 text-slate-500">Cargando tiendas...</div>
                ) : planFilter === "deleted" ? (
                  /* Tabla de tiendas borradas */
                  deletedStores.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">No hay tiendas borradas por inactividad</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-slate-200">
                            <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Subdominio</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Email</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Titulo</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Plan</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Creada</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Borrada</th>
                          </tr>
                        </thead>
                        <tbody>
                          {deletedStores.map((store) => (
                            <tr key={store.id} className="border-b border-slate-100 hover:bg-red-50">
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2">
                                  <Globe className="w-4 h-4 text-red-400" />
                                  <span className="text-slate-500 line-through">{store.subdomain}.tol.ar</span>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-slate-700">{store.email}</td>
                              <td className="py-3 px-4 text-slate-700">{store.site_title}</td>
                              <td className="py-3 px-4">
                                <Badge variant="outline" className="border-slate-300 text-slate-500">
                                  {store.plan || "free"}
                                </Badge>
                              </td>
                              <td className="py-3 px-4 text-slate-500 text-sm">
                                {store.created_at ? new Date(store.created_at).toLocaleDateString("es-AR") : "—"}
                              </td>
                              <td className="py-3 px-4 text-red-500 text-sm">
                                {store.deleted_at ? new Date(store.deleted_at).toLocaleDateString("es-AR") : "—"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )
                ) : filteredStores.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    {planFilter === "all" ? "No hay tiendas registradas" : `No hay tiendas con el plan "${planFilter}"`}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-200 text-xs">
                          <SortableHeader column="subdomain">Subdominio</SortableHeader>
                          <SortableHeader column="username">Usuario</SortableHeader>
                          <SortableHeader column="email">Email</SortableHeader>
                          <SortableHeader column="password">Clave</SortableHeader>
                          <SortableHeader column="template">Template</SortableHeader>
                          <SortableHeader column="plan">Plan</SortableHeader>
                          <SortableHeader column="created_at">Creada</SortableHeader>
                          <th className="text-left py-2 px-2 text-xs font-medium text-slate-500">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredStores.map((store) => (
                          <tr key={store.id} className="border-b border-slate-100 hover:bg-slate-50 text-sm">
                            <td className="py-2 px-2">
                              <a 
                                href={`https://${store.subdomain}.tol.ar`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 hover:text-green-600 transition-colors"
                              >
                                <Globe className="w-3 h-3 text-slate-400 flex-shrink-0" />
                                <span className="text-slate-700 hover:text-green-600 hover:underline">{store.subdomain}.tol.ar</span>
                              </a>
                            </td>
                            <td className="py-2 px-2 text-slate-700">{store.username || "—"}</td>
                            <td className="py-2 px-2 text-slate-700 truncate max-w-[160px]">{store.email}</td>
                            <td className="py-2 px-2">
  <code className="px-1.5 py-0.5 bg-slate-100 rounded text-xs text-green-600 font-mono block truncate max-w-[100px]" title={store.admin_password || ""}>
  {store.admin_password && store.admin_password.length > 12 ? `${store.admin_password.slice(0, 12)}...` : store.admin_password || "—"}
  </code>
                            </td>
                            <td className="py-2 px-2">
                              <Badge variant="outline" className="border-slate-300 text-slate-600 text-xs px-1.5 py-0">
                                {store.template || "modelo1"}
                              </Badge>
                            </td>
                            <td className="py-2 px-2">
                              <select
                                value={store.plan || "free"}
                                onChange={(e) => handleChangePlan(store.id, e.target.value)}
                                className={`text-xs font-medium px-1.5 py-0.5 rounded border cursor-pointer ${
                                  store.plan === "templates" ? "bg-slate-100 text-slate-700 border-slate-300" :
                                  store.plan === "cositas" ? "bg-orange-100 text-orange-700 border-orange-200" :
                                  store.plan === "socios" ? "bg-blue-100 text-blue-700 border-blue-200" :
                                  store.plan === "custom" ? "bg-purple-100 text-purple-700 border-purple-200" :
                                  store.plan === "mayoristas" ? "bg-amber-100 text-amber-700 border-amber-200" :
                                  "bg-green-100 text-green-700 border-green-200"
                                }`}
                              >
                                <option value="free">Gratis</option>
                                <option value="templates">Templates</option>
                                <option value="cositas">Cositas</option>
                                <option value="socios">Socios</option>
                                <option value="custom">Custom</option>
                                <option value="mayoristas">Mayoristas</option>
                              </select>
                            </td>
                            <td className="py-2 px-2">
                              <div className="flex items-center gap-1 text-slate-500 text-xs whitespace-nowrap">
                                <Calendar className="w-3 h-3 flex-shrink-0" />
                                {new Date(store.created_at).toLocaleDateString("es-AR")}
                              </div>
                            </td>
                            <td className="py-2 px-2">
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  asChild
                                  className="text-slate-500 hover:text-slate-900 hover:bg-slate-100 h-6 w-6 p-0"
                                >
                                  <a
                                    href={`https://${store.subdomain}.tol.ar`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                  </a>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openFeaturesModal(store)}
                                  className="text-orange-500 hover:text-orange-700 hover:bg-orange-50 h-6 w-6 p-0"
                                  title="Regalar Features"
                                >
                                  <Gift className="w-3.5 h-3.5" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteStore(store.id, store.site_title)}
                                  disabled={deleting === store.id}
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50 h-6 w-6 p-0"
                                >
                                  <Trash2 className={`w-3.5 h-3.5 ${deleting === store.id ? "animate-pulse" : ""}`} />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Plans Tab */}
          <TabsContent value="plans">
            <FeaturesAdmin />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <AnalyticsDashboard />
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments">
            <PaymentsConfig />
          </TabsContent>

          {/* Marketing Tab */}
          <TabsContent value="marketing">
            <PlatformMarketing />
          </TabsContent>

          {/* SEO Tab */}
          <TabsContent value="seo">
            <SeoModule />
          </TabsContent>

          {/* Integraciones Tab */}
          <TabsContent value="integraciones">
            <PlatformMarketing defaultTab="integrations" />
          </TabsContent>

          {/* Core Tab */}
          <TabsContent value="core">
            <CoreManager />
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates">
            <TemplateManager />
          </TabsContent>

          <TabsContent value="promo-mail">
            <PromoMail stores={stores} />
          </TabsContent>
        </Tabs>
      </main>

      {/* Modal para regalar features */}
      {selectedStore && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Gift className="w-5 h-5 text-orange-500" />
                    Regalar Features
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedStore.site_title || selectedStore.subdomain}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedStore(null)}
                  className="h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loadingFeatures ? (
                <div className="text-center py-8 text-muted-foreground">
                  Cargando features...
                </div>
              ) : (
                <div className="space-y-3">
                  {AVAILABLE_FEATURES.map((feature) => {
                    const isActive = storeFeatures.includes(feature.code)
                    const isSaving = savingFeature === feature.code
                    const Icon = feature.icon
                    
                    return (
                      <div
                        key={feature.code}
                        className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                          isActive 
                            ? "bg-green-50 border-green-200" 
                            : "bg-slate-50 border-slate-200"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${isActive ? "bg-green-100" : "bg-slate-100"}`}>
                            <Icon className={`w-4 h-4 ${isActive ? "text-green-600" : "text-slate-500"}`} />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{feature.name}</p>
                            <p className="text-xs text-muted-foreground">{feature.description}</p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant={isActive ? "default" : "outline"}
                          onClick={() => toggleFeature(feature.code)}
                          disabled={isSaving}
                          className={`min-w-[100px] ${
                            isActive 
                              ? "bg-green-600 hover:bg-red-500" 
                              : "border-orange-300 text-orange-600 hover:bg-orange-50 bg-transparent"
                          } group`}
                        >
                          {isSaving ? (
                            <RefreshCw className="w-3 h-3 animate-spin" />
                          ) : isActive ? (
                            <>
                              <span className="flex items-center gap-1 group-hover:hidden">
                                <Check className="w-3 h-3" />
                                Activa
                              </span>
                              <span className="hidden group-hover:flex items-center gap-1">
                                <X className="w-3 h-3" />
                                Quitar
                              </span>
                            </>
                          ) : (
                            "Regalar"
                          )}
                        </Button>
                      </div>
                    )
                  })}
                </div>
              )}
              
              <div className="mt-4 pt-4 border-t">
                <p className="text-xs text-muted-foreground text-center">
                  Las features regaladas no tienen costo para el usuario
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
