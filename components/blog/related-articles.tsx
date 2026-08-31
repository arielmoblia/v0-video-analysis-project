import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { articulos } from "@/lib/blog-articulos"

export function RelatedArticles({ currentSlug }: { currentSlug: string }) {
  const actual = articulos.find((a) => a.slug === currentSlug)
  const otros = articulos.filter((a) => a.slug !== currentSlug)
  const mismaCategoria = otros.filter((a) => a.categoria === actual?.categoria)
  const relacionados = [...mismaCategoria, ...otros.filter((a) => !mismaCategoria.includes(a))].slice(0, 3)

  if (relacionados.length === 0) return null

  return (
    <section className="py-12 px-4 bg-slate-50 border-t">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Artículos relacionados</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {relacionados.map((a) => (
            <Link
              key={a.slug}
              href={`/blog/${a.slug}`}
              className="block p-5 bg-white rounded-lg border hover:shadow-md transition-shadow group"
            >
              <span className="text-xs font-medium text-blue-600">{a.categoria}</span>
              <h3 className="font-semibold mt-1 mb-2 group-hover:text-blue-600 transition-colors">
                {a.titulo}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{a.descripcion}</p>
              <span className="inline-flex items-center gap-1 text-sm text-blue-600 mt-3">
                Leer más <ArrowRight className="w-3 h-3" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
