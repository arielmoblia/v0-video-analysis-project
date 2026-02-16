"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  MapPin,
  Truck,
  Loader2,
  Check,
  Package,
  ChevronDown,
  ChevronUp,
  Star,
  Building2,
  Mail,
  Bike,
  CheckCircle2,
} from "lucide-react"

interface ShippingManagerProps {
  storeId: string
}

interface ShippingConfig {
  // Retiro en local
  pickup_enabled: boolean
  pickup_address: string
  pickup_hours: string
  pickup_instructions: string
  own_delivery_enabled: boolean
  own_delivery_cost: string
  own_delivery_zones: string
  own_delivery_time: string
  own_delivery_instructions: string
  // Enviamelo (recomendado)
  enviamelo_enabled: boolean
  enviamelo_token: string
  enviamelo_user: string
  // Andreani
  andreani_enabled: boolean
  andreani_token: string
  andreani_contract: string
  andreani_user: string
  andreani_password: string
  andreani_account: string
  origin_postal_code: string
  origin_street: string
  origin_number: string
  origin_city: string
  origin_province: string
  // OCA
  oca_enabled: boolean
  oca_operativa: string
  oca_cuit: string
  // Correo Argentino
  correo_enabled: boolean
  correo_contract: string
  // Config general envío
  delivery_fixed_cost: string
  delivery_free_above: string
  delivery_instructions: string
}

// Videos tutoriales de YouTube
const TUTORIAL_VIDEOS = {
  pickup: "",
  own_delivery: "",
  enviamelo: "JHZWVOef68U",
  andreani: "hQHjK9-oQW0",
  oca: "",
  correo: "",
}

