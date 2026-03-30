import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { MapPin, Clock, ArrowLeft, Send } from "lucide-react"

const PUESTOS: Record<string, any> = {
  "agente-comercial": {
    titulo: "Agente Comercial",
    ubicacion: "Argentina (remoto)",
    tipo: "Freelance",
    descripcion: "Buscamos agentes comerciales para sumar nuevos merchants a la plataforma tol.ar en todo el país.",
    responsabilidades: [
      "Contactar potenciales merchants en tu zona o nicho",
      "Presentar la plataforma tol.ar y sus beneficios",
      "Acompañar al merchant en el proceso de alta",
      "Gestionar tu cartera de clientes y cobrar comisiones",
    ],
    requisitos: [
      "Experiencia en ventas o comercio (deseable)",
      "Buenas habilidades de comunicación",
      "Acceso a internet y dispositivo propio",
      "Ganas de crecer junto a una plataforma en expansión",
    ],
    beneficios: [
      "Comisiones por cada tienda activa que consigas",
      "Trabajo 100% remoto y flexible",
      "Capacitación sobre la plataforma",
      "Sin inversión inicial requerida",
    ],
  },
  "soporte-al-cliente": {
    titulo: "Soporte al Cliente",
    ubicacion: "Argentina (remoto)",
    tipo: "Part-time",
    descripcion: "Ayudá a nuestros merchants a sacar el máximo provecho de sus tiendas online.",
    responsabilidades: [
      "Responder consultas de merchants por WhatsApp y email",
      "Guiar a los usuarios en la configuración de su tienda",
      "Documentar problemas frecuentes y soluciones",
      "Escalar casos complejos al equipo técnico",
    ],
    requisitos: [
      "Buena redacción y comunicación escrita",
      "Paciencia y empatía con el usuario",
      "Conocimientos básicos de comercio electrónico",
      "Disponibilidad de 4 horas diarias",
    ],
    beneficios: [
      "Trabajo remoto y flexible",
      "Remuneración por hora acordada",
      "Capacitación completa sobre la plataforma",
      "Posibilidad de crecimiento dentro del equipo",
    ],
  },
  "disenador-web": {
    titulo: "Diseñador Web",
    ubicacion: "Argentina (remoto)",
    tipo: "Freelance",
    descripcion: "Creá templates originales para las tiendas de nuestra plataforma.",
    responsabilidades: [
      "Diseñar templates modernos y funcionales para distintos rubros",
      "Adaptar diseños existentes a nuevas categorías de productos",
      "Colaborar con el equipo técnico para la implementación",
      "Mantener coherencia visual con la identidad de tol.ar",
    ],
    requisitos: [
      "Experiencia en diseño web (portfolio requerido)",
      "Conocimientos de UI/UX y diseño responsivo",
      "Manejo de herramientas como Figma o Adobe XD",
      "Buen gusto estético y atención al detalle",
    ],
    beneficios: [
      "Pago por template entregado y aprobado",
      "Trabajo remoto y a tu ritmo",
      "Tus diseños usados por miles de tiendas",
      "Posibilidad de trabajo continuo",
    ],
  },
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const puesto = PUESTOS[slug]
  if (!puesto) return {}
  return {
    title: puesto.titulo + " | tol.ar",
    description: puesto.descripcion,
  }
}

export default async function PuestoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const puesto = PUESTOS[slug]
  if (!puesto) notFound()

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": puesto.titulo,
    "description": puesto.descripcion,
    "hiringOrganization": {
      "@type": "Organization",
      "name": "tol.ar",
      "sameAs": "https://tol.ar",
      "logo": "https://tol.ar/tol-logo.png"
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "AR"
      }
    },
    "jobLocationType": "TELECOMMUTE",
    "employmentType": puesto.tipo === "Part-time" ? "PART_TIME" : "CONTRACTOR",
    "datePosted": new Date().toISOString().split('T')[0],
    "validThrough": new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header />
      <main className="min-h-screen bg-slate-50">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto">
            <Link href="/empleos" className="flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-8 text-sm transition-colors">
              <ArrowLeft className="w-4 h-4" /> Volver a puestos
            </Link>
            <div className="bg-white border border-slate-200 rounded-xl p-8 mb-6">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 mb-3">{puesto.titulo}</h1>
                  <div className="flex gap-4 text-sm text-slate-400">
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{puesto.ubicacion}</span>
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{puesto.tipo}</span>
                  </div>
                </div>
                <span className="shrink-0 bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full">Activo</span>
              </div>
              <p className="text-slate-600 text-lg mb-8">{puesto.descripcion}</p>
              <div className="space-y-6">
                <div>
                  <h2 className="font-semibold text-slate-900 mb-3">Responsabilidades</h2>
                  <ul className="space-y-2">{puesto.responsabilidades.map((r: string, i: number) => <li key={i} className="flex items-start gap-2 text-slate-600 text-sm"><span className="text-purple-500 mt-0.5">✓</span>{r}</li>)}</ul>
                </div>
                <div>
                  <h2 className="font-semibold text-slate-900 mb-3">Requisitos</h2>
                  <ul className="space-y-2">{puesto.requisitos.map((r: string, i: number) => <li key={i} className="flex items-start gap-2 text-slate-600 text-sm"><span className="text-purple-500 mt-0.5">✓</span>{r}</li>)}</ul>
                </div>
                <div>
                  <h2 className="font-semibold text-slate-900 mb-3">Beneficios</h2>
                  <ul className="space-y-2">{puesto.beneficios.map((r: string, i: number) => <li key={i} className="flex items-start gap-2 text-slate-600 text-sm"><span className="text-purple-500 mt-0.5">✓</span>{r}</li>)}</ul>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 text-center">
              <h2 className="font-semibold text-slate-900 mb-2">¿Te interesa este puesto?</h2>
              <p className="text-slate-600 text-sm mb-4">Mandanos tu CV o una breve presentación a:</p>
              <a href={"mailto:empleos@tiendaonline.com.ar?subject=Postulacion: " + puesto.titulo} className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium">
                <Send className="w-4 h-4" /> Postularme ahora
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
