"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Check, AlertCircle, Eye, Sparkles, Shirt, Smartphone, Footprints, Crown, Lock, Palette } from "lucide-react"

type Step = "user-info" | "loading-user" | "store-config" | "creating-store" | "success" | "error"

interface SignupModalProps {
  isOpen: boolean
  onClose: () => void
  preselectedTemplate?: string | null
}

interface StoreData {
  storeUrl: string
  adminUrl: string
  username: string
  adminPassword: string
  emailSent: boolean
  subdomain: string
}

const freeTemplates = [
  {
    id: "cosmetics",
    name: "cosmeticos",
    subtitle: "Oz, Litros...",
    description: "Productos con unidades (ml, gr, oz). Ideal para cosméticos y accesorios.",
    image: "/images/templates/template-cosmeticos.png",
    previewUrl: "https://perfumes.tol.ar",
    icon: Sparkles,
    popular: false,
  },
  {
    id: "clothing",
    name: "indumentaria",
    subtitle: "Tallas S,M,L...",
    description: "Productos con tallas de letras (XS a XXL). Ideal para remeras, pantalones.",
    image: "/images/templates/template-indumentaria.png",
    previewUrl: "https://ropa.tol.ar",
    icon: Shirt,
    popular: false,
  },
  {
    id: "footwear",
    name: "calzado",
    subtitle: "Tallas 34,35...",
    description: "Productos con tallas numéricas (34 al 46). Ideal para zapatos y zapatillas.",
    image: "/images/templates/template-calzado.png",
    previewUrl: "https://zapatos.tol.ar",
    icon: Footprints,
    popular: false,
  },
  {
    id: "electronics",
    name: "electronicos",
    subtitle: "Solo cantidad",
    description: "Productos sin tallas. Ideal para celulares, computadoras y tecnología.",
    image: "/images/templates/template-electronicos.png",
    previewUrl: "https://electronicos.tol.ar",
    icon: Smartphone,
    popular: false,
  },
]



const premiumTemplates = [
  {
    id: "premium-luxury",
    name: "Luxury",
    subtitle: "Diseño premium",
    description: "Estilo elegante y sofisticado para marcas de alta gama.",
    image: "/luxury-elegant-store-dark-gold.jpg",
    previewUrl: "#",
    price: 2000,
    comingSoon: true,
  },
  {
    id: "premium-minimal",
    name: "Minimal",
    subtitle: "Diseño minimalista",
    description: "Líneas limpias y espacios amplios para destacar tus productos.",
    image: "/minimal-clean-white-store-modern.jpg",
    previewUrl: "#",
    price: 2000,
    comingSoon: true,
  },
  {
    id: "premium-bold",
    name: "Bold",
    subtitle: "Diseño audaz",
    description: "Colores vibrantes y tipografías impactantes para marcas jóvenes.",
    image: "/bold-colorful-vibrant-store-young.jpg",
    previewUrl: "#",
    price: 2000,
    comingSoon: true,
  },
  {
    id: "premium-vintage",
    name: "Vintage",
    subtitle: "Diseño retro",
    description: "Estética clásica con toques nostálgicos para productos artesanales.",
    image: "/vintage-retro-store-classic-artisan.jpg",
    previewUrl: "#",
    price: 2000,
    comingSoon: true,
  },
]

