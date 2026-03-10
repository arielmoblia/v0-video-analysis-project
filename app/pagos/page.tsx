import { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { CreditCard, Smartphone, Wallet, Check, ArrowRight, Shield, Zap, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"

export const metadata: Metadata = {
  title: "Medios de Pago para tu Tienda Online | Mercado Pago, MODO, Ualá | tol.ar",
  description: "Cobrá tus ventas online con Mercado Pago, MODO y Ualá Bis. Sin comisiones extra por transacción. Integración gratuita en tol.ar.",
  keywords: "mercado pago, modo, uala bis, medios de pago argentina, cobrar online, pasarela de pagos, tienda online argentina",
}

const paymentMethods = [
  {
    name: "Mercado Pago",
    icon: CreditCard,
    color: "bg-blue-500",
    description: "La plataforma líder en Argentina",
    features: [
      "Tarjetas de Crédito y Débito con cuotas",
      "Dinero en cuenta - cobros instantáneos",
      "Efectivo en Rapipago y Pago Fácil",
      "Mercado Crédito - compran ahora, pagan después",
    ],
  },
  {
    name: "MODO",
    icon: Smartphone,
    color: "bg-purple-500",
    description: "El ecosistema de los bancos argentinos",
    features: [
      "Pago escaneando QR",
      "Vinculación con cuenta bancaria",
      "Promociones bancarias vigentes",
      "Descuentos exclusivos",
    ],
  },
  {
    name: "Ualá Bis",
    icon: Wallet,
    color: "bg-red-500",
    description: "Cobros instantáneos en tu cuenta",
    features: [
      "Dinero disponible al instante",
      "Tasas competitivas",
      "Ideal para emprendedores",
      "Sin esperas para usar tu dinero",
    ],
  },
]

const comparisonData = [
  { feature: "Comisión por venta", tolar: "0% (Plan Gratis)", others: "2% o más por transacción" },
  { feature: "Integración Local", tolar: "Nativas (Mercado Pago, MODO)", others: "Requiere configuraciones extra" },
  { feature: "Soporte Humano", tolar: "WhatsApp directo en español", others: "Bots o tickets demorados" },
]

const faqs = [
  {
    question: "¿Tengo que pagar para activar los pagos?",
    answer: "No, la integración en tol.ar es gratuita. Solo pagás la comisión estándar de la pasarela que elijas (ej. Mercado Pago).",
  },
  {
    question: "¿Cuándo recibo mi dinero?",
    answer: "El dinero va directo a tu cuenta de Mercado Pago o Ualá, según los plazos que tengas configurados con ellos.",
  },
  {
    question: "¿Es seguro para mis clientes?",
    answer: "Sí, todas las transacciones están encriptadas y protegidas por los estándares de seguridad más altos del mercado argentino.",
  },
]

export default function PagosPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-green-50 to-white">
          <div className="container mx-auto px-4 text-center">
            <Badge className="mb-4 bg-green-100 text-green-700 hover:bg-green-100">
              Sin comisiones extra
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Medios de Pago para tu<br />
              <span className="text-green-600">Tienda Online en Argentina</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Cobrar tus ventas por internet nunca fue tan simple. Conectamos tu negocio con las 
              pasarelas de pago más importantes del país para que recibas tu dinero de forma segura.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/crear-tienda">
                <Button size="lg" className="bg-green-600 hover:bg-green-700">
                  Crear mi tienda gratis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/contacto">
                <Button size="lg" variant="outline">
                  Consultar dudas
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Payment Methods */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Métodos de Pago Disponibles
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {paymentMethods.map((method, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className={`w-14 h-14 ${method.color} rounded-xl flex items-center justify-center mb-4`}>
                      <method.icon className="w-7 h-7 text-white" />
                    </div>
                    <CardTitle className="text-2xl">{method.name}</CardTitle>
                    <p className="text-muted-foreground">{method.description}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {method.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Video Tutorial */}
        <section className="py-16 bg-slate-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-4">
              Como integrar Mercado Pago
            </h2>
            <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
              Mira este video tutorial y aprende a conectar Mercado Pago con tu tienda en minutos.
            </p>
            
            <div className="max-w-3xl mx-auto">
              <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl bg-black">
                <video 
                  controls 
                  className="w-full h-full object-contain"
                  poster="/images/placeholders/placeholder.svg?height=720&width=1280"
                >
                  <source 
                    src="/videos/mercado-pago-tutorial.mp4"
                    type="video/mp4" 
                  />
                  Tu navegador no soporta el elemento de video.
                </video>
              </div>
              <p className="text-center text-sm text-muted-foreground mt-4">
                Video tutorial: Integracion de Mercado Pago en tu tienda tol.ar
              </p>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Ventajas de cobrar con tol.ar
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Integración Instantánea</h3>
                <p className="text-muted-foreground text-sm">
                  Conectá Mercado Pago en minutos sin conocimientos técnicos.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">100% Seguro</h3>
                <p className="text-muted-foreground text-sm">
                  Transacciones encriptadas con los más altos estándares de seguridad.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Cobros Rápidos</h3>
                <p className="text-muted-foreground text-sm">
                  El dinero va directo a tu cuenta según los plazos de cada pasarela.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-4">
              tol.ar vs. Tiendanube y Otros
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Compará las diferencias y descubrí por qué somos la mejor opción para emprendedores argentinos.
            </p>
            
            <div className="max-w-3xl mx-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-1/3">Función</TableHead>
                    <TableHead className="w-1/3 bg-green-50 text-green-700 font-bold">tol.ar</TableHead>
                    <TableHead className="w-1/3">Tiendanube / Otros</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {comparisonData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{row.feature}</TableCell>
                      <TableCell className="bg-green-50 text-green-700 font-semibold">{row.tolar}</TableCell>
                      <TableCell className="text-muted-foreground">{row.others}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-16 bg-slate-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Preguntas Frecuentes sobre Pagos
            </h2>
            
            <div className="max-w-2xl mx-auto">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-16 bg-green-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Empezá a vender online hoy
            </h2>
            <p className="text-green-100 mb-8 max-w-xl mx-auto">
              Creá tu tienda gratis y conectá Mercado Pago en minutos. Sin costos de activación.
            </p>
            <Link href="/crear-tienda">
              <Button size="lg" variant="secondary" className="bg-white text-green-600 hover:bg-green-50">
                Crear mi tienda gratis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
