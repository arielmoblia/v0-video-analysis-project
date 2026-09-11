"use client"
import { CositasCheckout } from "@/components/cositas-checkout"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Script from "next/script"
import Image from "next/image"
import {
  BarChart3,
  Video,
  MessageSquare,
  EyeOff,
  Globe,
  Package,
  Headphones,
  Check,
  Loader2,
  Copy,
  Upload,
  DollarSign,
  Sparkles,
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
  Crown,
  Lock,
  Eye,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import CustomVariantsManager from "./custom-variants-manager" // Import CustomVariantsManager
import { DolarManager } from "./dolar-manager"

const PAYPAL_CLIENT_ID = "ASYvylVa8L7Qf57IKodIEIYd6BalypfW9TGuFkanCnaCR55rP-B-XRemN1FcVLcx0Aii2DIKDtr68RSA"

interface PlansManagerProps {
  storeId: string
  storeName?: string
  subdomain?: string
  initialCustomDomain?: string | null
  initialLinkedStoreUrl?: string | null
  initialLinkedStoreLabel?: string | null
  initialActiveTheme?: string | null
  initialCustomThemeRequest?: { url: string; status: string; requested_at: string } | null
  activeTab?: string
  onActiveTabChange?: (tab: string) => void
  onGoToProducts?: () => void
}

const pageDesigns = [
  {
    id: "moderno",
    name: "Moderno",
    subtitle: "Inspirado en Saleor",
    description: "Diseño moderno con grillas amplias y tarjetas redondeadas, ideal para marcas actuales.",
    image: "/images/templates/moderno-saleor-store.jpg",
    previewUrl: "/disenio-preview/moderno",
    comingSoon: false,
  },
  {
    id: "elegante",
    name: "Elegante",
    subtitle: "Diseño premium",
    description: "Franja superior, categorías circulares y hero a todo el ancho, ideal para marcas premium.",
    image: "/images/templates/elegant-fashion-lifestyle-photography.jpg",
    imagePosition: "object-center",
    previewUrl: "/disenio-preview/elegante",
    comingSoon: false,
  },
  {
    id: "luxury",
    name: "Luxury",
    subtitle: "Diseño premium",
    description: "Estilo elegante y sofisticado para marcas de alta gama.",
    image: "/images/templates/luxury-elegant-store-dark-gold.jpg",
    previewUrl: "#",
    comingSoon: true,
  },
  {
    id: "minimal",
    name: "Minimal",
    subtitle: "Diseño minimalista",
    description: "Líneas limpias y espacios amplios para destacar tus productos.",
    image: "/images/templates/minimal-clean-white-store-modern.jpg",
    previewUrl: "#",
    comingSoon: true,
  },
  {
    id: "bold",
    name: "Bold",
    subtitle: "Diseño audaz",
    description: "Colores vibrantes rosa y verde, tarjetas redondeadas y botones en pastilla, ideal para marcas jóvenes.",
    image: "/images/templates/bold-colorful-vibrant-store-young.jpg",
    imagePosition: "object-center",
    previewUrl: "/disenio-preview/bold",
    comingSoon: false,
  },
  {
    id: "blingg",
    name: "Blingg",
    subtitle: "Estilo joyería premium",
    description: "Paleta celeste, gris y verde con tipografía Roboto Slab, ideal para joyerías y accesorios.",
    image: "/images/templates/blingg-jewelry-store.jpg",
    imagePosition: "object-center",
    previewUrl: "/disenio-preview/blingg",
    comingSoon: false,
  },
  {
    id: "artesano",
    name: "Artesano",
    subtitle: "Estilo mueblería premium",
    description: "Hero grande, franja de logos, categorías, destacados y banner de beneficios, ideal para muebles y deco.",
    image: "/images/templates/artesano-furniture-store.jpg",
    imagePosition: "object-center",
    previewUrl: "/disenio-preview/artesano",
    comingSoon: false,
  },
  {
    id: "vintage",
    name: "Vintage",
    subtitle: "Diseño retro",
    description: "Estética clásica con toques nostálgicos para productos artesanales.",
    image: "/images/templates/vintage-retro-store-classic-artisan.jpg",
    previewUrl: "#",
    comingSoon: true,
  },
  {
    id: "nuevo_propio",
    name: "Nuevo / Propio",
    subtitle: "Creá tu propio modelo",
    description: "Pegá el link de una tienda que te gusta y armamos un modelo nuevo con ese estilo, usando tus productos y fotos reales.",
    image: "",
    previewUrl: "#",
    comingSoon: false,
    isCustom: true,
  },
]

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
  Truck,
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
  dropshipping: {
    configTitle: "Configurar Dropshipping",
    configDescription:
      "Tu tienda importa automáticamente los productos, precios y stock de una tienda madre. Vos elegís el margen de ganancia y sincronizás cuando quieras.",
  },
  mayorista_minorista: {
    configTitle: "Configurar Mayorista / Minorista",
    configDescription:
      "Poné la dirección de tu otra tienda (la mayorista o la minorista) y va a aparecer un botón en el encabezado de tu tienda que lleva directo a ella.",
  },
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://tol.ar"

const LEER_MAS_URLS: Record<string, string> = {
  dolar_peso: `${APP_URL}/plan-cositas/dolar-peso`,
  lupa: `${APP_URL}/plan-cositas/lupa`,
  dropshipping: `${APP_URL}/plan-cositas/dropshipping`,
  mayorista_minorista: `${APP_URL}/plan-cositas/mayorista-minorista`,
}

const getLeerMasUrl = (code: string) => LEER_MAS_URLS[code] || `${APP_URL}/cositas#${code}`

export function PlansManager({ storeId, storeName, subdomain, initialCustomDomain, initialLinkedStoreUrl, initialLinkedStoreLabel, initialActiveTheme, initialCustomThemeRequest, activeTab: controlledActiveTab, onActiveTabChange, onGoToProducts }: PlansManagerProps) {
  const [internalActiveTab, setInternalActiveTab] = useState("cositas")
  const activeTab = controlledActiveTab ?? internalActiveTab
  const setActiveTab = onActiveTabChange ?? setInternalActiveTab
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [purchasedFeatures, setPurchasedFeatures] = useState<string[]>([])
  const [purchasedDetails, setPurchasedDetails] = useState<any[]>([])
  const [availableFeatures, setAvailableFeatures] = useState<DbFeature[]>([])
  const [loading, setLoading] = useState(true)
  const [paypalLoaded, setPaypalLoaded] = useState(false)
  const [processingPayment, setProcessingPayment] = useState(false)
  const [paypalRendered, setPaypalRendered] = useState(false)
  const paypalButtonRef = useRef<HTMLDivElement>(null)
  const [exchangeRate, setExchangeRate] = useState(1400)

  // Modal de configuración
  const [configModal, setConfigModal] = useState<string | null>(null)
  const [trialModal, setTrialModal] = useState<{name: string, days: number} | null>(null)
  const [customDomain, setCustomDomain] = useState(initialCustomDomain || "")
  const [savingDomain, setSavingDomain] = useState(false)
  const [domainSaved, setDomainSaved] = useState(false)
  const [linkedStoreUrl, setLinkedStoreUrl] = useState(initialLinkedStoreUrl || "")
  const [linkedStoreLabel, setLinkedStoreLabel] = useState(initialLinkedStoreLabel || "")
  const [savingLinkedStore, setSavingLinkedStore] = useState(false)
  const [linkedStoreSaved, setLinkedStoreSaved] = useState(false)
  const [activeTheme, setActiveTheme] = useState(initialActiveTheme || "")
  const [savingTheme, setSavingTheme] = useState(false)
  const [previewDesign, setPreviewDesign] = useState<(typeof pageDesigns)[number] | null>(null)
  const [expandedFeatures, setExpandedFeatures] = useState<Set<string>>(new Set())
  const [customThemeRequest, setCustomThemeRequest] = useState<{ url: string; status: string; requested_at: string } | null>(
    initialCustomThemeRequest || null,
  )
  const [customUrlDialogOpen, setCustomUrlDialogOpen] = useState(false)
  const [customUrl, setCustomUrl] = useState("")
  const [customUrlError, setCustomUrlError] = useState("")
  const [submittingCustomUrl, setSubmittingCustomUrl] = useState(false)

  const toggleExpanded = (code: string) => {
    setExpandedFeatures((prev) => {
      const next = new Set(prev)
      if (next.has(code)) next.delete(code)
      else next.add(code)
      return next
    })
  }
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
          setPurchasedDetails(data.purchasedDetails || [])
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

  const handleSaveDomain = async () => {
    setSavingDomain(true)
    setDomainSaved(false)
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storeId, custom_domain: customDomain.trim() }),
      })
      if (res.ok) setDomainSaved(true)
    } finally {
      setSavingDomain(false)
    }
  }

  const handleSaveLinkedStore = async () => {
    setSavingLinkedStore(true)
    setLinkedStoreSaved(false)
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeId,
          linked_store_url: linkedStoreUrl.trim(),
          linked_store_label: linkedStoreLabel.trim(),
        }),
      })
      if (res.ok) setLinkedStoreSaved(true)
    } finally {
      setSavingLinkedStore(false)
    }
  }

  const handleChooseTheme = async (themeId: string) => {
    const next = activeTheme === themeId ? "" : themeId
    setSavingTheme(true)
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storeId, active_theme: next || null }),
      })
      if (res.ok) setActiveTheme(next)
    } finally {
      setSavingTheme(false)
    }
  }

  const handleSubmitCustomUrl = async () => {
    setCustomUrlError("")
    let normalized = customUrl.trim()
    if (normalized && !/^https?:\/\//i.test(normalized)) {
      normalized = `https://${normalized}`
    }
    try {
      // eslint-disable-next-line no-new
      new URL(normalized)
    } catch {
      setCustomUrlError("Pegá un link válido, ej: https://ejemplo.com")
      return
    }

    setSubmittingCustomUrl(true)
    try {
      const res = await fetch("/api/admin/theme-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storeId, url: normalized }),
      })
      const data = await res.json()
      if (!res.ok) {
        setCustomUrlError(data.error || "No se pudo enviar el pedido")
        return
      }
      setCustomThemeRequest(data.custom_theme_request)
      setCustomUrlDialogOpen(false)
      setCustomUrl("")
    } catch {
      setCustomUrlError("No se pudo enviar el pedido, probá de nuevo")
    } finally {
      setSubmittingCustomUrl(false)
    }
  }

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

  const startTrial = async (feature: any) => {
    if (!feature.trial_days || feature.trial_days === 0) return
    const trialEnd = new Date()
    trialEnd.setDate(trialEnd.getDate() + feature.trial_days)
    const res = await fetch("/api/admin/trial", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        storeId,
        featureCode: feature.code,
        trialDays: feature.trial_days,
        trialEndsAt: trialEnd.toISOString()
      })
    })
    if (res.ok) {
      setTrialModal({ name: feature.name, days: feature.trial_days })
      window.location.reload()
    }
  }

  const toggleFeature = (code: string) => {
    const detail = purchasedDetails.find((d: any) => d.feature_code === code)
    const isTrialOnly = detail?.is_trial && detail?.trial_ends_at && new Date(detail.trial_ends_at).getTime() > Date.now()
    if (purchasedFeatures.includes(code) && !isTrialOnly) return
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
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 space-y-2">
                  <p className="text-sm text-blue-900 font-semibold">Para conectarlo, cargá este registro DNS:</p>
                  <div className="bg-white rounded border border-blue-200 p-3 text-sm font-mono text-gray-800">
                    Tipo: A &nbsp;·&nbsp; Nombre: @ (o www) &nbsp;·&nbsp; Valor: 157.173.212.229
                  </div>
                  <p className="text-sm text-blue-800">
                    Esta función es solo para dominios comprados directo en nic.ar. Podés ver el paso a paso completo
                    en{" "}
                    <a href="/blog/dominio-propio" target="_blank" rel="noopener noreferrer" className="underline font-medium">
                      esta guía
                    </a>
                    . Una vez que el DNS esté apuntando bien, activamos el certificado de seguridad (HTTPS) a mano —
                    puede tardar hasta 24-48hs.
                  </p>
                </div>

                <Button
                  className="w-full"
                  disabled={!purchasedFeatures.includes("custom_domain") || savingDomain || !customDomain.trim()}
                  onClick={handleSaveDomain}
                >
                  {!purchasedFeatures.includes("custom_domain")
                    ? "Activá esta función para guardar"
                    : savingDomain
                      ? "Guardando..."
                      : "Guardar dominio"}
                </Button>
                {domainSaved && (
                  <p className="text-sm text-green-600 flex items-center gap-1">
                    <Check className="w-4 h-4" /> Dominio guardado. Cargá el registro DNS y avisanos — activamos el
                    certificado y tu tienda queda funcionando con tu dominio.
                  </p>
                )}
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
              <a
                href={`${APP_URL}/plan-cositas/dolar-peso`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 text-sm text-blue-600 hover:underline"
              >
                Leer más →
              </a>
            </div>
          </div>
        )

      case "mayorista_minorista":
        return (
          <div className="space-y-6">
            <div>
              <Label>Link de tu otra tienda</Label>
              <Input
                placeholder="https://tutiendamayorista.tol.ar"
                value={linkedStoreUrl}
                onChange={(e) => setLinkedStoreUrl(e.target.value)}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Pegá la dirección completa de tu otra tienda (la mayorista o la minorista, según corresponda)
              </p>
            </div>

            <div>
              <Label>Texto del botón</Label>
              <Input
                placeholder="Ej: Venta mayorista"
                value={linkedStoreLabel}
                onChange={(e) => setLinkedStoreLabel(e.target.value)}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Así se va a ver el botón en el encabezado de tu tienda
              </p>
            </div>

            <Button
              className="w-full"
              disabled={
                !purchasedFeatures.includes("mayorista_minorista") ||
                savingLinkedStore ||
                !linkedStoreUrl.trim() ||
                !linkedStoreLabel.trim()
              }
              onClick={handleSaveLinkedStore}
            >
              {!purchasedFeatures.includes("mayorista_minorista")
                ? "Activá esta función para guardar"
                : savingLinkedStore
                  ? "Guardando..."
                  : "Guardar"}
            </Button>
            {linkedStoreSaved && (
              <p className="text-sm text-green-600 flex items-center gap-1">
                <Check className="w-4 h-4" /> Guardado. Ya podés ver el botón en el encabezado de tu tienda.
              </p>
            )}
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
                      href={`${APP_URL}/cositas`}
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
                    <p className="text-center text-muted-foreground py-8">No hay funcionalidades disponibles.</p>
                  ) : (
                    <div className="space-y-5">

                      {/* BLOQUE VERDE: activos (pagados + en prueba) */}
                      {availableFeatures.filter(f => f.is_active && purchasedFeatures.includes(f.code)).length > 0 && (
                        <div className="rounded-xl overflow-hidden border-2 border-green-300">
                          <div className="bg-green-100 px-4 py-2.5 flex items-center gap-2 border-b border-green-200">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span className="text-sm font-medium text-green-800">Tus cositas activas</span>
                          </div>
                          {availableFeatures.filter(f => f.is_active && purchasedFeatures.includes(f.code)).map(feature => {
                            const IconComponent = ICON_MAP[feature.icon] || Package
                            const detail = purchasedDetails.find((d: any) => d.feature_code === feature.code)
                            const isTrial = detail?.is_trial && detail?.trial_ends_at
                            const daysLeft = isTrial ? Math.ceil((new Date(detail.trial_ends_at).getTime() - Date.now()) / 86400000) : 0
                            const totalDays = feature.trial_days || 7
                            const priceARS = getPriceARS(feature.price)
                            return (
                              <div key={feature.code} className="bg-green-50 border-b border-green-100 last:border-b-0">
                                <div className="flex items-center gap-3 px-4 py-3">
                                  <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                                    <IconComponent className="h-4 w-4 text-green-700" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-green-900 text-sm">{feature.name}</p>
                                    {isTrial && daysLeft > 0 ? (
                                      <div className="flex items-center gap-2 mt-1">
                                        <div className="flex-1 h-1.5 bg-green-200 rounded-full overflow-hidden max-w-24">
                                          <div className="h-full bg-orange-400 rounded-full" style={{width: `${Math.max(5,(daysLeft/totalDays)*100)}%`}}></div>
                                        </div>
                                        <span className="text-xs text-orange-600">{daysLeft} días restantes</span>
                                      </div>
                                    ) : (
                                      <p className="text-xs text-green-600">✓ Pagado</p>
                                    )}
                                  </div>
                                  {isTrial && daysLeft > 0 ? (
                                    <button onClick={() => toggleFeature(feature.code)} className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-green-700">Comprar</button>
                                  ) : (
                                    <span className="text-sm font-medium text-green-700">${priceARS.toLocaleString("es-AR")}/mes</span>
                                  )}
                                  <a
                                    href={getLeerMasUrl(feature.code)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="text-xs text-green-700 hover:text-green-800 hover:underline whitespace-nowrap flex-shrink-0"
                                  >
                                    Leer más →
                                  </a>
                                  <button
                                    type="button"
                                    onClick={() => toggleExpanded(feature.code)}
                                    className="flex-shrink-0 w-7 h-7 rounded-lg bg-green-100 hover:bg-green-200 flex items-center justify-center text-green-700"
                                    aria-label={expandedFeatures.has(feature.code) ? "Cerrar" : "Abrir"}
                                  >
                                    {expandedFeatures.has(feature.code) ? (
                                      <ChevronUp className="h-4 w-4" />
                                    ) : (
                                      <ChevronDown className="h-4 w-4" />
                                    )}
                                  </button>
                                </div>
                                {expandedFeatures.has(feature.code) && feature.code === "modelos_templates" && (
                                  <div className="px-4 pb-4 pt-1">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                      {pageDesigns.map((design) =>
                                        design.isCustom ? (
                                          <div
                                            key={design.id}
                                            className="relative border-2 border-dashed rounded-xl p-2 transition-all text-left bg-white border-violet-300"
                                          >
                                            <div className="h-20 rounded-lg mb-2 bg-violet-50 flex items-center justify-center text-violet-400 text-2xl font-bold">
                                              +
                                            </div>
                                            <p className="text-xs font-medium mb-0.5">{design.name}</p>
                                            <p className="text-[9px] text-muted-foreground leading-tight mb-2">{design.subtitle}</p>
                                            {customThemeRequest?.status === "pendiente" ? (
                                              <p className="text-[9px] text-violet-600 font-medium text-center py-1.5">Lo estamos armando…</p>
                                            ) : customThemeRequest?.status === "listo" ? (
                                              <p className="text-[9px] text-green-600 font-medium text-center py-1.5">¡Listo! Ya está en tu lista</p>
                                            ) : (
                                              <button
                                                type="button"
                                                onClick={() => setCustomUrlDialogOpen(true)}
                                                className="w-full text-xs py-1.5 rounded-lg font-medium bg-violet-500 hover:bg-violet-600 text-white"
                                              >
                                                Crear desde un link
                                              </button>
                                            )}
                                          </div>
                                        ) : design.comingSoon ? (
                                          <div
                                            key={design.id}
                                            className="relative border-2 rounded-xl p-2 transition-all text-left border-border opacity-60 cursor-not-allowed bg-white"
                                          >
                                            <Badge className="absolute -top-2 -right-2 text-[10px] px-1.5 py-0.5 bg-amber-500">
                                              Pronto
                                            </Badge>
                                            <div className="relative h-20 rounded-lg overflow-hidden mb-2 bg-muted">
                                              <Image
                                                src={design.image || "/images/placeholders/placeholder.svg"}
                                                alt={design.name}
                                                fill
                                                className="object-cover grayscale"
                                                sizes="150px"
                                                loading="lazy"
                                              />
                                              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                                <Lock className="h-4 w-4 text-white" />
                                              </div>
                                            </div>
                                            <div className="flex items-center gap-1 mb-0.5">
                                              <Crown className="h-3 w-3 text-amber-500" />
                                              <span className="text-xs font-medium">{design.name}</span>
                                            </div>
                                            <p className="text-[9px] text-muted-foreground leading-tight">{design.subtitle}</p>
                                          </div>
                                        ) : (
                                          <div
                                            key={design.id}
                                            className={`relative border-2 rounded-xl p-2 transition-all text-left bg-white ${
                                              activeTheme === design.id ? "border-violet-500 ring-2 ring-violet-200" : "border-border hover:border-violet-300"
                                            }`}
                                          >
                                            {activeTheme === design.id && (
                                              <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center z-10">
                                                <Check className="h-3 w-3 text-white" />
                                              </div>
                                            )}
                                            <button
                                              type="button"
                                              onClick={() => setPreviewDesign(design)}
                                              className="relative h-20 w-full rounded-lg overflow-hidden mb-2 bg-muted group block"
                                            >
                                              <Image
                                                src={design.image || "/images/placeholders/placeholder.svg"}
                                                alt={design.name}
                                                fill
                                                className={`object-cover ${design.imagePosition || "object-top"}`}
                                                sizes="150px"
                                                loading="lazy"
                                              />
                                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                                                <span className="hidden group-hover:flex items-center gap-1 text-white text-[10px] font-medium">
                                                  <Eye className="h-3 w-3" />
                                                  Ver demo
                                                </span>
                                              </div>
                                            </button>
                                            <p className="text-xs font-medium mb-0.5">{design.name}</p>
                                            <p className="text-[9px] text-muted-foreground leading-tight mb-2">{design.subtitle}</p>
                                            <button
                                              type="button"
                                              disabled={savingTheme}
                                              onClick={() => handleChooseTheme(design.id)}
                                              className={`w-full text-xs py-1.5 rounded-lg font-medium transition-colors ${
                                                activeTheme === design.id
                                                  ? "bg-violet-100 text-violet-700"
                                                  : "bg-violet-500 hover:bg-violet-600 text-white"
                                              }`}
                                            >
                                              {activeTheme === design.id ? "Elegido" : "Elegir"}
                                            </button>
                                          </div>
                                        ),
                                      )}
                                    </div>
                                  </div>
                                )}
                                {expandedFeatures.has(feature.code) && feature.code === "dolar_peso" && (
                                  <div className="px-4 pb-4 pt-1">
                                    <DolarManager storeId={storeId} />
                                  </div>
                                )}
                                {expandedFeatures.has(feature.code) && feature.code === "mayorista_minorista" && (
                                  <div className="px-4 pb-4 pt-1 space-y-3">
                                    <div>
                                      <Label className="text-xs text-green-900">Link de tu otra tienda</Label>
                                      <Input
                                        placeholder="https://tutiendamayorista.tol.ar"
                                        value={linkedStoreUrl}
                                        onChange={(e) => setLinkedStoreUrl(e.target.value)}
                                        className="mt-1 bg-white"
                                      />
                                    </div>
                                    <div>
                                      <Label className="text-xs text-green-900">Texto del botón</Label>
                                      <Input
                                        placeholder="Ej: Venta mayorista"
                                        value={linkedStoreLabel}
                                        onChange={(e) => setLinkedStoreLabel(e.target.value)}
                                        className="mt-1 bg-white"
                                      />
                                      <p className="text-xs text-green-700 mt-1">
                                        Así se va a ver el botón en el encabezado de tu tienda
                                      </p>
                                    </div>
                                    <Button
                                      size="sm"
                                      disabled={savingLinkedStore || !linkedStoreUrl.trim() || !linkedStoreLabel.trim()}
                                      onClick={handleSaveLinkedStore}
                                    >
                                      {savingLinkedStore ? "Guardando..." : "Guardar"}
                                    </Button>
                                    {linkedStoreSaved && (
                                      <p className="text-xs text-green-700 flex items-center gap-1">
                                        <Check className="w-3.5 h-3.5" /> Guardado. Ya podés ver el botón en el encabezado de tu tienda.
                                      </p>
                                    )}
                                  </div>
                                )}
                                {expandedFeatures.has(feature.code) && feature.code === "multi_images" && (
                                  <div className="px-4 pb-4 pt-1 space-y-2">
                                    <p className="text-xs text-green-700">{feature.description}</p>
                                    <Button size="sm" onClick={onGoToProducts}>
                                      Ir a Productos <ArrowRight className="h-3.5 w-3.5 ml-1" />
                                    </Button>
                                  </div>
                                )}
                                {expandedFeatures.has(feature.code) &&
                                  feature.code !== "modelos_templates" &&
                                  feature.code !== "mayorista_minorista" &&
                                  feature.code !== "multi_images" &&
                                  feature.code !== "dolar_peso" && (
                                    <div className="px-4 pb-4 pt-1">
                                      <p className="text-xs text-green-700">{feature.description}</p>
                                    </div>
                                  )}
                              </div>
                            )
                          })}
                        </div>
                      )}

                      {/* BLOQUE NARANJA: disponibles no compradas */}
                      {availableFeatures.filter(f => f.is_active && !purchasedFeatures.includes(f.code)).length > 0 && (
                        <div className="rounded-xl overflow-hidden border-2 border-orange-300">
                          <div className="bg-orange-100 px-4 py-2.5 flex items-center gap-2 border-b border-orange-200">
                            <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                            <span className="text-sm font-medium text-orange-800">Disponibles — probá gratis o comprá</span>
                          </div>
                          {availableFeatures.filter(f => f.is_active && !purchasedFeatures.includes(f.code)).map(feature => {
                            const IconComponent = ICON_MAP[feature.icon] || Package
                            const hasTrial = (feature.trial_days || 0) > 0
                            const priceARS = getPriceARS(feature.price)
                            const isSelected = selectedFeatures.includes(feature.code)
                            return (
                              <div key={feature.code} className="flex items-center gap-3 px-4 py-3 bg-orange-50 border-b border-orange-100 last:border-b-0">
                                <div className="w-9 h-9 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                                  <IconComponent className="h-4 w-4 text-orange-700" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-orange-900 text-sm">{feature.name}</p>
                                  <p className="text-xs text-orange-600 truncate">{feature.description}</p>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  {hasTrial && (
                                    <button onClick={() => startTrial(feature)} className="text-xs bg-orange-500 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-orange-600 whitespace-nowrap">
                                      Probar {feature.trial_days} días
                                    </button>
                                  )}
                                  <button
                                    onClick={() => toggleFeature(feature.code)}
                                    className={`text-xs px-3 py-1.5 rounded-lg font-medium border whitespace-nowrap ${isSelected ? "bg-orange-500 text-white border-orange-500" : "bg-white text-orange-600 border-orange-400 hover:bg-orange-50"}`}
                                  >
                                    {isSelected ? "Seleccionado" : "Comprar"}
                                  </button>
                                </div>
                                <a
                                  href={getLeerMasUrl(feature.code)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="text-xs text-orange-600 hover:text-orange-700 hover:underline whitespace-nowrap flex-shrink-0"
                                >
                                  Leer más →
                                </a>
                              </div>
                            )
                          })}
                        </div>
                      )}

                      {/* BLOQUE GRIS: proximamente */}
                      {availableFeatures.filter(f => !f.is_active).length > 0 && (
                        <div className="rounded-xl overflow-hidden border border-slate-200 opacity-60">
                          <div className="bg-slate-100 px-4 py-2.5 flex items-center gap-2 border-b border-slate-200">
                            <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                            <span className="text-sm font-medium text-slate-500">Próximamente</span>
                          </div>
                          {availableFeatures.filter(f => !f.is_active).map(feature => {
                            const IconComponent = ICON_MAP[feature.icon] || Package
                            return (
                              <div key={feature.code} className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 last:border-b-0 cursor-not-allowed">
                                <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                                  <IconComponent className="h-4 w-4 text-slate-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-slate-400 text-sm">{feature.name}</p>
                                  <p className="text-xs text-slate-400 truncate">{feature.description}</p>
                                </div>
                                <span className="text-xs text-slate-400 border border-slate-200 px-3 py-1 rounded-full flex-shrink-0">Pronto</span>
                              </div>
                            )
                          })}
                        </div>
                      )}

                    </div>
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
                        
                        {/* Stripe - VISA 0% */}
                        <div className="border-2 border-orange-400 rounded-lg p-3 bg-orange-50 relative">
                          <div className="absolute -top-2.5 left-3 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">RECOMENDADO</div>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-slate-800 rounded flex items-center justify-center">
                                <span className="text-white font-bold text-xs">VISA</span>
                              </div>
                              <div>
                                <p className="font-medium text-sm">Tarjeta de crédito / débito</p>
                                <p className="text-[10px] text-green-600 font-semibold">0% comisión para vos</p>
                              </div>
                            </div>
                            <Badge variant="outline" className="text-[10px] border-orange-300 text-orange-600">Dolares USD</Badge>
                          </div>
                          <CositasCheckout
                            selectedCositas={selectedFeatures}
                            total={totalARS}
                            hasPercentItem={false}
                            storeId={storeId}
                          />
                        </div>

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

        <TabsContent value="modelos" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-violet-500" />
                Modelos para tu primera página
              </CardTitle>
              <CardDescription>
                Elegí el diseño de tu página principal (index). El resto del panel sigue igual, esto solo cambia cómo se ve la portada.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {pageDesigns.map((design) =>
                  design.isCustom ? (
                    <div
                      key={design.id}
                      className="relative border-2 border-dashed rounded-xl p-2 transition-all text-left border-violet-300"
                    >
                      <div className="h-20 rounded-lg mb-2 bg-violet-50 flex items-center justify-center text-violet-400 text-2xl font-bold">
                        +
                      </div>
                      <p className="text-xs font-medium mb-0.5">{design.name}</p>
                      <p className="text-[9px] text-muted-foreground leading-tight mb-2">{design.subtitle}</p>
                      {customThemeRequest?.status === "pendiente" ? (
                        <p className="text-[9px] text-violet-600 font-medium text-center py-1.5">Lo estamos armando…</p>
                      ) : customThemeRequest?.status === "listo" ? (
                        <p className="text-[9px] text-green-600 font-medium text-center py-1.5">¡Listo! Ya está en tu lista</p>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setCustomUrlDialogOpen(true)}
                          className="w-full text-xs py-1.5 rounded-lg font-medium bg-violet-500 hover:bg-violet-600 text-white"
                        >
                          Crear desde un link
                        </button>
                      )}
                    </div>
                  ) : design.comingSoon ? (
                    <div
                      key={design.id}
                      className="relative border-2 rounded-xl p-2 transition-all text-left border-border opacity-60 cursor-not-allowed"
                    >
                      <Badge className="absolute -top-2 -right-2 text-[10px] px-1.5 py-0.5 bg-amber-500">
                        Pronto
                      </Badge>
                      <div className="relative h-20 rounded-lg overflow-hidden mb-2 bg-muted">
                        <Image
                          src={design.image || "/images/placeholders/placeholder.svg"}
                          alt={design.name}
                          fill
                          className="object-cover grayscale"
                          sizes="150px"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <Lock className="h-4 w-4 text-white" />
                        </div>
                      </div>
                      <div className="flex items-center gap-1 mb-0.5">
                        <Crown className="h-3 w-3 text-amber-500" />
                        <span className="text-xs font-medium">{design.name}</span>
                      </div>
                      <p className="text-[9px] text-muted-foreground leading-tight">{design.subtitle}</p>
                    </div>
                  ) : (
                    <div
                      key={design.id}
                      className={`relative border-2 rounded-xl p-2 transition-all text-left ${
                        activeTheme === design.id ? "border-violet-500 ring-2 ring-violet-200" : "border-border hover:border-violet-300"
                      }`}
                    >
                      {activeTheme === design.id && (
                        <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center z-10">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => setPreviewDesign(design)}
                        className="relative h-20 w-full rounded-lg overflow-hidden mb-2 bg-muted group block"
                      >
                        <Image
                          src={design.image || "/images/placeholders/placeholder.svg"}
                          alt={design.name}
                          fill
                          className={`object-cover ${design.imagePosition || "object-top"}`}
                          sizes="150px"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                          <span className="hidden group-hover:flex items-center gap-1 text-white text-[10px] font-medium">
                            <Eye className="h-3 w-3" />
                            Ver demo
                          </span>
                        </div>
                      </button>
                      <p className="text-xs font-medium mb-0.5">{design.name}</p>
                      <p className="text-[9px] text-muted-foreground leading-tight mb-2">{design.subtitle}</p>
                      <button
                        type="button"
                        disabled={savingTheme}
                        onClick={() => handleChooseTheme(design.id)}
                        className={`w-full text-xs py-1.5 rounded-lg font-medium transition-colors ${
                          activeTheme === design.id
                            ? "bg-violet-100 text-violet-700"
                            : "bg-violet-500 hover:bg-violet-600 text-white"
                        }`}
                      >
                        {activeTheme === design.id ? "Elegido" : "Elegir"}
                      </button>
                    </div>
                  ),
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Por ahora esto guarda tu preferencia de diseño. Todavía estamos conectando cada modelo a los productos y el carrito reales de tu tienda — te avisamos apenas "Moderno" quede funcionando 100% con tus datos.
              </p>
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

      {/* Preview grande del modelo */}
      <Dialog open={!!previewDesign} onOpenChange={(open) => !open && setPreviewDesign(null)}>
        <DialogContent className="max-w-[95vw] sm:max-w-[95vw] w-full p-0 overflow-hidden">
          <DialogHeader className="p-4 pb-0">
            <DialogTitle>{previewDesign?.name}</DialogTitle>
            <DialogDescription>{previewDesign?.description}</DialogDescription>
          </DialogHeader>
          {previewDesign && (
            <iframe
              src={previewDesign.previewUrl}
              title={previewDesign.name}
              className="w-full h-[70vh] border-0"
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Popup: crear modelo nuevo pegando una URL */}
      <Dialog open={customUrlDialogOpen} onOpenChange={(open) => { setCustomUrlDialogOpen(open); if (!open) setCustomUrlError("") }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Creá tu propio modelo</DialogTitle>
            <DialogDescription>
              Pegá el link de una tienda que te gusta. Armamos un modelo nuevo con ese estilo, usando tus productos y fotos.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              placeholder="https://ejemplo.com"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              disabled={submittingCustomUrl}
            />
            {customUrlError && <p className="text-xs text-red-600">{customUrlError}</p>}
            <Button
              type="button"
              className="w-full"
              disabled={submittingCustomUrl || !customUrl.trim()}
              onClick={handleSubmitCustomUrl}
            >
              {submittingCustomUrl ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Enviar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    {trialModal && (
      <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => setTrialModal(null)}>
        <div style={{ background: "white", borderRadius: "12px", padding: "32px", textAlign: "center", maxWidth: "360px", margin: "16px" }} onClick={(e) => e.stopPropagation()}>
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>🎉</div>
          <p style={{ fontSize: "18px", fontWeight: 600, margin: "0 0 8px" }}>¡{trialModal.days} días gratis activados!</p>
          <p style={{ fontSize: "13px", color: "#666", margin: "0 0 20px" }}>{trialModal.name} está activo. Probalo sin límites durante {trialModal.days} días.</p>
          <button onClick={() => setTrialModal(null)} style={{ background: "#f97316", color: "white", border: "none", borderRadius: "8px", padding: "12px 28px", fontSize: "15px", fontWeight: 600, cursor: "pointer" }}>
            ¡Empezar a usar!
          </button>
        </div>
      </div>
    )}
    </div>
  )
}
