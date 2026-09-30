"use client"

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
  GalleryHorizontal,
} from "lucide-react"
import CustomVariantsManager from "./custom-variants-manager" // Import CustomVariantsManager
import { DolarManager } from "./dolar-manager"
import type { CarouselBlock } from "@/components/store/store-carousels"

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
  initialCarousels?: CarouselBlock[] | null
  activeTab?: string
  onActiveTabChange?: (tab: string) => void
  onGoToProducts?: () => void
  autoSelectFeature?: string | null
}

const pageDesigns = [
  {
    id: "basico",
    name: "Básico",
    subtitle: "Diseño clásico",
    description: "El diseño de siempre, con hero, productos destacados y catálogo completo. Es el que ya trae tu tienda.",
    image: "/images/templates/basico-classic-store.jpg",
    previewUrl: "/disenio-preview/basico",
    comingSoon: false,
  },
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
    previewUrl: "/disenio-preview/luxury",
    comingSoon: false,
  },
  {
    id: "minimal",
    name: "Minimal",
    subtitle: "Diseño minimalista",
    description: "Líneas limpias y espacios amplios para destacar tus productos.",
    image: "/images/templates/minimal-clean-white-store-modern.jpg",
    previewUrl: "/disenio-preview/minimal",
    comingSoon: false,
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
    previewUrl: "/disenio-preview/vintage",
    comingSoon: false,
  },
]

