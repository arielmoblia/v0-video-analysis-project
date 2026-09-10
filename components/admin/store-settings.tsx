"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { ImageUpload } from "./image-upload"
import { MinorConsentStatus } from "./minor-consent-status"
import { Instagram, Facebook, Youtube } from "lucide-react"
import type { Store } from "@/lib/store-context"

interface StoreSettingsProps {
  store: Store
}

// Subdominios que usa la infraestructura de tol.ar y no se pueden pisar
const RESERVED_SUBDOMAINS = [
  "www", "admin", "api", "control", "scraping", "mail", "ftp", "smtp",
  "staging", "dev", "test", "app", "cdn", "static", "assets", "blog",
  "help", "soporte", "tienda", "traductor",
]

export function StoreSettings({ store }: StoreSettingsProps) {
  // Información básica
  const [storeName, setStoreName] = useState(store.site_title || "")
  const [storeEmail, setStoreEmail] = useState(store.email || "")

  // Subdominio (nombre.tol.ar)
  const [subdomain, setSubdomain] = useState(store.subdomain || "")
  const [subdomainStatus, setSubdomainStatus] = useState<"idle" | "checking" | "available" | "taken" | "invalid">(
    "idle",
  )

  // Banner
  const [bannerImage, setBannerImage] = useState(store.banner_image || "")
  const [bannerTitle, setBannerTitle] = useState(store.banner_title || "Bienvenido a")
  const [bannerSubtitle, setBannerSubtitle] = useState(store.banner_subtitle || "Descubre nuestra colección exclusiva")
  const [showProductsButton, setShowProductsButton] = useState(store.show_products_button !== false)

  // Banda superior
  const [topBarEnabled, setTopBarEnabled] = useState(store.top_bar_enabled !== false)
  const [topBarText, setTopBarText] = useState(store.top_bar_text || "Envío gratis en compras mayores a $50.000")

  // Redes sociales
  const [socialInstagram, setSocialInstagram] = useState(store.social_instagram || "")
  const [socialFacebook, setSocialFacebook] = useState(store.social_facebook || "")
  const [socialTwitter, setSocialTwitter] = useState(store.social_twitter || "")
  const [socialTiktok, setSocialTiktok] = useState(store.social_tiktok || "")
  const [storeAddress, setStoreAddress] = useState(store.address || "")
  const [storePhone, setStorePhone] = useState(store.phone || "")
  const [socialWhatsapp, setSocialWhatsapp] = useState(store.social_whatsapp || "")
  const [whatsappMarketingConsent, setWhatsappMarketingConsent] = useState(store.whatsapp_marketing_consent || false)
  const [socialYoutube, setSocialYoutube] = useState(store.social_youtube || "")

  // Pie de página
  const [footerSubtitle, setFooterSubtitle] = useState(
    store.footer_subtitle || "Tu destino para encontrar los mejores productos con estilo y calidad.",
  )

  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  // Verificar disponibilidad del subdominio en vivo, con debounce
  useEffect(() => {
    const normalized = subdomain.toLowerCase().trim()

    if (normalized === (store.subdomain || "").toLowerCase()) {
      setSubdomainStatus("idle")
      return
    }

    if (normalized.length < 4 || !/^[a-z0-9]+$/.test(normalized)) {
      setSubdomainStatus("invalid")
      return
    }

    if (RESERVED_SUBDOMAINS.includes(normalized)) {
      setSubdomainStatus("taken")
      return
    }

    setSubdomainStatus("checking")
    const timeoutId = setTimeout(async () => {
      try {
        const res = await fetch(`/api/check-subdomain?subdomain=${normalized}`)
        const data = await res.json()
        setSubdomainStatus(data.available ? "available" : "taken")
      } catch {
        setSubdomainStatus("idle")
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [subdomain, store.subdomain])

  const handleSaveAll = async () => {
    setSaving(true)
    setMessage("")

    if (!store.id) {
      setMessage("Error: No se encontró el ID de la tienda")
      setSaving(false)
      return
    }

    const normalizedSubdomain = subdomain.toLowerCase().trim()
    const subdomainChanged = normalizedSubdomain !== (store.subdomain || "").toLowerCase()

    if (subdomainChanged && (subdomainStatus === "invalid" || subdomainStatus === "taken")) {
      setMessage("Error: revisá el subdominio, no se puede guardar así")
      setSaving(false)
      return
    }

    if (subdomainChanged && subdomainStatus === "checking") {
      setMessage("Esperá que termine de verificar el subdominio")
      setSaving(false)
      return
    }

    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeId: store.id,
          site_title: storeName,
          subdomain: normalizedSubdomain,
          email: storeEmail,
          banner_image: bannerImage,
          banner_title: bannerTitle,
          banner_subtitle: bannerSubtitle,
          show_products_button: showProductsButton,
          top_bar_enabled: topBarEnabled,
          top_bar_text: topBarText,
          social_instagram: socialInstagram,
          social_facebook: socialFacebook,
          social_twitter: socialTwitter,
          social_tiktok: socialTiktok,
          social_whatsapp: socialWhatsapp,
          whatsapp_marketing_consent: whatsappMarketingConsent,
          social_youtube: socialYoutube,
          footer_subtitle: footerSubtitle,
          address: storeAddress,
          phone: storePhone,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        if (subdomainChanged) {
          setMessage(`Ajustes guardados. Redirigiendo a ${normalizedSubdomain}.tol.ar/admin...`)
          window.location.href = `https://${normalizedSubdomain}.tol.ar/admin`
        } else {
          setMessage("Ajustes guardados correctamente")
        }
      } else {
        setMessage(`Error: ${data.error || "desconocido"}`)
      }
    } catch (error) {
      setMessage("Error de conexión")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-light tracking-wide">Ajustes</h2>
        <Button
          onClick={handleSaveAll}
          disabled={saving || subdomainStatus === "checking" || subdomainStatus === "invalid" || subdomainStatus === "taken"}
        >
          {saving ? "Guardando..." : "Guardar todos los cambios"}
        </Button>
      </div>

      {message && (
        <p className={`text-sm ${message.includes("Error") ? "text-red-500" : "text-green-500"}`}>{message}</p>
      )}

      {/* Información básica */}
      <Card>
        <CardHeader>
          <CardTitle>Información de la tienda</CardTitle>
          <CardDescription>Datos básicos de tu tienda</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Nombre de la tienda</Label>
            <Input
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              placeholder="Nombre de tu tienda"
            />
          </div>
          <div>
            <Label>Subdominio</Label>
            <div className="flex items-center gap-2">
              <Input
                value={subdomain}
                onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ""))}
                placeholder="nombretienda"
              />
              <span className="text-sm text-neutral-500 whitespace-nowrap">.tol.ar</span>
            </div>
            {subdomainStatus === "checking" && (
              <p className="text-xs text-neutral-500 mt-1">Verificando disponibilidad...</p>
            )}
            {subdomainStatus === "available" && (
              <p className="text-xs text-green-600 mt-1">Disponible</p>
            )}
            {subdomainStatus === "taken" && (
              <p className="text-xs text-red-500 mt-1">Ese nombre ya está en uso, elegí otro</p>
            )}
            {subdomainStatus === "invalid" && (
              <p className="text-xs text-red-500 mt-1">
                Mínimo 4 caracteres, solo letras y números, sin espacios ni símbolos
              </p>
            )}
            {subdomain.toLowerCase().trim() !== (store.subdomain || "").toLowerCase() &&
              subdomainStatus !== "invalid" &&
              subdomainStatus !== "taken" && (
                <p className="text-xs text-amber-600 mt-1">
                  Ojo: al guardar, tu tienda pasa a {subdomain}.tol.ar y el link viejo ({store.subdomain}.tol.ar)
                  deja de funcionar.
                </p>
              )}
          </div>
          <div>
            <Label>Correo electrónico</Label>
            <Input
              value={storeEmail}
              onChange={(e) => setStoreEmail(e.target.value)}
              placeholder="tu@email.com"
              type="email"
            />
          </div>
          <div>
            <Label>Dirección</Label>
            <Input
              value={storeAddress}
              onChange={(e) => setStoreAddress(e.target.value)}
              placeholder="Ej: Av. Corrientes 1234, Buenos Aires"
            />
          </div>
          <div>
            <Label>Teléfono</Label>
            <Input
              value={storePhone}
              onChange={(e) => setStorePhone(e.target.value)}
              placeholder="Ej: +54 11 1234-5678"
            />
          </div>
        </CardContent>
      </Card>

      {/* Banda Superior */}
      <Card>
        <CardHeader>
          <CardTitle>Banda Superior</CardTitle>
          <CardDescription>La barra negra que aparece arriba del header</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Mostrar banda superior</Label>
              <p className="text-xs text-neutral-500">Activa o desactiva la banda negra del header</p>
            </div>
            <Switch checked={topBarEnabled} onCheckedChange={setTopBarEnabled} />
          </div>

          <div>
            <Label>Texto de la banda</Label>
            <Input
              value={topBarText}
              onChange={(e) => setTopBarText(e.target.value)}
              placeholder="Envío gratis en compras mayores a $50.000"
            />
          </div>
        </CardContent>
      </Card>

      {/* Banner Principal */}
      <Card>
        <CardHeader>
          <CardTitle>Banner Principal</CardTitle>
          <CardDescription>Personalizá la imagen y textos del banner de tu tienda</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="mb-2 block">Imagen del Banner</Label>
            <ImageUpload value={bannerImage} onChange={setBannerImage} type="banner" />
            <p className="text-xs text-neutral-500 mt-2">
              Recomendado: 1920x1080px. Si no subes una imagen, se usará la predeterminada.
            </p>
          </div>

          <div>
            <Label>Título del Banner</Label>
            <Input value={bannerTitle} onChange={(e) => setBannerTitle(e.target.value)} placeholder="Bienvenido a" />
            <p className="text-xs text-neutral-500 mt-1">Este texto aparece arriba del nombre de tu tienda</p>
          </div>

          <div>
            <Label>Subtítulo del Banner</Label>
            <Textarea
              value={bannerSubtitle}
              onChange={(e) => setBannerSubtitle(e.target.value)}
              placeholder="Descubre nuestra colección exclusiva"
              rows={2}
            />
            <p className="text-xs text-neutral-500 mt-1">Este texto aparece debajo del nombre de tu tienda</p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Mostrar botón "Ver Productos"</Label>
              <p className="text-xs text-neutral-500">El botón del banner que lleva directo a los productos</p>
            </div>
            <Switch checked={showProductsButton} onCheckedChange={setShowProductsButton} />
          </div>
        </CardContent>
      </Card>

      {/* Redes Sociales */}
      <Card>
        <CardHeader>
          <CardTitle>Redes Sociales</CardTitle>
          <CardDescription>
            Agregá los links de tus redes. Si dejás un campo vacío, no se mostrará el ícono.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label className="flex items-center gap-2">
                <Instagram className="h-4 w-4" /> Instagram
              </Label>
              <Input
                value={socialInstagram}
                onChange={(e) => setSocialInstagram(e.target.value)}
                placeholder="https://instagram.com/tutienda"
              />
            </div>

            <div>
              <Label className="flex items-center gap-2">
                <Facebook className="h-4 w-4" /> Facebook
              </Label>
              <Input
                value={socialFacebook}
                onChange={(e) => setSocialFacebook(e.target.value)}
                placeholder="https://facebook.com/tutienda"
              />
            </div>

            <div>
              <Label className="flex items-center gap-2">
                <Youtube className="h-4 w-4" /> YouTube
              </Label>
              <Input
                value={socialYoutube}
                onChange={(e) => setSocialYoutube(e.target.value)}
                placeholder="https://youtube.com/@tutienda"
              />
            </div>

            <div>
              <Label className="flex items-center gap-2">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                X (Twitter)
              </Label>
              <Input
                value={socialTwitter}
                onChange={(e) => setSocialTwitter(e.target.value)}
                placeholder="https://x.com/tutienda"
              />
            </div>

            <div>
              <Label>TikTok</Label>
              <Input
                value={socialTiktok}
                onChange={(e) => setSocialTiktok(e.target.value)}
                placeholder="https://tiktok.com/@tutienda"
              />
            </div>

            <div>
              <Label>WhatsApp (número sin +)</Label>
              <Input
                value={socialWhatsapp}
                onChange={(e) => setSocialWhatsapp(e.target.value)}
                placeholder="5491123456789"
              />
              <p className="text-xs text-neutral-500 mt-1">
                Ingresá el número completo con código de país, sin + ni espacios
              </p>
              <div className="flex items-start gap-2 mt-3">
                <input
                  type="checkbox"
                  id="whatsappMarketingConsent"
                  checked={whatsappMarketingConsent}
                  onChange={(e) => setWhatsappMarketingConsent(e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <div>
                  <Label htmlFor="whatsappMarketingConsent" className="text-sm font-normal text-neutral-600 cursor-pointer">
                    Quiero recibir mis <strong className="font-bold">VENTAS</strong> y novedades por WhatsApp
                  </Label>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Podés darte de baja cuando quieras respondiendo "BAJA" al mensaje.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pie de Página */}
      <Card>
        <CardHeader>
          <CardTitle>Pie de Página</CardTitle>
          <CardDescription>Personalizá el texto del footer de tu tienda</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Descripción del footer</Label>
            <Textarea
              value={footerSubtitle}
              onChange={(e) => setFooterSubtitle(e.target.value)}
              placeholder="Tu destino para encontrar los mejores productos con estilo y calidad."
              rows={3}
            />
            <p className="text-xs text-neutral-500 mt-1">Este texto aparece debajo del nombre de tu tienda en el pie</p>
          </div>
        </CardContent>
      </Card>

      <MinorConsentStatus subdomain={store.subdomain || ""} />
    </div>
  )
}
