"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { ImageUpload } from "./image-upload"
import { Instagram, Facebook, Youtube } from "lucide-react"
import type { Store } from "@/lib/store-context"

interface StoreSettingsProps {
  store: Store
}

export function StoreSettings({ store }: StoreSettingsProps) {
  // Banner
  const [bannerImage, setBannerImage] = useState(store.banner_image || "")
  const [bannerTitle, setBannerTitle] = useState(store.banner_title || "Bienvenido a")
  const [bannerSubtitle, setBannerSubtitle] = useState(store.banner_subtitle || "Descubre nuestra colección exclusiva")

  // Banda superior
  const [topBarEnabled, setTopBarEnabled] = useState(store.top_bar_enabled !== false)
  const [topBarText, setTopBarText] = useState(store.top_bar_text || "Envío gratis en compras mayores a $50.000")

  // Redes sociales
  const [socialInstagram, setSocialInstagram] = useState(store.social_instagram || "")
  const [socialFacebook, setSocialFacebook] = useState(store.social_facebook || "")
  const [socialTwitter, setSocialTwitter] = useState(store.social_twitter || "")
  const [socialTiktok, setSocialTiktok] = useState(store.social_tiktok || "")
  const [socialWhatsapp, setSocialWhatsapp] = useState(store.social_whatsapp || "")
  const [socialYoutube, setSocialYoutube] = useState(store.social_youtube || "")

  // Pie de página
  const [footerSubtitle, setFooterSubtitle] = useState(
    store.footer_subtitle || "Tu destino para encontrar los mejores productos con estilo y calidad.",
  )

  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  const handleSaveAll = async () => {
    setSaving(true)
    setMessage("")

    if (!store.id) {
      setMessage("Error: No se encontró el ID de la tienda")
      setSaving(false)
      return
    }

    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeId: store.id,
          banner_image: bannerImage,
          banner_title: bannerTitle,
          banner_subtitle: bannerSubtitle,
          top_bar_enabled: topBarEnabled,
          top_bar_text: topBarText,
          social_instagram: socialInstagram,
          social_facebook: socialFacebook,
          social_twitter: socialTwitter,
          social_tiktok: socialTiktok,
          social_whatsapp: socialWhatsapp,
          social_youtube: socialYoutube,
          footer_subtitle: footerSubtitle,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage("Ajustes guardados correctamente")
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
        <Button onClick={handleSaveAll} disabled={saving}>
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
            <Input value={store.site_title} disabled />
          </div>
          <div>
            <Label>Subdominio</Label>
            <Input value={store.subdomain} disabled />
          </div>
          <div>
            <Label>Email</Label>
            <Input value={store.email} disabled />
          </div>
          <div>
            <Label>Estado</Label>
            <Input value={store.status} disabled />
          </div>
          <p className="text-sm text-neutral-500">Para modificar estos datos, contactá a soporte.</p>
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
            <ImageUpload value={bannerImage} onChange={setBannerImage} />
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
    </div>
  )
}
