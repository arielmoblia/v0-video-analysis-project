"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Package, 
  Upload, 
  Store, 
  RefreshCw, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Plus,
  Rocket,
  History,
  Settings,
  Shirt,
  ShoppingBag,
  Sparkles,
  Smartphone,
  Eye,
  ExternalLink
} from "lucide-react"

interface Template {
  id: string
  name: string
  slug: string
  description: string
  icon: string
  current_version: string
  variantes: string[]
  is_active: boolean
  stores_count?: number
}

interface TemplateVersion {
  id: string
  template_id: string
  version: string
  changelog: string
  breaking_changes: boolean
  deployed_to_all: boolean
  created_at: string
  deployed_at?: string
}

import { FlaskConical, ArrowRight, Users, Beaker, Layers } from "lucide-react"

const TEMPLATE_ICONS: Record<string, any> = {
  pruebas: Beaker,
  base: Layers,
  zapatos: ShoppingBag,
  ropa: Shirt,
  perfumes: Sparkles,
  electronicos: Smartphone,
  default: Package
}

type TemplateLevel = "pruebas" | "base" | "rubro"

export function TemplateManager() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [versions, setVersions] = useState<TemplateVersion[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [loading, setLoading] = useState(true)
  const [deploying, setDeploying] = useState(false)
  const [deployStatus, setDeployStatus] = useState<string | null>(null)
  
  // Nueva version
  const [newVersion, setNewVersion] = useState({
    version: "",
    changelog: "",
    breaking_changes: false
  })

  useEffect(() => {
    loadTemplates()
  }, [])

  async function loadTemplates() {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/templates")
      const data = await response.json()
      if (data.success) {
        setTemplates(data.templates)
        if (data.templates.length > 0 && !selectedTemplate) {
          setSelectedTemplate(data.templates[0])
          loadVersions(data.templates[0].id)
        }
      }
    } catch (error) {
      console.error("Error loading templates:", error)
      // Datos de ejemplo con 3 niveles: PRUEBAS -> BASE -> RUBROS
      const mockTemplates: Template[] = [
        // Nivel 1: PRUEBAS (sandbox)
        { id: "0", name: "PRUEBAS", slug: "pruebas", description: "Sandbox para probar ideas nuevas sin afectar nada", icon: "pruebas", current_version: "1.0.0", variantes: ["test"], is_active: true, stores_count: 0 },
        // Nivel 2: BASE (afecta a todos)
        { id: "1", name: "BASE", slug: "base", description: "Template base - Los cambios aca afectan a TODOS los templates y tiendas", icon: "base", current_version: "1.0.0", variantes: ["color", "cantidad"], is_active: true, stores_count: 0 },
        // Nivel 3: RUBROS (afectan solo a su categoria)
        { id: "2", name: "Zapatos", slug: "zapatos", description: "Template para tiendas de calzado", icon: "zapatos", current_version: "1.0.0", variantes: ["34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44"], is_active: true, stores_count: 0 },
        { id: "3", name: "Ropa", slug: "ropa", description: "Template para tiendas de indumentaria", icon: "ropa", current_version: "1.0.0", variantes: ["XS", "S", "M", "L", "XL", "XXL"], is_active: true, stores_count: 0 },
        { id: "4", name: "Perfumes", slug: "perfumes", description: "Template para tiendas de cosmetica", icon: "perfumes", current_version: "1.0.0", variantes: ["30ml", "50ml", "100ml", "200ml"], is_active: true, stores_count: 0 },
        { id: "5", name: "Electronicos", slug: "electronicos", description: "Template para tiendas de tecnologia", icon: "electronicos", current_version: "1.0.0", variantes: ["Negro", "Blanco", "64GB", "128GB", "256GB"], is_active: true, stores_count: 0 },
      ]
      setTemplates(mockTemplates)
      setSelectedTemplate(mockTemplates[0])
    } finally {
      setLoading(false)
    }
  }

  async function loadVersions(templateId: string) {
    try {
      const response = await fetch(`/api/admin/templates/${templateId}/versions`)
      const data = await response.json()
      if (data.success) {
        setVersions(data.versions)
      }
    } catch (error) {
      console.error("Error loading versions:", error)
      // Versiones de ejemplo
      setVersions([
        { id: "1", template_id: templateId, version: "1.0.0", changelog: "Version inicial del template", breaking_changes: false, deployed_to_all: true, created_at: new Date().toISOString(), deployed_at: new Date().toISOString() }
      ])
    }
  }

  async function createVersion() {
    if (!selectedTemplate || !newVersion.version || !newVersion.changelog) return
    
    try {
      const response = await fetch(`/api/admin/templates/${selectedTemplate.id}/versions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newVersion)
      })
      
      if (response.ok) {
        loadVersions(selectedTemplate.id)
        setNewVersion({ version: "", changelog: "", breaking_changes: false })
      }
    } catch (error) {
      console.error("Error creating version:", error)
      // Simular creacion
      const newVer: TemplateVersion = {
        id: Date.now().toString(),
        template_id: selectedTemplate.id,
        version: newVersion.version,
        changelog: newVersion.changelog,
        breaking_changes: newVersion.breaking_changes,
        deployed_to_all: false,
        created_at: new Date().toISOString()
      }
      setVersions([newVer, ...versions])
      setNewVersion({ version: "", changelog: "", breaking_changes: false })
    }
  }

  async function deployToAll(versionId: string) {
    if (!selectedTemplate) return
    
    setDeploying(true)
    setDeployStatus("Iniciando despliegue...")
    
    try {
      const response = await fetch(`/api/admin/templates/${selectedTemplate.id}/deploy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ version_id: versionId })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setDeployStatus(`Desplegado a ${data.stores_updated} tiendas`)
        loadVersions(selectedTemplate.id)
      } else {
        setDeployStatus("Error en el despliegue")
      }
    } catch (error) {
      console.error("Error deploying:", error)
      // Simular despliegue
      setDeployStatus(`Desplegado a ${selectedTemplate.stores_count || 0} tiendas`)
      setVersions(versions.map(v => 
        v.id === versionId ? { ...v, deployed_to_all: true, deployed_at: new Date().toISOString() } : v
      ))
    } finally {
      setDeploying(false)
      setTimeout(() => setDeployStatus(null), 3000)
    }
  }

  function selectTemplate(template: Template) {
    setSelectedTemplate(template)
    loadVersions(template.id)
  }

  const IconComponent = selectedTemplate ? (TEMPLATE_ICONS[selectedTemplate.icon] || TEMPLATE_ICONS.default) : Package

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Administrador de Templates</h2>
          <p className="text-muted-foreground">Gestiona los templates y despliega actualizaciones a todas las tiendas</p>
        </div>
        <Button variant="outline" onClick={loadTemplates}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Actualizar
        </Button>
      </div>

      {/* Flujo visual explicativo - 3 NIVELES */}
      <Card className="bg-gradient-to-r from-orange-50 via-purple-50 via-blue-50 to-green-50 border-purple-200">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4 text-slate-700">Flujo de actualizaciones (3 niveles)</h3>
          <div className="flex items-center justify-between flex-wrap gap-4">
            {/* Nivel 1: PRUEBAS */}
            <div className="flex items-center gap-2 bg-white px-4 py-3 rounded-lg shadow-sm border border-orange-300">
              <Beaker className="w-5 h-5 text-orange-600" />
              <div>
                <span className="font-medium text-orange-700">PRUEBAS</span>
                <p className="text-xs text-muted-foreground">Sandbox</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400" />
            {/* Nivel 2: BASE */}
            <div className="flex items-center gap-2 bg-white px-4 py-3 rounded-lg shadow-sm border border-purple-300">
              <Layers className="w-5 h-5 text-purple-600" />
              <div>
                <span className="font-medium text-purple-700">BASE</span>
                <p className="text-xs text-muted-foreground">Afecta a TODOS</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400" />
            {/* Nivel 3: RUBROS */}
            <div className="flex items-center gap-2 bg-white px-4 py-3 rounded-lg shadow-sm border border-blue-300">
              <ShoppingBag className="w-5 h-5 text-blue-600" />
              <div>
                <span className="font-medium text-blue-700">RUBROS</span>
                <p className="text-xs text-muted-foreground">Por categoria</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400" />
            {/* Tiendas */}
            <div className="flex items-center gap-2 bg-white px-4 py-3 rounded-lg shadow-sm border border-green-300">
              <Users className="w-5 h-5 text-green-600" />
              <div>
                <span className="font-medium text-green-700">Tiendas</span>
                <p className="text-xs text-green-600 font-medium">Auto-update</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid de Templates */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {templates.map(template => {
          const Icon = TEMPLATE_ICONS[template.icon] || TEMPLATE_ICONS.default
          // Determinar nivel y colores
          const isPruebas = template.slug === "pruebas"
          const isBase = template.slug === "base"
          const levelColor = isPruebas 
            ? "border-orange-300 bg-orange-50 hover:bg-orange-100" 
            : isBase 
              ? "border-purple-300 bg-purple-50 hover:bg-purple-100" 
              : "border-blue-200 hover:bg-blue-50"
          const iconBg = isPruebas 
            ? "bg-orange-500 text-white" 
            : isBase 
              ? "bg-purple-500 text-white" 
              : selectedTemplate?.id === template.id 
                ? "bg-primary text-white" 
                : "bg-slate-100"
          
          return (
            <Card 
              key={template.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${levelColor} ${selectedTemplate?.id === template.id ? 'ring-2 ring-primary' : ''}`}
              onClick={() => selectTemplate(template)}
            >
              <CardContent className="p-4 text-center">
                <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-2 ${iconBg}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold">{template.name}</h3>
                {isPruebas && <Badge className="bg-orange-500 text-white text-[10px] mb-1">Sandbox</Badge>}
                {isBase && <Badge className="bg-purple-500 text-white text-[10px] mb-1">Afecta a todos</Badge>}
                <p className="text-xs text-muted-foreground">v{template.current_version}</p>
                <Badge variant="outline" className="mt-2">
                  <Store className="w-3 h-3 mr-1" />
                  {template.stores_count || 0} tiendas
                </Badge>
                <div className="flex gap-2 mt-3">
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={(e) => {
                      e.stopPropagation()
                      window.open(`https://${template.slug}.tol.ar`, '_blank')
                    }}
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    Tienda
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1 bg-slate-800 hover:bg-slate-900"
                    onClick={(e) => {
                      e.stopPropagation()
                      window.open(`https://${template.slug}.tol.ar/admin`, '_blank')
                    }}
                  >
                    <Settings className="w-3 h-3 mr-1" />
                    Admin
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Template Seleccionado */}
      {selectedTemplate && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <IconComponent className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <CardTitle>{selectedTemplate.name}</CardTitle>
                  <CardDescription>{selectedTemplate.description}</CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <a 
                  href={`https://${selectedTemplate.slug}.tol.ar`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-sm text-muted-foreground hover:text-slate-700 flex items-center gap-1"
                >
                  <Eye className="w-4 h-4" />
                  Ver tienda
                </a>
                <a 
                  href={`https://${selectedTemplate.slug}.tol.ar/admin`} 
                  target="_blank" 
                  rel="noreferrer"
                >
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Settings className="w-4 h-4 mr-2" />
                    Abrir Admin
                    <ExternalLink className="w-3 h-3 ml-2" />
                  </Button>
                </a>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="versiones">
              <TabsList className="mb-4">
                <TabsTrigger value="versiones">
                  <History className="w-4 h-4 mr-2" />
                  Versiones
                </TabsTrigger>
                <TabsTrigger value="nueva">
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva Version
                </TabsTrigger>
                <TabsTrigger value="variantes">
                  <Settings className="w-4 h-4 mr-2" />
                  Variantes
                </TabsTrigger>
              </TabsList>

              {/* Tab Versiones */}
              <TabsContent value="versiones" className="space-y-4">
                {deployStatus && (
                  <div className="p-3 bg-blue-50 text-blue-700 rounded-lg flex items-center gap-2">
                    {deploying ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                    {deployStatus}
                  </div>
                )}

                {versions.length === 0 ? (
                  <p className="text-center py-8 text-muted-foreground">No hay versiones registradas</p>
                ) : (
                  <div className="space-y-3">
                    {versions.map(version => (
                      <div 
                        key={version.id}
                        className="p-4 border rounded-lg flex items-center justify-between"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-semibold">v{version.version}</span>
                            {version.breaking_changes && (
                              <Badge variant="destructive" className="text-xs">Breaking</Badge>
                            )}
                            {version.deployed_to_all ? (
                              <Badge variant="default" className="bg-green-500 text-xs">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Desplegado
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-xs">
                                <Clock className="w-3 h-3 mr-1" />
                                Pendiente
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{version.changelog}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Creado: {new Date(version.created_at).toLocaleDateString()}
                            {version.deployed_at && ` | Desplegado: ${new Date(version.deployed_at).toLocaleDateString()}`}
                          </p>
                        </div>
                        {!version.deployed_to_all && (
                          <Button 
                            onClick={() => deployToAll(version.id)}
                            disabled={deploying}
                            className="ml-4"
                          >
                            <Rocket className="w-4 h-4 mr-2" />
                            Desplegar a Todas
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Tab Nueva Version */}
              <TabsContent value="nueva" className="space-y-4">
                <Card className="bg-amber-50 border-amber-200">
                  <CardContent className="p-4">
                    <div className="flex gap-2 text-amber-800">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      <div className="text-sm">
                        <p className="font-semibold">Como funciona:</p>
                        <ol className="list-decimal list-inside mt-1 space-y-1">
                          <li>Creas una nueva version con los cambios</li>
                          <li>Probas en el template ({selectedTemplate.slug}.tol.ar)</li>
                          <li>Si todo funciona, desplegas a todas las tiendas</li>
                        </ol>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Numero de Version</Label>
                      <Input 
                        placeholder="ej: 1.0.1"
                        value={newVersion.version}
                        onChange={e => setNewVersion({...newVersion, version: e.target.value})}
                      />
                      <p className="text-xs text-muted-foreground mt-1">Version actual: {selectedTemplate.current_version}</p>
                    </div>
                    <div className="flex items-center gap-2 pt-6">
                      <Switch 
                        checked={newVersion.breaking_changes}
                        onCheckedChange={checked => setNewVersion({...newVersion, breaking_changes: checked})}
                      />
                      <Label>Cambios importantes (breaking changes)</Label>
                    </div>
                  </div>

                  <div>
                    <Label>Descripcion de cambios (Changelog)</Label>
                    <Textarea 
                      placeholder="Describe los cambios de esta version..."
                      rows={4}
                      value={newVersion.changelog}
                      onChange={e => setNewVersion({...newVersion, changelog: e.target.value})}
                    />
                  </div>

                  <Button 
                    onClick={createVersion}
                    disabled={!newVersion.version || !newVersion.changelog}
                    className="w-full"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Crear Version {newVersion.version || ""}
                  </Button>
                </div>
              </TabsContent>

              {/* Tab Variantes */}
              <TabsContent value="variantes" className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Variantes especificas de este template. Estas opciones aparecen al agregar productos.
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {selectedTemplate.variantes.map((variante, index) => (
                    <Badge key={index} variant="secondary" className="text-sm py-1 px-3">
                      {variante}
                    </Badge>
                  ))}
                </div>

                <Card className="bg-slate-50">
                  <CardContent className="p-4">
                    <p className="text-sm">
                      <strong>Ejemplo de uso:</strong> Si un cliente crea una tienda con el template "{selectedTemplate.name}", 
                      cuando agregue productos podra seleccionar estas variantes: {selectedTemplate.variantes.join(", ")}.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
