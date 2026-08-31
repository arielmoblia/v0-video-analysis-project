
import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { SeoExtraBlock } from "@/components/seo-extra-block"
import { MapPin, Clock, Briefcase } from "lucide-react"

export const metadata: Metadata = {
  title: "Puestos de Trabajo",
  description: "Sumate al equipo de tol.ar. Buscamos personas apasionadas por el comercio electrónico y la tecnología en Argentina y Latinoamérica.",
}

const PUESTOS = [
  {
    slug: "agente-comercial",
    titulo: "Agente Comercial",
    ubicacion: "Argentina (remoto)",
    tipo: "Freelance",
    descripcion: "Buscamos agentes comerciales para sumar nuevos merchants a la plataforma tol.ar en todo el país.",
  },
  {
    slug: "soporte-al-cliente",
    titulo: "Soporte al Cliente",
    ubicacion: "Argentina (remoto)",
    tipo: "Part-time",
    descripcion: "Ayudá a nuestros merchants a sacar el máximo provecho de sus tiendas online.",
  },
  {
    slug: "disenador-web",
    titulo: "Diseñador Web",
    ubicacion: "Argentina (remoto)",
    tipo: "Freelance",
    descripcion: "Creá templates originales para las tiendas de nuestra plataforma.",
  },
]

export default function EmpleosPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-50">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">Puestos de trabajo</h1>
            <p className="text-lg text-slate-600 mb-12">
              Sumate al equipo de tol.ar. Trabajamos de forma remota y flexible para hacer crecer el comercio online en Argentina y Latinoamérica.
            </p>
            <div className="space-y-4">
              {PUESTOS.map((puesto) => (
                <Link key={puesto.slug} href={"/empleos/" + puesto.slug} className="block bg-white border border-slate-200 rounded-xl p-6 hover:border-purple-300 hover:shadow-md transition-all">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-semibold text-slate-900 mb-2">{puesto.titulo}</h2>
                      <p className="text-slate-500 text-sm mb-3">{puesto.descripcion}</p>
                      <div className="flex gap-4 text-sm text-slate-400">
                        <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{puesto.ubicacion}</span>
                        <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{puesto.tipo}</span>
                      </div>
                    </div>
                    <span className="shrink-0 bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full">Activo</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
      <SeoExtraBlock page="empleos" />
      <Footer />
    </>
  )
}
