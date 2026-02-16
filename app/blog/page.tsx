import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Calendar } from "lucide-react"

export const metadata: Metadata = {
  title: "Blog de Ecommerce para Emprendedores Argentinos | tol.ar",
  description: "Consejos, tutoriales y guias para vender por internet en Argentina. Aprende a usar MercadoPago, configurar envios, hacer marketing y mas.",
  keywords: "blog ecommerce argentina, como vender por internet, tutoriales mercadopago, guias tienda online",
}

// Articulos del blog (despues esto puede venir de Supabase)
const articulos = [
  {
    slug: "como-vender-por-whatsapp-argentina",
    titulo: "Como Vender por WhatsApp en Argentina: Guia Completa 2025",
    descripcion: "Aprende a usar WhatsApp Business para vender tus productos. Catalogo, mensajes automaticos y tips para cerrar mas ventas.",
    categoria: "Ventas",
    fecha: "2025-01-20",
    imagen: "/blog/whatsapp-ventas.jpg",
  },
  {
    slug: "configurar-mercadopago-tienda-online",
    titulo: "Como Configurar MercadoPago en tu Tienda Online",
    descripcion: "Tutorial paso a paso para integrar MercadoPago y empezar a cobrar con tarjetas, transferencias y Mercado Credito.",
    categoria: "Pagos",
    fecha: "2025-01-18",
    imagen: "/blog/mercadopago-config.jpg",
  },
  {
    slug: "envios-andreani-correo-argentino",
    titulo: "Envios con Andreani y Correo Argentino: Cual Elegir?",
    descripcion: "Comparamos precios, tiempos de entrega y cobertura de Andreani vs Correo Argentino para tu tienda online.",
    categoria: "Envios",
    fecha: "2025-01-15",
    imagen: "/blog/envios-argentina.jpg",
  },
  {
    slug: "fotos-productos-celular",
    titulo: "Como Sacar Fotos Profesionales de Productos con el Celular",
    descripcion: "Tips y trucos para fotografiar tus productos como un profesional usando solo tu smartphone.",
    categoria: "Marketing",
    fecha: "2025-01-12",
    imagen: "/blog/fotos-productos.jpg",
  },
  {
    slug: "tiendanube-vs-tolar-comparacion",
    titulo: "tol.ar vs Tiendanube: Cual Elegir en 2025?",
    descripcion: "Comparativa completa de precios, funciones y facilidad de uso entre las dos plataformas de ecommerce.",
    categoria: "Comparativas",
    fecha: "2025-01-10",
    imagen: "/blog/comparativa.jpg",
    link: "/comparar/tiendanube",
  },
  {
    slug: "instagram-tienda-online",
    titulo: "Como Vender en Instagram: Conecta tu Tienda Online",
    descripcion: "Guia para integrar Instagram Shopping con tu tienda y convertir seguidores en clientes.",
    categoria: "Redes Sociales",
    fecha: "2025-01-08",
    imagen: "/blog/instagram-shop.jpg",
  },
]

export default function BlogPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Blog de tol.ar",
    description: "Consejos y tutoriales para vender por internet en Argentina",
    url: "https://tol.ar/blog",
    publisher: {
      "@type": "Organization",
      name: "tol.ar",
      logo: {
        "@type": "ImageObject",
        url: "https://tol.ar/tol-logo.png",
      },
    },
  }

  return (
    <main className="min-h-screen flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      
      {/* Hero */}
      <section className="py-16 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Blog de Ecommerce para Emprendedores
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Consejos, tutoriales y guias para vender por internet en Argentina. 
            Aprende de expertos y hace crecer tu negocio.
          </p>
        </div>
      </section>

      {/* Articulos */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articulos.map((articulo) => (
              <Link 
                key={articulo.slug} 
                href={articulo.link || `/blog/${articulo.slug}`}
              >
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                  <div className="aspect-video bg-slate-100 rounded-t-lg flex items-center justify-center">
                    <span className="text-4xl">
                      {articulo.categoria === "Ventas" && "💬"}
                      {articulo.categoria === "Pagos" && "💳"}
                      {articulo.categoria === "Envios" && "📦"}
                      {articulo.categoria === "Marketing" && "📸"}
                      {articulo.categoria === "Comparativas" && "⚖️"}
                      {articulo.categoria === "Redes Sociales" && "📱"}
                    </span>
                  </div>
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">{articulo.categoria}</Badge>
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(articulo.fecha).toLocaleDateString('es-AR')}
                      </span>
                    </div>
                    <CardTitle className="group-hover:text-primary transition-colors line-clamp-2">
                      {articulo.titulo}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {articulo.descripcion}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <span className="text-primary font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                      Leer mas <ArrowRight className="w-4 h-4" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Listo para Empezar a Vender Online?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Crea tu tienda gratis en 2 minutos y pone en practica lo que aprendiste.
          </p>
          <Link 
            href="/#crear-tienda"
            className="inline-flex items-center gap-2 bg-white text-green-600 px-8 py-4 rounded-full font-semibold hover:bg-green-50 transition-colors"
          >
            Crear mi Tienda Gratis
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
