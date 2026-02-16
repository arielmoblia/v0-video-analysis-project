import { Check } from "lucide-react"

const plans = [
  {
    name: "Plan Gratis",
    price: "$0",
    features: ["Tienda básica", "Hasta 10 productos", "Soporte por email"],
  },
  {
    name: "Plan Cositas",
    price: "$9.99",
    features: ["Hasta 100 productos", "Dominio personalizado", "Soporte prioritario"],
  },
  {
    name: "Plan Socio",
    price: "$29.99",
    features: ["Productos ilimitados", "Múltiples tiendas", "Soporte 24/7"],
  },
]

export function Plans() {
  return (
    <section className="py-16 px-4 bg-muted">
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold text-center mb-12">Nuestros Planes</h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <div key={plan.name} className="bg-card rounded-lg p-6 border border-border">
              <h3 className="font-semibold text-lg mb-2">{plan.name}</h3>
              <p className="text-2xl font-bold text-primary mb-4">
                {plan.price}
                <span className="text-sm font-normal text-muted-foreground">/mes</span>
              </p>
              <ul className="space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-accent" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