export function ShippingManager({ storeId }: ShippingManagerProps) {
  const [config, setConfig] = useState<ShippingConfig>({
    pickup_enabled: false,
    pickup_address: "",
    pickup_hours: "",
    pickup_instructions: "",
    own_delivery_enabled: false,
    own_delivery_cost: "",
    own_delivery_zones: "",
    own_delivery_time: "",
    own_delivery_instructions: "",
    enviamelo_enabled: false,
    enviamelo_token: "",
    enviamelo_user: "",
    andreani_enabled: false,
    andreani_token: "",
    andreani_contract: "",
    andreani_user: "",
    andreani_password: "",
    andreani_account: "",
    origin_postal_code: "",
    origin_street: "",
    origin_number: "",
    origin_city: "",
    origin_province: "",
    oca_enabled: false,
    oca_operativa: "",
    oca_cuit: "",
    correo_enabled: false,
    correo_contract: "",
    delivery_fixed_cost: "",
    delivery_free_above: "",
    delivery_instructions: "",
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [expandedTutorials, setExpandedTutorials] = useState<Record<string, boolean>>({})

  useEffect(() => {
    fetchShippingConfig()
  }, [storeId])

  const fetchShippingConfig = async () => {
    try {
      const res = await fetch(`/api/admin/shipping?storeId=${storeId}`)
      if (res.ok) {
        const data = await res.json()
        if (data) {
          setConfig({
            pickup_enabled: data.pickup_enabled || false,
            pickup_address: data.pickup_address || "",
            pickup_hours: data.pickup_hours || "",
            pickup_instructions: data.pickup_instructions || "",
            own_delivery_enabled: data.own_delivery_enabled || false,
            own_delivery_cost: data.own_delivery_cost || "",
            own_delivery_zones: data.own_delivery_zones || "",
            own_delivery_time: data.own_delivery_time || "",
            own_delivery_instructions: data.own_delivery_instructions || "",
            enviamelo_enabled: data.enviamelo_enabled || false,
            enviamelo_token: data.enviamelo_token || "",
            enviamelo_user: data.enviamelo_user || "",
            andreani_enabled: data.andreani_enabled || false,
            andreani_token: data.andreani_token || "",
            andreani_contract: data.andreani_contract || "",
            oca_enabled: data.oca_enabled || false,
            oca_operativa: data.oca_operativa || "",
            oca_cuit: data.oca_cuit || "",
            correo_enabled: data.correo_enabled || false,
            correo_contract: data.correo_contract || "",
            delivery_fixed_cost: data.delivery_fixed_cost?.toString() || "",
            delivery_free_above: data.delivery_free_above?.toString() || "",
            delivery_instructions: data.delivery_instructions || "",
          })
        }
      }
    } catch (error) {
      console.error("Error fetching shipping config:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)
    try {
      const res = await fetch("/api/admin/shipping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeId,
          ...config,
          delivery_fixed_cost: config.delivery_fixed_cost ? Number.parseFloat(config.delivery_fixed_cost) : null,
          delivery_free_above: config.delivery_free_above ? Number.parseFloat(config.delivery_free_above) : null,
        }),
      })
      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } catch (error) {
      console.error("Error saving shipping config:", error)
    } finally {
      setSaving(false)
    }
  }

  const toggleTutorial = (key: string) => {
    setExpandedTutorials((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Métodos de Envío</h2>
          <p className="text-muted-foreground">Configurá cómo tus clientes reciben sus pedidos</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : saved ? (
            <Check className="h-4 w-4 mr-2" />
          ) : null}
          {saved ? "Guardado" : "Guardar Cambios"}
        </Button>
      </div>

      {/* Retiro en Local */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MapPin className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <CardTitle>Retiro en Local</CardTitle>
                <CardDescription>El cliente retira el pedido en tu dirección</CardDescription>
              </div>
            </div>
            <Switch
              checked={config.pickup_enabled}
              onCheckedChange={(checked) => setConfig({ ...config, pickup_enabled: checked })}
            />
          </div>
        </CardHeader>
        {config.pickup_enabled && (
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Dirección de retiro</Label>
                  <Input
                    placeholder="Av. Corrientes 1234, CABA"
                    value={config.pickup_address}
                    onChange={(e) => setConfig({ ...config, pickup_address: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Horarios de atención</Label>
                  <Input
                    placeholder="Lunes a Viernes de 9 a 18hs"
                    value={config.pickup_hours}
                    onChange={(e) => setConfig({ ...config, pickup_hours: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Instrucciones adicionales (opcional)</Label>
                  <Textarea
                    placeholder="Timbre 2B, preguntar por Juan..."
                    value={config.pickup_instructions}
                    onChange={(e) => setConfig({ ...config, pickup_instructions: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Video Tutorial</Label>
                <div className="aspect-video rounded-lg overflow-hidden border">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${TUTORIAL_VIDEOS.pickup}`}
                    title="Tutorial Retiro en Local"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Bike className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <CardTitle>Envío Propio</CardTitle>
                <CardDescription>Entregá vos mismo con tu moto, bici o vehículo</CardDescription>
              </div>
            </div>
            <Switch
              checked={config.own_delivery_enabled}
              onCheckedChange={(checked) => setConfig({ ...config, own_delivery_enabled: checked })}
            />
          </div>
        </CardHeader>
        {config.own_delivery_enabled && (
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Costo de envío ($)</Label>
                  <Input
                    type="text"
                    placeholder="Ej: 500 o 'Según zona'"
                    value={config.own_delivery_cost}
                    onChange={(e) => setConfig({ ...config, own_delivery_cost: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Podés poner un precio fijo o indicar que varía según zona
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Zonas de entrega</Label>
                  <Textarea
                    placeholder="Ej: CABA, Zona Norte (hasta 10km), San Isidro, Vicente López..."
                    value={config.own_delivery_zones}
                    onChange={(e) => setConfig({ ...config, own_delivery_zones: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tiempo de entrega estimado</Label>
                  <Input
                    placeholder="Ej: 24-48hs hábiles"
                    value={config.own_delivery_time}
                    onChange={(e) => setConfig({ ...config, own_delivery_time: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Instrucciones para el cliente (opcional)</Label>
                  <Textarea
                    placeholder="Ej: Nos comunicaremos por WhatsApp para coordinar la entrega..."
                    value={config.own_delivery_instructions}
                    onChange={(e) => setConfig({ ...config, own_delivery_instructions: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Video Tutorial</Label>
                <div className="aspect-video rounded-lg overflow-hidden border">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${TUTORIAL_VIDEOS.own_delivery}`}
                    title="Tutorial Envío Propio"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Título de sección */}
      <div className="pt-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Truck className="h-5 w-5" />
          Empresas de Envío
        </h3>
        <p className="text-sm text-muted-foreground">Conectá con empresas de logística para envíos a todo el país</p>
      </div>

      {/* Enviamelo - RECOMENDADO */}
      <Card className="border-2 border-green-500 relative">
        <div className="absolute -top-3 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
          <Star className="h-3 w-3" /> RECOMENDADO
        </div>
        <CardHeader className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Package className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">Enviamelo</CardTitle>
                <CardDescription>Envíos a todo el país con seguimiento - enviamelo.com.ar</CardDescription>
              </div>
            </div>
            <Switch
              checked={config.enviamelo_enabled}
              onCheckedChange={(checked) => setConfig({ ...config, enviamelo_enabled: checked })}
            />
          </div>
        </CardHeader>
        {config.enviamelo_enabled && (
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                {/* Tutorial desplegable */}
                <div className="bg-green-50 border border-green-200 rounded-lg">
                  <button
                    onClick={() => toggleTutorial("enviamelo")}
                    className="w-full flex items-center justify-between p-4 text-left"
                  >
                    <span className="font-medium text-green-800">¿Cómo obtener mis credenciales de Enviamelo?</span>
                    {expandedTutorials.enviamelo ? (
                      <ChevronUp className="h-5 w-5 text-green-600" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-green-600" />
                    )}
                  </button>
                  {expandedTutorials.enviamelo && (
                    <div className="px-4 pb-4 space-y-3 text-sm text-green-800">
                      <p>
                        <strong>Paso 1:</strong> Ingresá a{" "}
                        <a
                          href="https://enviamelo.com.ar"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline font-bold"
                        >
                          enviamelo.com.ar
                        </a>
                      </p>
                      <p>
                        <strong>Paso 2:</strong> Registrate como vendedor o iniciá sesión
                      </p>
                      <p>
                        <strong>Paso 3:</strong> Andá a "Mi cuenta" → "Integraciones" → "API"
                      </p>
                      <p>
                        <strong>Paso 4:</strong> Copiá tu Token de API y tu Usuario
                      </p>
                      <p>
                        <strong>Paso 5:</strong> Pegá las credenciales acá abajo
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Usuario de Enviamelo</Label>
                  <Input
                    placeholder="tu_usuario"
                    value={config.enviamelo_user}
                    onChange={(e) => setConfig({ ...config, enviamelo_user: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Token de API</Label>
                  <Input
                    type="password"
                    placeholder="••••••••••••••••"
                    value={config.enviamelo_token}
                    onChange={(e) => setConfig({ ...config, enviamelo_token: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Costo fijo de envío ($)</Label>
                    <Input
                      type="number"
                      placeholder="Calculado por API"
                      value={config.delivery_fixed_cost}
                      onChange={(e) => setConfig({ ...config, delivery_fixed_cost: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Envío gratis desde ($)</Label>
                    <Input
                      type="number"
                      placeholder="Sin mínimo"
                      value={config.delivery_free_above}
                      onChange={(e) => setConfig({ ...config, delivery_free_above: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {TUTORIAL_VIDEOS.enviamelo && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Video Tutorial</Label>
                  <div className="aspect-video rounded-lg overflow-hidden border">
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${TUTORIAL_VIDEOS.enviamelo}`}
                      title="Tutorial Enviamelo"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Andreani */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Truck className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <CardTitle>Andreani</CardTitle>
                <CardDescription>Envíos express y estándar a todo el país - Cotización automática</CardDescription>
              </div>
            </div>
            <Switch
              checked={config.andreani_enabled}
              onCheckedChange={(checked) => setConfig({ ...config, andreani_enabled: checked })}
            />
          </div>
        </CardHeader>
        {config.andreani_enabled && (
          <CardContent>
            <div className="space-y-6">
              {/* Tutorial */}
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h4 className="font-medium text-orange-800 mb-2">Como funciona la integracion con Andreani</h4>
                <ol className="text-sm text-orange-700 space-y-2 list-decimal list-inside">
                  <li><strong>Registrate en Andreani Empresas:</strong> Ingresa a <a href="https://www.andreani.com/empresas" target="_blank" rel="noopener noreferrer" className="underline font-bold">andreani.com/empresas</a></li>
                  <li><strong>Solicita acceso a la API:</strong> Desde el panel de empresa, pedi credenciales de API</li>
                  <li><strong>Completa los datos abajo:</strong> Te van a dar usuario, contraseña, numero de cuenta y contrato</li>
                  <li><strong>Listo!</strong> Tus clientes veran el costo de envio de Andreani en el checkout</li>
                </ol>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Credenciales */}
                <div className="space-y-4">
                  <h4 className="font-medium">Credenciales de API</h4>
                  <div className="space-y-2">
                    <Label>Usuario de API</Label>
                    <Input
                      placeholder="usuario@empresa.com"
                      value={config.andreani_user || ""}
                      onChange={(e) => setConfig({ ...config, andreani_user: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Contraseña de API</Label>
                    <Input
                      type="password"
                      placeholder="********"
                      value={config.andreani_password || ""}
                      onChange={(e) => setConfig({ ...config, andreani_password: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Numero de Cuenta (Cliente)</Label>
                    <Input
                      placeholder="Ej: 12345"
                      value={config.andreani_account || ""}
                      onChange={(e) => setConfig({ ...config, andreani_account: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Numero de Contrato/Operativa</Label>
                    <Input
                      placeholder="Ej: 300006611"
                      value={config.andreani_contract || ""}
                      onChange={(e) => setConfig({ ...config, andreani_contract: e.target.value })}
                    />
                  </div>
                </div>

                {/* Direccion de origen */}
                <div className="space-y-4">
                  <h4 className="font-medium">Direccion de Origen (desde donde envias)</h4>
                  <div className="space-y-2">
                    <Label>Codigo Postal</Label>
                    <Input
                      placeholder="Ej: 1425"
                      value={config.origin_postal_code || ""}
                      onChange={(e) => setConfig({ ...config, origin_postal_code: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2 space-y-2">
                      <Label>Calle</Label>
                      <Input
                        placeholder="Av. Corrientes"
                        value={config.origin_street || ""}
                        onChange={(e) => setConfig({ ...config, origin_street: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Numero</Label>
                      <Input
                        placeholder="1234"
                        value={config.origin_number || ""}
                        onChange={(e) => setConfig({ ...config, origin_number: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Ciudad</Label>
                    <Input
                      placeholder="CABA"
                      value={config.origin_city || ""}
                      onChange={(e) => setConfig({ ...config, origin_city: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Provincia</Label>
                    <Input
                      placeholder="Buenos Aires"
                      value={config.origin_province || ""}
                      onChange={(e) => setConfig({ ...config, origin_province: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Video Tutorial */}
              {TUTORIAL_VIDEOS.andreani && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Video Tutorial - Como crear cuenta en Andreani</Label>
                  <div className="aspect-video rounded-lg overflow-hidden border">
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${TUTORIAL_VIDEOS.andreani}`}
                      title="Tutorial Andreani"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}

              {/* Estado de configuracion */}
              {config.andreani_user && config.andreani_password && config.andreani_account && config.andreani_contract && config.origin_postal_code ? (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Andreani configurado correctamente. Los clientes veran el costo de envio en el checkout.
                  </p>
                </div>
              ) : (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-800">
                    Completa todos los campos para habilitar la cotizacion automatica de Andreani.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        )}
      </Card>

      {/* OCA */}
      <Card className="opacity-75">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Building2 className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  OCA
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-normal">
                    Próximamente
                  </span>
                </CardTitle>
                <CardDescription>Red de sucursales en todo el país</CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Correo Argentino */}
      <Card className="opacity-75">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-sky-100 rounded-lg">
                <Mail className="h-5 w-5 text-sky-600" />
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  Correo Argentino
                  <span className="text-xs bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full font-normal">
                    Próximamente
                  </span>
                </CardTitle>
                <CardDescription>Servicio postal nacional con cobertura total</CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Configuración general de envíos */}
      <Card>
        <CardHeader>
          <CardTitle>Configuración General de Envíos</CardTitle>
          <CardDescription>Opciones que aplican a todos los métodos de envío</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Instrucciones de envío para el cliente</Label>
            <Textarea
              placeholder="Información sobre tiempos de entrega, zonas de cobertura, etc."
              value={config.delivery_instructions}
              onChange={(e) => setConfig({ ...config, delivery_instructions: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
