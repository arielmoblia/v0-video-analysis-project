'use client'
import { useState, useEffect, useRef } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ArrowRight, Loader2, ShoppingBag, CheckCircle, CreditCard, Lock } from 'lucide-react'

const PAYMENT_PLATFORMS = [
  { id: 'mp', name: 'Mercado Pago', desc: 'Tarjeta de crédito o débito', color: '#00b1ea', enabled: true },
  { id: 'stripe', name: 'Stripe', desc: 'Próximamente', color: '#635bff', enabled: false },
  { id: 'paypal', name: 'PayPal', desc: 'Próximamente', color: '#ffc439', enabled: false },
  { id: 'mobbex', name: 'Mobbex', desc: 'Próximamente', color: '#00c853', enabled: false },
] as const

interface CositasCheckoutProps {
  selectedCositas: string[]
  total: number
  hasPercentItem: boolean
  storeId?: string
}

export function CositasCheckout({ selectedCositas, total, hasPercentItem, storeId: storeIdProp }: CositasCheckoutProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [subdomain, setSubdomain] = useState("")
  const [storeId, setStoreId] = useState<string | null>(storeIdProp || null)
  const [subdomainError, setSubdomainError] = useState("")
  const [lookingUp, setLookingUp] = useState(false)
  const [loadingBrick, setLoadingBrick] = useState(false)
  const [success, setSuccess] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null)
  const brickRef = useRef<HTMLDivElement>(null)
  const brickBuilt = useRef(false)

  const lookupStore = async (val: string) => {
    setSubdomain(val)
    setStoreId(null)
    setSubdomainError("")
    brickBuilt.current = false
    if (!val || val.length < 2) return
    setLookingUp(true)
    try {
      const res = await fetch(`/api/super-admin/store-by-subdomain?subdomain=${val}`)
      if (res.ok) {
        const data = await res.json()
        setStoreId(data.id)
      } else {
        setSubdomainError("Tienda no encontrada")
      }
    } catch {
      setSubdomainError("Error al verificar")
    }
    setLookingUp(false)
  }

  const initBrick = async (sid: string) => {
    if (brickBuilt.current || !brickRef.current) return
    setLoadingBrick(true)
    const pubKey = "APP_USR-aa9e2733-fd0b-49d8-b0b9-7abf369a9aa7"

    const loadMP = () => new Promise<void>(resolve => {
      if ((window as any).MercadoPago) { resolve(); return }
      const s = document.createElement("script")
      s.src = "https://sdk.mercadopago.com/js/v2"
      s.onload = () => resolve()
      document.head.appendChild(s)
    })

    await loadMP()
    const mp = new (window as any).MercadoPago(pubKey, { locale: "es-AR" })
    const bricks = mp.bricks()
    brickBuilt.current = true
    setLoadingBrick(false)

    await bricks.create("cardPayment", "mp-card-brick", {
      initialization: {
        amount: total,
        payer: { email: "" },
      },
      customization: {
        visual: { style: { theme: "default" } },
        paymentMethods: { minInstallments: 1, maxInstallments: 1 },
      },
      callbacks: {
        onReady: () => {},
        onError: (err: any) => console.error("MP Brick error:", err),
        onSubmit: async (cardData: any) => {
          try {
            const res = await fetch("/api/tolar/mercadopago/card-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ cardData, storeId: sid, features: selectedCositas, totalARS: total }),
            })
            const data = await res.json()
            if (res.ok && data.status === "approved") {
              setSuccess(true)
            } else {
              alert(data.error || "Pago rechazado. Intentá con otra tarjeta.")
            }
          } catch {
            alert("Error al procesar el pago")
          }
        },
      },
    })
  }

  useEffect(() => {
    if (storeId && isOpen && paymentMethod === 'mp') {
      brickBuilt.current = false
      setTimeout(() => initBrick(storeId), 100)
    }
  }, [storeId, isOpen, paymentMethod])

  const handleOpen = () => {
    if (storeIdProp) setStoreId(storeIdProp)
    brickBuilt.current = false
    setSuccess(false)
    setPaymentMethod(null)
    setIsOpen(true)
  }

  return (
    <>
      <Button
        size="lg"
        className="gap-2 bg-gradient-to-r from-[#62162f] to-[#96305a] hover:from-[#330000] hover:to-[#62162f]"
        onClick={handleOpen}
      >
        <ArrowRight className="w-4 h-4" />
        Continuar
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#62162f]" />
              Completar pago
            </DialogTitle>
          </DialogHeader>

          <div className="mt-2 space-y-4">

            <div className="bg-[#ff9fc5]/10 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-sm">Total a pagar:</span>
                <span className="text-2xl font-bold text-[#62162f]">
                  ${total.toLocaleString("es-AR")}
                  {hasPercentItem && " + 10%"}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {selectedCositas.length} cosita{selectedCositas.length > 1 ? "s" : ""} seleccionada{selectedCositas.length > 1 ? "s" : ""}
              </p>
            </div>

            {!storeIdProp && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Para que tienda?</label>
                <div className="flex items-center border rounded-lg overflow-hidden">
                  <input
                    type="text"
                    placeholder="mitienda"
                    value={subdomain}
                    onChange={e => lookupStore(e.target.value)}
                    className="flex-1 px-3 py-2 text-sm outline-none bg-transparent"
                  />
                  <span className="px-3 py-2 text-sm text-muted-foreground bg-slate-50 border-l">.tol.ar</span>
                </div>
                {lookingUp && <p className="text-xs text-muted-foreground">Buscando...</p>}
                {subdomainError && <p className="text-xs text-red-500">{subdomainError}</p>}
                {storeId && !subdomainError && <p className="text-xs text-green-600">Tienda encontrada</p>}
              </div>
            )}

            {success ? (
              <div className="text-center py-8 space-y-3">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                <p className="text-xl font-bold text-green-600">Pago exitoso</p>
                <p className="text-muted-foreground text-sm">Tus cositas ya estan activas. Te enviamos un email de confirmacion.</p>
                <Button onClick={() => setIsOpen(false)} className="mt-2">Cerrar</Button>
              </div>
            ) : !storeId && !storeIdProp ? (
              <div className="text-center py-6 text-muted-foreground text-sm">
                Ingresa tu subdominio para continuar
              </div>
            ) : !paymentMethod ? (
              <div className="space-y-2">
                <label className="text-sm font-medium">Elegí cómo pagar</label>
                {PAYMENT_PLATFORMS.map(p => (
                  <button
                    key={p.id}
                    disabled={!p.enabled}
                    onClick={() => p.enabled && setPaymentMethod(p.id)}
                    className={`w-full flex items-center gap-3 border rounded-lg p-3 text-left transition ${
                      p.enabled ? "hover:border-[#62162f] hover:bg-[#ff9fc5]/5 cursor-pointer" : "opacity-50 cursor-not-allowed bg-slate-50"
                    }`}
                  >
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${p.color}1a` }}
                    >
                      {p.enabled ? <CreditCard className="w-4 h-4" style={{ color: p.color }} /> : <Lock className="w-4 h-4 text-slate-400" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-800">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.desc}</p>
                    </div>
                    {p.enabled && <ArrowRight className="w-4 h-4 text-[#62162f]" />}
                  </button>
                ))}
              </div>
            ) : (
              <>
                <button
                  onClick={() => setPaymentMethod(null)}
                  className="text-xs text-muted-foreground hover:text-[#62162f]"
                >
                  ← Cambiar método de pago
                </button>
                {loadingBrick && (
                  <div className="flex items-center justify-center py-8 gap-2">
                    <Loader2 className="w-6 h-6 animate-spin text-[#00b1ea]" />
                    <span className="text-sm text-muted-foreground">Cargando formulario de pago...</span>
                  </div>
                )}
                <div id="mp-card-brick" ref={brickRef} />
                <p className="text-center text-xs text-muted-foreground">
                  Al pagar, las cositas se activan automaticamente en tu tienda
                </p>
              </>
            )}

          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
