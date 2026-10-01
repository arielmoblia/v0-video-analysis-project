"use client"

import { useState, useEffect } from "react"
import { Loader2, Eye, EyeOff } from "lucide-react"
import { formatPrice } from "@/lib/currency"
import type { Order, OrderStatus } from "@/lib/types"

interface CuentaClientProps {
  subdomain: string
  storeName: string
  country?: string | null
}

interface SessionCustomer {
  name: string
  email: string
  phone: string | null
}

const STATUS_LABELS: Record<OrderStatus, string> = {
  pendiente: "Pendiente",
  pendiente_pago: "Esperando el pago",
  pagado: "Pagado",
  preparando: "Preparando",
  enviado: "Enviado",
  entregado: "Entregado",
  cancelado: "Cancelado",
}

export function CuentaClient({ subdomain, storeName, country }: CuentaClientProps) {
  const [loading, setLoading] = useState(true)
  const [customer, setCustomer] = useState<SessionCustomer | null>(null)
  const [orders, setOrders] = useState<Order[]>([])

  const load = () => {
    fetch(`/api/customer/me?subdomain=${subdomain}`)
      .then((r) => r.json())
      .then((data) => {
        setCustomer(data.customer || null)
        setOrders(data.orders || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  useEffect(load, [subdomain])

  const handleLogout = async () => {
    await fetch("/api/customer/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subdomain }),
    })
    setCustomer(null)
    setOrders([])
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
      </div>
    )
  }

  if (!customer) {
    return <AuthForms subdomain={subdomain} storeName={storeName} onSuccess={load} />
  }

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Hola, {customer.name.split(" ")[0]}</h1>
          <p className="text-sm text-neutral-500 mt-1">{customer.email}</p>
        </div>
        <button onClick={handleLogout} className="text-sm text-neutral-500 hover:text-neutral-900 underline">
          Cerrar sesión
        </button>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Mis pedidos</h2>
        {orders.length === 0 ? (
          <p className="text-sm text-neutral-400">Todavía no hiciste ningún pedido en {storeName}.</p>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <div key={order.id} className="rounded-lg border border-neutral-200 p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-900">
                    {new Date(order.created_at).toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                  <p className="text-xs text-neutral-500 mt-0.5">{order.items?.length || 0} producto(s)</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-neutral-900">{formatPrice(order.total, country)}</p>
                  <p className="text-xs text-neutral-500 mt-0.5">{STATUS_LABELS[order.status] || order.status}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ChangePasswordForm subdomain={subdomain} />
    </div>
  )
}

function AuthForms({ subdomain, storeName, onSuccess }: { subdomain: string; storeName: string; onSuccess: () => void }) {
  const [mode, setMode] = useState<"login" | "register">("login")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (mode === "register" && password !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }

    setLoading(true)

    const url = mode === "login" ? "/api/customer/login" : "/api/customer/register"
    const body = mode === "login" ? { subdomain, email, password } : { subdomain, name, email, phone, password }

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error || "Algo salió mal")
      return
    }
    onSuccess()
  }

  const inputClass = "w-full rounded-lg border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-neutral-400"
  const labelClass = "block text-sm text-neutral-700 mb-1.5"

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 mb-1">{mode === "login" ? "Iniciá sesión" : "Crear cuenta"}</h1>
      <p className="text-sm text-neutral-500 mb-6">
        {mode === "login" ? `Entrá a tu cuenta de ${storeName}` : `Comprá más rápido en ${storeName} y llevá el control de tus pedidos, ¡en un solo lugar!`}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === "register" && (
          <div>
            <label className={labelClass}>Nombre y apellido</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ej.: María Perez"
              required
              className={inputClass}
            />
          </div>
        )}
        <div>
          <label className={labelClass}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ej.: tuemail@email.com"
            required
            className={inputClass}
          />
        </div>
        {mode === "register" && (
          <div>
            <label className={labelClass}>Teléfono (opcional)</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="ej.: 1123445567"
              className={inputClass}
            />
          </div>
        )}
        <div>
          <label className={labelClass}>Contraseña</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="ej.: tucontraseña"
              required
              minLength={6}
              className={`${inputClass} pr-11`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        {mode === "register" && (
          <div>
            <label className={labelClass}>Confirmar contraseña</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="ej.: tucontraseña"
                required
                minLength={6}
                className={`${inputClass} pr-11`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-black text-white rounded-lg font-medium hover:bg-neutral-800 disabled:opacity-50 text-sm"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {mode === "login" ? "Entrar" : "Crear cuenta"}
        </button>
      </form>

      <p className="mt-4 text-sm text-neutral-500">
        {mode === "login" ? "¿No tenés cuenta? " : "¿Ya tenés una cuenta? "}
        <button
          onClick={() => { setMode(mode === "login" ? "register" : "login"); setError("") }}
          className="text-neutral-900 underline hover:text-neutral-700"
        >
          {mode === "login" ? "Registrate" : "Iniciá sesión"}
        </button>
      </p>
    </div>
  )
}

function ChangePasswordForm({ subdomain }: { subdomain: string }) {
  const [open, setOpen] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setMessage("")

    const res = await fetch("/api/customer/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subdomain, currentPassword, newPassword }),
    })
    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error || "Algo salió mal")
      return
    }
    setMessage("Contraseña actualizada")
    setCurrentPassword("")
    setNewPassword("")
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="text-sm text-neutral-500 hover:text-neutral-900 underline">
        Cambiar contraseña
      </button>
    )
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-neutral-900 mb-4">Cambiar contraseña</h2>
      <form onSubmit={handleSubmit} className="space-y-3 max-w-sm">
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Contraseña actual"
          required
          className="w-full rounded-lg border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-neutral-400"
        />
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Contraseña nueva"
          required
          minLength={6}
          className="w-full rounded-lg border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-neutral-400"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        {message && <p className="text-sm text-green-600">{message}</p>}
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-lg font-medium hover:bg-neutral-800 disabled:opacity-50 text-sm"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          Guardar
        </button>
      </form>
    </div>
  )
}
