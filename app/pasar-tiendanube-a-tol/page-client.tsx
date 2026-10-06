"use client"

import type React from "react"
import { useState } from "react"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  RefreshCw,
  ExternalLink,
  Upload,
  Image as ImageIcon,
  Send,
  CheckCircle2,
  Loader2,
  Zap,
  FileText,
  KeyRound,
} from "lucide-react"

interface Props {
  brand?: "tol" | "tiendabasica"
}

export default function PasarTiendanubeATolPage({ brand = "tol" }: Props) {
  const [modo, setModo] = useState<"auto" | "manual">("auto")
  const [form, setForm] = useState({ name: "", email: "", whatsapp: "", storeUrl: "" })
  const [storeId, setStoreId] = useState("")
  const [accessToken, setAccessToken] = useState("")
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [fotos, setFotos] = useState<File[]>([])
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [resultado, setResultado] = useState<{ productos: number; fotos: number } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (modo === "manual" && !csvFile) {
      setError("Falta el archivo CSV que exportaste de Tiendanube.")
      return
    }
    if (modo === "auto" && (!storeId || !accessToken)) {
      setError("Falta el ID de tienda o el token de acceso.")
      return
    }

    setSending(true)
    try {
      if (modo === "auto") {
        const res = await fetch("/api/migracion-tiendanube/auto", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, storeId, accessToken }),
        })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error(data.error || "No se pudo importar")
        setResultado({ productos: data.productos, fotos: data.fotos })
      } else {
        const body = new FormData()
        body.append("name", form.name)
        body.append("email", form.email)
        body.append("whatsapp", form.whatsapp)
        body.append("storeUrl", form.storeUrl)
        body.append("csv", csvFile as File)
        fotos.forEach((f) => body.append("fotos", f))

        const res = await fetch("/api/migracion-tiendanube", { method: "POST", body })
        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          throw new Error(data.error || "No se pudo enviar")
        }
      }
      setSent(true)
    } catch (err: any) {
      setError(err.message || "Algo falló al enviar. Probá de nuevo o escribinos por WhatsApp.")
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      <Header brand={brand} />

      {/* Hero */}
      <section className="py-14 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-6 bg-orange-100 text-orange-700 hover:bg-orange-100">
            <RefreshCw className="w-3 h-3 mr-1" />
            Migración gratuita desde Tiendanube
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Pasá tu tienda de Tiendanube a tol.ar
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-2">
            Sin perder productos, precios ni fotos. Seguís vendiendo en Tiendanube mientras migramos.
          </p>
          <p className="text-2xl font-semibold text-orange-600">
            Apretá un botón y listo. Sin costo.
          </p>
        </div>
      </section>

      {/* Selector de modo */}
      <section className="py-4">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="grid sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setModo("auto")}
              className={`text-left rounded-xl border-2 p-5 transition-colors ${modo === "auto" ? "border-orange-500 bg-orange-50/60" : "border-border hover:border-orange-300"}`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-5 h-5 text-orange-500" />
                <span className="font-bold">Automático</span>
                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 text-xs">Recomendado</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Pegás un token, nosotros traemos productos, precios y fotos solos. Cero carga manual.
              </p>
            </button>
            <button
              type="button"
              onClick={() => setModo("manual")}
              className={`text-left rounded-xl border-2 p-5 transition-colors ${modo === "manual" ? "border-orange-500 bg-orange-50/60" : "border-border hover:border-orange-300"}`}
            >
              <div className="flex items-center gap-2 mb-1">
                <FileText className="w-5 h-5 text-orange-500" />
                <span className="font-bold">Manual</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Exportás vos el CSV desde tu panel y subís las fotos a mano. Más pasos, mismo resultado.
              </p>
            </button>
          </div>
        </div>
      </section>

      {modo === "auto" ? (
        <section className="py-6">
          <div className="container mx-auto px-4 max-w-3xl">
            <Card className="border-orange-100">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold shrink-0">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold mb-2">Generá tu token en tu panel de Tiendanube</h2>
                    <p className="text-muted-foreground mb-3">
                      Es una autorización tuya que le damos a la API oficial de Tiendanube para leer (no modificar)
                      tus productos y fotos. No tocamos tu cuenta ni tu contraseña, y no interrumpe tu tienda actual.
                    </p>
                    <p className="bg-muted rounded-lg px-4 py-3 text-sm font-mono mb-3">
                      Panel de Tiendanube → Aplicaciones a medida → Crear aplicación a medida → tildá solo lectura de
                      Productos e Imágenes → Guardar → Revelar token
                    </p>
                    <p className="text-sm text-muted-foreground mb-3">
                      Esta función depende de tu plan de Tiendanube — si no te aparece la opción "Aplicaciones a
                      medida" en tu panel, usá el modo Manual de más abajo. Copiá el token apenas lo veas: Tiendanube
                      solo lo muestra una vez.
                    </p>
                    <a
                      href="https://ayuda.tiendanube.com/es_ES/aplicaciones-a-medida/como-crear-una-aplicacion-a-medida-y-acceder-al-token-en-mi-tiendanube"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-orange-600 font-medium hover:underline"
                    >
                      Ver la guía oficial de Tiendanube <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      ) : (
        <>
      {/* Paso 1 */}
      <section className="py-10">
        <div className="container mx-auto px-4 max-w-3xl">
          <Card className="border-orange-100">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold shrink-0">1</div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold mb-2">Descargá tu catálogo de Tiendanube</h2>
                  <p className="text-muted-foreground mb-3">
                    Entrá a tu panel de Tiendanube y seguí esta ruta:
                  </p>
                  <p className="bg-muted rounded-lg px-4 py-3 text-sm font-mono mb-3">
                    Productos → Lista de productos → Importar y exportar → Exportar productos
                  </p>
                  <p className="text-muted-foreground mb-3">
                    Se descarga un archivo <strong>.csv</strong> a tu computadora. Es un click, no perdés nada de tu tienda actual.
                  </p>
                  <a
                    href="https://ayuda.tiendanube.com/es_ES/122710-importar-y-exportar-productos/como-descargar-la-lista-de-productos-de-mi-tiendanube"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-orange-600 font-medium hover:underline"
                  >
                    Ver la guía oficial de Tiendanube <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Paso 2 */}
      <section className="py-4">
        <div className="container mx-auto px-4 max-w-3xl">
          <Card className="border-orange-100">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold shrink-0">2</div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold mb-2">Juntá tus fotos (opcional, recomendado)</h2>
                  <p className="text-muted-foreground mb-3">
                    El CSV de Tiendanube no incluye las fotos de los productos — es una limitación de ellos, no nuestra.
                    Si tenés las fotos guardadas (en tu celular, computadora o Google Drive), seleccionalas todas juntas
                    más abajo. Aceptamos varios archivos sueltos o un ZIP.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    ¿No las tenés a mano? Mandá igual el CSV — armamos la tienda con lo que tengamos y coordinamos
                    las fotos después por WhatsApp.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
        </>
      )}

      {/* Paso 3 — formulario */}
      <section className="py-10">
        <div className="container mx-auto px-4 max-w-3xl">
          <Card className="border-orange-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4 mb-2">
                <div className="w-9 h-9 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold shrink-0">3</div>
                <h2 className="text-xl font-bold">{modo === "auto" ? "Pegá el token y listo" : "Mandanos todo"}</h2>
              </div>

              {sent ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">
                    {modo === "auto" && resultado
                      ? `¡Listo! Importamos ${resultado.productos} productos y ${resultado.fotos} fotos.`
                      : "¡Listo, lo recibimos!"}
                  </h3>
                  <p className="text-muted-foreground">
                    Te contactamos en menos de 24-48hs con tu tienda armada en tol.ar y los datos de acceso.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Tu nombre</label>
                      <Input
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Juan Pérez"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Email</label>
                      <Input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="juan@email.com"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">WhatsApp</label>
                      <Input
                        required
                        value={form.whatsapp}
                        onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                        placeholder="+54 9 11 1234-5678"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">URL de tu tienda en Tiendanube</label>
                      <Input
                        required
                        value={form.storeUrl}
                        onChange={(e) => setForm({ ...form, storeUrl: e.target.value })}
                        placeholder="https://mitienda.tiendanube.com"
                      />
                    </div>
                  </div>

                  {modo === "auto" ? (
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">ID de tienda (Store ID)</label>
                        <Input
                          required
                          value={storeId}
                          onChange={(e) => setStoreId(e.target.value)}
                          placeholder="123456"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Token de acceso</label>
                        <Input
                          required
                          type="password"
                          value={accessToken}
                          onChange={(e) => setAccessToken(e.target.value)}
                          placeholder="Pegá acá el token que revelaste en Tiendanube"
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Archivo CSV exportado de Tiendanube</label>
                        <label
                          className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center gap-2 bg-muted/40 cursor-pointer transition-colors ${csvFile ? "border-orange-400 bg-orange-50/40" : "border-border hover:border-orange-300"}`}
                        >
                          <Upload className="w-6 h-6 text-orange-500" />
                          <p className="text-sm font-medium text-foreground">
                            {csvFile ? csvFile.name : "Elegí el archivo .csv que descargaste"}
                          </p>
                          <input
                            type="file"
                            accept=".csv"
                            className="hidden"
                            onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                          />
                        </label>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-1 block">Fotos de tus productos (opcional)</label>
                        <label className="border-2 border-dashed rounded-xl p-6 flex flex-col items-center gap-2 bg-muted/40 cursor-pointer transition-colors border-border hover:border-orange-300">
                          <ImageIcon className="w-6 h-6 text-orange-500" />
                          <p className="text-sm font-medium text-foreground">
                            {fotos.length > 0 ? `${fotos.length} archivo(s) elegido(s)` : "Elegí las fotos o un ZIP"}
                          </p>
                          <input
                            type="file"
                            accept=".zip,image/*"
                            multiple
                            className="hidden"
                            onChange={(e) => setFotos(Array.from(e.target.files || []))}
                          />
                        </label>
                      </div>
                    </>
                  )}

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                      {error}
                    </div>
                  )}

                  <Button type="submit" className="w-full gap-2 bg-orange-500 hover:bg-orange-600" disabled={sending}>
                    {sending ? (
                      <>
                        {modo === "auto" ? "Importando…" : "Enviando…"} <Loader2 className="w-4 h-4 animate-spin" />
                      </>
                    ) : (
                      <>
                        {modo === "auto" ? "Importar todo automáticamente" : "Enviar y migrar gratis"} <Send className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
          <p className="text-center text-sm text-muted-foreground mt-6">
            Tu tienda en Tiendanube sigue funcionando mientras migramos. Sin riesgos, sin costo.
          </p>
        </div>
      </section>

      <Footer brand={brand} />
    </div>
  )
}
