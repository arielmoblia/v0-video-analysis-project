"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle2, Send, ImagePlus, X } from "lucide-react"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"

interface Props {
  brand?: "tol" | "tiendabasica"
}

export default function TestimonioForm({ brand = "tol" }: Props) {
  const [formData, setFormData] = useState({ nombre: "", tienda: "", rubro: "", texto: "" })
  const [foto, setFoto] = useState<File | null>(null)
  const [fotoPreview, setFotoPreview] = useState<string>("")
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")

  const handleFoto = (file: File | null) => {
    setFoto(file)
    if (file) setFotoPreview(URL.createObjectURL(file))
    else setFotoPreview("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    setError("")
    try {
      let fotoUrl = ""
      if (foto) {
        const fd = new FormData()
        fd.append("file", foto)
        fd.append("type", "product")
        const upRes = await fetch("/api/upload", { method: "POST", body: fd })
        const upData = await upRes.json()
        if (upRes.ok) fotoUrl = upData.url
      }

      const r = await fetch("/api/testimonio-nuevo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, fotoUrl }),
      })

      if (r.ok) {
        setSent(true)
        setFormData({ nombre: "", tienda: "", rubro: "", texto: "" })
        handleFoto(null)
      } else {
        setError("Error al enviar. Probá de nuevo.")
      }
    } catch {
      setError("Error de conexión. Probá de nuevo.")
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="min-h-screen">
      <Header brand={brand} />
      <section className="bg-emerald-500 py-16 px-4">
        <div className="container mx-auto max-w-2xl text-center">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 uppercase tracking-tight">
            Contanos tu experiencia
          </h1>
          <p className="text-xl text-white/90">
            Tu opinión nos ayuda a que más gente conozca tol.ar. Con tus propias palabras, contá qué te resolvió tu tienda.
          </p>
        </div>
      </section>

      <section className="bg-white py-12 px-4">
        <div className="container mx-auto max-w-xl">
          {sent ? (
            <div className="text-center py-8 bg-green-50 rounded-lg">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">¡Gracias por tu testimonio!</h3>
              <p className="text-gray-600 mb-6">Lo recibimos. Puede que lo usemos en la página de tol.ar.</p>
              <Button onClick={() => setSent(false)}>Enviar otro</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Tu nombre *</label>
                <Input
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="¿Cómo te llamás?"
                  required
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Tu tienda (opcional)</label>
                  <Input
                    value={formData.tienda}
                    onChange={(e) => setFormData({ ...formData, tienda: e.target.value })}
                    placeholder="Nombre de tu tienda"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Rubro (opcional)</label>
                  <Input
                    value={formData.rubro}
                    onChange={(e) => setFormData({ ...formData, rubro: e.target.value })}
                    placeholder="Ej: indumentaria, cosmética..."
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Tu foto (opcional)</label>
                {fotoPreview ? (
                  <div className="relative w-24 h-24">
                    <img src={fotoPreview} alt="Vista previa" className="w-24 h-24 object-cover rounded-lg" />
                    <button
                      type="button"
                      onClick={() => handleFoto(null)}
                      className="absolute -top-2 -right-2 bg-black text-white rounded-full p-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center gap-2 border-2 border-dashed rounded-lg px-4 py-3 cursor-pointer text-gray-500 hover:border-emerald-500 w-fit">
                    <ImagePlus className="w-5 h-5" />
                    <span className="text-sm">Subir foto</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFoto(e.target.files?.[0] || null)}
                    />
                  </label>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Tu testimonio *</label>
                <Textarea
                  value={formData.texto}
                  onChange={(e) => setFormData({ ...formData, texto: e.target.value })}
                  placeholder="Contanos con tus palabras qué te resolvió tol.ar..."
                  rows={5}
                  required
                />
              </div>
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              <Button type="submit" disabled={sending} className="w-full bg-emerald-600 hover:bg-emerald-700" size="lg">
                {sending ? "Enviando..." : "Enviar testimonio"}
                <Send className="w-4 h-4 ml-2" />
              </Button>
            </form>
          )}
        </div>
      </section>
      <Footer brand={brand} />
    </div>
  )
}
