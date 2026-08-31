"use client"

import { useState, useEffect } from "react"
import { Wrench, Plus, Trash2, Save, GripVertical } from "lucide-react"

type Servicio = {
  id: string
  categoria: string
  nombre: string
  descripcion: string
  precio: number
  activo: boolean
}

const CATEGORIAS_DEFAULT = ["Pagos", "Productos", "Envíos", "Diseño", "Marketing", "Soporte"]

const SERVICIOS_DEFAULT: Servicio[] = [
  { id:"mp", categoria:"Pagos", nombre:"Configurar Mercado Pago", descripcion:"Creamos la aplicación, obtenemos el Access Token y lo conectamos a tu tienda.", precio:5000, activo:true },
  { id:"pagos_extra", categoria:"Pagos", nombre:"Otros métodos de pago", descripcion:"Configuramos transferencia, Mobbex, Ualá u otros medios.", precio:3000, activo:true },
  { id:"productos", categoria:"Productos", nombre:"Carga de productos", descripcion:"Subimos tus productos con fotos, descripciones, precios y stock (hasta 30).", precio:8000, activo:true },
  { id:"categorias", categoria:"Productos", nombre:"Organización en categorías", descripcion:"Organizamos tu catálogo para que tus clientes encuentren lo que buscan.", precio:3000, activo:true },
  { id:"envios", categoria:"Envíos", nombre:"Configurar envíos", descripcion:"Configuramos Andreani, Enviamelo u otros.", precio:4000, activo:true },
  { id:"logo", categoria:"Diseño", nombre:"Logo y marca", descripcion:"Diseñamos el logo y elegimos colores y tipografías.", precio:10000, activo:true },
  { id:"banner", categoria:"Diseño", nombre:"Banner principal", descripcion:"Diseñamos el banner de portada con tu producto estrella.", precio:4000, activo:true },
  { id:"dominio", categoria:"Diseño", nombre:"Dominio propio", descripcion:"Compramos y conectamos tu dominio a tu tienda tol.ar.", precio:5000, activo:true },
  { id:"seo", categoria:"Marketing", nombre:"SEO básico", descripcion:"Configuramos título, descripción y palabras clave para Google.", precio:5000, activo:true },
  { id:"redes", categoria:"Marketing", nombre:"Redes sociales", descripcion:"Conectamos Instagram y Facebook, configuramos pixel de Meta.", precio:4000, activo:true },
  { id:"marketing_email", categoria:"Marketing", nombre:"Email marketing", descripcion:"Configuramos tu primera campaña de email.", precio:5000, activo:true },
  { id:"capacitacion", categoria:"Soporte", nombre:"Capacitación (1 hora)", descripcion:"Sesión por videollamada para aprender a manejar tu tienda.", precio:5000, activo:true },
  { id:"todo", categoria:"Soporte", nombre:"Todo incluido 🚀", descripcion:"Tienda 100% lista para vender. Productos, pagos, envíos, diseño y SEO.", precio:45000, activo:true },
]

export function EspecialistaDashboard() {
  const [servicios, setServicios] = useState<Servicio[]>(SERVICIOS_DEFAULT)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    // Cargar desde Supabase platform_settings
    fetch("/api/super-admin/especialista-config")
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.servicios) setServicios(data.servicios) })
      .catch(() => {})
  }, [])

  const guardar = async () => {
    setSaving(true)
    await fetch("/api/super-admin/especialista-config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ servicios })
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const updateServicio = (id: string, field: keyof Servicio, value: any) => {
    setServicios(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s))
  }

  const eliminar = (id: string) => {
    setServicios(prev => prev.filter(s => s.id !== id))
  }

  const agregar = () => {
    const nuevo: Servicio = {
      id: `servicio_${Date.now()}`,
      categoria: CATEGORIAS_DEFAULT[0],
      nombre: "Nuevo servicio",
      descripcion: "Descripción del servicio",
      precio: 5000,
      activo: true
    }
    setServicios(prev => [...prev, nuevo])
    setEditingId(nuevo.id)
  }

  const categorias = [...new Set(servicios.map(s => s.categoria))]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Wrench className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-semibold">Servicios de Especialista</h2>
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
            {servicios.filter(s => s.activo).length} activos
          </span>
        </div>
        <div className="flex gap-2">
          <button onClick={agregar} className="flex items-center gap-2 text-sm bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-lg">
            <Plus className="w-4 h-4" /> Agregar servicio
          </button>
          <button onClick={guardar} disabled={saving} className="flex items-center gap-2 text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50">
            <Save className="w-4 h-4" /> {saving ? "Guardando..." : saved ? "✓ Guardado" : "Guardar cambios"}
          </button>
        </div>
      </div>

      <div className="text-xs text-slate-400 bg-slate-50 rounded-lg p-3">
        Los cambios se guardan en Supabase y se reflejan en <strong>tol.ar/especialista</strong> automáticamente.
      </div>

      {categorias.map(cat => (
        <div key={cat}>
          <h3 className="text-sm font-medium text-slate-400 mb-2 uppercase tracking-wide">{cat}</h3>
          <div className="space-y-2">
            {servicios.filter(s => s.categoria === cat).map(s => (
              <div key={s.id} className={`border rounded-lg p-4 ${s.activo ? "bg-white" : "bg-slate-50 opacity-60"}`}>
                {editingId === s.id ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-slate-500 mb-1 block">Nombre</label>
                        <input value={s.nombre} onChange={e => updateServicio(s.id, "nombre", e.target.value)}
                          className="w-full border rounded px-3 py-1.5 text-sm" />
                      </div>
                      <div>
                        <label className="text-xs text-slate-500 mb-1 block">Categoría</label>
                        <select value={s.categoria} onChange={e => updateServicio(s.id, "categoria", e.target.value)}
                          className="w-full border rounded px-3 py-1.5 text-sm">
                          {CATEGORIAS_DEFAULT.map(c => <option key={c}>{c}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">Descripción</label>
                      <input value={s.descripcion} onChange={e => updateServicio(s.id, "descripcion", e.target.value)}
                        className="w-full border rounded px-3 py-1.5 text-sm" />
                    </div>
                    <div className="flex items-center gap-4">
                      <div>
                        <label className="text-xs text-slate-500 mb-1 block">Precio $</label>
                        <input type="number" value={s.precio} onChange={e => updateServicio(s.id, "precio", Number(e.target.value))}
                          className="w-32 border rounded px-3 py-1.5 text-sm" />
                      </div>
                      <button onClick={() => setEditingId(null)} className="mt-4 text-sm bg-blue-600 text-white px-4 py-1.5 rounded-lg">
                        Listo
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">{s.nombre}</p>
                        {!s.activo && <span className="text-xs bg-slate-200 text-slate-500 px-2 py-0.5 rounded-full">Oculto</span>}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{s.descripcion}</p>
                    </div>
                    <p className="font-semibold text-sm min-w-[80px] text-right">${s.precio.toLocaleString("es-AR")}</p>
                    <div className="flex items-center gap-1">
                      <button onClick={() => updateServicio(s.id, "activo", !s.activo)}
                        className={`text-xs px-2 py-1 rounded ${s.activo ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}>
                        {s.activo ? "Visible" : "Oculto"}
                      </button>
                      <button onClick={() => setEditingId(s.id)} className="text-xs px-2 py-1 rounded bg-slate-100 text-slate-600 hover:bg-slate-200">
                        Editar
                      </button>
                      <button onClick={() => eliminar(s.id)} className="text-xs px-2 py-1 rounded bg-red-50 text-red-500 hover:bg-red-100">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
