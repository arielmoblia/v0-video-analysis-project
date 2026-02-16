"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Script from "next/script"
import {
  BarChart3,
  Video,
  MessageSquare,
  EyeOff,
  Globe,
  Package,
  Headphones,
  Check,
  Info,
  Loader2,
  Copy,
  Upload,
  DollarSign,
  Sparkles,
  Users,
  Calendar,
  ArrowRight,
  AlertCircle,
  FileText,
  Phone,
  ImageIcon,
  Truck,
  Shield,
  CreditCard,
  ShoppingCart,
  ExternalLink,
  ShieldCheck,
  CheckCircle,
  Palette, // Import Palette
} from "lucide-react"
import CustomVariantsManager from "./custom-variants-manager" // Import CustomVariantsManager

const PAYPAL_CLIENT_ID = "ASYvylVa8L7Qf57IKodIEIYd6BalypfW9TGuFkanCnaCR55rP-B-XRemN1FcVLcx0Aii2DIKDtr68RSA"

interface PlansManagerProps {
  storeId: string
  storeName?: string
  subdomain?: string
}

interface DbFeature {
  id: string
  code: string
  name: string
  description: string
  price: number // Precio en USD
  icon: string
  is_active: boolean
}

const ICON_MAP: { [key: string]: any } = {
  BarChart3,
  Video,
  MessageSquare,
  EyeOff,
  Globe,
  Package,
  Headphones,
  DollarSign,
  ShoppingCart,
  Palette, // Add Palette to ICON_MAP
}

const FEATURE_CONFIG: { [key: string]: { configTitle: string; configDescription: string } } = {
  analytics: {
    configTitle: "Configurar Estadísticas",
    configDescription:
      "Una vez activado, vas a poder ver en tu panel de administración un dashboard completo con: visitas diarias, productos más vistos, de dónde vienen tus clientes, y mucho más.",
  },
  video_hero: {
    configTitle: "Configurar Video de Portada",
    configDescription:
      "Subí un video para mostrar en el banner principal de tu tienda. Recomendamos videos cortos (10-30 segundos) en formato MP4.",
  },
  ai_chat: {
    configTitle: "Configurar Chat con IA",
    configDescription:
      "Configurá las respuestas automáticas y el tono del asistente virtual. Podés entrenar a la IA con información de tus productos y políticas.",
  },
  remove_branding: {
    configTitle: "Quitar marca tol.ar",
    configDescription:
      "Al activar esta opción, se eliminará automáticamente el link 'Creado con tol.ar' del pie de página de tu tienda. Tu tienda se verá 100% profesional.",
  },
  custom_domain: {
    configTitle: "Configurar Dominio Propio",
    configDescription: "Conectá tu propio dominio para que tu tienda se vea más profesional.",
  },
  unlimited_products: {
    configTitle: "Productos Ilimitados",
    configDescription:
      "Al activar esta opción, podrás agregar todos los productos que quieras sin ningún límite. Ideal para tiendas con catálogos grandes.",
  },
  priority_support: {
    configTitle: "Soporte Prioritario",
    configDescription:
      "Acceso directo a nuestro equipo de soporte por WhatsApp. Respuesta garantizada en menos de 2 horas en horario laboral.",
  },
  dolar_peso: {
    configTitle: "Dólar/Peso Automático",
    configDescription:
      "Con esta función, podés cargar tus precios en dólares y tus clientes los verán automáticamente convertidos a pesos argentinos usando la cotización del dólar blue actualizada. Nunca más tenés que actualizar precios por inflación.",
  },
  google_merchant: {
    configTitle: "Google Shopping",
    configDescription:
      "Tus productos aparecen en Google Shopping cuando alguien busca lo que vendés. Llegás a miles de clientes nuevos sin esfuerzo.",
  },
  variantes_custom: {
    configTitle: "Configurar Variantes Personalizadas",
    configDescription:
      "Creá variantes personalizadas para tus productos como: Aromas, Colores, Sabores, Tamaños, etc. Tus clientes podrán elegir entre las opciones que definas.",
  },
  csv_import: {
    configTitle: "Importar Productos desde CSV/Excel",
    configDescription:
      "Cargá todos tus productos de una sola vez usando un archivo CSV o Excel. Ideal para migrar desde otra plataforma o cargar un catalogo grande.",
  },
}

