"use client"

import { useState, useEffect } from "react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Loader2, Truck, MapPin, Package } from "lucide-react"

interface ShippingOption {
  id: string
  name: string
  description: string
  price: number
  estimatedDays?: string
  type: "pickup" | "own_delivery" | "andreani" | "enviamelo"
}

interface ShippingOptionsProps {
  storeId: string
  postalCode: string
  cartTotal: number
  cartWeight?: number
  onSelect: (option: ShippingOption | null) => void
  selectedOption?: ShippingOption | null
}

export function ShippingOptions({
  storeId,
  postalCode,
  cartTotal,
  cartWeight = 1000,
  onSelect,
  selectedOption,
}: ShippingOptionsProps) {
  const [options, setOptions] = useState<ShippingOption[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (postalCode && postalCode.length >= 4) {
      fetchShippingOptions()
    }
  }, [postalCode, storeId])

  const fetchShippingOptions = async () => {
    setLoading(true)
    setError(null)
    const availableOptions: ShippingOption[] = []

    try {
      // Obtener configuración de envío de la tienda
      const configRes = await fetch(`/api/shipping/config?storeId=${storeId}`)
      const configData = await configRes.json()

      if (configData.error) {
        setError("No hay opciones de envío configuradas")
        setLoading(false)
        return
      }

      const config = configData.config

      // Retiro en local
      if (config.pickup_enabled) {
        availableOptions.push({
          id: "pickup",
          name: "Retiro en local",
          description: config.pickup_address || "Retirá tu pedido gratis",
          price: 0,
          type: "pickup",
        })
      }

      // Envío propio
      if (config.own_delivery_enabled) {
        const cost = parseFloat(config.own_delivery_cost) || 0
        const freeAbove = parseFloat(config.delivery_free_above) || 0
        const isFree = freeAbove > 0 && cartTotal >= freeAbove

        availableOptions.push({
          id: "own_delivery",
          name: "Envío a domicilio",
          description: config.own_delivery_zones || "Zona de cobertura",
          price: isFree ? 0 : cost,
          estimatedDays: config.own_delivery_time || "24-48hs",
          type: "own_delivery",
        })
      }

      // Andreani
      if (config.andreani_enabled && config.andreani_user && config.andreani_password) {
        try {
          const andreaniRes = await fetch("/api/shipping/andreani/quote", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              storeId,
              cpDestino: postalCode,
              pesoTotal: cartWeight,
              valorDeclarado: cartTotal,
            }),
          })

          const andreaniData = await andreaniRes.json()

          if (andreaniData.success && andreaniData.quote) {
            availableOptions.push({
              id: "andreani",
              name: "Andreani",
              description: `Envío a CP ${postalCode}`,
              price: andreaniData.quote.priceWithTax,
              estimatedDays: andreaniData.quote.estimatedDays,
              type: "andreani",
            })
          }
        } catch (e) {
          console.error("[v0] Error cotizando Andreani:", e)
        }
      }

      setOptions(availableOptions)

      // Si hay opciones y ninguna seleccionada, seleccionar la primera
      if (availableOptions.length > 0 && !selectedOption) {
        onSelect(availableOptions[0])
      }
    } catch (e) {
      console.error("[v0] Error obteniendo opciones de envío:", e)
      setError("Error al cargar opciones de envío")
    } finally {
      setLoading(false)
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "pickup":
        return <MapPin className="h-5 w-5" />
      case "own_delivery":
        return <Truck className="h-5 w-5" />
      case "andreani":
        return <Package className="h-5 w-5" />
      default:
        return <Truck className="h-5 w-5" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="h-5 w-5 animate-spin mr-2" />
        <span className="text-sm text-muted-foreground">Calculando opciones de envío...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-sm text-red-600 py-2">
        {error}
      </div>
    )
  }

  if (options.length === 0) {
    return (
      <div className="text-sm text-muted-foreground py-2">
        No hay opciones de envío disponibles para este código postal.
      </div>
    )
  }

  return (
    <RadioGroup
      value={selectedOption?.id || ""}
      onValueChange={(value) => {
        const option = options.find((o) => o.id === value)
        onSelect(option || null)
      }}
      className="space-y-3"
    >
      {options.map((option) => (
        <div
          key={option.id}
          className={`flex items-center space-x-3 border rounded-lg p-4 cursor-pointer transition-colors ${
            selectedOption?.id === option.id
              ? "border-primary bg-primary/5"
              : "border-gray-200 hover:border-gray-300"
          }`}
          onClick={() => onSelect(option)}
        >
          <RadioGroupItem value={option.id} id={option.id} />
          <div className="flex-1">
            <Label htmlFor={option.id} className="flex items-center gap-2 cursor-pointer font-medium">
              {getIcon(option.type)}
              {option.name}
              {option.estimatedDays && (
                <span className="text-xs text-muted-foreground font-normal">
                  ({option.estimatedDays})
                </span>
              )}
            </Label>
            <p className="text-sm text-muted-foreground mt-1">{option.description}</p>
          </div>
          <div className="text-right">
            {option.price === 0 ? (
              <span className="text-green-600 font-medium">Gratis</span>
            ) : (
              <span className="font-medium">${option.price.toLocaleString("es-AR")}</span>
            )}
          </div>
        </div>
      ))}
    </RadioGroup>
  )
}
