"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Pencil, X, Loader2 } from "lucide-react"

export function EditorArticulo({
  slug,
  tituloInicial,
  bajadaInicial,
  cuerpoInicial,
}: {
  slug: string
  tituloInicial: string
  bajadaInicial: string
  cuerpoInicial: string
}) {
  const router = useRouter()
  const [abierto, setAbierto] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [titulo, setTitulo] = useState(tituloInicial)
  const [bajada, setBajada] = useState(bajadaInicial)
  const [cuerpo, setCuerpo] = useState(cuerpoInicial)

  async function guardar() {
    setGuardando(true)
    try {
      const res = await fetch("/api/blog-contenido", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, titulo, bajada, cuerpo_html: cuerpo }),
      })
      if (res.ok) {
        setAbierto(false)
        router.refresh()
      } else {
        alert("No se pudo guardar. Probá de nuevo.")
      }
    } finally {
      setGuardando(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setAbierto(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-gray-900 text-white px-4 py-3 rounded-full shadow-lg hover:bg-gray-700 transition-colors"
        title="Editar este artículo"
      >
        <Pencil className="w-4 h-4" />
        Editar
      </button>

      {abierto && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Editar artículo</h2>
              <button onClick={() => setAbierto(false)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
            <input
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4"
            />

            <label className="block text-sm font-medium text-gray-700 mb-1">Bajada</label>
            <textarea
              value={bajada}
              onChange={(e) => setBajada(e.target.value)}
              rows={2}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4"
            />

            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cuerpo del artículo (HTML)
            </label>
            <textarea
              value={cuerpo}
              onChange={(e) => setCuerpo(e.target.value)}
              rows={16}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 font-mono text-sm"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setAbierto(false)}
                className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                onClick={guardar}
                disabled={guardando}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-600 text-white hover:bg-orange-700 disabled:opacity-60"
              >
                {guardando && <Loader2 className="w-4 h-4 animate-spin" />}
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
