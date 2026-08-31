"use client"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, ArrowLeftRight } from "lucide-react"

interface LinkedStoreManagerProps {
  storeId: string
  initialUrl: string | null
  initialLabel: string | null
}

export function LinkedStoreManager({ storeId, initialUrl, initialLabel }: LinkedStoreManagerProps) {
  const { toast } = useToast()
  const [url, setUrl] = useState(initialUrl || "")
  const [label, setLabel] = useState(initialLabel || "")
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeId,
          linked_store_url: url.trim(),
          linked_store_label: label.trim(),
        }),
      })
      if (res.ok) {
        toast({ title: "Guardado", description: "Ya podés ver el botón en el encabezado de tu tienda." })
      } else {
        toast({ title: "Error", description: "No se pudo guardar", variant: "destructive" })
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-8 max-w-xl">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Mayorista / Minorista</h1>
        <p className="text-xl text-muted-foreground mt-2">
          Conectá tu tienda con su versión mayorista o minorista con un botón en el encabezado.
        </p>
        <a
          href={`${process.env.NEXT_PUBLIC_APP_URL || "https://tol.ar"}/plan-cositas/mayorista-minorista`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-2 text-sm text-blue-600 hover:underline"
        >
          Leer más →
        </a>
      </div>

      <div className="bg-slate-50 rounded-xl p-6 space-y-6">
        <div>
          <Label>Link de tu otra tienda</Label>
          <Input
            placeholder="https://tutiendamayorista.tol.ar"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Pegá la dirección completa de tu otra tienda (la mayorista o la minorista, según corresponda)
          </p>
        </div>

        <div>
          <Label>Texto del botón</Label>
          <Input
            placeholder="Ej: Venta mayorista"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Así se va a ver el botón en el encabezado de tu tienda
          </p>
        </div>

        <Button
          className="w-full"
          disabled={saving || !url.trim() || !label.trim()}
          onClick={handleSave}
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <ArrowLeftRight className="w-4 h-4 mr-2" />}
          {saving ? "Guardando..." : "Guardar"}
        </Button>
      </div>
    </div>
  )
}
