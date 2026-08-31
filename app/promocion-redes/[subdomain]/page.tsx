"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"

export default function PromocionRedesPage() {
  const params = useParams()
  const subdomain = params.subdomain as string

  const [cargando, setCargando] = useState(true)
  const [siteTitle, setSiteTitle] = useState("")
  const [noExiste, setNoExiste] = useState(false)
  const [yaConfirmado, setYaConfirmado] = useState(false)
  const [tildado, setTildado] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [confirmadoAhora, setConfirmadoAhora] = useState(false)

  useEffect(() => {
    fetch(`/api/promocion-redes?subdomain=${encodeURIComponent(subdomain)}`)
      .then(r => {
        if (!r.ok) throw new Error("not found")
        return r.json()
      })
      .then(data => {
        setSiteTitle(data.siteTitle || subdomain)
        setYaConfirmado(!!data.yaConfirmado)
      })
      .catch(() => setNoExiste(true))
      .finally(() => setCargando(false))
  }, [subdomain])

  const confirmar = async () => {
    setEnviando(true)
    try {
      const res = await fetch("/api/promocion-redes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subdomain }),
      })
      if (res.ok) setConfirmadoAhora(true)
      else alert("Hubo un error, probá de nuevo en un rato.")
    } catch {
      alert("Hubo un error de conexión, probá de nuevo en un rato.")
    } finally {
      setEnviando(false)
    }
  }

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-400">Cargando...</p>
      </div>
    )
  }

  if (noExiste) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
        <p className="text-sm text-slate-500">No encontramos esa tienda.</p>
      </div>
    )
  }

  const yaDijoQueSi = yaConfirmado || confirmadoAhora

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-5">
        <img src="/tol-logo.png" alt="tol.ar" width={44} height={44} className="mx-auto rounded" />

        {yaDijoQueSi ? (
          <>
            <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto text-2xl">✓</div>
            <h1 className="text-lg font-semibold text-slate-800">¡Listo, gracias!</h1>
            <p className="text-sm text-slate-600">
              Ya tenemos tu OK para mostrar <strong>{siteTitle}</strong> en las redes de tol.ar. En breve armamos el
              posteo con lo que ya tenés cargado — no tenés que hacer nada más.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-lg font-semibold text-slate-800">
              Tu tienda <span className="text-purple-600">{siteTitle}</span> está lista para vender
            </h1>
            <p className="text-sm text-slate-600">
              Queremos mostrarla gratis en las redes de tol.ar para que te lleguen más clientes. Nosotros armamos el
              posteo con lo que ya tenés cargado (fotos, nombre, rubro) — no tenés que hacer nada más que darnos el OK.
            </p>
            <label className="flex items-start gap-2 text-left text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-lg p-3 cursor-pointer">
              <input
                type="checkbox"
                checked={tildado}
                onChange={e => setTildado(e.target.checked)}
                className="mt-0.5"
              />
              <span>Sí, quiero que tol.ar muestre mi tienda en sus redes.</span>
            </label>
            <button
              onClick={confirmar}
              disabled={!tildado || enviando}
              className="w-full text-sm px-4 py-2.5 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {enviando ? "Enviando..." : "Sí, mostrame"}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
