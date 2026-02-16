"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, CheckCircle, AlertTriangle, Info, X, TrendingUp, Search, Globe } from "lucide-react"
import { cn } from "@/lib/utils"

interface SEOAlert {
  id: string
  tipo: "info" | "warning" | "success" | "update"
  titulo: string
  mensaje: string
  link?: string
}

export function SEOAlerts() {
  const [alerts, setAlerts] = useState<SEOAlert[]>([])
  const [loading, setLoading] = useState(true)

  // Cargar estado real desde la nueva API dedicada de SEO
  useEffect(() => {
    async function loadAlerts() {
      try {
        const response = await fetch("/api/super-admin/seo-config")
        const newAlerts: SEOAlert[] = []
        
        if (response.ok) {
          const data = await response.json()
          
          // Verificar Google Analytics
          if (data.google_analytics_id && data.google_analytics_id.length > 5) {
            newAlerts.push({
              id: "ga-connected",
              tipo: "success",
              titulo: "Google Analytics Conectado",
              mensaje: `Tu sitio esta trackeando visitas correctamente. ID: ${data.google_analytics_id}`,
            })
          } else {
            newAlerts.push({
              id: "ga-missing",
              tipo: "warning",
              titulo: "Google Analytics No Conectado",
              mensaje: "Configura tu ID de Google Analytics en SEO > Google para trackear visitas.",
            })
          }
          
          // Verificar Search Console (basado en el flag google_verified)
          if (data.google_verified) {
            newAlerts.push({
              id: "gsc-connected",
              tipo: "success",
              titulo: "Search Console Verificado",
              mensaje: "Google puede indexar tu sitio. Revisa el panel para ver las busquedas.",
              link: "https://search.google.com/search-console",
            })
          } else {
            newAlerts.push({
              id: "gsc-missing",
              tipo: "warning",
              titulo: "Search Console No Verificado",
              mensaje: "Verifica tu sitio en Google Search Console para aparecer en busquedas.",
              link: "https://search.google.com/search-console",
            })
          }

          // Verificar Bing (opcional, solo mostrar si esta verificado)
          if (data.bing_verified) {
            newAlerts.push({
              id: "bing-connected",
              tipo: "success",
              titulo: "Bing Webmaster Verificado",
              mensaje: "Tu sitio tambien aparece en busquedas de Bing y DuckDuckGo.",
              link: "https://www.bing.com/webmasters",
            })
          }

          // Verificar Sitemap
          if (data.sitemap_submitted) {
            newAlerts.push({
              id: "sitemap-done",
              tipo: "success",
              titulo: "Sitemap Enviado a Buscadores",
              mensaje: "Los buscadores conocen todas tus paginas. La indexacion puede tardar 1-2 semanas.",
            })
          }
          
          // Verificar si todo esta completo
          const hasAnalytics = data.google_analytics_id && data.google_analytics_id.length > 5
          const hasSearchConsole = data.google_verified
          const allDone = hasAnalytics && hasSearchConsole
          
          // Solo mostrar tip si falta algo importante
          if (!allDone) {
            const missing: string[] = []
            if (!hasAnalytics) missing.push("Google Analytics")
            if (!hasSearchConsole) missing.push("Search Console")
            
            if (missing.length > 0) {
              newAlerts.push({
                id: "tip-seo",
                tipo: "info",
                titulo: `Configura ${missing.join(" y ")}`,
                mensaje: "Completa la configuracion en la tab Google para mejorar tu SEO.",
              })
            }
          }
        }
        
        setAlerts(newAlerts)
      } catch (error) {
        console.error("Error loading SEO alerts:", error)
        setAlerts([
          {
            id: "error",
            tipo: "warning",
            titulo: "No se pudo cargar el estado",
            mensaje: "Verifica la conexion y recarga la pagina.",
          }
        ])
      } finally {
        setLoading(false)
      }
    }
    loadAlerts()
  }, [])

  function markAsRead(alertId: string) {
    setAlerts(alerts.filter(a => a.id !== alertId))
  }

  const getIcon = (tipo: string) => {
    switch (tipo) {
      case "success": return <CheckCircle className="w-5 h-5 text-green-600" />
      case "warning": return <AlertTriangle className="w-5 h-5 text-yellow-600" />
      case "update": return <TrendingUp className="w-5 h-5 text-blue-600" />
      default: return <Info className="w-5 h-5 text-blue-600" />
    }
  }

  const getBgColor = (tipo: string) => {
    switch (tipo) {
      case "success": return "bg-green-50 border-green-200"
      case "warning": return "bg-yellow-50 border-yellow-200"
      case "update": return "bg-blue-50 border-blue-200"
      default: return "bg-blue-50 border-blue-200"
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Bell className="w-5 h-5" />
          Alertas y Novedades SEO
          {alerts.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {alerts.length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading ? (
          <div className="text-center py-6 text-gray-500">
            <div className="w-10 h-10 mx-auto mb-2 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
            <p>Cargando estado...</p>
          </div>
        ) : alerts.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <CheckCircle className="w-10 h-10 mx-auto mb-2 text-green-500" />
            <p>Todo esta en orden! No hay alertas pendientes.</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className={cn(
                "flex items-start gap-3 p-3 rounded-lg border transition-all",
                getBgColor(alert.tipo)
              )}
            >
              {getIcon(alert.tipo)}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900">{alert.titulo}</p>
                <p className="text-sm text-gray-600 mt-0.5">{alert.mensaje}</p>
                {alert.link && (
                  <a
                    href={alert.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-blue-600 hover:underline mt-1 inline-block"
                  >
                    Ver mas →
                  </a>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 shrink-0"
                onClick={() => markAsRead(alert.id)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))
        )}

        {/* Links rapidos */}
        <div className="pt-3 border-t mt-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Accesos rapidos</p>
          <div className="grid grid-cols-2 gap-2">
            <a
              href="https://analytics.google.com/analytics/web/#/a302792214p521395180/realtime/overview"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 p-2 bg-white border rounded-lg hover:bg-gray-50 text-sm"
            >
              <TrendingUp className="w-4 h-4 text-orange-500" />
              Analytics en Vivo
            </a>
            <a
              href="https://search.google.com/search-console?resource_id=sc-domain:tol.ar"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 p-2 bg-white border rounded-lg hover:bg-gray-50 text-sm"
            >
              <Search className="w-4 h-4 text-blue-500" />
              Search Console
            </a>
            <a
              href="https://pagespeed.web.dev/analysis?url=https://tol.ar"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 p-2 bg-white border rounded-lg hover:bg-gray-50 text-sm"
            >
              <Globe className="w-4 h-4 text-green-500" />
              PageSpeed Test
            </a>
            <a
              href="https://www.google.com/search?q=site:tol.ar"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 p-2 bg-white border rounded-lg hover:bg-gray-50 text-sm"
            >
              <Search className="w-4 h-4 text-purple-500" />
              Ver en Google
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