// Separado de pageDesigns a propósito: no es un modelo prearmado ($1/mes de Modelos/Templates),
// es el clonado real de la portada por link ($10 único, feature "theme_custom_url"). Antes vivía
// mezclado como una tile más de la grilla y quedaba invisible; ahora es su propia sección "Portada
// especial", siempre visible en el menú.
const customCloneDesign = {
  id: "nuevo_propio",
  name: "Diseño Customizado de Portada",
  subtitle: "Copiá el estilo de otra tienda",
  description: "Pegá el link de una tienda que te gusta y una IA arma una portada igual para vos, usando tus productos y fotos reales.",
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
  Truck,
  GalleryHorizontal,
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
      "Con esta función, podés cargar tus precios en dólares y tus clientes los verán automáticamente convertidos a pesos argentinos usando la cotización del dólar actualizada. Nunca más tenés que actualizar precios por inflación.",
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
  multi_images: {
    configTitle: "Configurar Galería de Imágenes",
    configDescription:
      "Subí hasta 5 fotos por producto. Tus clientes las ven en una galería deslizable, con el producto desde todos los ángulos.",
  },
  carousels: {
    configTitle: "Configurar Carruseles",
    configDescription:
      "Agregá una franja de productos destacados que se desliza, y/o una franja de texto con frases que van rotando (ej: promociones, envíos, redes). Aparecen en tu portada, debajo del banner principal.",
  },
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://tol.ar"

const LEER_MAS_URLS: Record<string, string> = {
  dolar_peso: `${APP_URL}/plan-cositas/dolar-peso`,
  lupa: `${APP_URL}/plan-cositas/lupa`,
  dropshipping: `${APP_URL}/plan-cositas/dropshipping`,
  mayorista_minorista: `${APP_URL}/plan-cositas/mayorista-minorista`,
  modelos_templates: `${APP_URL}/plan-cositas/modelos-templates`,
  nuevo_propio: `${APP_URL}/plan-cositas/portada-especial`,
  multi_images: `${APP_URL}/plan-cositas/galeria-imagenes`,
}

const getLeerMasUrl = (code: string, subdomain?: string) => {
  const base = LEER_MAS_URLS[code] || `${APP_URL}/cositas#${code}`
  if (!LEER_MAS_URLS[code] || !subdomain) return base
  return `${base}?tienda=${encodeURIComponent(subdomain)}`
}

export function PlansManager({ storeId, storeName, subdomain, initialCustomDomain, initialLinkedStoreUrl, initialLinkedStoreLabel, initialActiveTheme, initialCustomThemeRequest, initialCarousels, activeTab: controlledActiveTab, onActiveTabChange, onGoToProducts, autoSelectFeature }: PlansManagerProps) {
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
  const autoSelectHandled = useRef(false)

  // Modal de configuración
  const [configModal, setConfigModal] = useState<string | null>(null)
  const [trialModal, setTrialModal] = useState<{name: string, days: number} | null>(null)
  const [trialIntroFeature, setTrialIntroFeature] = useState<DbFeature | null>(null)
  const [trialCardFeature, setTrialCardFeature] = useState<DbFeature | null>(null)
  const [trialCardLoadingBrick, setTrialCardLoadingBrick] = useState(false)
  const [trialCardSubmitting, setTrialCardSubmitting] = useState(false)
  const [trialCardError, setTrialCardError] = useState("")
  const trialCardBrickRef = useRef<HTMLDivElement>(null)
  const trialCardBrickBuilt = useRef(false)
  const trialCardBrickController = useRef<any>(null)
  // Cuenta cuántas veces arrancamos una creación de Brick. Si el usuario navega
  // afuera (ej. al Comprar con MP) y vuelve con el botón "atrás", el navegador
  // puede restaurar la página desde bfcache con un bricks.create() que quedó
  // colgado a mitad de camino (la promesa nunca se cancela). Con este número
  // cada creación sabe si sigue siendo "la vigente" cuando por fin resuelve;
  // si no lo es, se descarta en vez de pisar el Brick nuevo que ya se mostró.
  const trialCardBrickGen = useRef(0)
  const [cancellingFeature, setCancellingFeature] = useState<string | null>(null)
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
  const [carouselsConfig, setCarouselsConfig] = useState<CarouselBlock[]>(initialCarousels || [])
  const [savingCarousels, setSavingCarousels] = useState(false)
  const [carouselsSaved, setCarouselsSaved] = useState(false)

  const hasProductsCarousel = carouselsConfig.some((c) => c.type === "products")
  const productsCarouselTitle = carouselsConfig.find((c) => c.type === "products")?.title || "Destacados"
  const textCarouselPhrases = (carouselsConfig.find((c) => c.type === "text")?.phrases || []).join("\n")

  const toggleProductsCarousel = (checked: boolean) => {
    setCarouselsConfig((prev) => {
      const rest = prev.filter((c) => c.type !== "products")
      return checked ? [...rest, { id: "products_default", type: "products" as const, title: productsCarouselTitle }] : rest
    })
  }

  const updateProductsCarouselTitle = (title: string) => {
    setCarouselsConfig((prev) => prev.map((c) => (c.type === "products" ? { ...c, title } : c)))
  }

  const updateTextCarousel = (raw: string) => {
    const phrases = raw
      .split("\n")
      .map((p) => p.trim())
      .filter(Boolean)
      .slice(0, 6)
    setCarouselsConfig((prev) => {
      const rest = prev.filter((c) => c.type !== "text")
      return phrases.length > 0 ? [...rest, { id: "text_default", type: "text" as const, phrases }] : rest
    })
  }

  const handleSaveCarousels = async () => {
    setSavingCarousels(true)
    setCarouselsSaved(false)
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storeId, carousels: carouselsConfig }),
      })
      if (res.ok) {
        setCarouselsSaved(true)
        setTimeout(() => setCarouselsSaved(false), 2000)
      }
    } finally {
      setSavingCarousels(false)
    }
  }
  const [customUrlDialogOpen, setCustomUrlDialogOpen] = useState(false)
  const [customUrl, setCustomUrl] = useState("")
  const [customUrlError, setCustomUrlError] = useState("")
  const [submittingCustomUrl, setSubmittingCustomUrl] = useState(false)
  const [customThemePriceUSD, setCustomThemePriceUSD] = useState(10)
  const [customUrlCardLoadingBrick, setCustomUrlCardLoadingBrick] = useState(false)
  const customUrlCardBrickRef = useRef<HTMLDivElement>(null)
  const customUrlCardBrickBuilt = useRef(false)
  const customUrlCardBrickGen = useRef(0)
  const customUrlCardBrickController = useRef<any>(null)
  const customUrlCardBrickOp = useRef<Promise<void>>(Promise.resolve())
  const normalizedCustomUrlRef = useRef<string | null>(null)

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
          const allFeatures: DbFeature[] = data.availableFeatures || []
          const customThemeFeature = allFeatures.find((f) => f.code === "theme_custom_url")
          setPurchasedFeatures(data.features || [])
          setPurchasedDetails(data.purchasedDetails || [])
          // "theme_custom_url" no se muestra como cosita genérica: se cobra desde la sección "Portada especial"
          setAvailableFeatures(allFeatures.filter((f) => f.code !== "theme_custom_url"))
          if (customThemeFeature) setCustomThemePriceUSD(customThemeFeature.price)
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
    autoSelectHandled.current = false
    fetchFeatures()
  }, [storeId])

  // Link directo desde el mail de aviso (?activar=codigo): selecciona la
  // cosita sola y lleva a la caja de pago, sin que haya que buscarla a mano.
  useEffect(() => {
    if (!autoSelectFeature || loading || autoSelectHandled.current) return
    // "Portada especial" no es una cosita de la tabla (ver comentario en fetchFeatures),
    // así que no está en availableFeatures: abre directo el diálogo de la URL a clonar.
    if (autoSelectFeature === "nuevo_propio") {
      autoSelectHandled.current = true
      setCustomUrlDialogOpen(true)
      setTimeout(() => {
        const el = document.getElementById("feature-nuevo_propio")
        el?.scrollIntoView({ behavior: "smooth", block: "center" })
      }, 300)
      return
    }
    const feature = availableFeatures.find((f) => f.code === autoSelectFeature)
    if (!feature) return
    autoSelectHandled.current = true
    toggleFeature(autoSelectFeature)
    setTimeout(() => {
      const el = document.getElementById(`feature-${autoSelectFeature}`)
      el?.scrollIntoView({ behavior: "smooth", block: "center" })
    }, 300)
  }, [autoSelectFeature, loading, availableFeatures])

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

  const getNormalizedCustomUrl = (raw: string): string | null => {
    let normalized = raw.trim()
    if (!normalized) return null
    if (!/^https?:\/\//i.test(normalized)) {
      normalized = `https://${normalized}`
    }
    try {
      const url = new URL(normalized)
      if (!url.hostname.includes(".")) return null
      return url.toString()
    } catch {
      return null
    }
  }

  const handleCustomUrlCardSubmit = async (cardData: any) => {
    const normalized = normalizedCustomUrlRef.current
    if (!normalized) return
    setSubmittingCustomUrl(true)
    setCustomUrlError("")
    try {
      const res = await fetch("/api/admin/theme-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeId,
          url: normalized,
          cardData,
          amountARS: getPriceARS(customThemePriceUSD),
          storeName,
          subdomain,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setCustomUrlError(data.error || "No pudimos procesar el pago, probá con otra tarjeta")
        return
      }
      await fetch("/api/admin/features/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeId,
          features: ["theme_custom_url"],
          paymentMethod: "mercadopago_card",
          paymentId: data.custom_theme_request?.mp_payment_id,
        }),
      })
      setCustomThemeRequest(data.custom_theme_request)
      setCustomUrlDialogOpen(false)
      setCustomUrl("")
    } catch {
      setCustomUrlError("Error al procesar el pago, probá de nuevo")
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

  const normalizedCustomUrl = getNormalizedCustomUrl(customUrl)
  const hasValidCustomUrl = !!normalizedCustomUrl
  normalizedCustomUrlRef.current = normalizedCustomUrl

  const renderCloneWithAICard = () => (
    <div className="rounded-xl border-2 border-dashed border-violet-300 bg-violet-50 p-4 flex items-start gap-3">
      <div className="w-11 h-11 rounded-lg bg-violet-100 flex items-center justify-center flex-shrink-0 text-violet-500">
        <Sparkles className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-violet-900">{customCloneDesign.name}</p>
        <p className="text-xs text-violet-700 mt-0.5">{customCloneDesign.description}</p>
        <a
          href={getLeerMasUrl(customCloneDesign.id, subdomain)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-block text-xs text-green-700 hover:text-green-800 hover:underline mt-1"
        >
          Leer más →
        </a>
        {customThemeRequest?.url && (
          <p className="text-xs text-violet-800 mt-1 break-all">
            Página que clonaste: <span className="font-medium">{customThemeRequest.url}</span>
          </p>
        )}
        <div className="mt-2">
          {customThemeRequest?.status === "pendiente" ? (
            <p className="text-xs text-violet-600 font-medium">Lo estamos armando…</p>
          ) : customThemeRequest?.status === "listo" ? (
            <p className="text-xs text-green-600 font-medium">¡Listo! Ya está en tu lista</p>
          ) : (
            <button
              type="button"
              onClick={() => setCustomUrlDialogOpen(true)}
              className="text-xs px-3 py-1.5 rounded-lg font-medium bg-violet-500 hover:bg-violet-600 text-white"
            >
              Comprar
            </button>
          )}
        </div>
      </div>
    </div>
  )

  const queueCustomUrlCardBrickOp = (op: () => Promise<void>) => {
    customUrlCardBrickOp.current = customUrlCardBrickOp.current.then(op, op)
    return customUrlCardBrickOp.current
  }

  const clearCustomUrlCardBrick = async () => {
    // Igual que con el Brick de "Probar gratis": invalidamos la creación en
    // curso apenas arranca un clear, así si esa promesa vieja resuelve tarde
    // se descarta sola en vez de pisar el contenedor.
    customUrlCardBrickGen.current += 1
    if (customUrlCardBrickController.current) {
      try { await customUrlCardBrickController.current.unmount() } catch {}
      customUrlCardBrickController.current = null
    }
    if (customUrlCardBrickRef.current) customUrlCardBrickRef.current.innerHTML = ""
    customUrlCardBrickBuilt.current = false
  }

  // Igual que el Brick de "Probar gratis": si el SDK de Mercado Pago se cuelga
  // a mitad de camino (conexión lenta, bfcache al volver con "atrás"), sin este
  // timeout el esqueleto gris de la imagen que mandó Ariel queda así para
  // siempre, sin ningún mensaje de error.
  const CUSTOM_URL_BRICK_TIMEOUT_MS = 15000

  const initCustomUrlCardBrick = () => queueCustomUrlCardBrickOp(async () => {
    if (customUrlCardBrickBuilt.current || !customUrlCardBrickRef.current) return
    await clearCustomUrlCardBrick()
    const myGen = customUrlCardBrickGen.current
    setCustomUrlCardLoadingBrick(true)

    const loadMP = () => new Promise<void>((resolve, reject) => {
      if ((window as any).MercadoPago) { resolve(); return }
      const s = document.createElement("script")
      s.src = "https://sdk.mercadopago.com/js/v2"
      s.onload = () => resolve()
      s.onerror = () => reject(new Error("No se pudo cargar Mercado Pago"))
      document.head.appendChild(s)
    })

    try {
      await loadMP()
    } catch (err) {
      if (customUrlCardBrickGen.current !== myGen) return
      console.error(err)
      setCustomUrlCardLoadingBrick(false)
      setCustomUrlError("No pudimos cargar el formulario de pago, cerrá y volvé a intentar")
      return
    }
    if (customUrlCardBrickGen.current !== myGen || !customUrlCardBrickRef.current) return

    const pubKey = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY as string
    const mp = new (window as any).MercadoPago(pubKey, { locale: "es-AR" })
    const bricks = mp.bricks()
    customUrlCardBrickBuilt.current = true
    setCustomUrlCardLoadingBrick(false)

    const timeoutId = setTimeout(() => {
      if (customUrlCardBrickGen.current !== myGen) return
      customUrlCardBrickGen.current += 1
      customUrlCardBrickBuilt.current = false
      if (customUrlCardBrickRef.current) customUrlCardBrickRef.current.innerHTML = ""
      setCustomUrlError("El formulario de pago tardó demasiado en cargar. Si estás en una ventana de incógnito o con bloqueadores de cookies, probá en una ventana normal. Cerrá esto y probá de nuevo.")
    }, CUSTOM_URL_BRICK_TIMEOUT_MS)

    let controller: any = null
    try {
      controller = await bricks.create("cardPayment", "mp-custom-url-card-brick", {
        initialization: {
          amount: getPriceARS(customThemePriceUSD),
          payer: { email: "" },
        },
        customization: {
          visual: { style: { theme: "default" } },
          paymentMethods: { minInstallments: 1, maxInstallments: 1 },
        },
        callbacks: {
          onReady: () => {},
          onError: (err: any) => console.error("MP Brick error:", err),
          onSubmit: (cardData: any) => handleCustomUrlCardSubmit(cardData),
        },
      })
    } catch (err) {
      clearTimeout(timeoutId)
      if (customUrlCardBrickGen.current !== myGen) return
      console.error("MP Brick create error:", err)
      customUrlCardBrickBuilt.current = false
      setCustomUrlCardLoadingBrick(false)
      setCustomUrlError("No pudimos cargar el formulario de pago, cerrá y volvé a intentar")
      return
    }
    clearTimeout(timeoutId)

    if (customUrlCardBrickGen.current !== myGen) {
      try { await controller?.unmount() } catch {}
      return
    }
    customUrlCardBrickController.current = controller
  })

  useEffect(() => {
    if (!customUrlDialogOpen || !hasValidCustomUrl) {
      queueCustomUrlCardBrickOp(clearCustomUrlCardBrick)
      return
    }
    if (customUrlCardBrickBuilt.current) return

    // Espera a que la URL deje de cambiar antes de montar el Brick. Si se monta en cada
    // tecla (o en el "parpadeo" de limpiar+pegar), el SDK de Mercado Pago se queda a
    // mitad de un create() async justo cuando el contenedor se vuelve a limpiar.
    const timer = setTimeout(() => {
      initCustomUrlCardBrick()
    }, 400)

    return () => clearTimeout(timer)
  }, [customUrlDialogOpen, hasValidCustomUrl, customThemePriceUSD, storeId, storeName, subdomain])

  const startTrial = (feature: any) => {
    if (!feature.trial_days || feature.trial_days === 0) return
    // Primero mostramos qué es (o, en Modelos/Templates, los diseños para elegir)
    // y recién después de esa elección se pide la tarjeta.
    setTrialIntroFeature(feature)
  }

  const confirmTrialIntro = () => {
    const feature = trialIntroFeature
    setTrialIntroFeature(null)
    if (!feature) return
    // Ahora sí pedimos la tarjeta (Mercado Pago) para poder cobrar sola
    // cuando termine el trial. Se abre el diálogo con el Brick.
    setTrialCardError("")
    trialCardBrickBuilt.current = false
    setTrialCardFeature(feature)
  }

  // El SDK de Mercado Pago escribe el <form> del Brick directo en el DOM
  // del contenedor mientras se está creando (no espera a que resuelva la
  // promesa de bricks.create), y su unmount() no garantiza sacar ese <form>
  // a tiempo. Si un desmontaje (cerrar el diálogo) y una creación (abrir
  // otra cosita) corren en paralelo, quedan dos formularios pisados en el
  // mismo contenedor, o uno colgado cargando para siempre. Por eso todo
  // unmount/create de este Brick pasa por esta cola: nunca se ejecutan dos
  // operaciones a la vez, siempre una espera a que la anterior termine del
  // todo antes de tocar el contenedor.
  const trialCardBrickOp = useRef<Promise<void>>(Promise.resolve())
  const queueTrialCardBrickOp = (op: () => Promise<void>) => {
    trialCardBrickOp.current = trialCardBrickOp.current.then(op, op)
    return trialCardBrickOp.current
  }

  const clearTrialCardBrick = async () => {
    // Cualquier creación en curso deja de ser "la vigente" apenas arranca un
    // clear: si esa promesa vieja resuelve más tarde, se va a descartar sola.
    trialCardBrickGen.current += 1
    if (trialCardBrickController.current) {
      try { await trialCardBrickController.current.unmount() } catch {}
      trialCardBrickController.current = null
    }
    if (trialCardBrickRef.current) trialCardBrickRef.current.innerHTML = ""
    trialCardBrickBuilt.current = false
  }

  const unmountTrialCardBrick = () => queueTrialCardBrickOp(clearTrialCardBrick)

  // Cuánto esperamos a que Mercado Pago termine de armar el formulario antes
  // de darlo por colgado. Si el usuario navegó afuera (ej. al Comprar) y
  // volvió con "atrás", el navegador puede restaurar la página desde bfcache
  // con este create() interrumpido a mitad de camino y que nunca va a
  // resolver solo — sin este timeout el esqueleto gris queda así para
  // siempre.
  const TRIAL_BRICK_TIMEOUT_MS = 15000

  const initTrialCardBrick = (feature: DbFeature) => queueTrialCardBrickOp(async () => {
    if (trialCardBrickBuilt.current || !trialCardBrickRef.current) return
    // Desmontamos cualquier Brick previo dentro del mismo turno de la cola,
    // así nunca se solapa con la creación de este.
    await clearTrialCardBrick()
    const myGen = trialCardBrickGen.current
    setTrialCardLoadingBrick(true)
    const pubKey = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY as string

    const loadMP = () => new Promise<void>(resolve => {
      if ((window as any).MercadoPago) { resolve(); return }
      const s = document.createElement("script")
      s.src = "https://sdk.mercadopago.com/js/v2"
      s.onload = () => resolve()
      document.head.appendChild(s)
    })

    await loadMP()
    // Si mientras cargaba el SDK se cerró el diálogo o se pidió otra
    // cosita, esta creación ya quedó vieja: no seguir.
    if (trialCardBrickGen.current !== myGen) return

    const mp = new (window as any).MercadoPago(pubKey, { locale: "es-AR" })
    const bricks = mp.bricks()
    trialCardBrickBuilt.current = true
    setTrialCardLoadingBrick(false)

    const priceARS = getPriceARS(feature.price)

    const timeoutId = setTimeout(() => {
      if (trialCardBrickGen.current !== myGen) return
      trialCardBrickGen.current += 1
      trialCardBrickBuilt.current = false
      if (trialCardBrickRef.current) trialCardBrickRef.current.innerHTML = ""
      setTrialCardError("El formulario de pago tardó demasiado en cargar. Si estás en una ventana de incógnito o con bloqueadores de cookies, probá en una ventana normal. Cerrá esto y probá de nuevo.")
    }, TRIAL_BRICK_TIMEOUT_MS)

    let controller: any = null
    try {
      controller = await bricks.create("cardPayment", "mp-trial-card-brick", {
        initialization: {
          amount: priceARS,
          payer: { email: "" },
        },
        customization: {
          visual: { style: { theme: "default" } },
          paymentMethods: { minInstallments: 1, maxInstallments: 1 },
        },
        callbacks: {
          onReady: () => {},
          onError: (err: any) => console.error("MP Brick error:", err),
          onSubmit: async (cardData: any) => {
            setTrialCardSubmitting(true)
            setTrialCardError("")
            try {
              const res = await fetch("/api/tolar/mercadopago/create-subscription", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  storeId,
                  featureCode: feature.code,
                  featureName: feature.name,
                  trialDays: (feature as any).trial_days,
                  cardToken: cardData.token,
                  payerEmail: cardData.payer?.email,
                  transactionAmountARS: priceARS,
                }),
              })
              const data = await res.json()
              if (res.ok && data.ok) {
                setTrialCardFeature(null)
                setTrialModal({ name: feature.name, days: (feature as any).trial_days })
                window.location.reload()
              } else {
                setTrialCardError(data.error || "No pudimos guardar la tarjeta. Probá con otra.")
              }
            } catch {
              setTrialCardError("Error al procesar la tarjeta")
            }
            setTrialCardSubmitting(false)
          },
        },
      })
    } finally {
      clearTimeout(timeoutId)
    }

    if (trialCardBrickGen.current !== myGen) {
      // Llegó tarde: ya se pidió otro Brick (o se invalidó por timeout)
      // mientras este terminaba de crearse. Lo descartamos para no pisar
      // lo que ya se está mostrando.
      try { await controller?.unmount() } catch {}
      return
    }
    trialCardBrickController.current = controller
  })

  useEffect(() => {
    if (trialCardFeature) {
      trialCardBrickBuilt.current = false
      setTimeout(() => initTrialCardBrick(trialCardFeature), 100)
    }
  }, [trialCardFeature])

  // Si el usuario se va del panel (ej. al Comprar, que redirige a Mercado
  // Pago) y vuelve con el botón "atrás" del navegador, Chrome puede restaurar
  // esta página entera desde bfcache tal cual quedó, con el diálogo de
  // "Probar gratis" a mitad de cargar y sin forma de terminar solo. Mejor
  // cerrarlo de una y que lo vuelva a abrir limpio.
  useEffect(() => {
    const onPageShow = (e: PageTransitionEvent) => {
      if (!e.persisted) return
      trialCardBrickGen.current += 1
      trialCardBrickBuilt.current = false
      if (trialCardBrickController.current) {
        try { trialCardBrickController.current.unmount() } catch {}
        trialCardBrickController.current = null
      }
      if (trialCardBrickRef.current) trialCardBrickRef.current.innerHTML = ""
      setTrialCardFeature(null)
      setTrialCardError("")
      setTrialCardLoadingBrick(false)
    }
    window.addEventListener("pageshow", onPageShow)
    return () => window.removeEventListener("pageshow", onPageShow)
  }, [])

  const cancelSubscription = async (featureCode: string, featureName: string) => {
    if (!window.confirm(`¿Cancelar ${featureName}? No se te va a cobrar y se desactiva ahora.`)) return
    setCancellingFeature(featureCode)
    try {
      const res = await fetch("/api/tolar/mercadopago/cancel-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storeId, featureCode }),
      })
      if (res.ok) {
        window.location.reload()
      } else {
        const data = await res.json().catch(() => ({}))
        alert(data.error || "No se pudo cancelar")
      }
    } catch {
      alert("Error al cancelar")
    }
    setCancellingFeature(null)
  }

  const toggleFeature = (code: string) => {
    const detail = purchasedDetails.find((d: any) => d.feature_code === code)
    const isTrialOnly = detail?.is_trial && detail?.trial_ends_at && new Date(detail.trial_ends_at).getTime() > Date.now()
    // Prueba vencida pero nunca cobrada (sin suscripción real en MP): se puede volver a pagar.
    const isTrialExpiredUnpaid = detail?.is_trial && detail?.trial_ends_at && new Date(detail.trial_ends_at).getTime() <= Date.now() && !detail?.mp_preapproval_id
    if (purchasedFeatures.includes(code) && !isTrialOnly && !isTrialExpiredUnpaid) return
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
                href={getLeerMasUrl("dolar_peso", subdomain)}
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
                            const isTrialExpiredUnpaid = isTrial && daysLeft <= 0 && !detail?.mp_preapproval_id
                            const isSelected = selectedFeatures.includes(feature.code)
                            return (
                              <div key={feature.code} id={`feature-${feature.code}`} className="bg-green-50 border-b border-green-100 last:border-b-0">
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
                                    ) : isTrialExpiredUnpaid ? (
                                      <p className="text-xs text-red-600">Prueba vencida, sin cobrar</p>
                                    ) : (
                                      <p className="text-xs text-green-600">✓ Pagado</p>
                                    )}
                                  </div>
                                  {isTrial && daysLeft > 0 ? (
                                    <div className="flex items-center gap-2">
                                      {detail?.mp_preapproval_id && (
                                        <button
                                          onClick={() => cancelSubscription(feature.code, feature.name)}
                                          disabled={cancellingFeature === feature.code}
                                          className="text-xs text-red-600 hover:text-red-700 hover:underline whitespace-nowrap"
                                        >
                                          {cancellingFeature === feature.code ? "Cancelando..." : "Cancelar"}
                                        </button>
                                      )}
                                      <button onClick={() => toggleFeature(feature.code)} className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-green-700">Comprar</button>
                                    </div>
                                  ) : isTrialExpiredUnpaid ? (
                                    <button
                                      onClick={() => toggleFeature(feature.code)}
                                      className={`text-xs px-3 py-1.5 rounded-lg font-medium whitespace-nowrap ${isSelected ? "bg-green-700 text-white" : "bg-green-600 text-white hover:bg-green-700"}`}
                                    >
                                      {isSelected ? "Seleccionado" : `Pagar ahora · $${priceARS.toLocaleString("es-AR")}/mes`}
                                    </button>
                                  ) : (
                                    <span className="text-sm font-medium text-green-700">${priceARS.toLocaleString("es-AR")}/mes</span>
                                  )}
                                  <a
                                    href={getLeerMasUrl(feature.code, subdomain)}
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
                                        design.comingSoon ? (
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
                                {expandedFeatures.has(feature.code) && feature.code === "carousels" && (
                                  <div className="px-4 pb-4 pt-1 space-y-3">
                                    <p className="text-xs text-green-700">{feature.description}</p>
                                    <label className="flex items-center gap-2 text-sm text-green-900">
                                      <input
                                        type="checkbox"
                                        checked={hasProductsCarousel}
                                        onChange={(e) => toggleProductsCarousel(e.target.checked)}
                                      />
                                      Carrusel de productos destacados
                                    </label>
                                    {hasProductsCarousel && (
                                      <Input
                                        placeholder="Título (ej: Destacados)"
                                        value={productsCarouselTitle}
                                        onChange={(e) => updateProductsCarouselTitle(e.target.value)}
                                        className="bg-white max-w-xs"
                                      />
                                    )}
                                    <div>
                                      <Label className="text-xs text-green-900">
                                        Franja de texto (una frase por línea, van rotando)
                                      </Label>
                                      <Textarea
                                        placeholder={"Ej: Envíos a todo el país\nSeguinos en Instagram"}
                                        value={textCarouselPhrases}
                                        onChange={(e) => updateTextCarousel(e.target.value)}
                                        className="mt-1 bg-white"
                                        rows={3}
                                      />
                                    </div>
                                    <Button size="sm" disabled={savingCarousels} onClick={handleSaveCarousels}>
                                      {savingCarousels ? "Guardando..." : "Guardar"}
                                    </Button>
                                    {carouselsSaved && (
                                      <p className="text-xs text-green-700 flex items-center gap-1">
                                        <Check className="w-3.5 h-3.5" /> Guardado. Ya se ve en tu tienda.
                                      </p>
                                    )}
                                  </div>
                                )}
                                {expandedFeatures.has(feature.code) &&
                                  feature.code !== "modelos_templates" &&
                                  feature.code !== "mayorista_minorista" &&
                                  feature.code !== "multi_images" &&
                                  feature.code !== "carousels" &&
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

                      {/* BLOQUE NARANJA: disponibles no compradas (siempre tiene al menos "Portada especial", fila manual) */}
                      {(
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
                              <div key={feature.code} id={`feature-${feature.code}`} className="flex items-center gap-3 px-4 py-3 bg-orange-50 border-b border-orange-100 last:border-b-0">
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
                                  href={getLeerMasUrl(feature.code, subdomain)}
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

                          {/* Fila manual: "Portada especial" no es una cosita de la tabla store_features
                              (es un pago único aparte, feature "theme_custom_url"), pero el cliente la
                              espera acá mezclada con el resto de las cositas, no escondida en el menú. */}
                          <div id="feature-nuevo_propio" className="flex items-center gap-3 px-4 py-3 bg-orange-50">
                            <div className="w-9 h-9 rounded-lg bg-violet-100 flex items-center justify-center flex-shrink-0">
                              <Sparkles className="h-4 w-4 text-violet-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-orange-900 text-sm">{customCloneDesign.name}</p>
                              <p className="text-xs text-orange-600 truncate" title={customThemeRequest?.url}>
                                {customThemeRequest?.url ? `Clonaste: ${customThemeRequest.url}` : customCloneDesign.description}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              {customThemeRequest?.status === "pendiente" ? (
                                <span className="text-xs text-violet-600 font-medium whitespace-nowrap">Lo estamos armando…</span>
                              ) : customThemeRequest?.status === "listo" ? (
                                <span className="text-xs text-green-600 font-medium whitespace-nowrap">¡Listo!</span>
                              ) : (
                                <button
                                  onClick={() => setCustomUrlDialogOpen(true)}
                                  className="text-xs bg-violet-500 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-violet-600 whitespace-nowrap"
                                >
                                  Comprar
                                </button>
                              )}
                            </div>
                            <a
                              href={getLeerMasUrl(customCloneDesign.id, subdomain)}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-xs text-orange-600 hover:text-orange-700 hover:underline whitespace-nowrap flex-shrink-0"
                            >
                              Leer más →
                            </a>
                          </div>
                        </div>
                      )}

                      {/* BLOQUE GRIS: proximamente (siempre tiene al menos "Clonar con IA", fila manual) */}
                      {(
                        <div className="rounded-xl overflow-hidden border border-slate-200 opacity-60">
                          <div className="bg-slate-100 px-4 py-2.5 flex items-center gap-2 border-b border-slate-200">
                            <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                            <span className="text-sm font-medium text-slate-500">Próximamente</span>
                          </div>

                          {/* Fila manual: "Clonar con IA" (tienda completa, catálogo incluido) todavía no
                              tiene precio ni mecánica definida — distinto de "Portada especial" (arriba),
                              que solo clona el diseño de la portada. Va acá hasta que se termine de armar. */}
                          <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 cursor-not-allowed">
                            <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                              <Copy className="h-4 w-4 text-slate-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-slate-400 text-sm">Clonar con IA</p>
                              <p className="text-xs text-slate-400 truncate">Clonamos tu tienda web completa (catálogo y productos incluidos), no solo la portada.</p>
                            </div>
                            <span className="text-xs text-slate-400 border border-slate-200 px-3 py-1 rounded-full flex-shrink-0">Pronto</span>
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
              <Card id="tu-seleccion" className="sticky top-4">
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

                                // Redirigir a MercadoPago (checkoutUrl ya elige sandbox o producción según la credencial)
                                window.location.href = data.checkoutUrl || data.initPoint
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

                        {/* PayPal - desactivado temporalmente, próximamente */}
                        <div className="border rounded-lg p-3">
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
                          <div className="w-full flex items-center justify-center gap-2 py-2.5 rounded-md bg-slate-100 text-slate-400 text-sm cursor-not-allowed">
                            <Lock className="w-4 h-4" />
                            Próximamente · ${totalUSD.toFixed(2)} USD
                          </div>
                        </div>

                        {/* Tarjeta (Stripe por dentro) - próximamente */}
                        <div className="border rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-slate-900 rounded flex items-center justify-center">
                                <CreditCard className="w-4 h-4 text-white" />
                              </div>
                              <div>
                                <p className="font-medium text-sm">Tarjeta de Débito/Crédito</p>
                                <p className="text-[10px] text-muted-foreground">0% Comisión</p>
                              </div>
                            </div>
                            <Badge variant="outline" className="text-[10px] border-green-300 text-green-600">Pesos ARS</Badge>
                          </div>
                          <div className="w-full flex items-center justify-center gap-2 py-2.5 rounded-md bg-slate-100 text-slate-400 text-sm cursor-not-allowed">
                            <Lock className="w-4 h-4" />
                            Próximamente · ${totalARS.toLocaleString("es-AR")} ARS
                          </div>
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
                  design.comingSoon ? (
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

        <TabsContent value="portada" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-violet-500" />
                Diseño Customizado de Portada
              </CardTitle>
              <CardDescription>
                Pago único aparte de Modelos/Templates. Vos pegás el link de una tienda que te gusta y una IA
                arma una portada igual para vos, usando tus productos y fotos reales.
              </CardDescription>
            </CardHeader>
            <CardContent>{renderCloneWithAICard()}</CardContent>
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
      <Dialog
        open={customUrlDialogOpen}
        onOpenChange={(open) => {
          setCustomUrlDialogOpen(open)
          if (!open) {
            setCustomUrlError("")
            setCustomUrl("")
            queueCustomUrlCardBrickOp(clearCustomUrlCardBrick)
          }
        }}
      >
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Diseño Customizado de Portada: pedila a partir de un link</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <ol className="space-y-3 text-sm">
              <li className="space-y-2">
                <div className="flex gap-2">
                  <span className="font-semibold text-violet-700">1)</span>
                  <span>Pegá el link de la página que te guste</span>
                </div>
                <Input
                  placeholder="xxxxxx.com"
                  value={customUrl}
                  onChange={(e) => {
                    setCustomUrl(e.target.value)
                    setCustomUrlError("")
                  }}
                  disabled={submittingCustomUrl}
                />
                {customUrlError && <p className="text-xs text-red-600">{customUrlError}</p>}
              </li>
              <li className="space-y-2">
                <div className="flex gap-2">
                  <span className="font-semibold text-violet-700">2)</span>
                  <span>
                    Aboná los <span className="font-semibold">USD {customThemePriceUSD}</span> (~$
                    {Math.round(customThemePriceUSD * exchangeRate).toLocaleString("es-AR")} ARS), pago único. Al
                    aprobarse el pago, una IA clona la portada sola y la deja lista al toque (si no puede, la
                    armamos nosotros en los próximos días).
                  </span>
                </div>
                <div className={`rounded-lg border border-violet-200 bg-violet-50 p-3 space-y-2 ${normalizedCustomUrl ? "" : "hidden"}`}>
                  {submittingCustomUrl && (
                    <div className="flex items-center justify-center py-2">
                      <Loader2 className="w-4 h-4 animate-spin text-violet-600" />
                    </div>
                  )}
                  <div className={submittingCustomUrl ? "hidden" : ""}>
                    {/* Este div nunca se desmonta mientras el popup está abierto: si se saca del DOM
                        a mitad de un toggle de estado, el SDK de Mercado Pago se queda a mitad de un create(). */}
                    <div id="mp-custom-url-card-brick" ref={customUrlCardBrickRef} className="min-h-[40px]" />
                    {customUrlCardLoadingBrick && <p className="text-[11px] text-muted-foreground">Cargando formulario de pago…</p>}
                  </div>
                </div>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-violet-700">3)</span>
                <span>
                  Personalizá fotos y texto{" "}
                  {/* Falta el link del video: pendiente hasta que se grabe y suba al canal de YouTube */}
                  <span className="text-muted-foreground">(video próximamente)</span>
                </span>
              </li>
            </ol>
          </div>
        </DialogContent>
      </Dialog>

      {/* Popup intermedio: explica qué es (o, en Modelos/Templates, deja ver los diseños) antes de pedir la tarjeta */}
      <Dialog open={!!trialIntroFeature} onOpenChange={(open) => { if (!open) setTrialIntroFeature(null) }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{trialIntroFeature?.name}</DialogTitle>
            <DialogDescription>
              {(trialIntroFeature && (FEATURE_CONFIG[trialIntroFeature.code]?.configDescription || (trialIntroFeature as any).full_description)) || trialIntroFeature?.description}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {trialIntroFeature?.code === "modelos_templates" && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {pageDesigns.filter(d => !d.comingSoon).map((design) => (
                  <button
                    key={design.id}
                    type="button"
                    onClick={() => setPreviewDesign(design)}
                    className="relative h-20 w-full rounded-lg overflow-hidden bg-muted group block border"
                  >
                    <Image
                      src={design.image || "/images/placeholders/placeholder.svg"}
                      alt={design.name}
                      fill
                      className={`object-cover ${design.imagePosition || "object-top"}`}
                      sizes="150px"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-end p-1">
                      <span className="text-white text-[10px] font-medium drop-shadow">{design.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
            {trialIntroFeature?.code === "modelos_templates" && (
              <p className="text-xs text-muted-foreground">
                Tocá un diseño para verlo en grande. Vas a poder elegir cuál usar una vez activada la prueba.
              </p>
            )}
            {trialIntroFeature && (
              <a
                href={getLeerMasUrl(trialIntroFeature.code, subdomain)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-xs text-orange-700 hover:text-orange-800 hover:underline"
              >
                Leer más →
              </a>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setTrialIntroFeature(null)}>Cancelar</Button>
              <Button onClick={confirmTrialIntro}>Continuar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!trialCardFeature} onOpenChange={(open) => { if (!open) { setTrialCardFeature(null); setTrialCardError(""); unmountTrialCardBrick() } }}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-orange-500" />
              Probar {trialCardFeature?.name} gratis
            </DialogTitle>
          </DialogHeader>
          <div className="mt-2 space-y-4">
            <div className="bg-orange-50 rounded-lg p-4 text-sm text-orange-900 space-y-1">
              <p>
                {(trialCardFeature as any)?.trial_days} días gratis. Después se cobra{" "}
                <strong>${trialCardFeature ? getPriceARS(trialCardFeature.price).toLocaleString("es-AR") : ""}/mes</strong>{" "}
                con la tarjeta que cargues, salvo que canceles antes.
              </p>
              <p className="text-xs text-orange-700">
                Te vamos a avisar por mail unos días antes de que se haga el primer cobro.
              </p>
            </div>
            {trialCardLoadingBrick && (
              <div className="flex items-center justify-center py-8 gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-[#00b1ea]" />
                <span className="text-sm text-muted-foreground">Cargando formulario de pago...</span>
              </div>
            )}
            <div id="mp-trial-card-brick" ref={trialCardBrickRef} />
            {trialCardSubmitting && (
              <p className="text-xs text-muted-foreground text-center">Guardando tarjeta...</p>
            )}
            {trialCardError && (
              <div className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 text-center">
                {trialCardError}
              </div>
            )}
            <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1">
              <Lock className="w-3 h-3" /> Tu tarjeta la guarda Mercado Pago, no nosotros
            </p>
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
