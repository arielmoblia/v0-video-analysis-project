"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Globe, Plus, Save, Trash2 } from "lucide-react"
import { StoresMap } from "./stores-map"
import { ResumenPersonas } from "./resumen-personas"
import { PERIODOS_VISITAS, type PeriodoVisitas, type PersonasResumenData } from "./personas-resumen-types"
import { useToast } from "@/hooks/use-toast"

interface Dominio {
  id: string
  nombre: string
  url: string
  sitemap: string
  service_account: string
  activo: boolean
}

export function PaisDominio({ stores = [] }: { stores?: any[] }) {
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

  const [periodoVisitas, setPeriodoVisitas] = useState<PeriodoVisitas>("siempre")
  const [visitasData, setVisitasData] = useState<PersonasResumenData | null>(null)
  const [visitasLoading, setVisitasLoading] = useState(true)

  useEffect(() => {
    setVisitasLoading(true)
    fetch(`/api/super-admin/personas-resumen?periodo=${periodoVisitas}`)
      .then((res) => res.json())
      .then((d) => { if (typeof d.tolarTotal === "number") setVisitasData(d) })
      .finally(() => setVisitasLoading(false))
  }, [periodoVisitas])

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
    <div className="space-y-6 px-[50px]">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Globe className="w-6 h-6" />
            País / Dominio
          </h2>
          <p className="text-slate-500 text-sm mt-1">Configurá cada dominio activo de la plataforma</p>
        </div>
        <div className="flex items-center gap-2">
          <a href="https://claude.ai/chat/0997613a-eb86-4e83-8a5f-c403ef9b0ef0" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="flex items-center gap-2 border-green-400 text-green-700 hover:bg-green-50">
              💬 Hablar con Claudio
            </Button>
          </a>
          <Button onClick={agregar} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Agregar país
          </Button>
        </div>
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
          <CardContent>
            <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
              {PERIODOS_VISITAS.map((p) => (
                <button
                  key={p.valor}
                  onClick={() => setPeriodoVisitas(p.valor)}
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    padding: "3px 8px",
                    borderRadius: 6,
                    border: "1px solid #e2e8f0",
                    background: periodoVisitas === p.valor ? "#1e293b" : "#f8fafc",
                    color: periodoVisitas === p.valor ? "#fff" : "#64748b",
                    cursor: "pointer",
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start" }}>
              <div style={{ width: 260, flexShrink: 0 }}>
                <ResumenPersonas data={visitasData} loading={visitasLoading} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <StoresMap stores={stores} />
              </div>
            </div>
          </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
