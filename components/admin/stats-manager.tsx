"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExternalLink, Users, Eye, TrendingUp, Globe, Monitor, Smartphone, RefreshCw } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface StatsManagerProps {
  storeId: string
  subdomain: string
  googleAnalyticsId?: string
}

interface PageView {
  id: string
  page_path: string
  referrer: string | null
  country: string | null
  user_agent: string | null
  created_at: string
  visitor_id: string
}

interface StatsData {
  today: number
  week: number
  month: number
  total: number
  topPages: { path: string; count: number }[]
  devices: { desktop: number; mobile: number }
  recentVisitors: number
}

export function StatsManager({ storeId, subdomain, googleAnalyticsId }: StatsManagerProps) {
  const [stats, setStats] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("resumen")

  const fetchStats = async () => {
    setLoading(true)
    const supabase = createClient()
    
    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
    const monthStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()
    const last5min = new Date(now.getTime() - 5 * 60 * 1000).toISOString()

    // Obtener todas las visitas del mes
    const { data: views } = await supabase
      .from("page_views")
      .select("*")
      .eq("store_id", storeId)
      .gte("created_at", monthStart)
      .order("created_at", { ascending: false })

    if (views) {
      const today = views.filter(v => v.created_at >= todayStart).length
      const week = views.filter(v => v.created_at >= weekStart).length
      const month = views.length
      const recentVisitors = new Set(views.filter(v => v.created_at >= last5min).map(v => v.visitor_id)).size

      // Top páginas
      const pageCounts: Record<string, number> = {}
      views.forEach(v => {
        pageCounts[v.page_path] = (pageCounts[v.page_path] || 0) + 1
      })
      const topPages = Object.entries(pageCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([path, count]) => ({ path, count }))

      // Dispositivos
      let desktop = 0
      let mobile = 0
      views.forEach(v => {
        if (v.user_agent?.toLowerCase().includes("mobile")) {
          mobile++
        } else {
          desktop++
        }
      })

      // Total histórico
      const { count: totalCount } = await supabase
        .from("page_views")
        .select("*", { count: "exact", head: true })
        .eq("store_id", storeId)

      setStats({
        today,
        week,
        month,
        total: totalCount || month,
        topPages,
        devices: { desktop, mobile },
        recentVisitors
      })
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchStats()
    // Refrescar cada 30 segundos
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
  }, [storeId])

  const analyticsUrl = `https://analytics.google.com/analytics/web/#/realtime/overview`

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Estadísticas</h2>
          <p className="text-muted-foreground">Ve el tráfico de tu tienda en tiempo real</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchStats} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Actualizar
          </Button>
          {googleAnalyticsId && (
            <Button asChild>
              <a href={analyticsUrl} target="_blank" rel="noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                Ver en Google Analytics
              </a>
            </Button>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="resumen">Resumen</TabsTrigger>
          <TabsTrigger value="paginas">Páginas</TabsTrigger>
          <TabsTrigger value="dispositivos">Dispositivos</TabsTrigger>
        </TabsList>

        <TabsContent value="resumen" className="space-y-4">
          {/* Usuarios en tiempo real */}
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-lg font-medium">Usuarios activos ahora</span>
                </div>
                <span className="text-4xl font-bold text-green-600">
                  {loading ? "..." : stats?.recentVisitors || 0}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Estadísticas generales */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Hoy</CardDescription>
                <CardTitle className="text-3xl">{loading ? "..." : stats?.today || 0}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Eye className="w-4 h-4 mr-1" />
                  visitas
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Últimos 7 días</CardDescription>
                <CardTitle className="text-3xl">{loading ? "..." : stats?.week || 0}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-muted-foreground">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  visitas
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Últimos 30 días</CardDescription>
                <CardTitle className="text-3xl">{loading ? "..." : stats?.month || 0}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Globe className="w-4 h-4 mr-1" />
                  visitas
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total histórico</CardDescription>
                <CardTitle className="text-3xl">{loading ? "..." : stats?.total || 0}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="w-4 h-4 mr-1" />
                  visitas
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="paginas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Páginas más visitadas</CardTitle>
              <CardDescription>Últimos 30 días</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-muted-foreground">Cargando...</p>
              ) : stats?.topPages && stats.topPages.length > 0 ? (
                <div className="space-y-3">
                  {stats.topPages.map((page, i) => (
                    <div key={page.path} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-muted-foreground">{i + 1}</span>
                        <span className="font-medium">{page.path === "/" ? "Inicio" : page.path}</span>
                      </div>
                      <span className="text-muted-foreground">{page.count} visitas</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No hay datos todavía</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dispositivos" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-2">
                  <Monitor className="w-4 h-4" />
                  Computadora
                </CardDescription>
                <CardTitle className="text-3xl">
                  {loading ? "..." : stats?.devices.desktop || 0}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-full bg-neutral-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ 
                      width: stats ? `${(stats.devices.desktop / (stats.devices.desktop + stats.devices.mobile || 1)) * 100}%` : "0%" 
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4" />
                  Celular
                </CardDescription>
                <CardTitle className="text-3xl">
                  {loading ? "..." : stats?.devices.mobile || 0}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-full bg-neutral-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ 
                      width: stats ? `${(stats.devices.mobile / (stats.devices.desktop + stats.devices.mobile || 1)) * 100}%` : "0%" 
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Link a Google Analytics */}
      {googleAnalyticsId && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Google Analytics conectado</h3>
                <p className="text-sm text-muted-foreground">ID: {googleAnalyticsId}</p>
              </div>
              <Button variant="outline" asChild>
                <a href={analyticsUrl} target="_blank" rel="noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Abrir Analytics
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
