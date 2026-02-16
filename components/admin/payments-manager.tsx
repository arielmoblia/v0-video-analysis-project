"use client"

import { DialogDescription } from "@/components/ui/dialog"
import { DialogTitle } from "@/components/ui/dialog"
import { DialogHeader } from "@/components/ui/dialog"
import { DialogContent } from "@/components/ui/dialog"
import { DialogTrigger } from "@/components/ui/dialog"
import { Dialog } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Info, ShoppingBag, Receipt } from "lucide-react"
import {
  Banknote,
  CreditCard,
  Building2,
  Wallet,
  Save,
  Loader2,
  CheckCircle2,
  Copy,
  Eye,
  EyeOff,
  Smartphone,
  Store,
  PlayCircle,
} from "lucide-react"
import { useState, useEffect } from "react"

function VideoTutorial({ videoId, title, videoUrl }: { videoId?: string; title: string; videoUrl?: string }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <PlayCircle className="w-4 h-4" />
        {title}
      </div>
      <div className="relative w-full aspect-video rounded-lg overflow-hidden border bg-black">
        {videoUrl ? (
          <video
            controls
            playsInline
            className="absolute inset-0 w-full h-full object-contain"
            src={videoUrl}
          >
            Tu navegador no soporta el video.
          </video>
        ) : videoId ? (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        ) : null}
      </div>
    </div>
  )
}

interface PaymentsManagerProps {
  storeId: string
}

interface PaymentMethods {
  cash_enabled: boolean
  cash_instructions: string
  card_enabled: boolean
  card_instructions: string
  transfer_enabled: boolean
  transfer_bank_name: string
  transfer_account_holder: string
  transfer_cbu: string
  transfer_alias: string
  mercadopago_enabled: boolean
  mercadopago_link: string
  mercadopago_access_token: string
  mercadopago_test_mode: boolean
  mercadopago_test_token: string
  mercadopago_checkout_type: "redirect" | "modal"
  mobbex_enabled: boolean
  mobbex_api_key: string
  mobbex_access_token: string
  modo_enabled: boolean
  modo_phone: string
  uala_enabled: boolean
  uala_link: string
  rapipago_enabled: boolean
  rapipago_instructions: string
}

