"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  CreditCard,
  DollarSign,
  Building2,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  TrendingUp,
  Users,
  Calendar,
  RefreshCw,
  Save,
  Info,
  ArrowRight,
  Calculator,
} from "lucide-react"

interface PaymentConfig {
  stripe_enabled: boolean
  stripe_publishable_key: string
  stripe_secret_key: string
  stripe_webhook_secret: string
  bank_name: string
  bank_account_last4: string
  customer_currency: string
  payout_currency: string
}

interface SubscriptionStats {
  total_subscribers: number
  monthly_revenue_ars: number
  monthly_revenue_usd: number
  active_subscriptions: number
  canceled_this_month: number
}

export function PaymentsConfig() {
  const [config, setConfig] = useState<PaymentConfig>({
    stripe_enabled: false,
    stripe_publishable_key: "",
    stripe_secret_key: "",
    stripe_webhook_secret: "",
    bank_name: "Wells Fargo",
    bank_account_last4: "",
    customer_currency: "ARS",
    payout_currency: "USD",
  })
  const [stats, setStats] = useState<SubscriptionStats>({
    total_subscribers: 0,
    monthly_revenue_ars: 0,
    monthly_revenue_usd: 0,
    active_subscriptions: 0,
    canceled_this_month: 0,
  })
  const [showSecretKey, setShowSecretKey] = useState(false)
  const [showWebhookSecret, setShowWebhookSecret] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [testingConnection, setTestingConnection] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"none" | "success" | "error">("none")

  // Calculadora
  const [calcArs, setCalcArs] = useState("100000")
  const exchangeRate = 1080 // Tasa aproximada ARS/USD

  useEffect(() => {
    fetchConfig()
  }, [])

  const fetchConfig = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/super-admin/payments-config")
      if (res.ok) {
        const data = await res.json()
        if (data.config) setConfig({ ...config, ...data.config })
        if (data.stats) setStats(data.stats)
      }
    } catch (error) {
      console.error("Error fetching config:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch("/api/super-admin/payments-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      })
      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } catch (error) {
      console.error("Error saving config:", error)
    } finally {
      setSaving(false)
    }
  }

  const testStripeConnection = async () => {
    setTestingConnection(true)
    setConnectionStatus("none")
    try {
      const res = await fetch("/api/super-admin/test-stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          publishable_key: config.stripe_publishable_key,
          secret_key: config.stripe_secret_key,
        }),
      })
      if (res.ok) {
        setConnectionStatus("success")
      } else {
        setConnectionStatus("error")
      }
    } catch (error) {
      setConnectionStatus("error")
    } finally {
      setTestingConnection(false)
    }
  }

  // Cálculo de comisiones
  const calculateFees = (arsAmount: number) => {
    const usdAmount = arsAmount / exchangeRate
    const stripeFee = usdAmount * 0.039 // 3.9%
    const fixedFee = 0.3
    const conversionFee = usdAmount * 0.02 // 2%
    const totalFees = stripeFee + fixedFee + conversionFee
    const netAmount = usdAmount - totalFees
    return {
      usdAmount: usdAmount.toFixed(2),
      stripeFee: stripeFee.toFixed(2),
      fixedFee: fixedFee.toFixed(2),
      conversionFee: conversionFee.toFixed(2),
      totalFees: totalFees.toFixed(2),
      netAmount: netAmount.toFixed(2),
      percentage: ((netAmount / usdAmount) * 100).toFixed(1),
    }
  }

  const fees = calculateFees(Number.parseFloat(calcArs) || 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Configuración de Pagos</h2>
          <p className="text-slate-400">Clientes pagan en ARS → Vos recibís en USD (Wells Fargo)</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="bg-green-600 hover:bg-green-700">
          {saving ? (
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
          ) : saved ? (
            <CheckCircle2 className="w-4 h-4 mr-2" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          {saved ? "Guardado" : "Guardar cambios"}
        </Button>
      </div>

      {/* Flujo ARS → USD */}
      <Card className="bg-gradient-to-r from-blue-500/10 to-green-500/10 border-blue-500/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl">🇦🇷</span>
              </div>
              <p className="font-medium text-white">Cliente paga</p>
              <p className="text-blue-400 text-lg font-bold">$ ARS</p>
            </div>
            <ArrowRight className="w-8 h-8 text-slate-500" />
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <CreditCard className="w-8 h-8 text-purple-400" />
              </div>
              <p className="font-medium text-white">Stripe procesa</p>
              <p className="text-purple-400 text-sm">Conversión automática</p>
            </div>
            <ArrowRight className="w-8 h-8 text-slate-500" />
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl">🇺🇸</span>
              </div>
              <p className="font-medium text-white">Vos recibís</p>
              <p className="text-green-400 text-lg font-bold">$ USD</p>
            </div>
            <ArrowRight className="w-8 h-8 text-slate-500" />
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <Building2 className="w-8 h-8 text-yellow-400" />
              </div>
              <p className="font-medium text-white">Wells Fargo</p>
              <p className="text-yellow-400 text-sm">Depósito semanal</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-400 font-semibold">Cobrado (ARS)</p>
                <p className="text-2xl font-bold text-white">${stats.monthly_revenue_ars.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <span className="text-xl">🇦🇷</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-400 font-semibold">Recibido (USD)</p>
                <p className="text-2xl font-bold text-white">${stats.monthly_revenue_usd.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-400 font-semibold">Suscriptores Activos</p>
                <p className="text-2xl font-bold text-white">{stats.active_subscriptions}</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-400 font-semibold">Cancelaciones</p>
                <p className="text-2xl font-bold text-white">{stats.canceled_this_month}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stripe Config */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <CardTitle className="text-white">Stripe</CardTitle>
                  <CardDescription>Procesador de pagos internacionales</CardDescription>
                </div>
              </div>
              <Switch
                checked={config.stripe_enabled}
                onCheckedChange={(checked) => setConfig({ ...config, stripe_enabled: checked })}
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Tutorial */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-300">
                  <p className="font-medium mb-2">Configuración paso a paso:</p>
                  <ol className="list-decimal list-inside space-y-1 text-blue-300/80">
                    <li>
                      Creá una cuenta en{" "}
                      <a href="https://stripe.com" target="_blank" rel="noopener noreferrer" className="underline">
                        stripe.com
                      </a>
                    </li>
                    <li>En Settings → Business → activá "Pagos internacionales"</li>
                    <li>Habilitá Argentina como país de cobro</li>
                    <li>En Settings → Payouts → conectá Wells Fargo</li>
                    <li>Copiá las API Keys de Developers → API Keys</li>
                  </ol>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-slate-300">Publishable Key</Label>
              <Input
                value={config.stripe_publishable_key}
                onChange={(e) => setConfig({ ...config, stripe_publishable_key: e.target.value })}
                placeholder="pk_live_..."
                className="bg-slate-900 border-slate-600 text-white mt-1"
              />
            </div>

            <div>
              <Label className="text-slate-300">Secret Key</Label>
              <div className="relative">
                <Input
                  type={showSecretKey ? "text" : "password"}
                  value={config.stripe_secret_key}
                  onChange={(e) => setConfig({ ...config, stripe_secret_key: e.target.value })}
                  placeholder="sk_live_..."
                  className="bg-slate-900 border-slate-600 text-white mt-1 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowSecretKey(!showSecretKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showSecretKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <Label className="text-slate-300">Webhook Secret</Label>
              <div className="relative">
                <Input
                  type={showWebhookSecret ? "text" : "password"}
                  value={config.stripe_webhook_secret}
                  onChange={(e) => setConfig({ ...config, stripe_webhook_secret: e.target.value })}
                  placeholder="whsec_..."
                  className="bg-slate-900 border-slate-600 text-white mt-1 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowWebhookSecret(!showWebhookSecret)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showWebhookSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-1">Webhook URL: https://tol.ar/api/stripe/webhook</p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button
                variant="outline"
                onClick={testStripeConnection}
                disabled={testingConnection || !config.stripe_secret_key}
                className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
              >
                {testingConnection ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : connectionStatus === "success" ? (
                  <CheckCircle2 className="w-4 h-4 mr-2 text-green-400" />
                ) : connectionStatus === "error" ? (
                  <AlertCircle className="w-4 h-4 mr-2 text-red-400" />
                ) : (
                  <CreditCard className="w-4 h-4 mr-2" />
                )}
                Probar conexión
              </Button>
              {connectionStatus === "success" && (
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Conectado</Badge>
              )}
              {connectionStatus === "error" && (
                <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Error</Badge>
              )}
            </div>

            <Button variant="link" asChild className="text-purple-400 hover:text-purple-300 p-0">
              <a href="https://dashboard.stripe.com" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                Ir a Stripe Dashboard
              </a>
            </Button>
          </CardContent>
        </Card>

        {/* Calculadora de comisiones */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Calculator className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <CardTitle className="text-white">Calculadora de Comisiones</CardTitle>
                <CardDescription>Simulá cuánto recibís por cada pago</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-slate-300">Cliente paga (ARS)</Label>
              <Input
                type="number"
                value={calcArs}
                onChange={(e) => setCalcArs(e.target.value)}
                placeholder="100000"
                className="bg-slate-900 border-slate-600 text-white mt-1 text-xl"
              />
              <p className="text-xs text-slate-500 mt-1">Tasa aprox: $1 USD = ${exchangeRate} ARS</p>
            </div>

            <div className="bg-slate-900 rounded-lg p-4 space-y-3">
              <div className="flex justify-between text-slate-400">
                <span>Conversión a USD</span>
                <span className="text-white">${fees.usdAmount}</span>
              </div>
              <div className="border-t border-slate-700 pt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-red-400">Comisión Stripe (3.9%)</span>
                  <span className="text-red-400">- ${fees.stripeFee}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-red-400">Fee fijo</span>
                  <span className="text-red-400">- ${fees.fixedFee}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-red-400">Conversión moneda (~2%)</span>
                  <span className="text-red-400">- ${fees.conversionFee}</span>
                </div>
              </div>
              <div className="border-t border-slate-700 pt-3">
                <div className="flex justify-between text-sm text-slate-400">
                  <span>Total comisiones</span>
                  <span className="text-red-400">- ${fees.totalFees}</span>
                </div>
              </div>
              <div className="border-t border-slate-700 pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-green-400 font-medium">Recibís en Wells Fargo</span>
                  <span className="text-green-400 text-2xl font-bold">${fees.netAmount} USD</span>
                </div>
                <p className="text-xs text-slate-500 text-right mt-1">({fees.percentage}% del total)</p>
              </div>
            </div>

            {/* Bank info */}
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Building2 className="w-5 h-5 text-yellow-400 mt-0.5" />
                <div className="text-sm text-yellow-300">
                  <p className="font-medium">Wells Fargo</p>
                  <p className="text-yellow-300/80">
                    Los pagos se depositan automáticamente. Podés configurar frecuencia diaria, semanal o mensual en
                    Stripe.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-slate-300">Últimos 4 dígitos de cuenta (referencia)</Label>
              <Input
                value={config.bank_account_last4}
                onChange={(e) => setConfig({ ...config, bank_account_last4: e.target.value })}
                placeholder="1234"
                maxLength={4}
                className="bg-slate-900 border-slate-600 text-white mt-1"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Info de cotización */}
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="font-medium text-white mb-1">Sobre la cotización del dólar</h3>
              <p className="text-slate-400 text-sm">
                Stripe usa la <strong className="text-white">cotización del mercado interbancario</strong> (similar al
                dólar MEP), no el oficial ni el blue. La tasa se actualiza automáticamente cada día. El spread de
                conversión (~2%) ya está incluido en la calculadora de arriba.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
