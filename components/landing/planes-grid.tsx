"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { EditableText, usePageContent } from "@/components/editable-text"
import { PLANS } from "@/components/landing/plans-section"

type Plan = (typeof PLANS)[number]

const PLAN_TAGLINES: Record<string, string> = {
  "Plan Gratis": "de por vida",
  "Plan Cositas": "a la carta",
  "Plan Socio": "sin mensualidad",
  "Plan Personalizado": "a tu medida",
}

// Plan Cositas se cobra en dólares (desde US$1 por función, por mes).
// El precio en pantalla siempre se muestra convertido a pesos, con la
// cotización del día — nunca un dólar fijo escrito a mano.
const COSITAS_PRECIO_USD = 1
const COTIZACION_FALLBACK = 1500

export function PlanesGrid({ plans = PLANS }: { plans?: Plan[] }) {
  const { isAdmin, get } = usePageContent("planes")
  const [dolarRate, setDolarRate] = useState<number | null>(null)

  useEffect(() => {
    fetch("/api/super-admin/exchange-rate")
      .then((r) => r.json())
      .then((d) => { if (d.rate) setDolarRate(d.rate) })
      .catch(() => {})
  }, [])

  return (
    <div
      className={`container mx-auto grid gap-6 grid-cols-1 md:grid-cols-2 ${
        plans.length >= 4 ? "max-w-6xl lg:grid-cols-4" : "max-w-3xl"
      }`}
    >
      {plans.map((plan, i) => {
        const isCositas = plan.name === "Plan Cositas"
        const cositasPrecioArs = Math.round(COSITAS_PRECIO_USD * (dolarRate ?? COTIZACION_FALLBACK))
        return (
        <Card
          key={i}
          className={`relative flex flex-col overflow-hidden ${
            plan.highlight ? "border-primary shadow-xl md:-translate-y-2" : ""
          }`}
        >
          {plan.highlight && (
            <div className="absolute -right-10 top-4 w-36 rotate-45 bg-primary py-1 text-center text-xs font-bold tracking-wide text-primary-foreground shadow-md">
              POPULAR
            </div>
          )}

          {/* 1. Nombre del plan */}
          <div className="bg-foreground px-4 py-6 text-center text-background">
            <EditableText
              page="planes"
              field={`name-${i}`}
              defaultValue={get(`name-${i}`, plan.name)}
              isAdmin={isAdmin}
              tag="div"
              className="text-lg font-bold"
              accentColor="#f59e0b"
            />
            <EditableText
              page="planes"
              field={`tagline-${i}`}
              defaultValue={get(`tagline-${i}`, PLAN_TAGLINES[plan.name] || "")}
              isAdmin={isAdmin}
              tag="div"
              className="mt-1 text-sm text-background/70"
              accentColor="#f59e0b"
            />
          </div>

          {/* 2. Precio */}
          <div className="flex flex-col items-center gap-1 py-6">
            <div className="flex items-center justify-center rounded-full border-2 border-muted px-6 py-3">
              {isCositas ? (
                <span className="text-3xl font-extrabold tracking-tight">
                  ${cositasPrecioArs.toLocaleString("es-AR")}
                </span>
              ) : (
                <EditableText
                  page="planes"
                  field={`price-${i}`}
                  defaultValue={get(`price-${i}`, plan.price)}
                  isAdmin={isAdmin}
                  tag="span"
                  className="text-3xl font-extrabold tracking-tight"
                  accentColor="#f59e0b"
                />
              )}
            </div>
            {isCositas ? (
              <div className="text-sm text-muted-foreground">por función, por mes</div>
            ) : (
              <EditableText
                page="planes"
                field={`period-${i}`}
                defaultValue={get(`period-${i}`, plan.period || "")}
                isAdmin={isAdmin}
                tag="div"
                className="text-sm text-muted-foreground"
                accentColor="#f59e0b"
              />
            )}
          </div>

          {/* 3. Listado de caracteristicas */}
          <CardContent className="flex-1 px-6">
            <ul className="divide-y divide-border text-sm">
              {plan.features.map((feature, j) => (
                <li key={j} className="flex items-center justify-center gap-2 py-3">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                  <EditableText
                    page="planes"
                    field={`feature-${i}-${j}`}
                    defaultValue={get(`feature-${i}-${j}`, feature)}
                    isAdmin={isAdmin}
                    tag="span"
                    accentColor="#f59e0b"
                  />
                </li>
              ))}
            </ul>
          </CardContent>

          {/* 4. Boton */}
          <CardFooter>
            <Link href={plan.href} className="w-full">
              <Button variant="outline" className="w-full">
                Leer más
              </Button>
            </Link>
          </CardFooter>
        </Card>
        )
      })}
    </div>
  )
}
