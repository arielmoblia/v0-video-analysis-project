"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { 
  Search, 
  Globe, 
  FileText, 
  ImageIcon,
  Share2,
  Sparkles,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Copy,
  ExternalLink,
  RefreshCw,
  Eye,
  Loader2,
  TrendingUp,
  Target,
  Zap,
  BarChart3,
  Link2,
  Bot
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface SEOManagerProps {
  storeId: string
  subdomain: string
  storeName: string
}

interface SEOData {
  meta_title: string
  meta_description: string
  keywords: string
  og_title: string
  og_description: string
  og_image: string
  twitter_title: string
  twitter_description: string
  twitter_image: string
  canonical_url: string
  robots_txt: string
  google_verification: string
  bing_verification: string
  structured_data_enabled: boolean
  auto_sitemap: boolean
}

interface SEOAnalysis {
  score: number
  issues: Array<{
    type: 'error' | 'warning' | 'success'
    message: string
    suggestion?: string
  }>
  suggestions: string[]
}

export function SEOManager({ storeId, subdomain, storeName }: SEOManagerProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [generatingAI, setGeneratingAI] = useState(false)
  
  const [seoData, setSeoData] = useState<SEOData>({
    meta_title: "",
    meta_description: "",
    keywords: "",
    og_title: "",
    og_description: "",
    og_image: "",
    twitter_title: "",
    twitter_description: "",
    twitter_image: "",
    canonical_url: "",
    robots_txt: `User-agent: *\nAllow: /\n\nSitemap: https://${subdomain}.tol.ar/sitemap.xml`,
    google_verification: "",
    bing_verification: "",
    structured_data_enabled: true,
    auto_sitemap: true
  })

  const [analysis, setAnalysis] = useState<SEOAnalysis>({
    score: 0,
    issues: [],
    suggestions: []
  })

  useEffect(() => {
    loadSEOSettings()
  }, [storeId])

  useEffect(() => {
    analyzeSEO()
  }, [seoData])

  const loadSEOSettings = async () => {
    try {
      const response = await fetch(`/api/admin/seo?storeId=${storeId}`)
      if (response.ok) {
        const data = await response.json()
        if (data.seo) {
          setSeoData(prev => ({ ...prev, ...data.seo }))
        }
      }
    } catch (error) {
      console.error("Error loading SEO settings:", error)
    }
  }

  const saveSEOSettings = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storeId, seo: seoData })
      })
      if (response.ok) {
        toast({ title: "Guardado", description: "Configuración SEO actualizada" })
      }
    } catch {
      toast({ title: "Error", description: "No se pudo guardar", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const analyzeSEO = () => {
    const issues: SEOAnalysis['issues'] = []
    let score = 100

    // Análisis del título
    if (!seoData.meta_title) {
      issues.push({ type: 'error', message: 'Falta el título SEO', suggestion: 'Agregá un título de 50-60 caracteres' })
      score -= 15
    } else if (seoData.meta_title.length < 30) {
      issues.push({ type: 'warning', message: 'Título muy corto', suggestion: 'El título ideal tiene entre 50-60 caracteres' })
      score -= 5
    } else if (seoData.meta_title.length > 60) {
      issues.push({ type: 'warning', message: 'Título muy largo', suggestion: 'Google cortará el título. Máximo 60 caracteres' })
      score -= 5
    } else {
      issues.push({ type: 'success', message: 'Título SEO optimizado' })
    }

    // Análisis de la descripción
    if (!seoData.meta_description) {
      issues.push({ type: 'error', message: 'Falta la descripción SEO', suggestion: 'Agregá una descripción de 150-160 caracteres' })
      score -= 15
    } else if (seoData.meta_description.length < 120) {
      issues.push({ type: 'warning', message: 'Descripción muy corta', suggestion: 'La descripción ideal tiene entre 150-160 caracteres' })
      score -= 5
    } else if (seoData.meta_description.length > 160) {
      issues.push({ type: 'warning', message: 'Descripción muy larga', suggestion: 'Google cortará la descripción. Máximo 160 caracteres' })
      score -= 5
    } else {
      issues.push({ type: 'success', message: 'Descripción SEO optimizada' })
    }

    // Palabras clave
    if (!seoData.keywords) {
      issues.push({ type: 'warning', message: 'Sin palabras clave', suggestion: 'Agregá 5-10 palabras clave relevantes' })
      score -= 5
    } else {
      const keywordCount = seoData.keywords.split(',').filter(k => k.trim()).length
      if (keywordCount < 3) {
        issues.push({ type: 'warning', message: 'Pocas palabras clave', suggestion: 'Agregá más palabras clave (5-10 recomendado)' })
        score -= 3
      } else {
        issues.push({ type: 'success', message: `${keywordCount} palabras clave configuradas` })
      }
    }

    // Open Graph
    if (!seoData.og_title || !seoData.og_description) {
      issues.push({ type: 'warning', message: 'Open Graph incompleto', suggestion: 'Completá título y descripción para redes sociales' })
      score -= 5
    } else {
      issues.push({ type: 'success', message: 'Open Graph configurado' })
    }

    if (!seoData.og_image) {
      issues.push({ type: 'warning', message: 'Sin imagen para redes sociales', suggestion: 'Agregá una imagen de 1200x630px' })
      score -= 5
    } else {
      issues.push({ type: 'success', message: 'Imagen social configurada' })
    }

    // Verificación de buscadores
    if (!seoData.google_verification) {
      issues.push({ type: 'warning', message: 'Google Search Console no verificado', suggestion: 'Verificá tu sitio para ver estadísticas en Google' })
      score -= 5
    } else {
      issues.push({ type: 'success', message: 'Google Search Console verificado' })
    }

    if (!seoData.bing_verification) {
      issues.push({ type: 'warning', message: 'Bing Webmaster no verificado', suggestion: 'Verificá tu sitio para aparecer mejor en Bing/Edge' })
      score -= 3
    } else {
      issues.push({ type: 'success', message: 'Bing Webmaster verificado' })
    }

    // Datos estructurados
    if (seoData.structured_data_enabled) {
      issues.push({ type: 'success', message: 'Datos estructurados (Schema.org) activos' })
    } else {
      issues.push({ type: 'warning', message: 'Datos estructurados desactivados', suggestion: 'Activalos para rich snippets en Google' })
      score -= 10
    }

    // Sitemap
    if (seoData.auto_sitemap) {
      issues.push({ type: 'success', message: 'Sitemap automático activo' })
    } else {
      issues.push({ type: 'error', message: 'Sitemap desactivado', suggestion: 'Activá el sitemap para mejor indexación' })
      score -= 10
    }

    setAnalysis({
      score: Math.max(0, score),
      issues,
      suggestions: []
    })
  }

  const generateWithAI = async (field: 'title' | 'description' | 'keywords' | 'all') => {
    setGeneratingAI(true)
    try {
      const response = await fetch("/api/admin/seo/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          storeId, 
          storeName, 
          subdomain,
          field,
          currentData: seoData
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        
        if (field === 'all' || field === 'title') {
          setSeoData(prev => ({ 
            ...prev, 
            meta_title: data.title || prev.meta_title,
            og_title: data.title || prev.og_title,
            twitter_title: data.title || prev.twitter_title
          }))
        }
        if (field === 'all' || field === 'description') {
          setSeoData(prev => ({ 
            ...prev, 
            meta_description: data.description || prev.meta_description,
            og_description: data.description || prev.og_description,
            twitter_description: data.description || prev.twitter_description
          }))
        }
        if (field === 'all' || field === 'keywords') {
          setSeoData(prev => ({ ...prev, keywords: data.keywords || prev.keywords }))
        }
        
        toast({ title: "Generado con IA", description: "Revisá el contenido y ajustalo si es necesario" })
      }
    } catch {
      toast({ title: "Error", description: "No se pudo generar con IA", variant: "destructive" })
    } finally {
      setGeneratingAI(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-green-500"
    if (score >= 60) return "bg-yellow-500"
    return "bg-red-500"
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({ title: "Copiado al portapapeles" })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Search className="w-6 h-6" />
            SEO Ultra
          </h2>
          <p className="text-slate-500">Optimizá tu tienda para Google y Bing con ayuda de IA</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={() => generateWithAI('all')}
            disabled={generatingAI}
            className="bg-transparent"
          >
            {generatingAI ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 mr-2" />
            )}
            Generar todo con IA
          </Button>
          <Button onClick={saveSEOSettings} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Guardar cambios
          </Button>
        </div>
      </div>

      {/* Score Card */}
      <Card className="border-2 border-slate-200">
        <CardContent className="pt-6">
          <div className="flex items-center gap-8">
            <div className="text-center">
              <div className={`text-5xl font-bold ${getScoreColor(analysis.score)}`}>
                {analysis.score}
              </div>
              <p className="text-sm text-slate-500 mt-1">Puntuación SEO</p>
            </div>
            <div className="flex-1">
              <Progress value={analysis.score} className={`h-3 ${getScoreBg(analysis.score)}`} />
              <div className="flex justify-between mt-2 text-xs text-slate-500">
                <span>0 - Malo</span>
                <span>50 - Regular</span>
                <span>80 - Bueno</span>
                <span>100 - Excelente</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {analysis.issues.filter(i => i.type === 'success').length}
                </div>
                <p className="text-xs text-slate-500">Correcto</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">
                  {analysis.issues.filter(i => i.type === 'warning').length}
                </div>
                <p className="text-xs text-slate-500">Advertencias</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {analysis.issues.filter(i => i.type === 'error').length}
                </div>
                <p className="text-xs text-slate-500">Errores</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Panel de Ayuda - Qué es SEO */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2 text-blue-800">
            <Bot className="w-5 h-5" />
            Que es SEO y como te ayuda esta herramienta?
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-blue-900 space-y-3">
          <p>
            <strong>SEO (Search Engine Optimization)</strong> es lo que hace que tu tienda aparezca en Google 
            cuando alguien busca productos como los tuyos. Mientras mejor SEO tengas, mas arriba apareces en los resultados.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="bg-white/60 rounded-lg p-3">
              <div className="font-semibold flex items-center gap-2 mb-1">
                <Zap className="w-4 h-4 text-yellow-600" />
                Paso 1: Generar con IA
              </div>
              <p className="text-xs">Hace click en "Generar todo con IA" y la inteligencia artificial creara titulos, descripciones y palabras clave optimizadas para tu tienda.</p>
            </div>
            
            <div className="bg-white/60 rounded-lg p-3">
              <div className="font-semibold flex items-center gap-2 mb-1">
                <Target className="w-4 h-4 text-green-600" />
                Paso 2: Revisar y ajustar
              </div>
              <p className="text-xs">Revisa lo que genero la IA y ajusta si necesitas. Asegurate que el puntaje llegue al menos a 80 puntos (verde).</p>
            </div>
            
            <div className="bg-white/60 rounded-lg p-3">
              <div className="font-semibold flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                Paso 3: Verificar en Google
              </div>
              <p className="text-xs">Ve a la seccion "Verificacion" y segui los pasos para conectar con Google Search Console. Asi podras ver cuantas visitas llegas desde Google.</p>
            </div>
          </div>

          <div className="bg-white/80 rounded-lg p-3 mt-4">
            <p className="font-semibold mb-2">Que significa cada seccion?</p>
            <ul className="text-xs space-y-1">
              <li><strong>Basico:</strong> Titulo y descripcion que aparece en Google cuando buscan tu tienda</li>
              <li><strong>Redes:</strong> Como se ve tu tienda cuando alguien comparte el link en Facebook, Twitter o WhatsApp</li>
              <li><strong>Tecnico:</strong> Configuraciones avanzadas como el sitemap (mapa de tu sitio para Google)</li>
              <li><strong>Verificacion:</strong> Conecta tu tienda con Google y Bing para ver estadisticas</li>
              <li><strong>Analisis:</strong> Lista de problemas y sugerencias para mejorar tu SEO</li>
              <li><strong>Preview:</strong> Vista previa de como aparece tu tienda en los resultados de Google</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="basico" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="basico">
            <FileText className="w-4 h-4 mr-1" />
            Básico
          </TabsTrigger>
          <TabsTrigger value="social">
            <Share2 className="w-4 h-4 mr-1" />
            Redes
          </TabsTrigger>
          <TabsTrigger value="tecnico">
            <Globe className="w-4 h-4 mr-1" />
            Técnico
          </TabsTrigger>
          <TabsTrigger value="verificacion">
            <CheckCircle className="w-4 h-4 mr-1" />
            Verificación
          </TabsTrigger>
          <TabsTrigger value="analisis">
            <BarChart3 className="w-4 h-4 mr-1" />
            Análisis
          </TabsTrigger>
          <TabsTrigger value="ai">
            <Bot className="w-4 h-4 mr-1" />
            Asistente IA
          </TabsTrigger>
        </TabsList>

        {/* SEO Básico */}
        <TabsContent value="basico">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Meta Tags Principales</CardTitle>
                <CardDescription>Lo que ve Google en los resultados de búsqueda</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Título SEO</Label>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs ${seoData.meta_title.length > 60 ? 'text-red-500' : 'text-slate-500'}`}>
                        {seoData.meta_title.length}/60
                      </span>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => generateWithAI('title')}
                        disabled={generatingAI}
                      >
                        <Sparkles className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <Input
                    placeholder="Ej: Zapatillas Nike Originales | Tu Tienda"
                    value={seoData.meta_title}
                    onChange={(e) => setSeoData({...seoData, meta_title: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Descripción SEO</Label>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs ${seoData.meta_description.length > 160 ? 'text-red-500' : 'text-slate-500'}`}>
                        {seoData.meta_description.length}/160
                      </span>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => generateWithAI('description')}
                        disabled={generatingAI}
                      >
                        <Sparkles className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <Textarea
                    placeholder="Descripción atractiva de tu tienda para los buscadores..."
                    value={seoData.meta_description}
                    onChange={(e) => setSeoData({...seoData, meta_description: e.target.value})}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Palabras Clave</Label>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => generateWithAI('keywords')}
                      disabled={generatingAI}
                    >
                      <Sparkles className="w-3 h-3" />
                    </Button>
                  </div>
                  <Textarea
                    placeholder="zapatillas, nike, adidas, deportivas, running, originales"
                    value={seoData.keywords}
                    onChange={(e) => setSeoData({...seoData, keywords: e.target.value})}
                    rows={2}
                  />
                  <p className="text-xs text-slate-500">Separadas por comas</p>
                </div>
              </CardContent>
            </Card>

            {/* Preview de Google */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Preview en Google
                </CardTitle>
                <CardDescription>Así se verá tu tienda en los resultados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-white border rounded-lg p-4 space-y-1">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Globe className="w-4 h-4" />
                    https://{subdomain}.tol.ar
                  </div>
                  <h3 className="text-xl text-blue-700 hover:underline cursor-pointer">
                    {seoData.meta_title || `${storeName} | Tu Tienda Online`}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {seoData.meta_description || "Descripción de tu tienda que aparecerá en Google..."}
                  </p>
                </div>

                <div className="mt-6 bg-slate-50 rounded-lg p-4">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Tips para mejor posicionamiento:
                  </h4>
                  <ul className="text-sm text-slate-600 space-y-2">
                    <li className="flex items-start gap-2">
                      <Zap className="w-4 h-4 text-yellow-500 mt-0.5" />
                      Incluí tu palabra clave principal al inicio del título
                    </li>
                    <li className="flex items-start gap-2">
                      <Zap className="w-4 h-4 text-yellow-500 mt-0.5" />
                      Usá verbos de acción en la descripción (Comprá, Descubrí, Encontrá)
                    </li>
                    <li className="flex items-start gap-2">
                      <Zap className="w-4 h-4 text-yellow-500 mt-0.5" />
                      Mencioná beneficios: envío gratis, cuotas, garantía
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Redes Sociales */}
        <TabsContent value="social">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Open Graph (Facebook, WhatsApp, LinkedIn)</CardTitle>
                <CardDescription>Cómo se ve cuando compartís un link</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Título para redes</Label>
                  <Input
                    placeholder="Título atractivo para compartir"
                    value={seoData.og_title}
                    onChange={(e) => setSeoData({...seoData, og_title: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Descripción para redes</Label>
                  <Textarea
                    placeholder="Descripción que aparece al compartir..."
                    value={seoData.og_description}
                    onChange={(e) => setSeoData({...seoData, og_description: e.target.value})}
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Imagen para compartir (1200x630px)</Label>
                  <Input
                    placeholder="https://tu-imagen.com/og-image.jpg"
                    value={seoData.og_image}
                    onChange={(e) => setSeoData({...seoData, og_image: e.target.value})}
                  />
                  <p className="text-xs text-slate-500">Tamaño ideal: 1200x630 píxeles</p>
                </div>
              </CardContent>
            </Card>

            {/* Preview Social */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Preview en Facebook/WhatsApp</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-slate-200 h-40 flex items-center justify-center">
                    {seoData.og_image ? (
                      <img src={seoData.og_image || "/placeholder.svg"} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-12 h-12 text-slate-400" />
                    )}
                  </div>
                  <div className="p-3 bg-white">
                    <p className="text-xs text-slate-500 uppercase">{subdomain}.tol.ar</p>
                    <h4 className="font-semibold text-slate-900">
                      {seoData.og_title || seoData.meta_title || "Título de tu tienda"}
                    </h4>
                    <p className="text-sm text-slate-600 line-clamp-2">
                      {seoData.og_description || seoData.meta_description || "Descripción..."}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Twitter Cards</CardTitle>
                <CardDescription>Configuración específica para Twitter/X</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Título para Twitter</Label>
                  <Input
                    placeholder="Título para Twitter (o dejá vacío para usar Open Graph)"
                    value={seoData.twitter_title}
                    onChange={(e) => setSeoData({...seoData, twitter_title: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Descripción para Twitter</Label>
                  <Textarea
                    placeholder="Descripción para Twitter..."
                    value={seoData.twitter_description}
                    onChange={(e) => setSeoData({...seoData, twitter_description: e.target.value})}
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Técnico */}
        <TabsContent value="tecnico">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Configuración Técnica</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>URL Canónica</Label>
                  <Input
                    placeholder={`https://${subdomain}.tol.ar`}
                    value={seoData.canonical_url}
                    onChange={(e) => setSeoData({...seoData, canonical_url: e.target.value})}
                  />
                  <p className="text-xs text-slate-500">Dejá vacío para usar la URL por defecto</p>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium">Datos Estructurados (Schema.org)</p>
                    <p className="text-sm text-slate-500">Rich snippets en Google (estrellas, precio, stock)</p>
                  </div>
                  <Switch
                    checked={seoData.structured_data_enabled}
                    onCheckedChange={(checked) => setSeoData({...seoData, structured_data_enabled: checked})}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium">Sitemap Automático</p>
                    <p className="text-sm text-slate-500">Se actualiza cada vez que agregás productos</p>
                  </div>
                  <Switch
                    checked={seoData.auto_sitemap}
                    onCheckedChange={(checked) => setSeoData({...seoData, auto_sitemap: checked})}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Robots.txt</CardTitle>
                <CardDescription>Controlá qué pueden indexar los buscadores</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  className="font-mono text-sm"
                  value={seoData.robots_txt}
                  onChange={(e) => setSeoData({...seoData, robots_txt: e.target.value})}
                  rows={8}
                />
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-transparent"
                    onClick={() => copyToClipboard(`https://${subdomain}.tol.ar/robots.txt`)}
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    Copiar URL
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-transparent"
                    asChild
                  >
                    <a href={`https://${subdomain}.tol.ar/robots.txt`} target="_blank" rel="noreferrer">
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Ver archivo
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Sitemap</CardTitle>
                <CardDescription>Mapa del sitio para buscadores</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-50 p-4 rounded-lg flex items-center justify-between">
                  <div>
                    <code className="text-sm">https://{subdomain}.tol.ar/sitemap.xml</code>
                    <p className="text-xs text-slate-500 mt-1">
                      Enviá este link a Google Search Console y Bing Webmaster Tools
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="bg-transparent"
                      onClick={() => copyToClipboard(`https://${subdomain}.tol.ar/sitemap.xml`)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="bg-transparent"
                      asChild
                    >
                      <a href={`https://${subdomain}.tol.ar/sitemap.xml`} target="_blank" rel="noreferrer">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Verificación */}
        <TabsContent value="verificacion">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google Search Console
                </CardTitle>
                <CardDescription>Verificá tu sitio en Google</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Código de verificación</Label>
                  <Input
                    placeholder="google-site-verification=XXXXX"
                    value={seoData.google_verification}
                    onChange={(e) => setSeoData({...seoData, google_verification: e.target.value})}
                  />
                </div>
                <div className="bg-blue-50 p-4 rounded-lg text-sm">
                  <h4 className="font-medium text-blue-900 mb-2">Cómo verificar:</h4>
                  <ol className="text-blue-800 space-y-1 list-decimal list-inside">
                    <li>Andá a <a href="https://search.google.com/search-console" target="_blank" rel="noreferrer" className="underline">Google Search Console</a></li>
                    <li>Agregá tu propiedad: {subdomain}.tol.ar</li>
                    <li>Elegí "Etiqueta HTML" como método de verificación</li>
                    <li>Copiá el código y pegalo arriba</li>
                    <li>Guardá y verificá en Google</li>
                  </ol>
                </div>
                <Button variant="outline" className="w-full bg-transparent" asChild>
                  <a href="https://search.google.com/search-console" target="_blank" rel="noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Ir a Google Search Console
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#008373" d="M20.76 9.39L12 .25 3.24 9.39v5.22L12 23.75l8.76-9.14V9.39z"/>
                    <path fill="#fff" d="M12 6.5l-4.5 4.7v2.6L12 9.1l4.5 4.7v-2.6L12 6.5z"/>
                  </svg>
                  Bing Webmaster Tools
                </CardTitle>
                <CardDescription>Verificá tu sitio en Bing y Microsoft Edge</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Código de verificación</Label>
                  <Input
                    placeholder="XXXXXXXXXXXXXXXXXXXXX"
                    value={seoData.bing_verification}
                    onChange={(e) => setSeoData({...seoData, bing_verification: e.target.value})}
                  />
                </div>
                <div className="bg-teal-50 p-4 rounded-lg text-sm">
                  <h4 className="font-medium text-teal-900 mb-2">Cómo verificar:</h4>
                  <ol className="text-teal-800 space-y-1 list-decimal list-inside">
                    <li>Andá a <a href="https://www.bing.com/webmasters" target="_blank" rel="noreferrer" className="underline">Bing Webmaster Tools</a></li>
                    <li>Agregá tu sitio</li>
                    <li>Elegí "Etiqueta Meta" como verificación</li>
                    <li>Copiá el content del meta tag</li>
                    <li>Pegalo arriba y verificá</li>
                  </ol>
                </div>
                <Button variant="outline" className="w-full bg-transparent" asChild>
                  <a href="https://www.bing.com/webmasters" target="_blank" rel="noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Ir a Bing Webmaster Tools
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Análisis */}
        <TabsContent value="analisis">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Análisis de SEO
              </CardTitle>
              <CardDescription>Estado actual de la optimización de tu tienda</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analysis.issues.map((issue, i) => (
                  <div 
                    key={i}
                    className={`flex items-start gap-3 p-3 rounded-lg ${
                      issue.type === 'error' ? 'bg-red-50' :
                      issue.type === 'warning' ? 'bg-yellow-50' :
                      'bg-green-50'
                    }`}
                  >
                    {issue.type === 'error' && <XCircle className="w-5 h-5 text-red-600 mt-0.5" />}
                    {issue.type === 'warning' && <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />}
                    {issue.type === 'success' && <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />}
                    <div>
                      <p className={`font-medium ${
                        issue.type === 'error' ? 'text-red-900' :
                        issue.type === 'warning' ? 'text-yellow-900' :
                        'text-green-900'
                      }`}>
                        {issue.message}
                      </p>
                      {issue.suggestion && (
                        <p className={`text-sm ${
                          issue.type === 'error' ? 'text-red-700' :
                          issue.type === 'warning' ? 'text-yellow-700' :
                          'text-green-700'
                        }`}>
                          {issue.suggestion}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Asistente IA */}
        <TabsContent value="ai">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Bot className="w-5 h-5" />
                Asistente SEO con IA
              </CardTitle>
              <CardDescription>
                Dejá que la inteligencia artificial optimice tu SEO como un experto
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <Button 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent"
                  onClick={() => generateWithAI('title')}
                  disabled={generatingAI}
                >
                  <FileText className="w-8 h-8 text-blue-600" />
                  <span className="font-medium">Generar Título</span>
                  <span className="text-xs text-slate-500">Optimizado para clicks</span>
                </Button>

                <Button 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent"
                  onClick={() => generateWithAI('description')}
                  disabled={generatingAI}
                >
                  <FileText className="w-8 h-8 text-green-600" />
                  <span className="font-medium">Generar Descripción</span>
                  <span className="text-xs text-slate-500">Atractiva y con keywords</span>
                </Button>

                <Button 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent"
                  onClick={() => generateWithAI('keywords')}
                  disabled={generatingAI}
                >
                  <Target className="w-8 h-8 text-purple-600" />
                  <span className="font-medium">Sugerir Keywords</span>
                  <span className="text-xs text-slate-500">Basado en tu tienda</span>
                </Button>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg">
                <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  Optimización Completa con IA
                </h4>
                <p className="text-slate-600 mb-4">
                  La IA analizará tu tienda y generará automáticamente:
                </p>
                <ul className="text-sm text-slate-600 space-y-2 mb-4">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Título SEO optimizado para tu nicho
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Descripción persuasiva con call-to-action
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Palabras clave relevantes para tu industria
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Textos para redes sociales
                  </li>
                </ul>
                <Button 
                  className="w-full"
                  onClick={() => generateWithAI('all')}
                  disabled={generatingAI}
                >
                  {generatingAI ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4 mr-2" />
                  )}
                  Generar TODO con IA
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
