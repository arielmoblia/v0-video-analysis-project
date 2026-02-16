"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye, Users, TrendingUp, Globe, BarChart3, RefreshCw } from "lucide-react"

interface AnalyticsData {
  totalViews: number
  uniqueVisitors: number
  dailyViews: { date: string; views: number }[]
  topStores: { subdomain: string; title: string; views: number }[]
  topPages: { path: string; views: number }[]
}

export function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [days, setDays] = useState(30)

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/super-admin/analytics?days=${days}`)
      if (response.ok) {
        const result = await response.json()
        setData(result)
      }
    } catch (error) {
      console.error("Error fetching analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [days])

  const maxViews = data?.dailyViews ? Math.max(...data.dailyViews.map((d) => d.views), 1) : 1

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Analytics de la Plataforma</h2>
        <div className="flex gap-2">
          {[7, 30, 90].map((d) => (
            <Button key={d} variant={days === d ? "default" : "outline"} size="sm" onClick={() => setDays(d)}>
              {d} días
            </Button>
          ))}
          <Button variant="outline" size="sm" onClick={fetchAnalytics}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Visitas Totales</CardTitle>
            <Eye className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data?.totalViews?.toLocaleString() || 0}</div>
            <p className="text-xs text-gray-500">Últimos {days} días</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Visitantes Únicos</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data?.uniqueVisitors?.toLocaleString() || 0}</div>
            <p className="text-xs text-gray-500">Últimos {days} días</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Promedio Diario</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {data?.totalViews ? Math.round(data.totalViews / days).toLocaleString() : 0}
            </div>
            <p className="text-xs text-gray-500">Visitas por día</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Tiendas Activas</CardTitle>
            <Globe className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data?.topStores?.length || 0}</div>
            <p className="text-xs text-gray-500">Con visitas</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de visitas por día */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Visitas por Día
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-end gap-1">
            {data?.dailyViews?.map((day, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-blue-500 rounded-t transition-all hover:bg-blue-600"
                  style={{ height: `${(day.views / maxViews) * 200}px`, minHeight: day.views > 0 ? "4px" : "0" }}
                  title={`${day.date}: ${day.views} visitas`}
                />
                {i % Math.ceil(data.dailyViews.length / 10) === 0 && (
                  <span className="text-xs text-gray-500 -rotate-45 origin-left">
                    {new Date(day.date).toLocaleDateString("es-AR", { day: "2-digit", month: "short" })}
                  </span>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top tiendas */}
        <Card>
          <CardHeader>
            <CardTitle>Top Tiendas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data?.topStores?.length === 0 ? (
                <p className="text-gray-500 text-sm">Sin datos aún</p>
              ) : (
                data?.topStores?.map((store, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-gray-400 w-6">{i + 1}</span>
                      <div>
                        <p className="font-medium">{store.title}</p>
                        <p className="text-xs text-gray-500">{store.subdomain}.tol.ar</p>
                      </div>
                    </div>
                    <span className="font-semibold text-blue-600">{store.views.toLocaleString()}</span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top páginas */}
        <Card>
          <CardHeader>
            <CardTitle>Páginas Más Visitadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data?.topPages?.length === 0 ? (
                <p className="text-gray-500 text-sm">Sin datos aún</p>
              ) : (
                data?.topPages?.map((page, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-gray-400 w-6">{i + 1}</span>
                      <p className="font-medium text-sm truncate max-w-[200px]">{page.path}</p>
                    </div>
                    <span className="font-semibold text-blue-600">{page.views.toLocaleString()}</span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
