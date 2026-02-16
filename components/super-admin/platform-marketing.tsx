"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  BarChart3,
  CheckCircle,
  Copy,
  ExternalLink,
  Save,
  Globe,
  Mail,
  MessageSquare,
  CreditCard,
  DollarSign
} from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"

interface PlatformMarketingProps {
  defaultTab?: "pixels" | "seo" | "integrations"
}

export function PlatformMarketing({ defaultTab = "pixels" }: PlatformMarketingProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  
  const [pixels, setPixels] = useState({
    meta_pixel_id: "",
    tiktok_pixel_id: "",
    google_analytics_id: "",
    google_ads_id: ""
  })

  const [seo, setSeo] = useState({
    site_title: "tol.ar - Creá tu tienda online gratis",
    site_description: "Hacé tu tienda online en 2 minutos. Sin conocimientos técnicos. Empezá a vender hoy.",
    keywords: "tienda online, ecommerce, vender online, crear tienda",
    google_verification: "", // Codigo de verificacion de Google Search Console
    bing_verification: "", // Codigo de verificacion de Bing
    google_verified: false, // Flag manual: Search Console verificado
    bing_verified: false, // Flag manual: Bing verificado
    sitemap_submitted: false // Flag manual: Sitemap enviado
  })

  const [payments, setPayments] = useState({
    stripe_enabled: false,
    stripe_currency: "ars",
    stripe_mode: "test"
  })

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      // Cargar configuracion de marketing (pixels, payments)
      const marketingRes = await fetch("/api/super-admin/platform-marketing")
      if (marketingRes.ok) {
        const data = await marketingRes.json()
        if (data.pixels) setPixels(data.pixels)
        if (data.payments) setPayments(data.payments)
      }
      
      // Cargar configuracion SEO desde la tabla dedicada
      const seoRes = await fetch("/api/super-admin/seo-config")
      if (seoRes.ok) {
        const seoData = await seoRes.json()
        setSeo({
          site_title: seoData.site_title || seo.site_title,
          site_description: seoData.site_description || seo.site_description,
          keywords: seoData.keywords || seo.keywords,
          google_verification: seoData.google_verification || "",
          bing_verification: seoData.bing_verification || "",
          google_verified: seoData.google_verified || false,
          bing_verified: seoData.bing_verified || false,
          sitemap_submitted: seoData.sitemap_submitted || false
        })
      }
    } catch (error) {
      console.error("Error loading settings:", error)
    }
  }

  const saveSettings = async (section: string, data: unknown) => {
    setLoading(true)
    try {
      // SEO usa la API dedicada, el resto usa platform-marketing
      const url = section === "seo" 
        ? "/api/super-admin/seo-config" 
        : "/api/super-admin/platform-marketing"
      
      const body = section === "seo" 
        ? JSON.stringify(data)
        : JSON.stringify({ section, data })
      
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
      <div>
        <h2 className="text-2xl font-semibold">Marketing de tol.ar</h2>
        <p className="text-slate-500">Configurá el marketing de la plataforma para atraer nuevos clientes</p>
      </div>

      <Tabs defaultValue={defaultTab} className="space-y-4">
        {defaultTab !== "integrations" && (
          <TabsList>
            <TabsTrigger value="pixels" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Pixels
            </TabsTrigger>
            <TabsTrigger value="seo" className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              SEO
            </TabsTrigger>
          </TabsList>
        )}

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

        {/* SEO ULTRA de tol.ar */}
        <TabsContent value="seo">
          <div className="space-y-6">
            {/* Panel de Ayuda SEO */}
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2 text-green-800">
                  <Search className="w-5 h-5" />
                  SEO ULTRA para posicionar tol.ar en Google y Bing
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-green-900">
                <p className="mb-3">
                  Con un buen SEO, cuando alguien busque "crear tienda online gratis" o "como vender por internet", 
                  tol.ar aparecera en los primeros resultados de Google. Esto trae trafico GRATIS a tu plataforma.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div className="bg-white/60 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-green-700">1</div>
                    <div className="text-xs">Completa los meta tags</div>
                  </div>
                  <div className="bg-white/60 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-green-700">2</div>
                    <div className="text-xs">Verifica en Google/Bing</div>
                  </div>
                  <div className="bg-white/60 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-green-700">3</div>
                    <div className="text-xs">Envia el sitemap</div>
                  </div>
                  <div className="bg-white/60 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-green-700">4</div>
                    <div className="text-xs">Espera 2-4 semanas</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Meta Tags Basicos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Meta Tags Basicos
                </CardTitle>
                <CardDescription>
                  Titulo y descripcion que aparece en Google
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Titulo del sitio (meta title)</Label>
                      <Input
                        value={seo.site_title}
                        onChange={(e) => setSeo({...seo, site_title: e.target.value})}
                      />
                      <p className="text-xs text-slate-500">{seo.site_title?.length || 0}/60 caracteres</p>
                    </div>
                    <div className="space-y-2">
                      <Label>Descripcion (meta description)</Label>
                      <Input
                        value={seo.site_description}
                        onChange={(e) => setSeo({...seo, site_description: e.target.value})}
                      />
                      <p className="text-xs text-slate-500">{seo.site_description?.length || 0}/160 caracteres</p>
                    </div>
                    <div className="space-y-2">
                      <Label>Palabras clave principales</Label>
                      <Input
                        value={seo.keywords}
                        onChange={(e) => setSeo({...seo, keywords: e.target.value})}
                      />
                      <p className="text-xs text-slate-500">Separadas por coma</p>
                    </div>
                    <Button onClick={() => saveSettings('seo', seo)} disabled={loading}>
                      <Save className="w-4 h-4 mr-2" />
                      Guardar SEO
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-medium">Preview en Google:</h4>
                    <div className="bg-white border rounded-lg p-4 shadow-sm">
                      <p className="text-blue-600 text-lg hover:underline cursor-pointer">
                        {seo.site_title || "tol.ar - Crea tu tienda online gratis"}
                      </p>
                      <p className="text-green-700 text-sm">https://tol.ar</p>
                      <p className="text-slate-600 text-sm mt-1">
                        {seo.site_description || "Hace tu tienda online en 2 minutos. Sin conocimientos tecnicos."}
                      </p>
                    </div>
                    
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <h5 className="font-medium text-blue-900 text-sm mb-2">Palabras clave sugeridas:</h5>
                      <div className="flex flex-wrap gap-1">
                        {["crear tienda online", "tienda online gratis", "vender por internet", "ecommerce argentina", "como hacer una tienda online", "tienda virtual", "vender online gratis"].map(kw => (
                          <Badge key={kw} variant="secondary" className="text-xs cursor-pointer hover:bg-blue-200"
                            onClick={() => {
                              if (!seo.keywords?.includes(kw)) {
                                setSeo({...seo, keywords: seo.keywords ? `${seo.keywords}, ${kw}` : kw})
                              }
                            }}>
                            + {kw}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Verificacion de Buscadores */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Verificacion en Buscadores
                </CardTitle>
                <CardDescription>
                  Conecta tol.ar con Google y Bing para ver estadisticas y enviar el sitemap
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Google */}
                  <div className="space-y-4 p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                        <svg viewBox="0 0 24 24" className="w-5 h-5">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold">Google Search Console</h4>
                        <p className="text-xs text-slate-500">El mas importante - 90% del trafico</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p className="font-medium">Pasos:</p>
                      <ol className="list-decimal list-inside space-y-1 text-slate-600">
                        <li>Anda a Search Console</li>
                        <li>Agrega la propiedad tol.ar</li>
                        <li>Verifica con el metodo DNS o HTML</li>
                        <li>Envia el sitemap: tol.ar/sitemap.xml</li>
                      </ol>
                    </div>
                    <Button variant="outline" className="w-full bg-transparent" asChild>
                      <a href="https://search.google.com/search-console" target="_blank" rel="noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Abrir Google Search Console
                      </a>
                    </Button>
                  </div>

                  {/* Bing */}
                  <div className="space-y-4 p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                        <svg viewBox="0 0 24 24" className="w-5 h-5">
                          <path fill="#008373" d="M5 3v16.5l4.5 2.5 8-4.5V11l-6 3.5-3.5-2V5L5 3z"/>
                          <path fill="#00A67E" d="M9.5 8l3.5 2v6.5l-3.5 2V8z"/>
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold">Bing Webmaster Tools</h4>
                        <p className="text-xs text-slate-500">Importante para usuarios de Windows</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p className="font-medium">Pasos:</p>
                      <ol className="list-decimal list-inside space-y-1 text-slate-600">
                        <li>Anda a Bing Webmaster</li>
                        <li>Importa desde Google Search Console (mas facil)</li>
                        <li>O agrega tol.ar manualmente</li>
                        <li>Envia el sitemap</li>
                      </ol>
                    </div>
                    <Button variant="outline" className="w-full bg-transparent" asChild>
                      <a href="https://www.bing.com/webmasters" target="_blank" rel="noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Abrir Bing Webmaster Tools
                      </a>
                    </Button>
                  </div>
                </div>

                {/* Sitemap */}
                <div className="mt-6 p-4 bg-amber-50 rounded-lg">
                  <h4 className="font-medium text-amber-900 mb-2">Tu Sitemap (envialo a ambos buscadores):</h4>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-white p-2 rounded text-sm">https://tol.ar/sitemap.xml</code>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText("https://tol.ar/sitemap.xml")
                        toast({ title: "Copiado al portapapeles" })
                      }}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <a href="https://tol.ar/sitemap.xml" target="_blank" rel="noreferrer">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Verificacion manual de buscadores */}
            <Card className="border-green-200 bg-green-50/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Marcar verificaciones completadas
                </CardTitle>
                <CardDescription>
                  Cuando completes cada paso, marcalo aqui para que las alertas desaparezcan
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                    <div className="flex items-center gap-2">
                      <svg viewBox="0 0 24 24" className="w-5 h-5">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      <span className="font-medium">Google Search Console verificado</span>
                    </div>
                    <Switch 
                      checked={seo.google_verified || false}
                      onCheckedChange={(checked) => setSeo({...seo, google_verified: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                    <div className="flex items-center gap-2">
                      <svg viewBox="0 0 24 24" className="w-5 h-5">
                        <path fill="#008373" d="M5 3v16.5l4.5 2.5 8-4.5V11l-6 3.5-3.5-2V5L5 3z"/>
                        <path fill="#00A67E" d="M9.5 8l3.5 2v6.5l-3.5 2V8z"/>
                      </svg>
                      <span className="font-medium">Bing Webmaster verificado</span>
                    </div>
                    <Switch 
                      checked={seo.bing_verified || false}
                      onCheckedChange={(checked) => setSeo({...seo, bing_verified: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                    <div className="flex items-center gap-2">
                      <Globe className="w-5 h-5 text-blue-500" />
                      <span className="font-medium">Sitemap enviado a buscadores</span>
                    </div>
                    <Switch 
                      checked={seo.sitemap_submitted || false}
                      onCheckedChange={(checked) => setSeo({...seo, sitemap_submitted: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-orange-500" />
                      <span className="font-medium">Google Analytics conectado</span>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${(pixels.google_analytics_id?.length || 0) > 5 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {(pixels.google_analytics_id?.length || 0) > 5 ? 'Configurado' : 'Falta ID'}
                    </div>
                  </div>
                </div>
                <Button onClick={() => saveSettings('seo', seo)} disabled={loading} className="w-full">
                  <Save className="w-4 h-4 mr-2" />
                  Guardar estado de verificaciones
                </Button>
              </CardContent>
            </Card>

            {/* Checklist SEO */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Checklist SEO para tol.ar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { task: "Meta title configurado (max 60 chars)", done: (seo.site_title?.length || 0) > 10 && (seo.site_title?.length || 0) <= 60 },
                    { task: "Meta description configurada (max 160 chars)", done: (seo.site_description?.length || 0) > 50 && (seo.site_description?.length || 0) <= 160 },
                    { task: "Palabras clave definidas", done: (seo.keywords?.length || 0) > 10 },
                    { task: "Google Search Console verificado", done: seo.google_verified || false },
                    { task: "Bing Webmaster Tools verificado", done: seo.bing_verified || false },
                    { task: "Sitemap enviado a buscadores", done: seo.sitemap_submitted || false },
                    { task: "Google Analytics configurado", done: (pixels.google_analytics_id?.length || 0) > 5 },
                  ].map((item, i) => (
                    <div key={i} className={`flex items-center gap-2 p-2 rounded ${item.done ? 'bg-green-50' : 'bg-slate-50'}`}>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${item.done ? 'bg-green-500 text-white' : 'bg-slate-300'}`}>
                        {item.done ? <CheckCircle className="w-3 h-3" /> : <span className="text-xs">{i + 1}</span>}
                      </div>
                      <span className={`text-sm ${item.done ? 'text-green-800' : 'text-slate-600'}`}>{item.task}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Integraciones */}
        <TabsContent value="integrations">
          <div className="space-y-6">
            {/* Stripe - Pagos con tarjeta */}
            <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-purple-600" />
                  Stripe - Pagos con Tarjeta
                  <Badge className="bg-purple-600">Principal</Badge>
                </CardTitle>
                <CardDescription>
                  Recibí pagos en pesos argentinos con tarjeta de crédito/débito. La plata llega a tu cuenta en dólares.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="stripe-enabled">Activar pagos con Stripe</Label>
                      <Switch 
                        id="stripe-enabled"
                        checked={payments.stripe_enabled}
                        onCheckedChange={(checked) => setPayments({...payments, stripe_enabled: checked})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Moneda de cobro</Label>
                      <select 
                        className="w-full p-2 border rounded-lg"
                        value={payments.stripe_currency}
                        onChange={(e) => setPayments({...payments, stripe_currency: e.target.value})}
                      >
                        <option value="ars">Pesos Argentinos (ARS)</option>
                        <option value="usd">Dólares (USD)</option>
                      </select>
                      <p className="text-xs text-slate-500">Los clientes pagan en esta moneda</p>
                    </div>

                    <div className="space-y-2">
                      <Label>Modo</Label>
                      <select 
                        className="w-full p-2 border rounded-lg"
                        value={payments.stripe_mode}
                        onChange={(e) => setPayments({...payments, stripe_mode: e.target.value})}
                      >
                        <option value="test">Pruebas (sandbox)</option>
                        <option value="live">Producción (real)</option>
                      </select>
                      <p className="text-xs text-slate-500">Usá "Pruebas" para testear sin cobrar de verdad</p>
                    </div>

                    <Button onClick={() => saveSettings('payments', payments)} disabled={loading}>
                      <Save className="w-4 h-4 mr-2" />
                      Guardar configuración
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div className={`p-4 rounded-lg ${payments.stripe_enabled ? 'bg-green-50 border border-green-200' : 'bg-slate-50'}`}>
                      <div className="flex items-center gap-2 mb-2">
                        {payments.stripe_enabled ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <CreditCard className="w-5 h-5 text-slate-400" />
                        )}
                        <span className="font-medium">
                          {payments.stripe_enabled ? 'Stripe Activado' : 'Stripe Desactivado'}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600">
                        {payments.stripe_enabled 
                          ? 'Los usuarios pueden pagar Plan Cositas y otros planes con tarjeta.'
                          : 'Activa Stripe para recibir pagos con tarjeta de crédito/débito.'
                        }
                      </p>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h5 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        Como funciona:
                      </h5>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Cliente paga en pesos argentinos</li>
                        <li>• Stripe convierte a dólares automáticamente</li>
                        <li>• El dinero llega a tu cuenta bancaria en USD</li>
                        <li>• Comisión de Stripe: ~3.5% + $0.30 USD por venta</li>
                      </ul>
                    </div>

                    <Button variant="outline" className="w-full bg-transparent" asChild>
                      <a href="https://dashboard.stripe.com" target="_blank" rel="noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Abrir Dashboard de Stripe
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    Email Marketing
                  </CardTitle>
                  <CardDescription>
                    Para enviar newsletters a potenciales clientes
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {[
                      { name: "Mailchimp", status: "Próximamente" },
                      { name: "Brevo (Sendinblue)", status: "Próximamente" },
                      { name: "Resend", status: "Conectado", connected: true }
                    ].map((item) => (
                      <div key={item.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <span className="font-medium">{item.name}</span>
                        <Badge variant={item.connected ? "default" : "secondary"}>
                          {item.connected && <CheckCircle className="w-3 h-3 mr-1" />}
                          {item.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Chat y Soporte
                  </CardTitle>
                  <CardDescription>
                    Para atender consultas de visitantes
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {[
                      { name: "WhatsApp Business", status: "Próximamente" },
                      { name: "Crisp Chat", status: "Próximamente" },
                      { name: "Tawk.to", status: "Próximamente" }
                    ].map((item) => (
                      <div key={item.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <span className="font-medium">{item.name}</span>
                        <Badge variant="secondary">{item.status}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
