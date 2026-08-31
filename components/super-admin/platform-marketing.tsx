"use client"
import { ClaudioPopup } from "@/components/super-admin/claudio-popup"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { 
  BarChart3,
  CheckCircle,
  Copy,
  ExternalLink,
  Save,
  Globe,
  Mail,
  Sparkles,
  MessageSquare
} from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { PromoMail } from "@/components/super-admin/promo-mail"
import { MarketingAgent } from "@/components/super-admin/marketing-agent"
import { CampaniasTab } from "@/components/super-admin/campanias-tab"
import { WhatsappTab } from "@/components/super-admin/whatsapp-tab"

interface PlatformMarketingProps {
  defaultTab?: "pixels" | "promomail" | "agente" | "campanias" | "whatsapp"
}

export function PlatformMarketing({ defaultTab = "pixels" }: PlatformMarketingProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [stores, setStores] = useState<any[]>([])
  
  const [pixels, setPixels] = useState({
    meta_pixel_id: "",
    tiktok_pixel_id: "",
    google_analytics_id: "",
    google_ads_id: ""
  })



  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const storesRes = await fetch("/api/super-admin/stores")
      if (storesRes.ok) {
        const data = await storesRes.json()
        setStores(data.stores || data || [])
      }
      // Cargar configuracion de marketing (pixels, payments)
      const marketingRes = await fetch("/api/super-admin/platform-marketing")
      if (marketingRes.ok) {
        const data = await marketingRes.json()
        if (data.pixels) setPixels(data.pixels)
        if (data.payments) setPayments(data.payments)
      }
      
    } catch (error) {
      console.error("Error loading settings:", error)
    }
  }

  const saveSettings = async (section: string, data: unknown) => {
    setLoading(true)
    try {
      const url = "/api/super-admin/platform-marketing"
      const body = JSON.stringify({ section, data })
      
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body
      })
      if (response.ok) {
        toast({ title: "Guardado", description: "Configuración actualizada" })
      }
    } catch {
      toast({ title: "Error", description: "No se pudo guardar", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Marketing de tol.ar</h2>
          <p className="text-slate-500">Configurá el marketing de la plataforma para atraer nuevos clientes</p>
        </div>
        
        <ClaudioPopup
          titulo="Claudio — Marketing"
          contexto="Sos Claudio, el asistente operativo de tol.ar. Estás en el módulo MARKETING. Tenés acceso a datos reales via VER_DATOS. Podés ver merchants, ventas, inactivos. Tu objetivo: ayudar a Ariel a planificar y ejecutar acciones de marketing. NUNCA ejecutes nada sin aprobación escrita de Ariel Mobilia."
        />
      </div>

      <Tabs defaultValue={defaultTab} className="space-y-4">
        <TabsList>
            <TabsTrigger value="campanias" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Campañas
            </TabsTrigger>
            <TabsTrigger value="pixels" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Pixels
            </TabsTrigger>
            <TabsTrigger value="agente" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Redes sociales
            </TabsTrigger>
            <TabsTrigger value="whatsapp" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              WhatsApp
            </TabsTrigger>
            <TabsTrigger value="promomail" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Promo Mail
            </TabsTrigger>
          </TabsList>

        {/* Pixels para tol.ar */}
        <TabsContent value="pixels">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Pixels de Seguimiento
                <Badge variant="secondary">tol.ar</Badge>
              </CardTitle>
              <CardDescription>
                Medí el rendimiento de tus anuncios para atraer dueños de tiendas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Meta Pixel ID (Facebook/Instagram)</Label>
                    <Input
                      placeholder="123456789012345"
                      value={pixels.meta_pixel_id}
                      onChange={(e) => setPixels({...pixels, meta_pixel_id: e.target.value})}
                    />
                    <p className="text-xs text-slate-500">
                      Para medir conversiones de registros desde anuncios de Meta
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label>TikTok Pixel ID</Label>
                    <Input
                      placeholder="ABCDEF123456"
                      value={pixels.tiktok_pixel_id}
                      onChange={(e) => setPixels({...pixels, tiktok_pixel_id: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Google Analytics ID</Label>
                    <Input
                      placeholder="G-XXXXXXXXXX"
                      value={pixels.google_analytics_id}
                      onChange={(e) => setPixels({...pixels, google_analytics_id: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Google Ads ID</Label>
                    <Input
                      placeholder="AW-XXXXXXXXXX"
                      value={pixels.google_ads_id}
                      onChange={(e) => setPixels({...pixels, google_ads_id: e.target.value})}
                    />
                  </div>
                  <Button onClick={() => saveSettings('pixels', pixels)} disabled={loading}>
                    <Save className="w-4 h-4 mr-2" />
                    Guardar Pixels
                  </Button>
                </div>
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Eventos que se trackean:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Visita a la landing (PageView)</li>
                      <li>• Click en "Hacer tu tienda" (InitiateCheckout)</li>
                      <li>• Registro completado (CompleteRegistration)</li>
                      <li>• Tienda creada (Purchase)</li>
                      <li>• Plan pagado (Subscribe)</li>
                    </ul>
                  </div>
                  <div className="bg-amber-50 p-4 rounded-lg">
                    <h4 className="font-medium text-amber-900 mb-2">Audiencias recomendadas:</h4>
                    <ul className="text-sm text-amber-800 space-y-1">
                      <li>• Emprendedores</li>
                      <li>• Dueños de negocios pequeños</li>
                      <li>• Intereses: Mercado Libre, Tiendanube</li>
                      <li>• Lookalike de clientes que ya crearon tienda</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="promomail">
          <PromoMail stores={stores} />
        </TabsContent>
        <TabsContent value="agente">
          <MarketingAgent />
        </TabsContent>
        <TabsContent value="campanias">
          <CampaniasTab />
        </TabsContent>
        <TabsContent value="whatsapp">
          <WhatsappTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
