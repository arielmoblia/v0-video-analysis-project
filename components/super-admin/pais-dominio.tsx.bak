"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Globe, Plus, Save, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Dominio {
  id: string
  nombre: string
  url: string
  sitemap: string
  service_account: string
  activo: boolean
}

export function PaisDominio() {
  const { toast } = useToast()
  const [dominios, setDominios] = useState<Dominio[]>([
    {
      id: "1",
      nombre: "Argentina",
      url: "https://tol.ar",
      sitemap: "https://tol.ar/sitemap.xml",
      service_account: "tolar-search-console@tolar-seo.iam.gserviceaccount.com",
      activo: true
    }
  ])
  const [editando, setEditando] = useState<string | null>(null)

  const agregar = () => {
    const nuevo: Dominio = {
      id: Date.now().toString(),
      nombre: "",
      url: "",
      sitemap: "",
      service_account: "",
      activo: false
    }
    setDominios([...dominios, nuevo])
    setEditando(nuevo.id)
  }

  const actualizar = (id: string, campo: keyof Dominio, valor: string | boolean) => {
    setDominios(dominios.map(d => d.id === id ? { ...d, [campo]: valor } : d))
  }

  const guardar = () => {
    toast({ title: "Guardado", description: "Configuración de dominios actualizada." })
    setEditando(null)
  }

  const eliminar = (id: string) => {
    setDominios(dominios.filter(d => d.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Globe className="w-6 h-6" />
            País / Dominio
          </h2>
          <p className="text-slate-500 text-sm mt-1">Configurá cada dominio activo de la plataforma</p>
        </div>
        <Button onClick={agregar} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Agregar país
        </Button>
      </div>

      <div className="grid gap-4">
        {dominios.map((d) => (
          <Card key={d.id} className={d.activo ? "border-green-200" : "border-slate-200"}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Globe className="w-5 h-5 text-slate-500" />
                  {d.nombre || "Nuevo dominio"}
                  {d.activo && <Badge className="bg-green-100 text-green-700 text-xs">Activo</Badge>}
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setEditando(editando === d.id ? null : d.id)}>
                    {editando === d.id ? "Cerrar" : "Editar"}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => eliminar(d.id)}>
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </Button>
                </div>
              </div>
              {editando !== d.id && (
                <CardDescription>{d.url}</CardDescription>
              )}
            </CardHeader>
            {editando === d.id && (
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label>Nombre del país</Label>
                    <Input value={d.nombre} onChange={e => actualizar(d.id, "nombre", e.target.value)} placeholder="Argentina" />
                  </div>
                  <div className="space-y-1">
                    <Label>URL del dominio</Label>
                    <Input value={d.url} onChange={e => actualizar(d.id, "url", e.target.value)} placeholder="https://tol.ar" />
                  </div>
                  <div className="space-y-1">
                    <Label>Sitemap</Label>
                    <Input value={d.sitemap} onChange={e => actualizar(d.id, "sitemap", e.target.value)} placeholder="https://tol.ar/sitemap.xml" />
                  </div>
                  <div className="space-y-1">
                    <Label>Service Account Google</Label>
                    <Input value={d.service_account} onChange={e => actualizar(d.id, "service_account", e.target.value)} placeholder="cuenta@proyecto.iam.gserviceaccount.com" />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" checked={d.activo} onChange={e => actualizar(d.id, "activo", e.target.checked)} />
                    Dominio activo
                  </label>
                  <Button onClick={guardar} className="flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    Guardar
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}
