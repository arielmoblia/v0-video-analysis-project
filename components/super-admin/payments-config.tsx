"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  CreditCard, Building2, Eye, EyeOff,
  CheckCircle2, AlertCircle, ExternalLink, TrendingUp,
  RefreshCw, Save, Info, ArrowRight, Calculator,
  ChevronDown,
} from "lucide-react"

interface PaymentConfig {
  stripe_enabled: boolean
  stripe_publishable_key: string
  stripe_secret_key: string
  stripe_webhook_secret: string
  mp_enabled: boolean
  mp_access_token: string
  mp_public_key: string
  paypal_enabled: boolean
  paypal_client_id: string
  paypal_client_secret: string
  mobbex_enabled: boolean
  mobbex_api_key: string
  mobbex_access_token: string
  bank_account_last4: string
}

interface Pago {
  id: string
  tipo: "cosita" | "renovacion"
  fecha: string | null
  store: { id: string; subdomain: string; email: string; site_title: string } | null
  store_id: string
  monto_ars: number | null
  estado: string | null
  payment_id: string | null
  external_reference: string | null
  concepto: string
}

const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
  completed: { label: "Pagado", cls: "bg-green-100 text-green-700 border-green-200" },
  processed: { label: "Pagado", cls: "bg-green-100 text-green-700 border-green-200" },
  authorized: { label: "Autorizado", cls: "bg-green-100 text-green-700 border-green-200" },
  pending: { label: "Pendiente", cls: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  payment_rejected: { label: "Rechazado", cls: "bg-red-100 text-red-700 border-red-200" },
  rejected: { label: "Rechazado", cls: "bg-red-100 text-red-700 border-red-200" },
  cancelled: { label: "Cancelado", cls: "bg-gray-100 text-gray-600 border-gray-200" },
  paused: { label: "Pausado", cls: "bg-gray-100 text-gray-600 border-gray-200" },
}

