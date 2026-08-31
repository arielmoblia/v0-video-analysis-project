"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { CheckCircle, CreditCard, DollarSign, ExternalLink, Mail, MessageSquare, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function IntegracionesManager() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [payments, setPayments] = useState({
    stripe_enabled: false,
    stripe_currency: "ars",
    stripe_mode: "test"
  })

  useEffect(() => {
    fetch("/api/super-admin/platform-marketing")
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.payments) setPayments(data.payments) })
      .catch(() => {})
  }, [])

  const saveSettings = async (section: string, data: unknown) => {
    setLoading(true)
    try {
      const response = await fetch("/api/super-admin/platform-marketing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section, data })
      })
      if (response.ok) toast({ title: "Guardado", description: "Configuración actualizada" })
    } catch {
      toast({ title: "Error", description: "No se pudo guardar", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Integraciones</h2>
        <p className="text-slate-500">Servicios externos conectados a tol.ar</p>
      </div>

      {/* Stripe */}
      <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-purple-600" />
            Stripe - Pagos con Tarjeta
            <Badge className="bg-purple-600">Principal</Badge>
          </CardTitle>
          <CardDescription>
            Recibí pagos en pesos argentinos con tarjeta de crédito/débito. La plata llega a tu cuenta en dólares.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="stripe-enabled">Activar pagos con Stripe</Label>
                <Switch
                  id="stripe-enabled"
                  checked={payments.stripe_enabled}
                  onCheckedChange={(checked) => setPayments({...payments, stripe_enabled: checked})}
                />
              </div>
              <div className="space-y-2">
                <Label>Moneda de cobro</Label>
                <select
                  className="w-full p-2 border rounded-lg"
                  value={payments.stripe_currency}
                  onChange={(e) => setPayments({...payments, stripe_currency: e.target.value})}
                >
                  <option value="ars">Pesos Argentinos (ARS)</option>
                  <option value="usd">Dólares (USD)</option>
                </select>
                <p className="text-xs text-slate-500">Los clientes pagan en esta moneda</p>
              </div>
              <div className="space-y-2">
                <Label>Modo</Label>
                <select
                  className="w-full p-2 border rounded-lg"
                  value={payments.stripe_mode}
                  onChange={(e) => setPayments({...payments, stripe_mode: e.target.value})}
                >
                  <option value="test">Pruebas (sandbox)</option>
                  <option value="live">Producción (real)</option>
                </select>
                <p className="text-xs text-slate-500">Usá "Pruebas" para testear sin cobrar de verdad</p>
              </div>
              <Button onClick={() => saveSettings("payments", payments)} disabled={loading}>
                <Save className="w-4 h-4 mr-2" />
                Guardar configuración
              </Button>
            </div>
            <div className="space-y-4">
              <div className={`p-4 rounded-lg ${payments.stripe_enabled ? "bg-green-50 border border-green-200" : "bg-slate-50"}`}>
                <div className="flex items-center gap-2 mb-2">
                  {payments.stripe_enabled
                    ? <CheckCircle className="w-5 h-5 text-green-600" />
                    : <CreditCard className="w-5 h-5 text-slate-400" />}
                  <span className="font-medium">{payments.stripe_enabled ? "Stripe Activado" : "Stripe Desactivado"}</span>
                </div>
                <p className="text-sm text-slate-600">
                  {payments.stripe_enabled
                    ? "Los usuarios pueden pagar Plan Cositas y otros planes con tarjeta."
                    : "Activa Stripe para recibir pagos con tarjeta de crédito/débito."}
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h5 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Como funciona:
                </h5>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Cliente paga en pesos argentinos</li>
                  <li>• Stripe convierte a dólares automáticamente</li>
                  <li>• El dinero llega a tu cuenta bancaria en USD</li>
                  <li>• Comisión de Stripe: ~3.5% + $0.30 USD por venta</li>
                </ul>
              </div>
              <Button variant="outline" className="w-full bg-transparent" asChild>
                <a href="https://dashboard.stripe.com" target="_blank" rel="noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Abrir Dashboard de Stripe
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Email */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Email Marketing
            </CardTitle>
            <CardDescription>Para enviar newsletters a potenciales clientes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {[
                { name: "Mailchimp", status: "Próximamente" },
                { name: "Brevo (Sendinblue)", status: "Próximamente" },
                { name: "Resend", status: "Conectado", connected: true }
              ].map((item) => (
                <div key={item.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="font-medium">{item.name}</span>
                  <Badge variant={item.connected ? "default" : "secondary"}>
                    {item.connected && <CheckCircle className="w-3 h-3 mr-1" />}
                    {item.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Chat y Soporte
            </CardTitle>
            <CardDescription>Para atender consultas de visitantes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {[
                { name: "WhatsApp Business", status: "Próximamente" },
                { name: "Crisp Chat", status: "Próximamente" },
                { name: "Tawk.to", status: "Próximamente" }
              ].map((item) => (
                <div key={item.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="font-medium">{item.name}</span>
                  <Badge variant="secondary">{item.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
