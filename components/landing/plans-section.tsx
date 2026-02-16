import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface PlansSectionProps {
  fullPlans?: boolean  // true = todos los planes, false = solo Plan Gratis
  basePath?: string
}

const PLANS = [
  {
    name: "Plan Gratis",
    price: "$0",
    period: "",
    features: ["100% gratis para siempre", "Hasta 20 productos", "Todo lo basico para vender"],
    href: "/plan-gratis",
    buttonStyle: "default",
    highlight: false,
  },
  {
    name: "Plan Cositas",
    nameHtml: true,
    price: "Vos elegis",
    period: "",
    features: ["Empezas gratis", "Sumas funciones cuando quieras", "Pagas solo lo que usas"],
    href: "/plan-cositas",
    buttonStyle: "default",
    highlight: false,
  },
  {
    name: "Plan Socio",
    price: "10%",
    period: "por venta",
    features: ["Todo incluido", "Sin mensualidad", "Nosotros invertimos en publicidad"],
    href: "/plan-socio",
    buttonStyle: "green",
    highlight: true,
  },
  {
    name: "Plan Personalizado",
    price: "A medida",
    period: "",
    features: ["Tienda 100% a tu medida", "Nuestro equipo hace tu SEO", "Asesoramiento completo"],
    href: "/plan-a-medida",
    buttonStyle: "default",
    highlight: false,
  },
]

export function PlansSection({ fullPlans = false, basePath = "" }: PlansSectionProps) {
  // Si no es fullPlans, solo mostrar Plan Gratis
  const plansToShow = fullPlans ? PLANS : PLANS.filter(p => p.name === "Plan Gratis")
  
  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-8">
          {fullPlans ? "Nuestros Planes" : "Empeza Gratis"}
        </h2>
        
        <div className={`grid gap-6 max-w-5xl mx-auto ${fullPlans ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4" : "grid-cols-1 max-w-md"}`}>
          {plansToShow.map((plan) => (
            <Card 
              key={plan.name} 
              className={`flex flex-col ${plan.highlight ? "border-primary/50 shadow-lg" : ""}`}
            >
              <CardHeader className="pb-2 text-center">
                <CardTitle className="text-lg">
                  {plan.name}
                </CardTitle>
                {plan.price && (
                  <div className="mt-2">
                    <span className="text-2xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground text-sm">{plan.period}</span>
                  </div>
                )}
              </CardHeader>
              
              <CardContent className="flex-1 pb-4 text-center">
                {plan.features.length > 0 && (
                  <ul className="space-y-1 text-sm">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className={idx === 0 ? "text-primary font-medium" : "text-muted-foreground"}>
                        {feature}
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
              
              <CardFooter>
                <Link href={`${basePath}${plan.href}`} className="w-full">
                  <Button 
                    className={`w-full ${
                      plan.buttonStyle === "green" 
                        ? "bg-primary hover:bg-primary/90" 
                        : "bg-foreground text-background hover:bg-foreground/90"
                    }`}
                  >
                    entrar
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