export function PaymentsConfig() {
  const [mainTab, setMainTab] = useState<"totales" | "pasarelas" | "alertas">("totales")
  const [gwTab, setGwTab] = useState<"stripe" | "mp" | "paypal" | "mobbex">("stripe")
  const [subTab, setSubTab] = useState<"config" | "clientes">("config")
  const [period, setPeriod] = useState("Mar 2026")
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [testingConnection, setTestingConnection] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<Record<string, "none" | "success" | "error">>({})
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({})
  const [calcArs, setCalcArs] = useState("100000")
  const [exchangeRate, setExchangeRate] = useState(1580)
  const [rateUpdated, setRateUpdated] = useState("")
  const [pagos, setPagos] = useState<Pago[]>([])
  const [pagosLoading, setPagosLoading] = useState(true)
  const [pagosError, setPagosError] = useState("")
  const [pagosSearch, setPagosSearch] = useState("")

  useEffect(() => {
    fetch("/api/super-admin/exchange-rate")
      .then(r => r.json())
      .then(data => {
        if (data.rate) {
          setExchangeRate(data.rate)
          setRateUpdated(new Date(data.lastUpdate).toLocaleTimeString("es-AR", {hour:"2-digit", minute:"2-digit"}))
        }
      })
      .catch(() => {})
  }, [])
  // exchangeRate viene del estado

  useEffect(() => {
    fetch("/api/super-admin/payments-list")
      .then(r => r.json())
      .then(data => {
        if (data.pagos) setPagos(data.pagos)
        else setPagosError(data.error || "Error al cargar pagos")
      })
      .catch(() => setPagosError("Error al cargar pagos"))
      .finally(() => setPagosLoading(false))
  }, [])

  const pagosFiltrados = pagos.filter(p => {
    if (!pagosSearch.trim()) return true
    const q = pagosSearch.toLowerCase().trim()
    return [p.store?.subdomain, p.store?.email, p.store?.site_title, p.payment_id, p.external_reference, p.concepto, p.monto_ars?.toString()]
      .some(v => v?.toLowerCase().includes(q))
  })

  const totalesMes = (() => {
    const ahora = new Date()
    const delMes = pagos.filter(p => {
      if (!p.fecha) return false
      const f = new Date(p.fecha)
      return f.getMonth() === ahora.getMonth() && f.getFullYear() === ahora.getFullYear()
    })
    const pagados = delMes.filter(p => ["completed", "processed", "authorized"].includes(p.estado || ""))
    const totalArs = pagados.reduce((acc, p) => acc + (p.monto_ars || 0), 0)
    return { cobros: pagados.length, totalArs }
  })()

  const [config, setConfig] = useState<PaymentConfig>({
    stripe_enabled: false,
    stripe_publishable_key: "",
    stripe_secret_key: "",
    stripe_webhook_secret: "",
    mp_enabled: true,
    mp_access_token: "",
    mp_public_key: "",
    paypal_enabled: true,
    paypal_client_id: "ASYvylVa8L7Qf57IKodIEIYd6BalypfW9TGuFkanCnaCR55rP-B-XRemN1FcVLcx0Aii2DIKDtr68RSA",
    paypal_client_secret: "",
    mobbex_enabled: false,
    mobbex_api_key: "",
    mobbex_access_token: "",
    bank_account_last4: "",
  })

  const fees = (() => {
    const ars = parseFloat(calcArs) || 0
    const usd = ars / exchangeRate
    const stripeFee = usd * 0.039
    const fixedFee = 0.30
    const fxFee = usd * 0.02
    const total = stripeFee + fixedFee + fxFee
    const net = usd - total
    return {
      usd: usd.toFixed(2),
      stripeFee: stripeFee.toFixed(2),
      fixedFee: fixedFee.toFixed(2),
      fxFee: fxFee.toFixed(2),
      total: total.toFixed(2),
      net: net.toFixed(2),
      pct: usd > 0 ? ((net / usd) * 100).toFixed(1) : "0",
    }
  })()

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch("/api/super-admin/payments-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      })
      if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 3000) }
    } catch (e) { console.error(e) }
    finally { setSaving(false) }
  }

  const testConnection = async (gw: string) => {
    setTestingConnection(true)
    setConnectionStatus(prev => ({ ...prev, [gw]: "none" }))
    try {
      const res = await fetch(`/api/super-admin/test-${gw}`, { method: "POST" })
      setConnectionStatus(prev => ({ ...prev, [gw]: res.ok ? "success" : "error" }))
    } catch { setConnectionStatus(prev => ({ ...prev, [gw]: "error" })) }
    finally { setTestingConnection(false) }
  }

  const toggleKey = (key: string) => setShowKeys(prev => ({ ...prev, [key]: !prev[key] }))
  const setGw = (gw: typeof gwTab) => { setGwTab(gw); setSubTab("config") }

  const alerts = [
    !config.stripe_publishable_key && { type: "error", title: "Stripe sin configurar", desc: "Las keys de Stripe están vacías. Los pagos con tarjeta no funcionarán." },
    !config.mp_access_token && { type: "error", title: "MercadoPago sin configurar", desc: "Falta el Access Token de MercadoPago." },
    !config.mobbex_api_key && { type: "warn", title: "Mobbex no configurado", desc: "Mobbex es la pasarela más barata (1% + IVA). Conviene configurarlo." },
    { type: "warn", title: "Cotización dólar hardcodeada", desc: "El tipo de cambio está fijo en $1580. Hay que conectarlo a dolarapi.com en tiempo real." },
  ].filter(Boolean) as { type: string; title: string; desc: string }[]

  const FieldInput = ({ label, value, onChange, placeholder, secret, keyId }: any) => (
    <div>
      <Label className="text-slate-600 text-sm font-medium">{label}</Label>
      <div className="relative mt-1">
        <Input
          type={secret && !showKeys[keyId] ? "password" : "text"}
          value={value}
          onChange={(e: any) => onChange(e.target.value)}
          placeholder={placeholder}
          className="bg-white border-slate-200 text-slate-800 pr-10"
        />
        {secret && (
          <button type="button" onClick={() => toggleKey(keyId)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
            {showKeys[keyId] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
    </div>
  )

  const TestBtn = ({ gw }: { gw: string }) => (
    <div className="flex items-center gap-3 pt-2">
      <Button variant="outline" onClick={() => testConnection(gw)} disabled={testingConnection}
        className="border-slate-200 text-slate-600 hover:bg-slate-50 bg-white">
        {testingConnection ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> :
          connectionStatus[gw] === "success" ? <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" /> :
          connectionStatus[gw] === "error" ? <AlertCircle className="w-4 h-4 mr-2 text-red-500" /> :
          <CreditCard className="w-4 h-4 mr-2" />}
        Probar conexión
      </Button>
      {connectionStatus[gw] === "success" && <Badge className="bg-green-100 text-green-700 border-green-200">Conectado</Badge>}
      {connectionStatus[gw] === "error" && <Badge className="bg-red-100 text-red-700 border-red-200">Error de conexión</Badge>}
    </div>
  )

  const ClientsTable = () => (
    <div className="space-y-3">
      <Input
        value={pagosSearch}
        onChange={e => setPagosSearch(e.target.value)}
        placeholder="Buscar por tienda, mail, payment ID o monto (para identificar un cobro que viste en MercadoPago)..."
        className="bg-white border-slate-200 text-slate-800"
      />
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              {["Fecha","Tienda","Concepto","Monto","Estado","Payment ID","Tipo"].map(h => (
                <th key={h} className="text-left py-3 px-4 text-slate-500 font-medium text-xs">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pagosLoading ? (
              <tr><td colSpan={7} className="py-8 text-center text-slate-400">Cargando...</td></tr>
            ) : pagosError ? (
              <tr><td colSpan={7} className="py-8 text-center text-red-500">{pagosError}</td></tr>
            ) : pagosFiltrados.length === 0 ? (
              <tr><td colSpan={7} className="py-8 text-center text-slate-400">{pagos.length === 0 ? "Sin pagos aún" : "No hay pagos que coincidan con la búsqueda"}</td></tr>
            ) : pagosFiltrados.map(p => {
              const estadoInfo = STATUS_LABELS[p.estado || ""] || { label: p.estado || "—", cls: "bg-slate-100 text-slate-600 border-slate-200" }
              return (
                <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-4 text-slate-500 whitespace-nowrap">{p.fecha ? new Date(p.fecha).toLocaleDateString("es-AR") : "—"}</td>
                  <td className="py-3 px-4 text-slate-800 font-medium">
                    {p.store ? (
                      <a href={`https://${p.store.subdomain}.tol.ar`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        {p.store.site_title || p.store.subdomain}
                      </a>
                    ) : (
                      <span className="text-red-500">tienda borrada ({p.store_id})</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-600">{p.concepto}</td>
                  <td className="py-3 px-4 text-slate-800 font-medium">{p.monto_ars != null ? `$${p.monto_ars.toLocaleString("es-AR")} ARS` : "—"}</td>
                  <td className="py-3 px-4"><Badge className={estadoInfo.cls}>{estadoInfo.label}</Badge></td>
                  <td className="py-3 px-4 text-slate-500 font-mono text-xs">{p.payment_id || "—"}</td>
                  <td className="py-3 px-4 text-slate-500 text-xs">{p.tipo === "cosita" ? "Cosita" : "Renovación"}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )

  const renderGwConfig = () => {
    if (subTab === "clientes") return (
      <div className="bg-white border border-slate-200 rounded-xl p-4"><ClientsTable /></div>
    )

    if (gwTab === "stripe") return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-slate-800 font-medium">Stripe activo</span>
            <Switch checked={config.stripe_enabled} onCheckedChange={v => setConfig({ ...config, stripe_enabled: v })} />
          </div>
          <div className="bg-orange-50 border border-orange-100 rounded-lg p-4 text-sm text-orange-700">
            <p className="font-medium mb-2 flex items-center gap-2"><Info className="w-4 h-4" /> Configuración paso a paso:</p>
            <ol className="list-decimal list-inside space-y-1 text-orange-600">
              <li>Creá una cuenta en <a href="https://stripe.com" target="_blank" rel="noopener noreferrer" className="underline font-medium">stripe.com</a></li>
              <li>En Settings → Business → activá "Pagos internacionales"</li>
              <li>Habilitá Argentina como país de cobro</li>
              <li>En Settings → Payouts → conectá Wells Fargo</li>
              <li>Copiá las API Keys de Developers → API Keys</li>
            </ol>
          </div>
          <FieldInput label="Publishable Key" value={config.stripe_publishable_key} onChange={(v: string) => setConfig({ ...config, stripe_publishable_key: v })} placeholder="pk_live_..." />
          <FieldInput label="Secret Key" value={config.stripe_secret_key} onChange={(v: string) => setConfig({ ...config, stripe_secret_key: v })} placeholder="sk_live_..." secret keyId="stripe_secret" />
          <FieldInput label="Webhook Secret" value={config.stripe_webhook_secret} onChange={(v: string) => setConfig({ ...config, stripe_webhook_secret: v })} placeholder="whsec_..." secret keyId="stripe_webhook" />
          <p className="text-xs text-slate-400">Webhook URL: https://tol.ar/api/stripe/webhook</p>
          <TestBtn gw="stripe" />
          <Button onClick={handleSave} disabled={saving} className="w-full bg-orange-500 hover:bg-orange-600 text-white">
            {saving ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : saved ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            {saved ? "Guardado" : "Guardar Stripe"}
          </Button>
          <Button variant="link" asChild className="text-orange-600 hover:text-orange-700 p-0">
            <a href="https://dashboard.stripe.com" target="_blank" rel="noopener noreferrer"><ExternalLink className="w-4 h-4 mr-2" />Ir a Stripe Dashboard</a>
          </Button>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <Calculator className="w-5 h-5 text-orange-600" />
            <span className="text-slate-800 font-medium">Calculadora de comisiones</span>
          </div>
          <div>
            <Label className="text-slate-600 text-sm font-medium">Cliente paga (ARS)</Label>
            <Input type="number" value={calcArs} onChange={e => setCalcArs(e.target.value)} className="bg-white border-slate-200 text-slate-800 mt-1 text-xl" />
            <p className="text-xs text-slate-400 mt-1">Tasa aprox: $1 USD = ${exchangeRate.toLocaleString()} ARS</p>
          </div>
          <div className="bg-slate-50 border border-slate-100 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm"><span className="text-slate-500">Conversión a USD</span><span className="text-slate-800 font-medium">${fees.usd}</span></div>
            <div className="border-t border-slate-200 pt-2 space-y-1">
              <div className="flex justify-between text-sm"><span className="text-red-500">Comisión Stripe (3.9%)</span><span className="text-red-500">- ${fees.stripeFee}</span></div>
              <div className="flex justify-between text-sm"><span className="text-red-500">Fee fijo</span><span className="text-red-500">- ${fees.fixedFee}</span></div>
              <div className="flex justify-between text-sm"><span className="text-red-500">Conversión moneda (~2%)</span><span className="text-red-500">- ${fees.fxFee}</span></div>
            </div>
            <div className="border-t border-slate-200 pt-2 flex justify-between text-sm"><span className="text-slate-500">Total comisiones</span><span className="text-red-500 font-medium">- ${fees.total}</span></div>
            <div className="border-t border-slate-200 pt-3">
              <div className="flex justify-between items-center">
                <span className="text-green-600 font-medium">Recibís en Wells Fargo</span>
                <span className="text-green-600 text-2xl font-bold">${fees.net} USD</span>
              </div>
              <p className="text-xs text-slate-400 text-right mt-1">({fees.pct}% del total)</p>
            </div>
          </div>
          <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 text-sm flex gap-3">
            <Building2 className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
            <div><p className="font-medium text-amber-800">Wells Fargo</p><p className="text-amber-700 mt-1">Los pagos se depositan automáticamente. Configurá la frecuencia en Stripe.</p></div>
          </div>
          <FieldInput label="Últimos 4 dígitos de cuenta (referencia)" value={config.bank_account_last4} onChange={(v: string) => setConfig({ ...config, bank_account_last4: v })} placeholder="1234" />
        </div>
      </div>
    )

    if (gwTab === "mp") return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-slate-800 font-medium">MercadoPago activo</span>
            <Switch checked={config.mp_enabled} onCheckedChange={v => setConfig({ ...config, mp_enabled: v })} />
          </div>
          <div className="bg-orange-50 border border-orange-100 rounded-lg p-4 text-sm text-orange-700">
            <p className="font-medium mb-1 flex items-center gap-2"><Info className="w-4 h-4" /> Comisión: 4.5% + IVA</p>
            <p className="text-orange-600">Los cobros se acreditan en ARS en tu cuenta de MercadoPago.</p>
          </div>
          <FieldInput label="Access Token" value={config.mp_access_token} onChange={(v: string) => setConfig({ ...config, mp_access_token: v })} placeholder="APP_USR-..." secret keyId="mp_access" />
          <FieldInput label="Public Key" value={config.mp_public_key} onChange={(v: string) => setConfig({ ...config, mp_public_key: v })} placeholder="APP_USR-..." />
          <TestBtn gw="mp" />
          <Button onClick={handleSave} disabled={saving} className="w-full bg-orange-500 hover:bg-orange-600 text-white">
            {saving ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : saved ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            {saved ? "Guardado" : "Guardar MercadoPago"}
          </Button>
          <Button variant="link" asChild className="text-orange-600 hover:text-orange-700 p-0">
            <a href="https://www.mercadopago.com.ar/developers" target="_blank" rel="noopener noreferrer"><ExternalLink className="w-4 h-4 mr-2" />Ir a MP Developers</a>
          </Button>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <Calculator className="w-5 h-5 text-orange-500" />
            <span className="text-slate-800 font-medium">Calculadora de comisiones</span>
          </div>
          <div>
            <Label className="text-slate-600 text-sm font-medium">Cliente paga (ARS)</Label>
            <Input type="number" value={calcArs} onChange={e => setCalcArs(e.target.value)} className="bg-white border-slate-200 text-slate-800 mt-1 text-xl" />
            <p className="text-xs text-slate-400 mt-1">Tasa aprox: $1 USD = ${exchangeRate.toLocaleString()} ARS</p>
          </div>
          <div className="bg-slate-50 border border-slate-100 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm"><span className="text-slate-500">Conversión a USD</span><span className="text-slate-800 font-medium">${(parseFloat(calcArs)/exchangeRate).toFixed(2)}</span></div>
            <div className="border-t border-slate-200 pt-2 space-y-1">
              <div className="flex justify-between text-sm"><span className="text-red-500">Comisión MP (4.5%)</span><span className="text-red-500">- ${((parseFloat(calcArs)/exchangeRate)*0.045).toFixed(2)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-red-500">IVA (21%)</span><span className="text-red-500">- ${((parseFloat(calcArs)/exchangeRate)*0.045*0.21).toFixed(2)}</span></div>
            </div>
            <div className="border-t border-slate-200 pt-2 flex justify-between text-sm"><span className="text-slate-500">Total comisiones</span><span className="text-red-500 font-medium">- ${((parseFloat(calcArs)/exchangeRate)*0.045*1.21).toFixed(2)}</span></div>
            <div className="border-t border-slate-200 pt-3">
              <div className="flex justify-between items-center">
                <span className="text-green-600 font-medium">Recibís en ARS</span>
                <span className="text-green-600 text-2xl font-bold">${(parseFloat(calcArs) - parseFloat(calcArs)*0.045*1.21).toLocaleString("es-AR", {maximumFractionDigits:0})} ARS</span>
              </div>
              <p className="text-xs text-slate-400 text-right mt-1">({(((parseFloat(calcArs) - parseFloat(calcArs)*0.045*1.21)/parseFloat(calcArs))*100).toFixed(1)}% del total)</p>
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm flex gap-3">
            <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div><p className="font-medium text-blue-700">MercadoPago</p><p className="text-blue-600 mt-1">Los fondos se acreditan en pesos en tu cuenta. Podés retirar a tu CBU cuando quieras.</p></div>
          </div>
        </div>
      </div>
    )

    if (gwTab === "paypal") return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-slate-800 font-medium">PayPal activo</span>
            <Switch checked={config.paypal_enabled} onCheckedChange={v => setConfig({ ...config, paypal_enabled: v })} />
          </div>
          <div className="bg-orange-50 border border-orange-100 rounded-lg p-4 text-sm text-orange-700">
            <p className="font-medium mb-1 flex items-center gap-2"><Info className="w-4 h-4" /> Comisión: 5.4% + $0.30 USD</p>
            <p className="text-orange-600">Los cobros se acreditan en USD en tu cuenta PayPal.</p>
          </div>
          <FieldInput label="Client ID" value={config.paypal_client_id} onChange={(v: string) => setConfig({ ...config, paypal_client_id: v })} placeholder="Client ID de PayPal..." />
          <FieldInput label="Client Secret" value={config.paypal_client_secret} onChange={(v: string) => setConfig({ ...config, paypal_client_secret: v })} placeholder="Secret..." secret keyId="paypal_secret" />
          <TestBtn gw="paypal" />
          <Button onClick={handleSave} disabled={saving} className="w-full bg-orange-500 hover:bg-orange-600 text-white">
            {saving ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : saved ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            {saved ? "Guardado" : "Guardar PayPal"}
          </Button>
          <Button variant="link" asChild className="text-orange-600 hover:text-orange-700 p-0">
            <a href="https://developer.paypal.com" target="_blank" rel="noopener noreferrer"><ExternalLink className="w-4 h-4 mr-2" />Ir a PayPal Developer</a>
          </Button>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <Calculator className="w-5 h-5 text-orange-500" />
            <span className="text-slate-800 font-medium">Calculadora de comisiones</span>
          </div>
          <div>
            <Label className="text-slate-600 text-sm font-medium">Cliente paga (ARS)</Label>
            <Input type="number" value={calcArs} onChange={e => setCalcArs(e.target.value)} className="bg-white border-slate-200 text-slate-800 mt-1 text-xl" />
            <p className="text-xs text-slate-400 mt-1">Tasa aprox: $1 USD = {exchangeRate.toLocaleString()} ARS</p>
          </div>
          <div className="bg-slate-50 border border-slate-100 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm"><span className="text-slate-500">Conversión a USD</span><span className="text-slate-800 font-medium">{(parseFloat(calcArs)/exchangeRate).toFixed(2)}</span></div>
            <div className="border-t border-slate-200 pt-2 space-y-1">
              <div className="flex justify-between text-sm"><span className="text-red-500">Comisión PayPal (5.4%)</span><span className="text-red-500">- {((parseFloat(calcArs)/exchangeRate)*0.054).toFixed(2)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-red-500">Fee fijo</span><span className="text-red-500">- $0.30</span></div>
            </div>
            <div className="border-t border-slate-200 pt-2 flex justify-between text-sm"><span className="text-slate-500">Total comisiones</span><span className="text-red-500 font-medium">- {((parseFloat(calcArs)/exchangeRate)*0.054+0.30).toFixed(2)}</span></div>
            <div className="border-t border-slate-200 pt-3">
              <div className="flex justify-between items-center">
                <span className="text-green-600 font-medium">Recibís en USD</span>
                <span className="text-green-600 text-2xl font-bold">{((parseFloat(calcArs)/exchangeRate)-(parseFloat(calcArs)/exchangeRate)*0.054-0.30).toFixed(2)} USD</span>
              </div>
              <p className="text-xs text-slate-400 text-right mt-1">({((((parseFloat(calcArs)/exchangeRate)-(parseFloat(calcArs)/exchangeRate)*0.054-0.30)/(parseFloat(calcArs)/exchangeRate))*100).toFixed(1)}% del total)</p>
            </div>
          </div>
          <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 text-sm flex gap-3">
            <Info className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
            <div><p className="font-medium text-yellow-700">PayPal</p><p className="text-yellow-600 mt-1">Los fondos se acreditan en USD en tu cuenta PayPal. Podés transferirlos a tu banco cuando quieras.</p></div>
          </div>
        </div>
      </div>
    )
    if (gwTab === "mobbex") return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-slate-800 font-medium">Mobbex activo</span>
            <Switch checked={config.mobbex_enabled} onCheckedChange={v => setConfig({ ...config, mobbex_enabled: v })} />
          </div>
          <div className="bg-green-50 border border-green-100 rounded-lg p-4 text-sm text-green-700">
            <p className="font-medium mb-1 flex items-center gap-2"><Info className="w-4 h-4" /> Comisión: 1% + IVA</p>
            <p className="text-green-600">La pasarela argentina más barata. Los cobros se acreditan en ARS en tu cuenta bancaria.</p>
          </div>
          <FieldInput label="API Key" value={config.mobbex_api_key} onChange={(v: string) => setConfig({ ...config, mobbex_api_key: v })} placeholder="mobbex_api_..." />
          <FieldInput label="Access Token" value={config.mobbex_access_token} onChange={(v: string) => setConfig({ ...config, mobbex_access_token: v })} placeholder="Token..." secret keyId="mobbex_token" />
          <TestBtn gw="mobbex" />
          <Button onClick={handleSave} disabled={saving} className="w-full bg-orange-500 hover:bg-orange-600 text-white">
            {saving ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : saved ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            {saved ? "Guardado" : "Guardar Mobbex"}
          </Button>
          <Button variant="link" asChild className="text-orange-600 hover:text-orange-700 p-0">
            <a href="https://mobbex.com" target="_blank" rel="noopener noreferrer"><ExternalLink className="w-4 h-4 mr-2" />Ir a Mobbex</a>
          </Button>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <Calculator className="w-5 h-5 text-orange-500" />
            <span className="text-slate-800 font-medium">Calculadora de comisiones</span>
          </div>
          <div>
            <Label className="text-slate-600 text-sm font-medium">Cliente paga (ARS)</Label>
            <Input type="number" value={calcArs} onChange={e => setCalcArs(e.target.value)} className="bg-white border-slate-200 text-slate-800 mt-1 text-xl" />
            <p className="text-xs text-slate-400 mt-1">Tasa aprox: $1 USD = ${exchangeRate.toLocaleString()} ARS</p>
          </div>
          <div className="bg-slate-50 border border-slate-100 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm"><span className="text-slate-500">Monto en ARS</span><span className="text-slate-800 font-medium">${parseFloat(calcArs).toLocaleString("es-AR", {maximumFractionDigits:0})}</span></div>
            <div className="border-t border-slate-200 pt-2 space-y-1">
              <div className="flex justify-between text-sm"><span className="text-red-500">Comisión Mobbex (1%)</span><span className="text-red-500">- ${(parseFloat(calcArs)*0.01).toLocaleString("es-AR", {maximumFractionDigits:0})}</span></div>
              <div className="flex justify-between text-sm"><span className="text-red-500">IVA (21%)</span><span className="text-red-500">- ${(parseFloat(calcArs)*0.01*0.21).toLocaleString("es-AR", {maximumFractionDigits:0})}</span></div>
            </div>
            <div className="border-t border-slate-200 pt-2 flex justify-between text-sm"><span className="text-slate-500">Total comisiones</span><span className="text-red-500 font-medium">- ${(parseFloat(calcArs)*0.01*1.21).toLocaleString("es-AR", {maximumFractionDigits:0})}</span></div>
            <div className="border-t border-slate-200 pt-3">
              <div className="flex justify-between items-center">
                <span className="text-green-600 font-medium">Recibís en ARS</span>
                <span className="text-green-600 text-2xl font-bold">${(parseFloat(calcArs) - parseFloat(calcArs)*0.01*1.21).toLocaleString("es-AR", {maximumFractionDigits:0})} ARS</span>
              </div>
              <p className="text-xs text-slate-400 text-right mt-1">({(((parseFloat(calcArs) - parseFloat(calcArs)*0.01*1.21)/parseFloat(calcArs))*100).toFixed(1)}% del total)</p>
            </div>
          </div>
          <div className="bg-green-50 border border-green-100 rounded-lg p-4 text-sm flex gap-3">
            <Info className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
            <div><p className="font-medium text-green-700">La más barata del mercado</p><p className="text-green-600 mt-1">Mobbex cobra solo 1% + IVA. Los fondos se acreditan directo en tu CBU bancario.</p></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Cobros</h2>
          <p className="text-slate-500 text-sm">Clientes pagan en ARS → Vos recibís en USD (Wells Fargo)</p>
        </div>
        <div className="flex items-center gap-2 bg-orange-50 border border-orange-100 rounded-lg px-3 py-1.5 text-xs text-orange-700">
          <span className="w-2 h-2 rounded-full bg-green-400 inline-block"></span>
          <span>Dólar MEP: <strong>${exchangeRate.toLocaleString("es-AR")} ARS</strong></span>
          <span className="text-orange-400">{rateUpdated ? `· Actualizado ${rateUpdated}` : "· Actualizado hoy"}</span>
        </div>
      </div>

      
      <div className="flex gap-1 border-b border-slate-200">
        {(["totales","pasarelas","alertas"] as const).map(tab => (
          <button key={tab} onClick={() => setMainTab(tab)}
            className={`px-5 py-2 text-sm font-medium rounded-t-lg transition-colors ${mainTab === tab ? "bg-white text-orange-600 border border-b-white border-slate-200 -mb-px" : "text-slate-500 hover:text-slate-700"}`}>
            {tab === "alertas" ? <span>Alertas {alerts.length > 0 && <span className="ml-1 bg-red-100 text-red-600 text-xs px-1.5 py-0.5 rounded-full">{alerts.length}</span>}</span> : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {mainTab === "totales" && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-slate-500 text-sm">Período:</span>
            <div className="relative">
              <select value={period} onChange={e => setPeriod(e.target.value)} className="bg-white border border-slate-200 text-slate-700 text-sm rounded-lg px-3 py-2 pr-8 appearance-none">
                {["Mar 2026","Feb 2026","Ene 2026"].map(p => <option key={p}>{p}</option>)}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { label: "Stripe", val: "$0", sub: "0 cobros", color: "text-orange-600", border: "border-orange-100" },
              { label: "MercadoPago", val: `$${totalesMes.totalArs.toLocaleString("es-AR")}`, sub: `${totalesMes.cobros} cobro${totalesMes.cobros === 1 ? "" : "s"}`, color: "text-orange-600", border: "border-orange-100" },
              { label: "PayPal", val: "$0", sub: "0 cobros", color: "text-amber-600", border: "border-amber-100" },
              { label: "Mobbex", val: "$0", sub: "0 cobros", color: "text-green-600", border: "border-green-100" },
              { label: "Total del mes", val: `$${totalesMes.totalArs.toLocaleString("es-AR")} ARS`, sub: `${totalesMes.cobros} cobro${totalesMes.cobros === 1 ? "" : "s"}`, color: "text-orange-600", border: "border-orange-500/20", highlight: true },
            ].map((m: any) => (
              <div key={m.label} className={`bg-white border rounded-xl p-4 ${m.border} ${m.highlight ? "shadow-sm" : ""}`}>
                <p className={`text-xs font-semibold mb-1 ${m.color}`}>{m.label}</p>
                <p className="text-2xl font-bold text-slate-800">{m.val}</p>
                <p className="text-xs text-slate-400 mt-1">{m.sub}</p>
              </div>
            ))}
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-slate-700 font-medium">Últimos movimientos</p>
              <p className="text-xs text-slate-400">Para encontrar a qué tienda pertenece un cobro visto en MercadoPago, buscalo en la pestaña Pasarelas → MercadoPago → Clientes</p>
            </div>
            {pagosLoading ? (
              <p className="text-center text-slate-400 text-sm py-6">Cargando...</p>
            ) : pagos.length === 0 ? (
              <p className="text-center text-slate-400 text-sm py-6">Sin movimientos aún</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {pagos.slice(0, 8).map(p => {
                  const estadoInfo = STATUS_LABELS[p.estado || ""] || { label: p.estado || "—", cls: "bg-slate-100 text-slate-600 border-slate-200" }
                  return (
                    <div key={p.id} className="flex items-center justify-between py-2.5 text-sm">
                      <div>
                        <span className="text-slate-800 font-medium">{p.store?.site_title || p.store?.subdomain || "tienda borrada"}</span>
                        <span className="text-slate-400 ml-2">{p.concepto}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-slate-500">{p.fecha ? new Date(p.fecha).toLocaleDateString("es-AR") : "—"}</span>
                        <span className="text-slate-800 font-medium">{p.monto_ars != null ? `$${p.monto_ars.toLocaleString("es-AR")}` : "—"}</span>
                        <Badge className={estadoInfo.cls}>{estadoInfo.label}</Badge>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {mainTab === "pasarelas" && (
        <div className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            {(["stripe","mp","paypal","mobbex"] as const).map(gw => (
              <button key={gw} onClick={() => setGw(gw)}
                className={`px-4 py-2 text-sm rounded-lg border transition-colors ${gwTab === gw ? "bg-orange-500 text-white border-orange-500 font-medium" : "text-slate-600 border-slate-200 hover:border-slate-300 bg-white"}`}>
                {{"stripe":"Stripe","mp":"MercadoPago","paypal":"PayPal","mobbex":"Mobbex"}[gw]}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {(["config","clientes"] as const).map(s => (
              <button key={s} onClick={() => setSubTab(s)}
                className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${subTab === s ? "bg-slate-100 text-slate-700 border-slate-200 font-medium" : "text-slate-400 border-slate-200 hover:text-slate-600 bg-white"}`}>
                {s === "config" ? "Configuración" : "Clientes"}
              </button>
            ))}
          </div>
          {renderGwConfig()}
        </div>
      )}

      {mainTab === "alertas" && (
        <div className="space-y-3">
          {alerts.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">
              <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <p className="text-slate-700 font-medium">Todo en orden</p>
              <p className="text-slate-400 text-sm mt-1">No hay alertas pendientes</p>
            </div>
          ) : alerts.map((a, i) => (
            <div key={i} className={`flex items-start gap-4 p-4 rounded-xl border ${a.type === "error" ? "bg-red-50 border-red-100" : "bg-amber-50 border-amber-100"}`}>
              <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${a.type === "error" ? "bg-red-400" : "bg-amber-400"}`} />
              <div>
                <p className={`font-medium ${a.type === "error" ? "text-red-700" : "text-amber-700"}`}>{a.title}</p>
                <p className={`text-sm mt-1 ${a.type === "error" ? "text-red-600" : "text-amber-600"}`}>{a.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-xl p-6 flex items-start gap-4">
        <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0">
          <TrendingUp className="w-6 h-6 text-blue-500" />
        </div>
        <div>
          <h3 className="font-medium text-slate-800 mb-1">Sobre la cotización del dólar</h3>
          <p className="text-slate-500 text-sm">Stripe usa la <strong className="text-slate-700">cotización del mercado interbancario</strong> (similar al dólar MEP). La tasa se actualiza automáticamente cada día. El spread de conversión (~2%) ya está incluido en la calculadora.</p>
        </div>
      </div>
    </div>
  )
}
