"use client"

import { Star } from "lucide-react"

const testimonials = [
  {
    name: "María García",
    business: "Cosmeticos MG",
    location: "Buenos Aires",
    rating: 5,
    text: "Tenia mi negocio solo en Instagram y perdia ventas porque no podia cobrar con tarjeta. Con tol.ar arme mi tienda en una tarde y ahora vendo el doble.",
  },
  {
    name: "Carlos Mendez",
    business: "Zapatillas CM",
    location: "Cordoba",
    rating: 5,
    text: "Probe TiendaNube pero era muy complicado. tol.ar es super simple. Conecte MercadoPago en 5 minutos y ya estaba vendiendo.",
  },
  {
    name: "Laura Fernandez",
    business: "Bijou Laura",
    location: "Rosario",
    rating: 5,
    text: "Lo que mas me gusta es que puedo ver mis pedidos desde el celular. El diseño de mi tienda quedo muy profesional sin saber nada de diseño.",
  },
  {
    name: "Diego Romero",
    business: "Tech Store DR",
    location: "Mendoza",
    rating: 5,
    text: "El soporte es increible. Me respondieron un domingo a la noche cuando tenia un problema. 100% recomendado para emprendedores.",
  },
]

export function Testimonials() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Emprendedores que ya venden con tol.ar
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Conoce las historias de quienes crearon su tienda online y empezaron a vender por internet
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-muted-foreground mb-4 text-sm">"{testimonial.text}"</p>
              <div>
                <p className="font-semibold">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.business}</p>
                <p className="text-xs text-muted-foreground">{testimonial.location}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm">
            <Star className="w-4 h-4 fill-green-600 text-green-600" />
            <span>4.8/5 basado en 150+ opiniones</span>
          </div>
        </div>
      </div>
    </section>
  )
}
