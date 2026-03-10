"use client"

import { useState, useEffect } from "react"
import { useCart } from "./cart-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft, CreditCard, Banknote, Building2, Smartphone, Truck, CheckCircle, Loader2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface CheckoutStore {
  id: string
  site_title: string
  subdomain: string
}

export function CheckoutForm({ store }: { store: CheckoutStore }) {
  const { items, total, clearCart, isLoaded } = useCart()
  const [step, setStep] = useState<"info" | "payment" | "shipping" | "confirm" | "success">("info")
  const [loading, setLoading] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [shippingCost, setShippingCost] = useState<number | null>(null)
  const [shippingLoading, setShippingLoading] = useState(false)
  const [shippingError, setShippingError] = useState<string | null>(null)
  const [orderData, setOrderData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    notes: "",
    paymentMethod: "",
    shippingMethod: "pickup",
  })
  const [paymentSettings, setPaymentSettings] = useState<{
    cash_enabled?: boolean
    transfer_enabled?: boolean
    card_enabled?: boolean
    mercadopago_enabled?: boolean
  } | null>(null)
  const [loadingPayments, setLoadingPayments] = useState(true)

  // Cargar configuracion de pagos de la tienda
  useEffect(() => {
    const loadPaymentSettings = async () => {
      try {
        const res = await fetch(`/api/admin/payments?storeId=${store.id}`)
        const data = await res.json()
        // Normalizar los valores booleanos (por si vienen como 1/0 de la DB)
        const normalizedData = data ? {
          ...data,
          cash_enabled: data.cash_enabled === true || data.cash_enabled === 1,
          transfer_enabled: data.transfer_enabled === true || data.transfer_enabled === 1,
          card_enabled: data.card_enabled === true || data.card_enabled === 1,
          mercadopago_enabled: data.mercadopago_enabled === true || data.mercadopago_enabled === 1,
        } : null
        
        setPaymentSettings(normalizedData)
        
        // Seleccionar el primer metodo habilitado por defecto
        if (normalizedData) {
          if (normalizedData.cash_enabled) setOrderData(prev => ({ ...prev, paymentMethod: "cash" }))
          else if (normalizedData.transfer_enabled) setOrderData(prev => ({ ...prev, paymentMethod: "transfer" }))
          else if (normalizedData.card_enabled) setOrderData(prev => ({ ...prev, paymentMethod: "card" }))
          else if (normalizedData.mercadopago_enabled) setOrderData(prev => ({ ...prev, paymentMethod: "mercadopago" }))
          else setOrderData(prev => ({ ...prev, paymentMethod: "" }))
        } else {
          setOrderData(prev => ({ ...prev, paymentMethod: "" }))
        }
      } catch (error) {
        console.error("Error cargando metodos de pago:", error)
        setOrderData(prev => ({ ...prev, paymentMethod: "cash" }))
      } finally {
        setLoadingPayments(false)
      }
    }
    loadPaymentSettings()
  }, [store.id])

  // Limpiar carrito si vuelve de MercadoPago
  useEffect(() => {
    if (typeof window !== "undefined") {
      const pendingClear = sessionStorage.getItem("mp_pending_clear")
      if (pendingClear) {
        sessionStorage.removeItem("mp_pending_clear")
        clearCart()
      }
    }
  }, [clearCart])

  const formatPrice = (price: number) => {
    return `$${price.toLocaleString()}`
  }

  // Cotizar envío con Andreani cuando cambia el código postal
  const fetchShippingQuote = async (postalCode: string) => {
    if (!postalCode || postalCode.length < 4) {
      setShippingCost(null)
      return
    }

    setShippingLoading(true)
    setShippingError(null)

    try {
      const response = await fetch("/api/shipping/andreani/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeId: store.id,
          cpDestino: postalCode,
          pesoTotal: items.reduce((acc, item) => acc + (item.quantity * 500), 0), // Estimado 500g por producto
          valorDeclarado: total,
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setShippingCost(data.quote.priceWithTax || data.quote.priceWithoutTax)
      } else {
        // Si no hay Andreani configurado, no mostrar error, solo dejar "A calcular"
        setShippingCost(null)
        if (data.error && !data.error.includes("no configuradas")) {
          setShippingError(data.error)
        }
      }
    } catch (error) {
      console.error("[v0] Error cotizando envío:", error)
      setShippingCost(null)
    } finally {
      setShippingLoading(false)
    }
  }

  // Efecto para cotizar cuando cambia el CP
  useEffect(() => {
    if (orderData.shippingMethod === "delivery" && orderData.postalCode) {
      const timer = setTimeout(() => {
        fetchShippingQuote(orderData.postalCode)
      }, 500) // Debounce de 500ms
      return () => clearTimeout(timer)
    } else {
      setShippingCost(null)
    }
  }, [orderData.postalCode, orderData.shippingMethod])

  const getItemKey = (item: (typeof items)[0]) => {
    return `${item.product.id}-${item.product.selectedSize || "no-size"}`
  }

  const getStoreUrl = () => {
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname
      const isSubdomain = hostname.includes(".tol.ar") && !hostname.startsWith("www.") && hostname !== "tol.ar"
      if (isSubdomain) {
        return "/"
      }
    }
    return `/tienda/${store.subdomain}`
  }

  const handleSubmit = async () => {
    setLoading(true)

    try {
      // Primero crear el pedido
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeId: store.id,
          items: items.map((item) => ({
            productId: item.product.id,
            name: item.product.name,
            price: Number(item.product.price),
            quantity: item.quantity,
            size: item.product.selectedSize || null,
            image_url: item.product.image_url || null,
          })),
          total,
          customer: {
            name: orderData.name,
            email: orderData.email,
            phone: orderData.phone,
          },
          shipping: {
            method: orderData.shippingMethod,
            address: orderData.address,
            city: orderData.city,
            postalCode: orderData.postalCode,
            notes: orderData.notes,
          },
          paymentMethod: orderData.paymentMethod,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // Si eligió MercadoPago, redirigir al checkout de MP
        if (orderData.paymentMethod === "mercadopago") {
          try {
            const mpResponse = await fetch("/api/mercadopago/create-preference", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                storeId: store.id,
                orderId: data.orderId,
                customerEmail: orderData.email,
                items: items.map((item) => ({
                  name: item.product.name,
                  price: Number(item.product.price),
                  quantity: item.quantity,
                  size: item.product.selectedSize || null,
                })),
              }),
            })

            const mpData = await mpResponse.json()

            if (mpResponse.ok && mpData.initPoint) {
              // Guardamos en sessionStorage para limpiar cuando vuelva
              sessionStorage.setItem("mp_pending_clear", "true")
              
              // Verificar si usar modal o redirect
              if (mpData.checkoutType === "modal") {
                // Abrir en popup/ventana nueva centrada
                const width = 600
                const height = 700
                const left = (window.screen.width - width) / 2
                const top = (window.screen.height - height) / 2
                const popup = window.open(
                  mpData.initPoint,
                  "MercadoPago",
                  `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
                )
                
                // Verificar si el popup fue bloqueado
                if (!popup || popup.closed || typeof popup.closed === "undefined") {
                  // Si el popup fue bloqueado, hacer redirect normal
                  window.location.href = mpData.initPoint
                }
                return
              } else {
                // Redirect normal
                window.location.href = mpData.initPoint
                return
              }
            } else {
              console.error("[v0] Error MP Response:", mpData)
              const errorMsg = mpData.details || mpData.error || "Error desconocido"
              alert(`Error al conectar con MercadoPago: ${errorMsg}. El pedido fue creado, te contactaremos para coordinar el pago.`)
            }
          } catch (mpError) {
            console.error("Error al crear preferencia MP:", mpError)
            alert("Error al conectar con MercadoPago. El pedido fue creado, te contactaremos para coordinar el pago.")
          }
        }
        
        setOrderId(data.orderId)
        clearCart()
        setStep("success")
      }
    } catch (error) {
      console.error("Error al crear pedido:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-neutral-400" />
          <p className="text-neutral-500">Cargando carrito...</p>
        </div>
      </div>
    )
  }

  if (items.length === 0 && step !== "success") {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-light mb-4">Tu carrito está vacío</h1>
          <Link href={getStoreUrl()}>
            <Button variant="outline">Volver a la tienda</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (step === "success") {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-sm max-w-md w-full text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-light mb-2">¡Pedido confirmado!</h1>
          {orderId && <p className="text-sm text-neutral-500 mb-2">Orden #{orderId.slice(0, 8).toUpperCase()}</p>}
          <p className="text-neutral-600 mb-6">
            Recibimos tu pedido. Te contactaremos pronto para coordinar el pago y envío.
          </p>
          <Link href={getStoreUrl()}>
            <Button className="w-full">Volver a la tienda</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href={getStoreUrl()} className="flex items-center gap-2 text-sm text-neutral-600 hover:text-black">
            <ArrowLeft className="h-4 w-4" />
            Volver a la tienda
          </Link>
          <h1 className="text-lg font-medium">{store.site_title}</h1>
          <div className="w-24" />
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Formulario */}
          <div className="space-y-6">
            {/* Pasos */}
            <div className="flex gap-2 mb-8">
              {["info", "shipping", "payment", "confirm"].map((s, i) => (
                <div
                  key={s}
                  className={`flex-1 h-1 rounded ${
                    ["info", "shipping", "payment", "confirm"].indexOf(step) >= i ? "bg-black" : "bg-neutral-200"
                  }`}
                />
              ))}
            </div>

            {/* Paso 1: Información */}
            {step === "info" && (
              <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
                <h2 className="text-lg font-medium mb-4">Información de contacto</h2>

                <div className="space-y-2">
                  <Label htmlFor="name">Nombre completo *</Label>
                  <Input
                    id="name"
                    value={orderData.name}
                    onChange={(e) => setOrderData({ ...orderData, name: e.target.value })}
                    placeholder="Tu nombre"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={orderData.email}
                    onChange={(e) => setOrderData({ ...orderData, email: e.target.value })}
                    placeholder="tu@email.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono *</Label>
                  <Input
                    id="phone"
                    value={orderData.phone}
                    onChange={(e) => setOrderData({ ...orderData, phone: e.target.value })}
                    placeholder="+54 11 1234-5678"
                  />
                </div>

                <Button
                  className="w-full mt-4"
                  onClick={() => setStep("shipping")}
                  disabled={!orderData.name || !orderData.email || !orderData.phone}
                >
                  Continuar
                </Button>
              </div>
            )}

            {/* Paso 2: Envío */}
            {step === "shipping" && (
              <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
                <h2 className="text-lg font-medium mb-4">Método de envío</h2>

                <RadioGroup
                  value={orderData.shippingMethod}
                  onValueChange={(value) => setOrderData({ ...orderData, shippingMethod: value })}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:border-black">
                    <RadioGroupItem value="pickup" id="pickup" />
                    <Label htmlFor="pickup" className="flex items-center gap-3 cursor-pointer flex-1">
                      <Truck className="h-5 w-5" />
                      <div>
                        <p className="font-medium">Retiro en local</p>
                        <p className="text-sm text-neutral-500">Gratis</p>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:border-black">
                    <RadioGroupItem value="delivery" id="delivery" />
                    <Label htmlFor="delivery" className="flex items-center gap-3 cursor-pointer flex-1">
                      <Truck className="h-5 w-5" />
                      <div>
                        <p className="font-medium">Envío a domicilio</p>
                        <p className="text-sm text-neutral-500">Calculado según destino</p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>

                {orderData.shippingMethod === "delivery" && (
                  <div className="space-y-4 mt-4 pt-4 border-t">
                    <div className="space-y-2">
                      <Label htmlFor="address">Dirección *</Label>
                      <Input
                        id="address"
                        value={orderData.address}
                        onChange={(e) => setOrderData({ ...orderData, address: e.target.value })}
                        placeholder="Calle y número"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">Ciudad *</Label>
                        <Input
                          id="city"
                          value={orderData.city}
                          onChange={(e) => setOrderData({ ...orderData, city: e.target.value })}
                          placeholder="Ciudad"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="postalCode">Código postal</Label>
                        <Input
                          id="postalCode"
                          value={orderData.postalCode}
                          onChange={(e) => setOrderData({ ...orderData, postalCode: e.target.value })}
                          placeholder="1234"
                        />
                      </div>
                    </div>

                    {/* Mostrar costo de envío */}
                    {orderData.postalCode && orderData.postalCode.length >= 4 && (
                      <div className="mt-4 p-3 bg-muted rounded-lg">
                        {shippingLoading ? (
                          <p className="text-sm text-muted-foreground">Calculando costo de envío...</p>
                        ) : shippingError ? (
                          <p className="text-sm text-red-600">{shippingError}</p>
                        ) : shippingCost !== null ? (
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Costo de envío (Andreani):</span>
                            <span className="text-lg font-bold">${shippingCost.toLocaleString()}</span>
                          </div>
                        ) : null}
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="notes">Notas adicionales</Label>
                  <Textarea
                    id="notes"
                    value={orderData.notes}
                    onChange={(e) => setOrderData({ ...orderData, notes: e.target.value })}
                    placeholder="Instrucciones especiales para la entrega..."
                  />
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep("info")}>
                    Atrás
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => setStep("payment")}
                    disabled={orderData.shippingMethod === "delivery" && (!orderData.address || !orderData.city)}
                  >
                    Continuar
                  </Button>
                </div>
              </div>
            )}

            {/* Paso 3: Pago */}
            {step === "payment" && (
              <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
                <h2 className="text-lg font-medium mb-4">Método de pago</h2>

                {loadingPayments ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
                  </div>
                ) : (
                  <div>
                    <RadioGroup
                      value={orderData.paymentMethod}
                      onValueChange={(value) => setOrderData({ ...orderData, paymentMethod: value })}
                      className="space-y-3"
                    >
                      {/* Efectivo - mostrar solo si esta habilitado */}
                      {paymentSettings?.cash_enabled && (
                        <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:border-black">
                          <RadioGroupItem value="cash" id="cash" />
                          <Label htmlFor="cash" className="flex items-center gap-3 cursor-pointer flex-1">
                            <Banknote className="h-5 w-5" />
                            <div>
                              <p className="font-medium">Efectivo</p>
                              <p className="text-sm text-neutral-500">Pago al recibir o retirar</p>
                            </div>
                          </Label>
                        </div>
                      )}
                      
                      {/* Transferencia - mostrar solo si esta habilitado */}
                      {paymentSettings?.transfer_enabled && (
                        <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:border-black">
                          <RadioGroupItem value="transfer" id="transfer" />
                          <Label htmlFor="transfer" className="flex items-center gap-3 cursor-pointer flex-1">
                            <Building2 className="h-5 w-5" />
                            <div>
                              <p className="font-medium">Transferencia bancaria</p>
                              <p className="text-sm text-neutral-500">Te enviamos los datos</p>
                            </div>
                          </Label>
                        </div>
                      )}
                      
                      {/* Tarjeta - mostrar solo si esta habilitado */}
                      {paymentSettings?.card_enabled && (
                        <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:border-black">
                          <RadioGroupItem value="card" id="card" />
                          <Label htmlFor="card" className="flex items-center gap-3 cursor-pointer flex-1">
                            <CreditCard className="h-5 w-5" />
                            <div>
                              <p className="font-medium">Tarjeta</p>
                              <p className="text-sm text-neutral-500">Crédito o débito</p>
                            </div>
                          </Label>
                        </div>
                      )}
                      
                      {/* MercadoPago - mostrar solo si esta habilitado */}
                      {paymentSettings?.mercadopago_enabled && (
                        <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:border-black">
                          <RadioGroupItem value="mercadopago" id="mercadopago" />
                          <Label htmlFor="mercadopago" className="flex items-center gap-3 cursor-pointer flex-1">
                            <Smartphone className="h-5 w-5" />
                            <div>
                              <p className="font-medium">Mercado Pago</p>
                              <p className="text-sm text-neutral-500">Todas las formas de pago</p>
                            </div>
                          </Label>
                        </div>
                      )}
                      
                      {/* Si no hay ningún método habilitado, mostrar mensaje */}
                      {!paymentSettings?.cash_enabled && !paymentSettings?.transfer_enabled && !paymentSettings?.card_enabled && !paymentSettings?.mercadopago_enabled && (
                        <div className="text-center py-4 text-neutral-500">
                          <p>No hay métodos de pago configurados.</p>
                          <p className="text-sm">Contacta al vendedor para coordinar el pago.</p>
                        </div>
                      )}
                    </RadioGroup>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep("shipping")}>
                    Atrás
                  </Button>
                  <Button className="flex-1" onClick={() => setStep("confirm")}>
                    Continuar
                  </Button>
                </div>
              </div>
            )}

            {/* Paso 4: Confirmar */}
            {step === "confirm" && (
              <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
                <h2 className="text-lg font-medium mb-4">Confirmar pedido</h2>

                <div className="space-y-4 text-sm">
                  <div className="pb-4 border-b">
                    <p className="text-neutral-500 mb-1">Contacto</p>
                    <p className="font-medium">{orderData.name}</p>
                    <p>{orderData.email}</p>
                    <p>{orderData.phone}</p>
                  </div>

                  <div className="pb-4 border-b">
                    <p className="text-neutral-500 mb-1">Envío</p>
                    <p className="font-medium">
                      {orderData.shippingMethod === "pickup" ? "Retiro en local" : "Envío a domicilio"}
                    </p>
                    {orderData.shippingMethod === "delivery" && (
                      <p>
                        {orderData.address}, {orderData.city} {orderData.postalCode}
                      </p>
                    )}
                  </div>

                  <div>
                    <p className="text-neutral-500 mb-1">Pago</p>
                    <p className="font-medium">
                      {orderData.paymentMethod === "cash" && "Efectivo"}
                      {orderData.paymentMethod === "transfer" && "Transferencia bancaria"}
                      {orderData.paymentMethod === "card" && "Tarjeta"}
                      {orderData.paymentMethod === "mercadopago" && "Mercado Pago"}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button variant="outline" onClick={() => setStep("payment")}>
                    Atrás
                  </Button>
                  <Button className="flex-1" onClick={handleSubmit} disabled={loading}>
                    {loading ? "Procesando..." : "Pagar"}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Resumen del pedido */}
          <div className="lg:sticky lg:top-8 h-fit">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-medium mb-4">Resumen del pedido</h2>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={getItemKey(item)} className="flex gap-4">
                    <div className="relative h-16 w-16 bg-neutral-100 rounded flex-shrink-0">
                      {item.product.image_url ? (
                        <Image
                          src={item.product.image_url || "/images/placeholders/placeholder.svg"}
                          alt={item.product.name}
                          fill
                          className="object-cover rounded"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-300">
                          <span className="text-xs">Sin img</span>
                        </div>
                      )}
                      <span className="absolute -top-2 -right-2 bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.product.name}</p>
                      {item.product.selectedSize && (
                        <p className="text-xs text-neutral-500">Talla: {item.product.selectedSize}</p>
                      )}
                      <p className="text-sm text-neutral-500">{formatPrice(Number(item.product.price))}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Subtotal</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Envío</span>
                  <span>
                    {orderData.shippingMethod === "pickup" 
                      ? "Gratis (retiro en local)" 
                      : shippingCost !== null 
                        ? formatPrice(shippingCost)
                        : "A calcular"
                  }</span>
                </div>
                <div className="flex justify-between text-lg font-medium pt-2 border-t">
                  <span>Total</span>
                  <span>{formatPrice(total + (orderData.shippingMethod === "delivery" && shippingCost ? shippingCost : 0))}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
