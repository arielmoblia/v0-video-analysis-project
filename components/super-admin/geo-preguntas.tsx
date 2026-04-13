"use client"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

type Pregunta = { id: string; pregunta: string; activa: boolean; orden: number }

export function GeoPreguntas() {
  const { toast } = useToast()
  const [preguntas, setPreguntas] = useState<Pregunta[]>([])
  const [editando, setEditando] = useState<string | null>(null)
  const [textoEdit, setTextoEdit] = useState("")
  const [nueva, setNueva] = useState("")
  const [agregando, setAgregando] = useState(false)

  useEffect(() => {
    fetch("/api/super-admin/geo-preguntas")
      .then(r => r.json())
      .then(d => { if (d.success) setPreguntas(d.data) })
  }, [])

  const guardarEdit = async (id: string) => {
    await fetch("/api/super-admin/geo-preguntas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "update", id, pregunta: textoEdit })
    })
    setPreguntas(prev => prev.map(p => p.id === id ? { ...p, pregunta: textoEdit } : p))
    setEditando(null)
    toast({ title: "Pregunta actualizada" })
  }

  const eliminar = async (id: string) => {
    await fetch("/api/super-admin/geo-preguntas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", id })
    })
    setPreguntas(prev => prev.filter(p => p.id !== id))
    toast({ title: "Pregunta eliminada" })
  }

  const agregar = async () => {
    if (!nueva.trim()) return
    const res = await fetch("/api/super-admin/geo-preguntas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "add", pregunta: nueva, orden: preguntas.length + 1 })
    })
    const d = await res.json()
    if (d.success) {
      setPreguntas(prev => [...prev, d.data])
      setNueva("")
      setAgregando(false)
      toast({ title: "Pregunta agregada" })
    }
  }

  const toggleActiva = async (id: string, activa: boolean) => {
    await fetch("/api/super-admin/geo-preguntas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "toggle", id, activa: !activa })
    })
    setPreguntas(prev => prev.map(p => p.id === id ? { ...p, activa: !activa } : p))
  }

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-slate-100">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Preguntas monitoreadas ({preguntas.length})</span>
        <button onClick={() => setAgregando(!agregando)} className="text-xs px-3 py-1 rounded-full border border-slate-200 text-slate-500 hover:border-slate-400 transition-colors">+ Agregar</button>
      </div>
      {agregando && (
        <div className="flex gap-2 p-3 border-b border-slate-100 bg-slate-50">
          <input type="text" value={nueva} onChange={e => setNueva(e.target.value)} placeholder="Nueva pregunta..." className="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-1.5" onKeyDown={e => e.key === "Enter" && agregar()} />
          <button onClick={agregar} className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 text-white">Guardar</button>
          <button onClick={() => setAgregando(false)} className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 text-slate-500">Cancelar</button>
        </div>
      )}
      {preguntas.map((p, i) => (
        <div key={p.id} className={`flex items-center gap-3 px-4 py-2.5 border-b border-slate-100 last:border-0 ${!p.activa ? "opacity-40" : ""}`}>
          <span className="text-xs text-slate-300 w-4">{i + 1}</span>
          {editando === p.id ? (
            <input type="text" value={textoEdit} onChange={e => setTextoEdit(e.target.value)} className="flex-1 text-sm border border-slate-300 rounded-lg px-2 py-1" onKeyDown={e => e.key === "Enter" && guardarEdit(p.id)} autoFocus />
          ) : (
            <span className="flex-1 text-sm text-slate-700 italic">"{p.pregunta}"</span>
          )}
          <div className="flex items-center gap-2 flex-shrink-0">
            {editando === p.id ? (
              <>
                <button onClick={() => guardarEdit(p.id)} className="text-xs text-green-600 hover:text-green-800">Guardar</button>
                <button onClick={() => setEditando(null)} className="text-xs text-slate-400 hover:text-slate-600">Cancelar</button>
              </>
            ) : (
              <>
                <button onClick={() => { setEditando(p.id); setTextoEdit(p.pregunta) }} className="text-xs text-slate-400 hover:text-slate-600">Editar</button>
                <button onClick={() => toggleActiva(p.id, p.activa)} className="text-xs text-slate-400 hover:text-slate-600">{p.activa ? "Pausar" : "Activar"}</button>
                <button onClick={() => eliminar(p.id)} className="text-xs text-red-400 hover:text-red-600">Eliminar</button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