export function SignupModal({ isOpen, onClose, preselectedTemplate }: SignupModalProps) {
  const [step, setStep] = useState<Step>("user-info")
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState("")
  const [storeData, setStoreData] = useState<StoreData | null>(null)

  // Form data
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [siteOption, setSiteOption] = useState("site")
  const [subdomain, setSubdomain] = useState("")
  const [siteTitle, setSiteTitle] = useState("")
  const [allowIndexing, setAllowIndexing] = useState("yes")
  const [selectedTemplate, setSelectedTemplate] = useState("clothing")
  
  // Validacion subdominio en tiempo real
  const [subdomainAvailable, setSubdomainAvailable] = useState<boolean | null>(null)
  const [checkingSubdomain, setCheckingSubdomain] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setStep("user-info")
      setProgress(0)
      setError("")
      setStoreData(null)
      setUsername("")
      setEmail("")
      setSiteOption("site")
      setSubdomain("")
      setAllowIndexing("yes")
      setSelectedTemplate(preselectedTemplate || "clothing")
      setSubdomainAvailable(null)
    }
  }, [isOpen, preselectedTemplate])

  // Verificar subdominio en tiempo real con debounce
  useEffect(() => {
    if (subdomain.length < 4) {
      setSubdomainAvailable(null)
      return
    }

    // Solo caracteres alfanumericos
    if (!/^[a-zA-Z0-9]+$/.test(subdomain)) {
      setSubdomainAvailable(null)
      return
    }

    setCheckingSubdomain(true)
    const timeoutId = setTimeout(async () => {
      try {
        const res = await fetch(`/api/check-subdomain?subdomain=${subdomain.toLowerCase()}`)
        const data = await res.json()
        setSubdomainAvailable(data.available)
      } catch {
        setSubdomainAvailable(null)
      } finally {
        setCheckingSubdomain(false)
      }
    }, 500) // Espera 500ms despues de que deje de escribir

    return () => clearTimeout(timeoutId)
  }, [subdomain])

  useEffect(() => {
    if (step === "loading-user") {
      setProgress(0)
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            setStep("store-config")
            return 100
          }
          return prev + 5
        })
      }, 50)
      return () => clearInterval(interval)
    }
  }, [step])

  const handleUserInfoSubmit = () => {
    if (username.length >= 4 && email.includes("@")) {
      setStep("loading-user")
    }
  }

  const handleStoreConfigSubmit = async () => {
    if (subdomain.length >= 4) {
      setStep("creating-store")
      setProgress(0)
      setError("")

      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return 90
          return prev + 2
        })
      }, 100)

      try {
        const response = await fetch("/api/create-store", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            email,
            subdomain,
            siteTitle: subdomain, // Usa el subdominio como título
            allowIndexing,
            template: selectedTemplate,
          }),
        })

        const data = await response.json()

        clearInterval(progressInterval)

        if (!response.ok) {
          setError(data.error || "Error al crear la tienda")
          setStep("error")
          return
        }

        setProgress(100)
        setStoreData({
          storeUrl: data.store.storeUrl,
          adminUrl: data.store.adminUrl,
          username: data.store.username,
          adminPassword: data.store.adminPassword,
          emailSent: data.emailSent,
          subdomain: data.store.subdomain,
        })

        setTimeout(() => {
          setStep("success")
        }, 500)
      } catch (err) {
        clearInterval(progressInterval)
        setError("Error de conexión. Por favor intente nuevamente.")
        setStep("error")
      }
    }
  }

  const isUsernameValid = username.length >= 4 && /^[a-zA-Z0-9]+$/.test(username)
  const isEmailValid = email.includes("@") && email.includes(".")
  const isSubdomainValid = subdomain.length >= 4 && /^[a-zA-Z0-9]+$/.test(subdomain)

  const getTestStoreUrl = (sub: string) => {
    if (typeof window !== "undefined" && window.location.hostname === "localhost") {
      return `${window.location.origin}/tienda/${sub}`
    }
    return `https://${sub}.tol.ar/`
  }

  const getTestAdminUrl = (sub: string) => {
    if (typeof window !== "undefined" && window.location.hostname === "localhost") {
      return `${window.location.origin}/tienda/${sub}/admin`
    }
    return `https://${sub}.tol.ar/admin`
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Step 1: User Info - SIMPLIFICADO */}
        {step === "user-info" && (
          <div className="space-y-6 py-4">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Consigue tu tienda online en segundos</h2>
            </div>

            <div className="space-y-4">
              {/* Nombre de la tienda */}
              <div className="space-y-2">
                <Label htmlFor="subdomain" className="text-gray-900 font-medium">Nombre de la tienda</Label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Input 
                      id="subdomain" 
                      value={subdomain} 
                      onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))} 
                      placeholder="" 
                      className={`pr-10 ${
                        subdomainAvailable === false ? "border-red-500 focus:ring-red-500" : 
                        subdomainAvailable === true ? "border-green-500 focus:ring-green-500" : ""
                      }`}
                    />
                    {subdomain.length >= 4 && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {checkingSubdomain ? (
                          <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                        ) : subdomainAvailable === true ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : subdomainAvailable === false ? (
                          <AlertCircle className="w-4 h-4 text-red-500" />
                        ) : null}
                      </div>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground font-medium">.tol.ar</span>
                </div>
                {subdomainAvailable === false && subdomain.length >= 4 && (
                  <p className="text-xs text-red-500 font-medium">
                    Este nombre ya esta en uso, proba con otro
                  </p>
                )}
                {subdomainAvailable === true && subdomain.length >= 4 && (
                  <p className="text-xs text-green-500 font-medium">
                    Nombre disponible
                  </p>
                )}
                {subdomainAvailable === null && (
                  <p className="text-xs text-muted-foreground">
                    (Debe tener como minimo 4 caracteres, solo letras y numeros)
                  </p>
                )}
              </div>

              {/* Nombre del usuario */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-900 font-medium">Nombre del usuario</Label>
                <Input 
                  id="username" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  placeholder="" 
                />
                <p className="text-xs text-muted-foreground">
                  (Con este nombre entrarás al administrador)
                </p>
              </div>

              {/* Mail */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-900 font-medium">Mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder=""
                />
                <p className="text-xs text-muted-foreground">
                  A este email llegara tu usuario y contraseña
                </p>
              </div>
            </div>

            <Button
              onClick={handleUserInfoSubmit}
              disabled={!isUsernameValid || !isEmailValid || !isSubdomainValid}
              className="w-full bg-primary hover:bg-primary/90"
            >
              Elegi el modelo
            </Button>
          </div>
        )}

        {/* Step 2: Loading User Creation */}
        {step === "loading-user" && (
          <div className="space-y-6 py-8">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-primary mb-6">
                Estamos Creando su pagina espere un momento...
              </h2>
              <div className="relative">
                <Progress value={progress} className="h-3 bg-muted" />
                {progress >= 100 && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2">
                    <Check className="h-5 w-5 text-accent" />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Store Configuration - SIMPLIFICADO */}
        {step === "store-config" && (
          <div className="space-y-6 py-4">
            <div className="space-y-4">
              {/* Privacidad */}
              <div className="space-y-3">
                <div>
                  <p className="font-medium">Privacidad: Permitir que los motores de busquedas indexen este sitio.</p>
                </div>
                <RadioGroup value={allowIndexing} onValueChange={setAllowIndexing}>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="yes" />
                      <Label htmlFor="yes">Si</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="no" />
                      <Label htmlFor="no">No</Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-4">
                {/* Templates Gratis */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <p className="font-medium">¿Qué vas a vender?</p>
                    <Badge variant="secondary" className="bg-green-100 text-green-700 text-[10px]">
                      GRATIS
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Elegí según el tipo de producto.
                    <a href="/templates" target="_blank" className="text-primary hover:underline ml-1" rel="noreferrer">
                      Ver demos completas
                    </a>
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {freeTemplates.map((template) => (
                      <div
                        key={template.id}
                        className={`relative rounded-lg overflow-hidden transition-all ${
                          selectedTemplate === template.id
                            ? "ring-2 ring-green-500 ring-offset-2"
                            : "border border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        {/* Screenshot del template - clic abre preview */}
                        <a
                          href={template.previewUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="relative aspect-[3/4] bg-gray-100 group block"
                        >
                          <Image
                            src={template.image || "/placeholder.svg"}
                            alt={template.name}
                            fill
                            className="object-cover object-top"
                            sizes="150px"
                            loading="lazy"
                          />
                          {selectedTemplate === template.id && (
                            <div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center z-10">
                              <Check className="h-3 w-3 text-white" />
                            </div>
                          )}
                          {/* Overlay para ver demo */}
                          <div className="absolute inset-0 bg-black/0 hover:bg-black/50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <span className="flex items-center gap-1 text-white text-xs font-medium bg-black/70 px-2 py-1 rounded">
                              <Eye className="h-3 w-3" />
                              Ver demo
                            </span>
                          </div>
                        </a>
                        
                        {/* Boton verde con nombre - clic selecciona template */}
                        <button
                          type="button"
                          onClick={() => setSelectedTemplate(template.id)}
                          className="w-full bg-green-500 hover:bg-green-600 text-white text-center py-1.5 text-xs font-medium transition-colors"
                        >
                          {template.name}
                        </button>
                        
                        {/* Subtitulo */}
                        <p className="text-[10px] text-gray-500 text-center py-1 truncate px-1">
                          {template.subtitle}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Templates Premium */}
                <div className="pt-4 border-t">
                  <div className="flex items-center gap-2 mb-3">
                    <Crown className="h-4 w-4 text-amber-500" />
                    <p className="font-medium">Diseños Premium</p>
                    <Badge className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-[10px]">
                      $2.000
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Diseños exclusivos para destacar tu marca. Próximamente disponibles.
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {premiumTemplates.map((template) => (
                      <div
                        key={template.id}
                        className="relative border-2 rounded-xl p-2 transition-all text-left border-border opacity-60 cursor-not-allowed"
                      >
                        <Badge className="absolute -top-2 -right-2 text-[10px] px-1.5 py-0.5 bg-amber-500">
                          Pronto
                        </Badge>

<div className="relative h-16 rounded-lg overflow-hidden mb-2 bg-muted">
                                          <Image
                                            src={template.image || "/placeholder.svg"}
                                            alt={template.name}
                                            fill
                                            className="object-cover grayscale"
                                            sizes="100px"
                                            loading="lazy"
                                          />
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <Lock className="h-4 w-4 text-white" />
                          </div>
                        </div>

                        <div className="flex items-center gap-1 mb-0.5">
                          <div className="p-1 rounded bg-gradient-to-br from-amber-500 to-yellow-500">
                            <Crown className="h-3 w-3 text-white" />
                          </div>
                          <span className="text-xs font-medium">{template.name}</span>
                        </div>
                        <p className="text-[9px] text-muted-foreground leading-tight">{template.subtitle}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <Button
              onClick={handleStoreConfigSubmit}
              disabled={subdomain.length < 4 || subdomainAvailable === false || checkingSubdomain}
              className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {checkingSubdomain ? "Verificando nombre..." : "Crear mi tienda ya"}
            </Button>
          </div>
        )}

        {/* Step 4: Creating Store */}
        {step === "creating-store" && (
          <div className="space-y-6 py-8">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-primary mb-6">
                Estamos Creando su pagina espere un momento...
              </h2>
              <div className="relative">
                <Progress value={progress} className="h-3 bg-muted" />
                {progress >= 100 && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2">
                    <Check className="h-5 w-5 text-accent" />
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-4">Esto puede demorar unos segundos...</p>
            </div>
          </div>
        )}

        {/* Step 5: Success */}
        {step === "success" && storeData && (
          <div className="space-y-6 py-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold mb-4">¡Tu tienda online está lista!</h2>
              {storeData.emailSent ? (
                <p className="text-muted-foreground mb-4">
                  Te enviamos un email con los datos de acceso. Revisa spam si es necesario.
                </p>
              ) : (
                <p className="text-muted-foreground mb-4">Guarda estos datos, son tus credenciales de acceso.</p>
              )}

              <div className="mt-6 p-4 bg-muted rounded-lg text-left space-y-4">
                <div>
                  <p className="text-sm font-medium mb-1">Tu tienda:</p>
                  <a
                    href={getTestStoreUrl(storeData.subdomain)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary text-sm break-all hover:underline"
                  >
                    {getTestStoreUrl(storeData.subdomain)}
                  </a>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Panel de administración:</p>
                  <a
                    href={getTestAdminUrl(storeData.subdomain)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary text-sm break-all hover:underline"
                  >
                    {getTestAdminUrl(storeData.subdomain)}
                  </a>
                </div>
                <div className="border-t border-border pt-4">
                  <p className="text-sm font-medium mb-2">Credenciales de acceso:</p>
                  <div className="bg-background p-3 rounded border space-y-2">
                    <p className="text-sm">
                      <span className="text-muted-foreground">Usuario:</span>{" "}
                      <span className="font-mono font-medium">{storeData.username}</span>
                    </p>
                    <p className="text-sm">
                      <span className="text-muted-foreground">Contraseña:</span>{" "}
                      <span className="font-mono font-medium">{storeData.adminPassword}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <Button onClick={onClose} className="w-full bg-primary hover:bg-primary/90">
              Cerrar
            </Button>
          </div>
        )}

        {step === "error" && (
          <div className="space-y-6 py-8">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-4">Error al crear la tienda</h2>
              <p className="text-muted-foreground mb-4">{error}</p>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => setStep("store-config")} variant="outline" className="flex-1 bg-transparent">
                Intentar de nuevo
              </Button>
              <Button onClick={onClose} className="flex-1">
                Cerrar
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