export function PaymentsManager({ storeId }: PaymentsManagerProps) {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showAccessToken, setShowAccessToken] = useState(false)
  const [payments, setPayments] = useState<PaymentMethods>({
    cash_enabled: false,
    cash_instructions: "",
    card_enabled: false,
    card_instructions: "",
    transfer_enabled: false,
    transfer_bank_name: "",
    transfer_account_holder: "",
    transfer_cbu: "",
    transfer_alias: "",
    mercadopago_enabled: false,
    mercadopago_link: "",
    mercadopago_access_token: "",
    mercadopago_test_mode: false,
    mercadopago_test_token: "",
    mercadopago_checkout_type: "redirect",
    mobbex_enabled: false,
    mobbex_api_key: "",
    mobbex_access_token: "",
    modo_enabled: false,
    modo_phone: "",
    uala_enabled: false,
    uala_link: "",
    rapipago_enabled: false,
    rapipago_instructions: "",
  })

  useEffect(() => {
    fetchPayments()
  }, [storeId])

  const fetchPayments = async () => {
    try {
      const res = await fetch(`/api/admin/payments?storeId=${storeId}`)
      if (res.ok) {
        const data = await res.json()
        if (data) {
          setPayments({
            cash_enabled: data.cash_enabled || false,
            cash_instructions: data.cash_instructions || "",
            card_enabled: data.card_enabled || false,
            card_instructions: data.card_instructions || "",
            transfer_enabled: data.transfer_enabled || false,
            transfer_bank_name: data.transfer_bank_name || "",
            transfer_account_holder: data.transfer_account_holder || "",
            transfer_cbu: data.transfer_cbu || "",
            transfer_alias: data.transfer_alias || "",
            mercadopago_enabled: data.mercadopago_enabled || false,
            mercadopago_link: data.mercadopago_link || "",
            mercadopago_access_token: data.mercadopago_access_token || "",
            mercadopago_test_mode: data.mercadopago_test_mode || false,
            mercadopago_test_token: data.mercadopago_test_token || "",
            mobbex_enabled: data.mobbex_enabled || false,
            mobbex_api_key: data.mobbex_api_key || "",
            mobbex_access_token: data.mobbex_access_token || "",
            modo_enabled: data.modo_enabled || false,
            modo_phone: data.modo_phone || "",
            uala_enabled: data.uala_enabled || false,
            uala_link: data.uala_link || "",
            rapipago_enabled: data.rapipago_enabled || false,
            rapipago_instructions: data.rapipago_instructions || "",
          })
        }
      }
    } catch (error) {
      console.error("Error fetching payments:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      console.log("[v0] Guardando pagos:", { storeId, ...payments })
      const res = await fetch("/api/admin/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storeId, ...payments }),
      })
      const data = await res.json()
      console.log("[v0] Respuesta guardado:", data, "Status:", res.status)
      
      if (res.ok) {
        alert("Configuracion de pagos guardada correctamente")
      } else {
        alert("Error al guardar: " + (data.error || "Error desconocido"))
      }
    } catch (error) {
      console.error("[v0] Error saving payments:", error)
      alert("Error de conexion al guardar")
    } finally {
      setSaving(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert("Copiado al portapapeles")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Pagos</h2>
          <p className="text-muted-foreground">Gestioná los pagos de tu tienda y tu suscripción</p>
        </div>
      </div>

      <Tabs defaultValue="tienda" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="tienda" className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4" />
            Para tu tienda
          </TabsTrigger>
          <TabsTrigger value="suscripcion" className="flex items-center gap-2">
            <Receipt className="w-4 h-4" />
            Tu suscripción
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: Pagos para la tienda */}
        <TabsContent value="tienda" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Métodos de pago para tus clientes</h3>
              <p className="text-sm text-muted-foreground">Configurá cómo tus clientes te pagan</p>
            </div>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Guardar Cambios
            </Button>
          </div>

          {/* Sección: Pagos Online */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">💳 Pagos Online</h3>

            <div className="grid gap-6">
              {/* Mercado Pago */}
              <Card className="border-sky-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-sky-100 rounded-lg">
                        <Wallet className="w-5 h-5 text-sky-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          Mercado Pago
                          <span className="text-xs bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full">Recomendado</span>
                        </CardTitle>
                        <CardDescription>Tarjetas, débito, saldo MP y cuotas sin interés</CardDescription>
                      </div>
                    </div>
                    <Switch
                      checked={payments.mercadopago_enabled}
                      onCheckedChange={(checked) => setPayments({ ...payments, mercadopago_enabled: checked })}
                    />
                  </div>
                </CardHeader>
                {payments.mercadopago_enabled && (
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Columna izquierda: Formulario */}
                      <div className="space-y-4">
                        
                        {/* MODO PRUEBA (SANDBOX) - Arriba */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label className="flex items-center gap-2">
                              Modo Prueba (Sandbox)
                              <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">Testing</span>
                            </Label>
                            <Switch
                              checked={payments.mercadopago_test_mode}
                              onCheckedChange={(checked) => setPayments({ ...payments, mercadopago_test_mode: checked })}
                            />
                          </div>
                          
                          {payments.mercadopago_test_mode && (
                            <div className="space-y-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                              <p className="text-xs text-orange-800">
                                El modo prueba permite testear pagos sin usar dinero real. Usa las credenciales de TEST de MercadoPago.
                              </p>
                              <div className="space-y-2">
                                <Label className="text-sm">Access Token de TEST</Label>
                                <Input
                                  type="password"
                                  placeholder="TEST-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                                  value={payments.mercadopago_test_token}
                                  onChange={(e) => setPayments({ ...payments, mercadopago_test_token: e.target.value })}
                                />
                                {payments.mercadopago_test_token && payments.mercadopago_test_token.startsWith("TEST-") && (
                                  <p className="text-xs text-green-600 flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3" /> Token de prueba configurado
                                  </p>
                                )}
                              </div>
                              <p className="text-xs text-orange-700">
                                Para probar usa tarjetas de prueba de MP. El pago no se cobra realmente.
                              </p>
                            </div>
                          )}
                        </div>

                        {/* MODO PRODUCCION - Abajo */}
                        <div className="space-y-3 border-t pt-4">
                          <div className="flex items-center justify-between">
                            <Label className="flex items-center gap-2">
                              Modo Producción
                            </Label>
                            <Switch
                              checked={!payments.mercadopago_test_mode}
                              onCheckedChange={(checked) => setPayments({ ...payments, mercadopago_test_mode: !checked })}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label className="flex items-center gap-2 text-sm">
                              Access Token de Producción
                              <span className="text-xs text-muted-foreground">(requerido)</span>
                            </Label>
                            <div className="flex gap-2">
                              <div className="relative flex-1">
                                <Input
                                  type={showAccessToken ? "text" : "password"}
                                  placeholder="APP_USR-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                                  value={payments.mercadopago_access_token}
                                  onChange={(e) => setPayments({ ...payments, mercadopago_access_token: e.target.value })}
                                  className="pr-10"
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowAccessToken(!showAccessToken)}
                                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
                                >
                                  {showAccessToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                              </div>
                              {payments.mercadopago_access_token && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  onClick={() => copyToClipboard(payments.mercadopago_access_token)}
                                >
                                  <Copy className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                            {payments.mercadopago_access_token &&
                              payments.mercadopago_access_token.startsWith("APP_USR-") && (
                                <p className="text-xs text-green-600 flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" /> Access Token válido
                                </p>
                              )}
                          </div>
                        </div>

                        {/* Link de MP */}
                        <div className="space-y-2 border-t pt-4">
                          <Label className="flex items-center gap-2">
                            Link de Mercado Pago
                            <span className="text-xs text-muted-foreground">(alternativa manual)</span>
                            <Dialog>
                              <DialogTrigger asChild>
                                <button className="p-1 hover:bg-muted rounded-full transition-colors">
                                  <Info className="w-4 h-4 text-muted-foreground" />
                                </button>
                              </DialogTrigger>
                              <DialogContent className="max-w-lg">
                                <DialogHeader>
                                  <DialogTitle>Access Token vs Link de MP</DialogTitle>
                                  <DialogDescription className="pt-4 space-y-4 text-left">
                                    <p>
                                      El <strong>Link de Mercado Pago</strong> es una alternativa más simple para quienes no quieren configurar el Access Token.
                                    </p>
                                    <div className="space-y-2">
                                      <p className="font-medium">Cómo funciona:</p>
                                      <ol className="list-decimal list-inside space-y-1 text-sm">
                                        <li>Entrás a la app de MercadoPago</li>
                                        <li>Creás un "Link de pago"</li>
                                        <li>Copiás ese link y lo pegás acá</li>
                                        <li>Cuando un cliente compra, se le muestra el link para que pague</li>
                                      </ol>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 pt-2">
                                      <div className="p-3 bg-green-50 rounded-lg">
                                        <p className="font-medium text-green-800 text-sm">Access Token (API)</p>
                                        <ul className="text-xs text-green-700 mt-1 space-y-1">
                                          <li>+ Checkout automático integrado</li>
                                          <li>+ Pedido se marca pagado solo</li>
                                          <li>+ Más profesional</li>
                                        </ul>
                                      </div>
                                      <div className="p-3 bg-amber-50 rounded-lg">
                                        <p className="font-medium text-amber-800 text-sm">Link de MP (manual)</p>
                                        <ul className="text-xs text-amber-700 mt-1 space-y-1">
                                          <li>+ Más fácil de configurar</li>
                                          <li>- Cliente paga por separado</li>
                                          <li>- Verificar pago manualmente</li>
                                        </ul>
                                      </div>
                                    </div>
                                  </DialogDescription>
                                </DialogHeader>
                              </DialogContent>
                            </Dialog>
                          </Label>
                          <Input
                            placeholder="https://link.mercadopago.com.ar/tutienda"
                            value={payments.mercadopago_link}
                            onChange={(e) => setPayments({ ...payments, mercadopago_link: e.target.value })}
                          />
                          <p className="text-xs text-muted-foreground">
                            Si no querés configurar el Access Token, podés crear un link desde la app de MP
                          </p>
                        </div>

                        {/* Tipo de Checkout */}
                        <div className="space-y-3 border-t pt-4">
                          <Label className="flex items-center gap-2">
                            Tipo de Checkout
                            <Dialog>
                              <DialogTrigger asChild>
                                <button className="p-1 hover:bg-muted rounded-full transition-colors">
                                  <Info className="w-4 h-4 text-muted-foreground" />
                                </button>
                              </DialogTrigger>
                              <DialogContent className="max-w-lg">
                                <DialogHeader>
                                  <DialogTitle>Redirect vs Popup</DialogTitle>
                                  <DialogDescription className="pt-4 space-y-4 text-left">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="p-3 bg-blue-50 rounded-lg">
                                        <p className="font-medium text-blue-800 text-sm">Redirect (Redirigir)</p>
                                        <ul className="text-xs text-blue-700 mt-1 space-y-1">
                                          <li>+ Más compatible</li>
                                          <li>+ Funciona en todos los navegadores</li>
                                          <li>- Sale de tu tienda</li>
                                        </ul>
                                      </div>
                                      <div className="p-3 bg-purple-50 rounded-lg">
                                        <p className="font-medium text-purple-800 text-sm">Popup (Ventana)</p>
                                        <ul className="text-xs text-purple-700 mt-1 space-y-1">
                                          <li>+ Cliente no sale de tu tienda</li>
                                          <li>+ Experiencia más fluida</li>
                                          <li>- Puede ser bloqueado</li>
                                        </ul>
                                      </div>
                                    </div>
                                  </DialogDescription>
                                </DialogHeader>
                              </DialogContent>
                            </Dialog>
                          </Label>
                          <div className="grid grid-cols-2 gap-3">
                            <button
                              type="button"
                              onClick={() => setPayments({ ...payments, mercadopago_checkout_type: "redirect" })}
                              className={`p-3 rounded-lg border-2 transition-all text-left ${
                                payments.mercadopago_checkout_type === "redirect" 
                                  ? "border-primary bg-primary/5" 
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                            >
                              <p className="font-medium text-sm">Redirect</p>
                              <p className="text-xs text-muted-foreground">Sale a MercadoPago</p>
                            </button>
                            <button
                              type="button"
                              onClick={() => setPayments({ ...payments, mercadopago_checkout_type: "modal" })}
                              className={`p-3 rounded-lg border-2 transition-all text-left ${
                                payments.mercadopago_checkout_type === "modal" 
                                  ? "border-primary bg-primary/5" 
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                            >
                              <p className="font-medium text-sm">Popup</p>
                              <p className="text-xs text-muted-foreground">Ventana en tu tienda</p>
                            </button>
                          </div>
                        </div>

                        {/* Estado */}
                        <div
                          className={`p-3 rounded-lg ${payments.mercadopago_access_token?.startsWith("APP_USR-") || payments.mercadopago_test_token?.startsWith("TEST-") ? "bg-green-50 border border-green-200" : "bg-gray-50 border border-gray-200"}`}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${payments.mercadopago_access_token?.startsWith("APP_USR-") || payments.mercadopago_test_token?.startsWith("TEST-") ? "bg-green-500" : "bg-gray-400"}`}
                            />
                            <p className="text-sm font-medium">
                              {payments.mercadopago_test_mode 
                                ? (payments.mercadopago_test_token?.startsWith("TEST-") ? "Modo prueba activo" : "Configurá el Access Token de TEST")
                                : (payments.mercadopago_access_token?.startsWith("APP_USR-") ? "Integración activa" : "Configurá el Access Token")}
                            </p>
                          </div>
                        </div>

                        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                          <p className="text-xs text-amber-800">
                            <strong>Comision:</strong> ~4-5% por venta. El dinero llega a tu cuenta de MP.
                          </p>
                        </div>
                      </div>

                      {/* Columna derecha: Videos tutoriales */}
                      <div className="space-y-4">
              <VideoTutorial
                videoUrl="http://arielmobilia.com/wp-content/uploads/2026/02/token-mercado-pago.mp4"
                title="Cómo obtener el Access Token"
              />
              <VideoTutorial
                videoUrl="http://arielmobilia.com/wp-content/uploads/2026/02/cuenta-en-Mercado-Pago-400.mp4"
                title="Cómo crear tu cuenta en Mercado Pago"
              />
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>

              {/* Mobbex - Alternativa a MercadoPago */}
              <Card className="border-green-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <CreditCard className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          Mobbex
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Menor comision</span>
                        </CardTitle>
                        <CardDescription>Alternativa argentina a MercadoPago - Todas las tarjetas y billeteras</CardDescription>
                      </div>
                    </div>
                    <Switch
                      checked={payments.mobbex_enabled}
                      onCheckedChange={(checked) => setPayments({ ...payments, mobbex_enabled: checked })}
                    />
                  </div>
                </CardHeader>
                {payments.mobbex_enabled && (
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-800">
                          <strong>Comision ~4-5%</strong> vs MercadoPago ~7.5%. Acepta Visa, Mastercard, AMEX, Cabal, Naranja, MODO, Cuenta DNI y mas.
                        </p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>API Key</Label>
                          <Input
                            type="password"
                            placeholder="Tu API Key de Mobbex"
                            value={payments.mobbex_api_key}
                            onChange={(e) => setPayments({ ...payments, mobbex_api_key: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Access Token</Label>
                          <Input
                            type="password"
                            placeholder="Tu Access Token de Mobbex"
                            value={payments.mobbex_access_token}
                            onChange={(e) => setPayments({ ...payments, mobbex_access_token: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <p className="text-xs text-amber-800">
                          <strong>Como obtener las credenciales:</strong> Registrate en <a href="https://mobbex.com" target="_blank" rel="noopener noreferrer" className="underline">mobbex.com</a>, 
                          crea tu comercio y obtene las credenciales en el panel de desarrollador.
                        </p>
                      </div>

                      {payments.mobbex_api_key && payments.mobbex_access_token && (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            <p className="text-sm font-medium text-green-800">Credenciales configuradas</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                )}
              </Card>

              {/* MODO */}
              <Card className="border-violet-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-violet-100 rounded-lg">
                        <Smartphone className="w-5 h-5 text-violet-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">MODO</CardTitle>
                        <CardDescription>Pagos con QR desde la app del banco - Sin comision</CardDescription>
                      </div>
                    </div>
                    <Switch
                      checked={payments.modo_enabled}
                      onCheckedChange={(checked) => setPayments({ ...payments, modo_enabled: checked })}
                    />
                  </div>
                </CardHeader>
                {payments.modo_enabled && (
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Tu número de MODO (celular)</Label>
                          <Input
                            placeholder="Ej: 11 2345-6789"
                            value={payments.modo_phone}
                            onChange={(e) => setPayments({ ...payments, modo_phone: e.target.value })}
                          />
                          <p className="text-xs text-muted-foreground">
                            Este número se mostrará al cliente para que pueda encontrarte en MODO
                          </p>
                        </div>

                        <div className="p-3 bg-violet-50 border border-violet-200 rounded-lg">
                          <p className="text-xs text-violet-800">
                            <strong>💰 Sin comisión:</strong> MODO no cobra comisión. El dinero llega directo a tu cuenta
                            bancaria.
                          </p>
                        </div>
                      </div>

                      <div>
              <VideoTutorial videoUrl="http://arielmobilia.com/wp-content/uploads/2026/02/MODO.mp4" title="Cómo configurar MODO" />
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>

              {/* Ualá Bis */}
              <Card className="border-red-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <CreditCard className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Ualá Bis</CardTitle>
                        <CardDescription>Link de pago de Ualá para comercios</CardDescription>
                      </div>
                    </div>
                    <Switch
                      checked={payments.uala_enabled}
                      onCheckedChange={(checked) => setPayments({ ...payments, uala_enabled: checked })}
                    />
                  </div>
                </CardHeader>
                {payments.uala_enabled && (
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Link de Ualá Bis</Label>
                          <Input
                            placeholder="https://bis.uala.com.ar/tutienda"
                            value={payments.uala_link}
                            onChange={(e) => setPayments({ ...payments, uala_link: e.target.value })}
                          />
                          <p className="text-xs text-muted-foreground">
                            Creá tu link en la app Ualá Bis → Cobrar → Compartir link
                          </p>
                        </div>

                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-xs text-red-800">
                            <strong>💰 Comisión:</strong> ~3-4% por venta. El dinero llega a tu cuenta Ualá.
                          </p>
                        </div>
                      </div>

                      <div>
                        {/* VIDEO PLACEHOLDER - Reemplazar con el ID real del video */}
                        <VideoTutorial videoId="dQw4w9WgXcQ" title="Cómo configurar Ualá Bis" />
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            </div>
          </div>

          {/* Sección: Pagos Presenciales */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">🏪 Pagos Presenciales</h3>

            <div className="grid gap-6">
              {/* Efectivo */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Banknote className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Efectivo</CardTitle>
                        <CardDescription>Pago en efectivo contra entrega</CardDescription>
                      </div>
                    </div>
                    <Switch
                      checked={payments.cash_enabled}
                      onCheckedChange={(checked) => setPayments({ ...payments, cash_enabled: checked })}
                    />
                  </div>
                </CardHeader>
                {payments.cash_enabled && (
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>Instrucciones para el cliente</Label>
                        <Textarea
                          placeholder="Ej: Tener el monto exacto. Aceptamos billetes de todas las denominaciones."
                          value={payments.cash_instructions}
                          onChange={(e) => setPayments({ ...payments, cash_instructions: e.target.value })}
                          rows={3}
                        />
                      </div>
                      <div>
              <VideoTutorial videoUrl="http://arielmobilia.com/wp-content/uploads/2026/02/PAGO-EN-EFECTIVO.mp4" title="Cómo manejar pagos en efectivo" />
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>

              {/* Posnet / Tarjeta presencial */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <CreditCard className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Posnet / Tarjeta presencial</CardTitle>
                        <CardDescription>Pago con tarjeta al momento de la entrega</CardDescription>
                      </div>
                    </div>
                    <Switch
                      checked={payments.card_enabled}
                      onCheckedChange={(checked) => setPayments({ ...payments, card_enabled: checked })}
                    />
                  </div>
                </CardHeader>
                {payments.card_enabled && (
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>Instrucciones para el cliente</Label>
                        <Textarea
                          placeholder="Ej: Aceptamos todas las tarjetas de crédito y débito. Disponible pago en cuotas."
                          value={payments.card_instructions}
                          onChange={(e) => setPayments({ ...payments, card_instructions: e.target.value })}
                          rows={3}
                        />
                      </div>
                      <div>
                        {/* VIDEO PLACEHOLDER */}
                        <VideoTutorial videoId="dQw4w9WgXcQ" title="Cómo usar el Posnet" />
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>

              {/* Rapipago / Pago Fácil */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <Store className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Rapipago / Pago Fácil</CardTitle>
                        <CardDescription>Pago en efectivo en puntos de cobranza</CardDescription>
                      </div>
                    </div>
                    <Switch
                      checked={payments.rapipago_enabled}
                      onCheckedChange={(checked) => setPayments({ ...payments, rapipago_enabled: checked })}
                    />
                  </div>
                </CardHeader>
                {payments.rapipago_enabled && (
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>Instrucciones para el cliente</Label>
                        <Textarea
                          placeholder="Ej: Te enviaremos un código de pago por email. Podés pagarlo en cualquier Rapipago o Pago Fácil."
                          value={payments.rapipago_instructions}
                          onChange={(e) => setPayments({ ...payments, rapipago_instructions: e.target.value })}
                          rows={3}
                        />
                      </div>
                      <div>
                        {/* VIDEO PLACEHOLDER */}
                        <VideoTutorial videoId="dQw4w9WgXcQ" title="Cómo configurar Rapipago" />
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            </div>
          </div>

          {/* Sección: Transferencia Bancaria */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">🏦 Transferencia Bancaria</h3>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <Building2 className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Transferencia Bancaria</CardTitle>
                      <CardDescription>Transferencia directa a tu cuenta</CardDescription>
                    </div>
                  </div>
                  <Switch
                    checked={payments.transfer_enabled}
                    onCheckedChange={(checked) => setPayments({ ...payments, transfer_enabled: checked })}
                  />
                </div>
              </CardHeader>
              {payments.transfer_enabled && (
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Banco</Label>
                          <Input
                            placeholder="Ej: Banco Galicia"
                            value={payments.transfer_bank_name}
                            onChange={(e) => setPayments({ ...payments, transfer_bank_name: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Titular</Label>
                          <Input
                            placeholder="Nombre del titular"
                            value={payments.transfer_account_holder}
                            onChange={(e) => setPayments({ ...payments, transfer_account_holder: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>CBU</Label>
                        <div className="flex gap-2">
                          <Input
                            placeholder="0000000000000000000000"
                            value={payments.transfer_cbu}
                            onChange={(e) => setPayments({ ...payments, transfer_cbu: e.target.value })}
                          />
                          {payments.transfer_cbu && (
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => copyToClipboard(payments.transfer_cbu)}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Alias</Label>
                        <div className="flex gap-2">
                          <Input
                            placeholder="mi.tienda.alias"
                            value={payments.transfer_alias}
                            onChange={(e) => setPayments({ ...payments, transfer_alias: e.target.value })}
                          />
                          {payments.transfer_alias && (
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => copyToClipboard(payments.transfer_alias)}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>

                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                        <p className="text-xs text-emerald-800">
                          <strong>💰 Sin comisión:</strong> Las transferencias no tienen costo. El cliente te envía el
                          comprobante y vos confirmás el pedido.
                        </p>
                      </div>
                    </div>

                    <div>
              <VideoTutorial videoUrl="http://arielmobilia.com/wp-content/uploads/2026/02/TRANFERENCAIA.mp4" title="Cómo recibir transferencias" />
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        </TabsContent>

        {/* TAB 2: Suscripción a TOL.AR */}
        <TabsContent value="suscripcion" className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">Pagá tu suscripción a TOL.AR</h3>
            <p className="text-sm text-muted-foreground">Elegí cómo querés pagar tus cositas y planes</p>
          </div>

          {/* Metodos de pago disponibles */}
          <div className="grid gap-4">
            {/* MercadoPago */}
            <Card className="border-[#00b1ea]/30 hover:border-[#00b1ea] transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#00b1ea] rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-lg">MP</span>
                    </div>
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        MercadoPago
                        <Badge className="bg-green-100 text-green-700 text-xs">Pesos ARS</Badge>
                      </CardTitle>
                      <CardDescription>Tarjetas, transferencia, efectivo</CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">Comisión: 4.5% + IVA</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Pagá en pesos argentinos con todos los medios disponibles en MercadoPago.
                </p>
                <Badge className="bg-green-100 text-green-700 text-xs">Disponible</Badge>
              </CardContent>
            </Card>

            {/* PayPal */}
            <Card className="border-[#003087]/30 hover:border-[#003087] transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#003087] rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-lg">PP</span>
                    </div>
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        PayPal
                        <Badge className="bg-blue-100 text-blue-700 text-xs">Dólares USD</Badge>
                      </CardTitle>
                      <CardDescription>Tarjetas internacionales y saldo PayPal</CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">Comisión: 5.4% + $0.30</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Pagá en dólares con tu tarjeta internacional o saldo PayPal.
                </p>
                <Badge className="bg-green-100 text-green-700 text-xs">Disponible</Badge>
              </CardContent>
            </Card>

            {/* Transferencia Bancaria */}
            <Card className="border-emerald-200 hover:border-emerald-400 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        Transferencia Bancaria
                        <Badge className="bg-green-100 text-green-700 text-xs">Pesos ARS</Badge>
                      </CardTitle>
                      <CardDescription>Transferencia directa sin comisión</CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs text-emerald-600 border-emerald-300">Sin comisión</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Transferí directamente a nuestra cuenta bancaria. Activación manual en 24hs.
                </p>
                <Badge variant="secondary" className="text-xs">Proximamente</Badge>
              </CardContent>
            </Card>

            {/* Cripto */}
            <Card className="border-orange-200 hover:border-orange-400 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <span className="text-orange-600 font-bold text-lg">₿</span>
                    </div>
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        Criptomonedas
                        <Badge className="bg-orange-100 text-orange-700 text-xs">USDT / BTC</Badge>
                      </CardTitle>
                      <CardDescription>Bitcoin, USDT y otras criptos</CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">Comisión: Variable</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Pagá con criptomonedas. Activación automática al confirmar la transacción.
                </p>
                <Badge variant="secondary" className="text-xs">Proximamente</Badge>
              </CardContent>
            </Card>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg border">
            <p className="text-sm text-muted-foreground text-center">
              Los pagos se procesan de forma segura. Las cositas se activan automáticamente al confirmar el pago.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
