"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Sparkles, Loader2, CheckCircle } from "lucide-react"

interface ClonarCatalogoManagerProps {
  storeId: string
  subdomain: string
  inline?: boolean
}

const MODALIDADES = [
  {
    id: "solo-portada",
    titulo: "Solo portada",
    precio: "$15.000",
    desc: "Clonamos solo la pantalla de inicio (portada), tal como se ve hoy. Sin productos, sin páginas internas, sin actualizarse después.",
  },
  {
    id: "catalogo-sin-diseno",
    titulo: "Catálogo sin clonar el diseño",
    precio: "$25.000",
    desc: "Traemos los productos de la página de origen, pero con el diseño propio de tol.ar (no copiamos el look original).",
  },
  {
    id: "sistema-vacio",
    titulo: "Sistema completo vacío",
    precio: "$35.000",
    desc: "Clonamos el diseño completo (todas las páginas: categorías, producto, carrito, cuenta) sin productos. El cliente carga el catálogo a mano después.",
  },
  {
    id: "snapshot-completo",
    titulo: "Todo clonado, foto fija",
    precio: "$50.000",
    desc: "Clonamos diseño y catálogo completo tal como están hoy. Queda fijo: no se actualiza solo si el original cambia precio o stock.",
  },
  {
    id: "parte-puntual",
    titulo: "Solo una parte puntual",
    precio: "A cotizar",
    desc: "Clonamos una sección específica (por ejemplo, el checkout o una categoría), no la página entera.",
  },
  {
    id: "marca-propia",
    titulo: "Con marca propia",
    precio: "A cotizar",
    desc: "Misma base que se elija arriba, pero con logo, colores y nombre propios, para que la tienda tenga identidad propia.",
  },
  {
    id: "dropshipping",
    titulo: "Sistema + catálogo sincronizado",
    precio: "$70.000 + mantenimiento mensual",
    desc: "Clonamos todo y lo mantenemos sincronizado solo, todos los días (precio y stock), como un sistema de dropshipping completo.",
  },
]

export function ClonarCatalogoManager({ storeId, subdomain, inline }: ClonarCatalogoManagerProps) {
  const [seleccion, setSeleccion] = useState<string | null>(null)
  const [link, setLink] = useState("")
  const [confirmoPermiso, setConfirmoPermiso] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [resultado, setResultado] = useState<"ok" | "error" | null>(null)

  const modalidadSeleccionada = MODALIDADES.find((m) => m.id === seleccion)

  const enviar = async () => {
    if (!modalidadSeleccionada || !confirmoPermiso) return
    setEnviando(true)
    setResultado(null)
    try {
      const res = await fetch("/api/admin/clonar-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeId,
          subdomain,
          modalidadId: modalidadSeleccionada.id,
          modalidadTitulo: modalidadSeleccionada.titulo,
          link,
          confirmoPermiso,
        }),
      })
      if (!res.ok) throw new Error("fail")
      setResultado("ok")
      setSeleccion(null)
      setLink("")
      setConfirmoPermiso(false)
    } catch {
      setResultado("error")
    } finally {
      setEnviando(false)
    }
  }

  const contenido = (
    <div className="space-y-3">
      {!inline && (
        <p className="text-sm text-muted-foreground">
          Elegí la modalidad de clonado que pidió el cliente y, si corresponde, pegá el link de la página a clonar.
          Los precios son orientativos, se ajustan según el caso.
        </p>
      )}
      {MODALIDADES.map((m) => {
        const isSelected = seleccion === m.id
        return (
          <div
            key={m.id}
            onClick={() => setSeleccion(m.id)}
            className={`border rounded-lg p-4 cursor-pointer transition-colors bg-white ${
              isSelected ? "border-violet-500 bg-violet-50" : "border-neutral-200 hover:border-violet-300"
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                checked={isSelected}
                onChange={() => setSeleccion(m.id)}
                className="accent-violet-600 w-4 h-4 flex-shrink-0"
              />
              <div className="flex-1 flex items-baseline justify-between gap-2 flex-wrap">
                <span className="font-medium text-sm">{m.titulo}</span>
                <span className="text-sm font-semibold text-violet-700">{m.precio}</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1.5 ml-7">{m.desc}</p>
            {isSelected && (
              <div className="mt-3 ml-7 space-y-1" onClick={(e) => e.stopPropagation()}>
                <Label className="text-xs">Link de la página a clonar</Label>
                <Input
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="https://..."
                  className="text-sm"
                />
              </div>
            )}
          </div>
        )
      })}

      {resultado === "ok" ? (
        <div className="flex items-center gap-2 text-green-600 text-sm pt-2">
          <CheckCircle className="w-4 h-4" />
          Pedido guardado.
        </div>
      ) : (
        <>
          {seleccion && (
            <label className="flex items-start gap-2 text-xs text-muted-foreground pt-1 cursor-pointer">
              <input
                type="checkbox"
                checked={confirmoPermiso}
                onChange={(e) => setConfirmoPermiso(e.target.checked)}
                className="mt-0.5 accent-violet-600"
              />
              <span>
                Confirmo que la página a clonar es propia o cuento con autorización del dueño para copiar su diseño,
                catálogo, fotos y textos. tol.ar no verifica esta autorización, es responsabilidad de quien pide el clonado.
              </span>
            </label>
          )}
          <Button onClick={enviar} disabled={!seleccion || !confirmoPermiso || enviando} className="w-full mt-2">
            {enviando ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            {enviando ? "Guardando..." : "Guardar pedido"}
          </Button>
        </>
      )}
      {resultado === "error" && (
        <p className="text-xs text-red-600 text-center">No se pudo guardar. Probá de nuevo.</p>
      )}
    </div>
  )

  if (inline) return contenido

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-violet-500" />
          Clonar con IA
        </CardTitle>
        <CardDescription>
          Elegí la modalidad de clonado que pidió el cliente y, si corresponde, pegá el link de la página a clonar.
          Los precios son orientativos, se ajustan según el caso.
        </CardDescription>
      </CardHeader>
      <CardContent>{contenido}</CardContent>
    </Card>
  )
}
