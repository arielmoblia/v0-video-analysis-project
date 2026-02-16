"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { 
  ShoppingCart, 
  Tag, 
  Search, 
  Mail, 
  Package,
  Lock,
  CheckCircle,
  Copy,
  ExternalLink,
  Sparkles,
  TrendingUp,
  Users,
  Clock,
  Percent,
  BarChart3
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface MarketingManagerProps {
  storeId: string
  subdomain: string
}

export function MarketingManager({ storeId, subdomain }: MarketingManagerProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [purchasedFeatures, setPurchasedFeatures] = useState<string[]>([])
  
  // Estados para cada función
  const [cartRecovery, setCartRecovery] = useState({
    enabled: false,
    delay_hours: 2,
    email_subject: "¡Olvidaste algo en tu carrito!",
    email_message: "Hola {nombre}, notamos que dejaste productos en tu carrito. ¡Completá tu compra ahora!"
  })
  
  const [pixels, setPixels] = useState({
    meta_pixel_id: "",
    tiktok_pixel_id: "",
    google_analytics_id: ""
  })
  
  const [crossSelling, setCrossSelling] = useState({
    enabled: false,
    max_products: 4
  })

  const [verification, setVerification] = useState({
    meta_domain: "",
    google_site: ""
  })

  const [googleMerchant, setGoogleMerchant] = useState({
    enabled: false
  })

  useEffect(() => {
    loadMarketingSettings()
    loadPurchasedFeatures()
  }, [storeId])

  const loadMarketingSettings = async () => {
    try {
      const response = await fetch(`/api/admin/marketing?storeId=${storeId}`)
      if (response.ok) {
        const data = await response.json()
        if (data.cartRecovery) setCartRecovery(data.cartRecovery)
        if (data.pixels) setPixels(data.pixels)
        if (data.crossSelling) setCrossSelling(data.crossSelling)
        if (data.verification) setVerification(data.verification)
        if (data.googleMerchant) setGoogleMerchant(data.googleMerchant)
      }
    } catch (error) {
      console.error("Error loading marketing settings:", error)
    }
  }

  const loadPurchasedFeatures = async () => {
    try {
      const response = await fetch(`/api/admin/features/purchased?storeId=${storeId}`)
      if (response.ok) {
        const data = await response.json()
        setPurchasedFeatures(data.features || [])
      }
    } catch (error) {
      console.error("Error loading purchased features:", error)
    }
  }

  const saveSettings = async (section: string, data: unknown) => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/marketing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storeId, section, data })
      })
      if (response.ok) {
        toast({ title: "Guardado", description: "Configuración actualizada correctamente" })
      }
    } catch {
      toast({ title: "Error", description: "No se pudo guardar", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const hasMarketingPro = purchasedFeatures.includes('marketing_pro')
  const hasFeature = () => hasMarketingPro

  const LockedFeature = ({ name, description }: { name: string; description: string }) => (
    <div className="relative">
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-lg">
        <Lock className="w-8 h-8 text-slate-400 mb-2" />
        <p className="text-sm font-medium text-slate-600">Función Premium</p>
        <p className="text-xs text-slate-500 mb-3">Activala desde + Planes</p>
        <Button size="sm" variant="outline" onClick={() => window.location.hash = 'plans'}>
          <Sparkles className="w-4 h-4 mr-2" />
          Desbloquear
        </Button>
      </div>
      <Card className="opacity-50">
        <CardHeader>
          <CardTitle className="text-lg">{name}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="h-32" />
      </Card>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Marketing</h2>
          <p className="text-slate-500">Herramientas para aumentar tus ventas</p>
        </div>
      </div>

      <Tabs defaultValue="seo" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="seo" className="text-xs">
            <Search className="w-4 h-4 mr-1" />
            SEO
          </TabsTrigger>
          <TabsTrigger value="pixels" className="text-xs">
            <BarChart3 className="w-4 h-4 mr-1" />
            Pixels
          </TabsTrigger>
          <TabsTrigger value="cart" className="text-xs">
            <ShoppingCart className="w-4 h-4 mr-1" />
            Carrito
          </TabsTrigger>
          <TabsTrigger value="coupons" className="text-xs">
            <Tag className="w-4 h-4 mr-1" />
            Cupones
          </TabsTrigger>
          <TabsTrigger value="email" className="text-xs">
            <Mail className="w-4 h-4 mr-1" />
            Email
          </TabsTrigger>
          <TabsTrigger value="cross" className="text-xs">
            <Package className="w-4 h-4 mr-1" />
            Cross-sell
          </TabsTrigger>
        </TabsList>

        {/* SEO Automático - GRATIS */}
        <TabsContent value="seo">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="w-5 h-5" />
                    SEO Automático
                    <Badge variant="secondary" className="bg-green-100 text-green-700">Gratis</Badge>
                  </CardTitle>
                  <CardDescription>
                    Tu tienda ya está optimizada para aparecer en Google
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Lo que hacemos automáticamente:</h4>
                  <div className="space-y-2">
                    {[
                      "Sitemap XML generado y actualizado",
                      "Meta tags optimizados en cada página",
                      "URLs amigables para buscadores",
                      "Imágenes con alt text automático",
                      "Schema markup para productos",
                      "Tiempos de carga optimizados"
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium">Tu Sitemap:</h4>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <code className="text-sm text-slate-600">
                        {subdomain}.tol.ar/sitemap.xml
                      </code>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          navigator.clipboard.writeText(`https://${subdomain}.tol.ar/sitemap.xml`)
                          toast({ title: "Copiado" })
                        }}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                      Enviá este link a Google Search Console para indexar tu tienda más rápido
                    </p>
                  </div>
                  <Button variant="outline" className="w-full bg-transparent" asChild>
                    <a href="https://search.google.com/search-console" target="_blank" rel="noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Ir a Google Search Console
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pixels - COSITA */}
        <TabsContent value="pixels">
          {hasFeature() ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Pixels de Seguimiento
                </CardTitle>
                <CardDescription>
                  Conectá tus cuentas de publicidad para medir resultados
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
                        Lo encontrás en Meta Business Suite - Eventos - Configuración
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label>TikTok Pixel ID</Label>
                      <Input
                        placeholder="ABCDEF123456"
                        value={pixels.tiktok_pixel_id}
                        onChange={(e) => setPixels({...pixels, tiktok_pixel_id: e.target.value})}
                      />
                      <p className="text-xs text-slate-500">
                        Lo encontrás en TikTok Ads Manager - Activos - Eventos
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label>Google Analytics ID</Label>
                      <Input
                        placeholder="G-XXXXXXXXXX"
                        value={pixels.google_analytics_id}
                        onChange={(e) => setPixels({...pixels, google_analytics_id: e.target.value})}
                      />
                    </div>
                    <Button onClick={() => saveSettings('pixels', pixels)} disabled={loading}>
                      Guardar Pixels
                    </Button>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">¿Para qué sirven?</h4>
                    <ul className="text-sm text-blue-800 space-y-2">
                      <li>• Medir cuántas ventas vienen de tus anuncios</li>
                      <li>• Crear audiencias de remarketing</li>
                      <li>• Optimizar automáticamente tus campañas</li>
                      <li>• Ver qué productos se venden más por publicidad</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <LockedFeature 
              name="Pixels de Seguimiento"
              description="Conectá Meta, TikTok y Google Analytics con un clic"
            />
          )}
        </TabsContent>

        {/* Recupero de Carrito - COSITA */}
        <TabsContent value="cart">
          {hasFeature() ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Recupero de Carrito Abandonado
                </CardTitle>
                <CardDescription>
                  Enviá emails automáticos a quienes no completaron su compra
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={cartRecovery.enabled}
                      onCheckedChange={(enabled) => setCartRecovery({...cartRecovery, enabled})}
                    />
                    <div>
                      <p className="font-medium">Activar recupero automático</p>
                      <p className="text-sm text-slate-500">Se envía un email cuando abandonan el carrito</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-green-600">
                      <TrendingUp className="w-4 h-4" />
                      <span className="font-medium">+15% ventas</span>
                    </div>
                    <p className="text-xs text-slate-500">promedio de recupero</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Tiempo de espera (horas)</Label>
                      <Input
                        type="number"
                        min="1"
                        max="72"
                        value={cartRecovery.delay_hours}
                        onChange={(e) => setCartRecovery({...cartRecovery, delay_hours: parseInt(e.target.value)})}
                      />
                      <p className="text-xs text-slate-500">
                        Cuánto esperar antes de enviar el email (recomendado: 2 horas)
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label>Asunto del email</Label>
                      <Input
                        value={cartRecovery.email_subject}
                        onChange={(e) => setCartRecovery({...cartRecovery, email_subject: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Mensaje</Label>
                      <Textarea
                        value={cartRecovery.email_message}
                        onChange={(e) => setCartRecovery({...cartRecovery, email_message: e.target.value})}
                        rows={4}
                      />
                      <p className="text-xs text-slate-500">
                        Usá {"{nombre}"} para el nombre del cliente y {"{productos}"} para listar los productos
                      </p>
                    </div>
                    <Button onClick={() => saveSettings('cartRecovery', cartRecovery)} disabled={loading}>
                      Guardar Configuración
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-amber-50 p-4 rounded-lg">
                      <h4 className="font-medium text-amber-900 mb-2 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Estadísticas
                      </h4>
                      <div className="grid grid-cols-2 gap-4 mt-3">
                        <div className="text-center p-3 bg-white rounded-lg">
                          <p className="text-2xl font-bold text-amber-600">0</p>
                          <p className="text-xs text-slate-500">Emails enviados</p>
                        </div>
                        <div className="text-center p-3 bg-white rounded-lg">
                          <p className="text-2xl font-bold text-green-600">0</p>
                          <p className="text-xs text-slate-500">Carritos recuperados</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <LockedFeature 
              name="Recupero de Carrito Abandonado"
              description="Recuperá hasta un 15% de ventas perdidas con emails automáticos"
            />
          )}
        </TabsContent>

        {/* Cupones Avanzados - COSITA */}
        <TabsContent value="coupons">
          {hasFeature() ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="w-5 h-5" />
                  Cupones Avanzados
                </CardTitle>
                <CardDescription>
                  Creá cupones con reglas personalizadas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Percent className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">Próximamente: Cupones por categoría, monto mínimo, primera compra y más</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <LockedFeature 
              name="Cupones Avanzados"
              description="Reglas por categoría, monto mínimo, primera compra y más"
            />
          )}
        </TabsContent>

        {/* Email Marketing - COSITA */}
        <TabsContent value="email">
          {hasFeature() ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Email Marketing
                </CardTitle>
                <CardDescription>
                  Conectá con Mailchimp o Perfit para enviar newsletters
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">Próximamente: Sincronización automática de clientes con Mailchimp y Perfit</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <LockedFeature 
              name="Email Marketing"
              description="Sincronizá tus clientes automáticamente con Mailchimp o Perfit"
            />
          )}
        </TabsContent>

        {/* Cross-selling - COSITA */}
        <TabsContent value="cross">
          {hasFeature() ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Productos Relacionados (Cross-selling)
                </CardTitle>
                <CardDescription>
                  Sugerí productos para aumentar el ticket promedio
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={crossSelling.enabled}
                      onCheckedChange={(enabled) => setCrossSelling({...crossSelling, enabled})}
                    />
                    <div>
                      <p className="font-medium">Mostrar productos relacionados</p>
                      <p className="text-sm text-slate-500">Aparecen en la página de cada producto y en el carrito</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Cantidad de productos a mostrar</Label>
                  <Input
                    type="number"
                    min="2"
                    max="8"
                    value={crossSelling.max_products}
                    onChange={(e) => setCrossSelling({...crossSelling, max_products: parseInt(e.target.value)})}
                    className="w-32"
                  />
                </div>
                <Button onClick={() => saveSettings('crossSelling', crossSelling)} disabled={loading}>
                  Guardar
                </Button>
              </CardContent>
            </Card>
          ) : (
            <LockedFeature 
              name="Productos Relacionados"
              description="Aumentá tu ticket promedio sugiriendo productos automáticamente"
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