export function PlansManager({ storeId, storeName, subdomain }: PlansManagerProps) {
  const [activeTab, setActiveTab] = useState("cositas")
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [purchasedFeatures, setPurchasedFeatures] = useState<string[]>([])
  const [availableFeatures, setAvailableFeatures] = useState<DbFeature[]>([])
  const [loading, setLoading] = useState(true)
  const [paypalLoaded, setPaypalLoaded] = useState(false)
  const [processingPayment, setProcessingPayment] = useState(false)
  const [paypalRendered, setPaypalRendered] = useState(false)
  const paypalButtonRef = useRef<HTMLDivElement>(null)
  const [exchangeRate, setExchangeRate] = useState(1100)

  // Modal de configuración
  const [configModal, setConfigModal] = useState<string | null>(null)
  const [customDomain, setCustomDomain] = useState("")
  const [videoUrl, setVideoUrl] = useState("")
  const [aiInstructions, setAiInstructions] = useState("")
  const [copied, setCopied] = useState(false)

  const totalUSD = selectedFeatures.reduce((sum, code) => {
    const feature = availableFeatures.find((f) => f.code === code)
    return sum + (feature?.price || 0)
  }, 0)
  const totalARS = totalUSD * exchangeRate

  useEffect(() => {
    const fetchFeatures = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/admin/features?storeId=${storeId}&includeAvailable=true`)
        if (res.ok) {
          const data = await res.json()
          setPurchasedFeatures(data.features || [])
          setAvailableFeatures(data.availableFeatures || [])
          if (data.exchangeRate) {
            setExchangeRate(data.exchangeRate)
          }
        }
      } catch (error) {
        console.error("Error loading features:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchFeatures()
  }, [storeId])

  useEffect(() => {
    if (
      selectedFeatures.length > 0 &&
      paypalLoaded &&
      paypalButtonRef.current &&
      (window as any).paypal &&
      !paypalRendered
    ) {
      paypalButtonRef.current.innerHTML = ""
      ;(window as any).paypal
        .Buttons({
          style: {
            layout: "vertical",
            color: "gold",
            shape: "rect",
            label: "paypal",
            height: 45,
          },
          createOrder: (data: any, actions: any) => {
            const featureNames = selectedFeatures
              .map((code) => availableFeatures.find((f) => f.code === code)?.name)
              .filter(Boolean)
              .join(", ")

            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: totalUSD.toFixed(2),
                    currency_code: "USD",
                  },
                  description: `Suscripción mensual tol.ar: ${featureNames} - Tienda: ${storeName || subdomain}`,
                },
              ],
            })
          },
          onApprove: async (data: any, actions: any) => {
            setProcessingPayment(true)
            try {
              const order = await actions.order.capture()

              const res = await fetch("/api/admin/features/purchase", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  storeId,
                  features: selectedFeatures,
                  paymentMethod: "paypal",
                  paypalOrderId: order.id,
                }),
              })

              if (res.ok) {
                setPurchasedFeatures((prev) => [...prev, ...selectedFeatures])
                setSelectedFeatures([])
                setPaypalRendered(false)
                alert("¡Pago exitoso! Las funcionalidades ya están activas.")
              } else {
                alert("Pago recibido. Contactanos para activar tus funciones.")
              }
            } catch (error) {
              console.error("Error:", error)
              alert("Pago recibido. Contactanos para activar tus funciones.")
            } finally {
              setProcessingPayment(false)
            }
          },
          onError: (err: any) => {
            console.error("PayPal Error:", err)
            alert("Error al procesar el pago. Por favor intentá de nuevo.")
          },
        })
        .render(paypalButtonRef.current)

      setPaypalRendered(true)
    }

    // Reset when features change
    if (selectedFeatures.length === 0) {
      setPaypalRendered(false)
    }
  }, [selectedFeatures, paypalLoaded, availableFeatures, totalUSD, storeId, storeName, subdomain, paypalRendered])

  useEffect(() => {
    if (paypalRendered && paypalButtonRef.current) {
      setPaypalRendered(false)
    }
  }, [selectedFeatures.length])

  const toggleFeature = (code: string) => {
    if (purchasedFeatures.includes(code)) return
    setSelectedFeatures((prev) => (prev.includes(code) ? prev.filter((f) => f !== code) : [...prev, code]))
    setPaypalRendered(false)
  }

  const currentFeature = availableFeatures.find((f) => f.code === configModal)
  const currentConfig = configModal ? FEATURE_CONFIG[configModal] : null

  const getIcon = (iconName: string) => {
    return ICON_MAP[iconName] || Package
  }

  const getPriceARS = (priceUSD: number) => {
    return priceUSD * exchangeRate
  }

  const renderConfigContent = () => {
    if (!configModal) return null

    switch (configModal) {
      case "custom_domain":
        return (
          <div className="space-y-6">
            <div>
              <Label>Tu dominio</Label>
              <Input
                placeholder="mitienda.com"
                value={customDomain}
                onChange={(e) => setCustomDomain(e.target.value)}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">Ingresá el dominio sin "www" ni "https://"</p>
            </div>

            {customDomain && (
              <div className="space-y-4">
                <h4 className="font-medium">Configuración DNS requerida:</h4>
                <p className="text-sm text-muted-foreground">
                  Ingresá a tu proveedor de dominio (GoDaddy, Hostinger, NIC Argentina, etc.) y agregá estos registros:
                </p>

                <div className="bg-slate-50 p-4 rounded-lg space-y-4">
                  <div>
                    <p className="text-xs font-medium text-slate-500 mb-1">Registro CNAME</p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 bg-white p-2 rounded text-sm border">www → cname.vercel-dns.com</code>
                      <Button size="sm" variant="outline" onClick={() => copyToClipboard("cname.vercel-dns.com")}>
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-slate-500 mb-1">Registro A (para dominio raíz)</p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 bg-white p-2 rounded text-sm border">@ → 76.76.21.21</code>
                      <Button size="sm" variant="outline" onClick={() => copyToClipboard("76.76.21.21")}>
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {copied && (
                  <p className="text-sm text-green-600 flex items-center gap-1">
                    <Check className="w-4 h-4" /> Copiado al portapapeles
                  </p>
                )}

                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <p className="text-sm text-amber-800">
                    <strong>Importante:</strong> Los cambios de DNS pueden tardar hasta 48 horas en propagarse.
                  </p>
                </div>

                <Button className="w-full" disabled={!purchasedFeatures.includes("custom_domain")}>
                  {purchasedFeatures.includes("custom_domain") ? "Guardar dominio" : "Activá esta función para guardar"}
                </Button>
              </div>
            )}
          </div>
        )

      case "video_hero":
        return (
          <div className="space-y-6">
            <div>
              <Label>URL del video (YouTube o MP4)</Label>
              <Input
                placeholder="https://www.youtube.com/watch?v=..."
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="mt-1"
              />
            </div>

            <div className="text-center p-6 border-2 border-dashed rounded-lg">
              <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">O arrastrá un archivo de video aquí</p>
              <p className="text-xs text-muted-foreground mt-1">MP4, WebM hasta 50MB</p>
            </div>

            <Button className="w-full" disabled={!purchasedFeatures.includes("video_hero")}>
              {purchasedFeatures.includes("video_hero") ? "Guardar video" : "Activá esta función para guardar"}
            </Button>
          </div>
        )

      case "ai_chat":
        return (
          <div className="space-y-6">
            <div>
              <Label>Instrucciones para la IA</Label>
              <Textarea
                placeholder="Ej: Somos una tienda de ropa femenina. Nuestro horario es de 9 a 18hs..."
                value={aiInstructions}
                onChange={(e) => setAiInstructions(e.target.value)}
                className="mt-1 min-h-[150px]"
              />
            </div>

            <Button className="w-full" disabled={!purchasedFeatures.includes("ai_chat")}>
              {purchasedFeatures.includes("ai_chat") ? "Guardar configuración" : "Activá esta función para guardar"}
            </Button>
          </div>
        )

      case "dolar_peso":
        return (
          <div className="space-y-6">
            <div className="text-center py-8">
              <DollarSign className="w-12 h-12 mx-auto text-green-500 mb-2" />
              <p className="text-muted-foreground">
                {purchasedFeatures.includes(configModal!)
                  ? "Esta función ya está activa"
                  : "Activá esta función para empezar a usarla"}
              </p>
            </div>
          </div>
        )

      case "google_merchant":
        return (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-lg mb-2">¿Qué es Google Shopping?</h4>
              <p className="text-sm text-slate-700 mb-4">
                Google Shopping es la sección de Google donde aparecen productos con foto y precio cuando alguien busca
                algo para comprar. Por ejemplo, si vendés "zapatillas Nike", tu producto puede aparecer ahí.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-center">
                <div className="bg-white p-3 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">+300%</p>
                  <p className="text-xs text-slate-500">más visibilidad</p>
                </div>
                <div className="bg-white p-3 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">Gratis</p>
                  <p className="text-xs text-slate-500">sin costo de publicidad</p>
                </div>
                <div className="bg-white p-3 rounded-lg">
                  <p className="text-2xl font-bold text-amber-600">24/7</p>
                  <p className="text-xs text-slate-500">activo todo el día</p>
                </div>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
              <h5 className="font-semibold text-red-800 flex items-center gap-2 mb-3">
                <AlertCircle className="w-5 h-5" />
                Requisitos de Google (IMPORTANTE)
              </h5>
              <p className="text-sm text-red-700 mb-3">
                Google es muy estricto. Para que aprueben tu tienda necesitás cumplir con esto:
              </p>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-start gap-2 bg-white p-2 rounded-lg">
                  <div className="bg-red-100 p-1 rounded-full mt-0.5">
                    <FileText className="w-3 h-3 text-red-600" />
                  </div>
                  <div>
                    <p className="font-medium text-xs">Política de Devoluciones</p>
                    <p className="text-[10px] text-slate-600">Página con tu política de cambios</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 bg-white p-2 rounded-lg">
                  <div className="bg-red-100 p-1 rounded-full mt-0.5">
                    <Phone className="w-3 h-3 text-red-600" />
                  </div>
                  <div>
                    <p className="font-medium text-xs">Datos de Contacto Reales</p>
                    <p className="text-[10px] text-slate-600">Teléfono, email y dirección física</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 bg-white p-2 rounded-lg">
                  <div className="bg-red-100 p-1 rounded-full mt-0.5">
                    <ImageIcon className="w-3 h-3 text-red-600" />
                  </div>
                  <div>
                    <p className="font-medium text-xs">Fotos con Fondo Blanco</p>
                    <p className="text-[10px] text-slate-600">Sin marcas de agua ni textos</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 bg-white p-2 rounded-lg">
                  <div className="bg-red-100 p-1 rounded-full mt-0.5">
                    <DollarSign className="w-3 h-3 text-red-600" />
                  </div>
                  <div>
                    <p className="font-medium text-xs">Precios y Stock Real</p>
                    <p className="text-[10px] text-slate-600">Deben coincidir con tu tienda</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 bg-white p-2 rounded-lg">
                  <div className="bg-red-100 p-1 rounded-full mt-0.5">
                    <Truck className="w-3 h-3 text-red-600" />
                  </div>
                  <div>
                    <p className="font-medium text-xs">Información de Envío</p>
                    <p className="text-[10px] text-slate-600">Costos claros y tiempos estimados</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 bg-white p-2 rounded-lg">
                  <div className="bg-red-100 p-1 rounded-full mt-0.5">
                    <Shield className="w-3 h-3 text-red-600" />
                  </div>
                  <div>
                    <p className="font-medium text-xs">Política de Privacidad</p>
                    <p className="text-[10px] text-slate-600">Cómo manejás los datos de clientes</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 bg-white p-2 rounded-lg">
                  <div className="bg-red-100 p-1 rounded-full mt-0.5">
                    <CreditCard className="w-3 h-3 text-red-600" />
                  </div>
                  <div>
                    <p className="font-medium text-xs">Métodos de Pago</p>
                    <p className="text-[10px] text-slate-600">Visibles antes del checkout</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-white p-3 rounded-lg">
                  <div className="bg-red-100 p-1.5 rounded-full mt-0.5">
                    <CreditCard className="w-4 h-4 text-red-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Métodos de Pago Claros</p>
                    <p className="text-xs text-slate-600">
                      El cliente debe saber cómo puede pagar antes de llegar al checkout (tarjeta, transferencia, etc.)
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* Fin requisitos de Google */}

            {purchasedFeatures.includes("google_merchant") ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
                  <Check className="w-5 h-5" />
                  <span className="font-medium">Google Shopping está activo</span>
                </div>

                <div>
                  <Label>Tu feed de productos (URL para Google)</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      value={`https://${subdomain}.tol.ar/api/feed/google/${subdomain}`}
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(`https://${subdomain}.tol.ar/api/feed/google/${subdomain}`)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg space-y-3">
                  <h5 className="font-medium">Cómo conectar con Google Merchant Center:</h5>
                  <ol className="text-sm space-y-2 list-decimal list-inside text-slate-700">
                    <li>
                      Andá a{" "}
                      <a
                        href="https://merchants.google.com"
                        target="_blank"
                        rel="noreferrer noopener"
                        className="text-blue-600 underline"
                      >
                        merchants.google.com
                      </a>{" "}
                      y creá una cuenta (es gratis)
                    </li>
                    <li>Verificá tu sitio web ({subdomain}.tol.ar)</li>
                    <li>En "Productos" → "Feeds", hacé clic en "Agregar feed"</li>
                    <li>Elegí "Programado" y pegá la URL de arriba</li>
                    <li>Google importará tus productos automáticamente cada día</li>
                  </ol>
                </div>

                <Button className="w-full bg-transparent" variant="outline" asChild>
                  <a href="https://merchants.google.com" target="_blank" rel="noreferrer noopener">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Ir a Google Merchant Center
                  </a>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <h5 className="font-medium text-amber-800 mb-2">¿Cómo funciona?</h5>
                  <ol className="text-sm space-y-1 list-decimal list-inside text-amber-700">
                    <li>Verificá que cumplís con todos los requisitos de arriba</li>
                    <li>Activás esta función</li>
                    <li>Nosotros generamos automáticamente un "feed" con todos tus productos</li>
                    <li>Conectás ese feed con Google Merchant Center (te guiamos paso a paso)</li>
                    <li>Tus productos empiezan a aparecer en Google Shopping</li>
                  </ol>
                </div>

                <div className="text-center py-4">
                  <ShoppingCart className="w-12 h-12 mx-auto text-slate-300 mb-2" />
                  <p className="text-muted-foreground">Primero cumplí los requisitos, después activá esta función</p>
                </div>
              </div>
            )}
          </div>
        )

      case "variantes_custom":
        return (
          <div className="space-y-4">
            {purchasedFeatures.includes("variantes_custom") ? (
              <CustomVariantsManager storeId={storeId} />
            ) : (
              <div className="py-8 text-center">
                <Palette className="w-12 h-12 mx-auto text-slate-300 mb-2" />
                <p className="text-muted-foreground">Activá esta función para crear variantes personalizadas</p>
                <p className="text-sm text-slate-500 mt-2">
                  Podrás crear opciones como: Aromas, Colores, Sabores, Tamaños, etc.
                </p>
              </div>
            )}
          </div>
        )

      case "csv_import":
        return (
          <div className="space-y-4">
            {purchasedFeatures.includes("csv_import") ? (
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Check className="w-5 h-5 text-green-600" />
                    <h5 className="font-medium text-green-800">Funcion activa</h5>
                  </div>
                  <p className="text-sm text-green-700">
                    Podes importar productos desde la seccion de Productos. Busca el boton "Importar CSV" en la parte superior.
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg border">
                  <h5 className="font-medium mb-2">Formato del archivo</h5>
                  <p className="text-sm text-muted-foreground mb-2">
                    El archivo CSV/Excel debe tener las columnas: nombre, descripcion, precio, precio_anterior (opcional), categoria (opcional), imagen_url (opcional).
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Podes descargar una plantilla de ejemplo desde el boton "Importar CSV" en Productos.
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center">
                <Upload className="w-12 h-12 mx-auto text-slate-300 mb-2" />
                <p className="text-muted-foreground">Activa esta funcion para importar productos masivamente</p>
                <p className="text-sm text-slate-500 mt-2">
                  Subi todos tus productos de una sola vez desde un archivo CSV o Excel. Pago unico de $1 USD.
                </p>
              </div>
            )}
          </div>
        )

      default:
        return (
          <div className="py-8 text-center">
            <Check className="w-12 h-12 mx-auto text-green-500 mb-2" />
            <p className="text-muted-foreground">
              {purchasedFeatures.includes(configModal!)
                ? "Esta funcion ya esta activa"
                : "Activa esta funcion para empezar a usarla"}
            </p>
          </div>
        )
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading && availableFeatures.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Script
        src={`https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD`}
        onLoad={() => setPaypalLoaded(true)}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="cositas">Plan Cositas</TabsTrigger>
          <TabsTrigger value="socio">Plan Socio</TabsTrigger>
          <TabsTrigger value="medida">Plan a Medida</TabsTrigger>
        </TabsList>

        <TabsContent value="cositas" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Columna izquierda: Lista de features */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-violet-500" />
                        Plan Cositas
                      </CardTitle>
                      <CardDescription>
                        Elegí las funcionalidades que necesitás. Pagás solo lo que usás, mensualmente.
                      </CardDescription>
                    </div>
                    <a
                      href="/cositas"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-orange-500 hover:text-orange-600 hover:underline flex items-center gap-1"
                    >
                      Ver detalles
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {availableFeatures.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No hay funcionalidades disponibles en este momento.
                    </p>
                  ) : (
                    <>
                      {/* Features ACTIVAS - las que funcionan */}
                      {availableFeatures
                        .filter((f) => ["multi_images", "whatsapp_chat", "custom_variants", "csv_import"].includes(f.code))
                        .map((feature) => {
                          const IconComponent = ICON_MAP[feature.icon] || Package
                          const isPurchased = purchasedFeatures.includes(feature.code)
                          const isSelected = selectedFeatures.includes(feature.code)
                          const priceARS = getPriceARS(feature.price)

                          return (
                            <div
                              key={feature.code}
                              className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all ${
                                isPurchased
                                  ? "bg-green-50 border-green-300 cursor-default"
                                  : isSelected
                                    ? "bg-violet-50 border-violet-300"
                                    : "hover:bg-slate-50"
                              }`}
                              onClick={() => !isPurchased && toggleFeature(feature.code)}
                            >
                              <Checkbox
                                checked={isPurchased || isSelected}
                                onCheckedChange={() => toggleFeature(feature.code)}
                                disabled={isPurchased}
                                onClick={(e) => e.stopPropagation()}
                                className="h-5 w-5"
                              />
                              <div
                                className={`p-2 rounded-lg ${
                                  isPurchased ? "bg-green-100" : isSelected ? "bg-violet-100" : "bg-slate-100"
                                }`}
                              >
                                <IconComponent
                                  className={`h-5 w-5 ${
                                    isPurchased ? "text-green-600" : isSelected ? "text-violet-600" : "text-slate-600"
                                  }`}
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{feature.name}</span>
                                  {isPurchased && <Badge className="bg-green-500 text-white text-xs">Activo</Badge>}
                                </div>
                                <p className="text-sm text-muted-foreground truncate">{feature.description}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-lg">${priceARS.toLocaleString("es-AR")}</p>
                                <p className="text-xs text-muted-foreground">/mes</p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setConfigModal(feature.code)
                                }}
                              >
                                <Info className="h-4 w-4" />
                              </Button>
                            </div>
                          )
                        })}
                      
                      {/* Separador */}
                      {availableFeatures.filter((f) => !["multi_images", "whatsapp_chat", "custom_variants", "csv_import"].includes(f.code)).length > 0 && (
                        <div className="pt-4 mt-4 border-t">
                          <p className="text-sm font-medium text-slate-500 mb-3">Proximamente</p>
                        </div>
                      )}
                      
                      {/* Features PROXIMAMENTE - las que aun no funcionan */}
                      {availableFeatures
                        .filter((f) => !["multi_images", "whatsapp_chat", "custom_variants", "csv_import"].includes(f.code))
                        .map((feature) => {
                          const IconComponent = ICON_MAP[feature.icon] || Package

                          return (
                            <div
                              key={feature.code}
                              className="flex items-center gap-4 p-4 rounded-lg border border-slate-200 bg-slate-50 opacity-60 cursor-not-allowed"
                            >
                              <div className="p-2 rounded-lg bg-slate-200">
                                <IconComponent className="h-5 w-5 text-slate-400" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-slate-500">{feature.name}</span>
                                  <Badge variant="outline" className="text-slate-400 border-slate-300 text-xs">
                                    Pronto
                                  </Badge>
                                </div>
                                <p className="text-sm text-slate-400 truncate">{feature.description}</p>
                              </div>
                            </div>
                          )
                        })}
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Columna derecha: Resumen y pago */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <ShoppingCart className="w-5 h-5" />
                    Tu selección
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedFeatures.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">
                      <ShoppingCart className="w-10 h-10 mx-auto mb-2 opacity-30" />
                      <p className="text-sm">Seleccioná las cositas que necesitás</p>
                    </div>
                  ) : (
                    <>
                      {/* Lista de seleccionados */}
                      <div className="space-y-2">
                        {selectedFeatures.map((code) => {
                          const feature = availableFeatures.find((f) => f.code === code)
                          if (!feature) return null
                          const priceARS = getPriceARS(feature.price)
                          return (
                            <div key={code} className="flex justify-between text-sm">
                              <span>{feature.name}</span>
                              <span className="font-medium">${priceARS.toLocaleString("es-AR")}</span>
                            </div>
                          )
                        })}
                      </div>

                      <div className="border-t pt-4">
                        <div className="flex justify-between font-bold text-lg">
                          <span>Total mensual:</span>
                          <span>${totalARS.toLocaleString("es-AR")}</span>
                        </div>
                        <p className="text-xs text-muted-foreground text-right mt-1">
                          ≈ USD ${totalUSD.toFixed(2)}/mes
                        </p>
                      </div>

                      {/* Opciones de pago */}
                      <div className="pt-4 space-y-3">
                        <p className="text-sm font-medium text-center">Elegí como pagar:</p>
                        
                        {/* MercadoPago */}
                        <div className="border rounded-lg p-3 hover:border-blue-400 transition-colors">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-[#00b1ea] rounded flex items-center justify-center">
                                <span className="text-white font-bold text-xs">MP</span>
                              </div>
                              <div>
                                <p className="font-medium text-sm">MercadoPago</p>
                                <p className="text-[10px] text-muted-foreground">Comision: 4.5% + IVA</p>
                              </div>
                            </div>
                            <Badge variant="outline" className="text-[10px] border-green-300 text-green-600">Pesos ARS</Badge>
                          </div>
                          <Button 
                            className="w-full bg-[#00b1ea] hover:bg-[#0095c8] text-white"
                            disabled={processingPayment}
                            onClick={async () => {
                              setProcessingPayment(true)
                              try {
                                // Preparar datos de las features seleccionadas
                                const featuresToPurchase = availableFeatures
                                  .filter(f => selectedFeatures.includes(f.code))
                                  .map(f => ({ code: f.code, name: f.name, price: f.price }))
                                
                                const res = await fetch("/api/tolar/mercadopago/create-preference", {
                                  method: "POST",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({
                                    storeId,
                                    features: featuresToPurchase,
                                    totalARS,
                                  }),
                                })
                                
                                const data = await res.json()
                                
                                if (!res.ok) {
                                  alert(data.error || "Error al crear el pago")
                                  return
                                }
                                
                                // Redirigir a MercadoPago
                                window.location.href = data.initPoint
                              } catch (error) {
                                console.error("Error:", error)
                                alert("Error al procesar el pago")
                              } finally {
                                setProcessingPayment(false)
                              }
                            }}
                          >
                            {processingPayment ? (
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : null}
                            Pagar ${totalARS.toLocaleString("es-AR")} ARS
                          </Button>
                        </div>
                        
                        {/* PayPal */}
                        <div className="border rounded-lg p-3 hover:border-yellow-400 transition-colors">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-[#003087] rounded flex items-center justify-center">
                                <span className="text-white font-bold text-xs">PP</span>
                              </div>
                              <div>
                                <p className="font-medium text-sm">PayPal</p>
                                <p className="text-[10px] text-muted-foreground">Comision: 5.4% + $0.30 USD</p>
                              </div>
                            </div>
                            <Badge variant="outline" className="text-[10px] border-blue-300 text-blue-600">Dolares USD</Badge>
                          </div>
                          <div ref={paypalButtonRef} className="min-h-[45px]" />
                          {!paypalLoaded && (
                            <div className="flex items-center justify-center py-2">
                              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        
                        {processingPayment && (
                          <div className="flex items-center justify-center gap-2 py-4 bg-slate-50 rounded-lg">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span className="text-sm">Procesando pago...</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-2">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Pagos 100% seguros</span>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="socio" className="mt-6">
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Plan Socio</CardTitle>
              <CardDescription>
                Sin mensualidad fija. Pagás el 10% de tus ventas y nosotros invertimos en publicidad para tu tienda.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <p className="text-3xl font-bold text-amber-600">10%</p>
                  <p className="text-sm text-muted-foreground">de tus ventas</p>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <p className="text-3xl font-bold text-amber-600">$0</p>
                  <p className="text-sm text-muted-foreground">mensualidad fija</p>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <p className="text-3xl font-bold text-amber-600">100%</p>
                  <p className="text-sm text-muted-foreground">cositas incluidas</p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Incluye todo:</h4>
                {availableFeatures.map((feature) => (
                  <div key={feature.code} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>{feature.name}</span>
                  </div>
                ))}
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Publicidad paga en redes sociales</span>
                </div>
              </div>

              <Button className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700">
                Solicitar Plan Socio
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medida" className="mt-6">
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-slate-600 to-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Plan a Medida</CardTitle>
              <CardDescription>
                Agendá una videollamada con nuestro equipo para crear una solución personalizada para tu negocio.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <h4 className="font-medium">¿Qué incluye?</h4>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Consultoría personalizada</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Diseño exclusivo para tu tienda</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Integraciones especiales</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Soporte dedicado</span>
                </div>
              </div>

              <Button className="w-full">
                Agendar Videollamada
                <Calendar className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal de configuración */}
      <Dialog open={!!configModal} onOpenChange={() => setConfigModal(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{currentConfig?.configTitle || "Configuración"}</DialogTitle>
            <DialogDescription>{currentConfig?.configDescription}</DialogDescription>
          </DialogHeader>
          {renderConfigContent()}
        </DialogContent>
      </Dialog>
    </div>
  )
}
