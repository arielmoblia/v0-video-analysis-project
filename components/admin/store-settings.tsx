"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { ImageUpload } from "./image-upload"
import { MinorConsentStatus } from "./minor-consent-status"
import { Instagram, Facebook, Youtube, AlertTriangle, Eye, EyeOff } from "lucide-react"
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
  const [logoUrl, setLogoUrl] = useState(store.logo_url || "")
  const [dataFiscalUrl, setDataFiscalUrl] = useState(store.data_fiscal_url || "")

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

  // Cambio de contraseña
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmNewPassword, setConfirmNewPassword] = useState("")
  const [changingPassword, setChangingPassword] = useState(false)
  const [passwordMessage, setPasswordMessage] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false)

  // Dar de baja la tienda
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletePassword, setDeletePassword] = useState("")
  const [showDeletePassword, setShowDeletePassword] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState("")

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
          logo_url: logoUrl,
          data_fiscal_url: dataFiscalUrl,
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

  const handleChangePassword = async () => {
    setPasswordMessage("")

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setPasswordMessage("Error: completá los tres campos")
      return
    }
    if (newPassword !== confirmNewPassword) {
      setPasswordMessage("Error: la nueva contraseña no coincide en los dos campos")
      return
    }

    setChangingPassword(true)
    try {
      const response = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subdomain: store.subdomain,
          currentPassword,
          newPassword,
        }),
      })
      const data = await response.json()
      if (response.ok) {
        setPasswordMessage("Contraseña actualizada correctamente")
        setCurrentPassword("")
        setNewPassword("")
        setConfirmNewPassword("")
      } else {
        setPasswordMessage(`Error: ${data.error || "no se pudo cambiar la contraseña"}`)
      }
    } catch {
      setPasswordMessage("Error de conexión")
    } finally {
      setChangingPassword(false)
    }
  }

  const handleDeleteAccount = async () => {
    setDeleteError("")

    if (!deletePassword) {
      setDeleteError("Ingresá tu contraseña de administrador")
      return
    }

    setDeleting(true)
    try {
      const response = await fetch("/api/admin/delete-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subdomain: store.subdomain,
          password: deletePassword,
        }),
      })
      const data = await response.json()
      if (response.ok) {
        window.location.href = "https://tol.ar/"
      } else {
        setDeleteError(data.error || "No se pudo dar de baja la tienda")
      }
    } catch {
      setDeleteError("Error de conexión")
    } finally {
      setDeleting(false)
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
          <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-4 md:gap-6">
            <div className="space-y-4">
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
            </div>
            <div>
              <Label className="mb-2 block">Logo</Label>
              <ImageUpload value={logoUrl} onChange={setLogoUrl} type="logo" />
              <p className="text-xs text-neutral-500 mt-2">
                Si subís una imagen, reemplaza el nombre en letras del encabezado de tu tienda. Si no subís nada, se
                sigue mostrando el nombre de la tienda en texto.
              </p>
            </div>
          </div>
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm font-medium text-amber-900">
              Obligaciones de AFIP y Defensa del Consumidor para tiendas online en Argentina
            </p>
            <ul className="mt-2 space-y-1 text-xs text-amber-800 list-disc pl-4">
              <li>
                <strong>Botón de Arrepentimiento</strong> (Resolución 424/2020): ya está puesto solo en tu tienda, no
                tenés que hacer nada.
              </li>
              <li>
                <strong>QR Data Fiscal de AFIP</strong> (Formulario 960/D): es obligatorio mostrarlo en tu tienda, pero
                es único por cada comerciante (está atado a tu CUIT) — nosotros no te lo podemos generar. Lo sacás
                gratis entrando a{" "}
                <a
                  href="https://www.afip.gob.ar/960/formulario-960/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  afip.gob.ar
                </a>{" "}
                con tu Clave Fiscal, pedís el "Formulario 960/D", y te da una imagen con el código QR. Subila acá
                abajo y listo.
              </li>
            </ul>
            <div className="mt-3 max-w-[200px]">
              <Label className="mb-2 block text-xs">QR Data Fiscal (AFIP)</Label>
              <ImageUpload value={dataFiscalUrl} onChange={setDataFiscalUrl} type="qr" />
            </div>
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

      {/* Seguridad: cambiar contraseña */}
      <Card>
        <CardHeader>
          <CardTitle>Seguridad</CardTitle>
          <CardDescription>Cambiá la contraseña con la que entrás a este panel de administración</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Contraseña actual</Label>
            <div className="relative">
              <Input
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Tu contraseña actual"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-neutral-900"
                tabIndex={-1}
              >
                {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div>
            <Label>Nueva contraseña</Label>
            <div className="relative">
              <Input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-neutral-900"
                tabIndex={-1}
              >
                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div>
            <Label>Confirmar nueva contraseña</Label>
            <div className="relative">
              <Input
                type={showConfirmNewPassword ? "text" : "password"}
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="Repetí la nueva contraseña"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmNewPassword((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-neutral-900"
                tabIndex={-1}
              >
                {showConfirmNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          {passwordMessage && (
            <p className={`text-sm ${passwordMessage.includes("Error") ? "text-red-500" : "text-green-600"}`}>
              {passwordMessage}
            </p>
          )}
          <Button onClick={handleChangePassword} disabled={changingPassword} variant="outline">
            {changingPassword ? "Cambiando..." : "Cambiar contraseña"}
          </Button>
        </CardContent>
      </Card>

      {/* Zona de peligro: dar de baja la tienda */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Zona de peligro
          </CardTitle>
          <CardDescription>Dar de baja tu tienda de forma definitiva</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-neutral-600 mb-4">
            Esto borra tu tienda ({store.subdomain}.tol.ar) para siempre: productos, pedidos, categorías, imágenes y
            toda la configuración. No hay forma de recuperarla después.
          </p>
          <Button
            variant="destructive"
            onClick={() => {
              setDeleteError("")
              setDeletePassword("")
              setDeleteDialogOpen(true)
            }}
          >
            Dar de baja mi tienda
          </Button>
        </CardContent>
      </Card>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              ¿Dar de baja {store.subdomain}.tol.ar?
            </DialogTitle>
            <DialogDescription>
              Vas a borrar {store.subdomain}.tol.ar. Esta acción no se puede deshacer: se van a borrar para siempre
              todos los productos, pedidos, categorías, imágenes y toda la información de tu tienda. No vas a poder
              recuperar nada después de confirmar.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Tu contraseña de administrador</Label>
              <div className="relative">
                <Input
                  type={showDeletePassword ? "text" : "password"}
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  placeholder="Contraseña actual"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowDeletePassword((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-neutral-900"
                  tabIndex={-1}
                >
                  {showDeletePassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            {deleteError && <p className="text-sm text-red-500">{deleteError}</p>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={deleting}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteAccount} disabled={deleting}>
              {deleting ? "Borrando..." : "Sí, borrar todo"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
