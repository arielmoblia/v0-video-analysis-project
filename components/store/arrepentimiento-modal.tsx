"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Send, CheckCircle } from "lucide-react"
import type { Store } from "@/lib/store-context"

interface ArrepentimientoModalProps {
  store: Store
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ArrepentimientoModal({ store, open, onOpenChange }: ArrepentimientoModalProps) {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    numeroPedido: "",
    motivo: "",
  })
  const [sending, setSending] = useState(false)
  const [codigo, setCodigo] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    setError(null)

    try {
      const response = await fetch("/api/arrepentimiento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          storeId: store.id,
          storeName: store.site_title,
          storeEmail: store.email,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setCodigo(data.codigo)
        setFormData({ nombre: "", email: "", numeroPedido: "", motivo: "" })
      } else {
        setError(data.error || "No se pudo enviar la solicitud, intentá de nuevo.")
      }
    } catch {
      setError("No se pudo enviar la solicitud, intentá de nuevo.")
    } finally {
      setSending(false)
    }
  }

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) setCodigo(null)
    onOpenChange(isOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-light tracking-wide">Botón de arrepentimiento</DialogTitle>
        </DialogHeader>

        {codigo ? (
          <div className="py-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-2">Solicitud recibida</h3>
            <p className="text-muted-foreground mb-4">
              Tu código de arrepentimiento es:
            </p>
            <p className="text-2xl font-bold tracking-widest mb-4">{codigo}</p>
            <p className="text-sm text-muted-foreground">
              La tienda tiene 24 horas para confirmarte la solicitud. Te enviamos este código también por email.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <p className="text-sm text-muted-foreground">
              Tenés derecho a arrepentirte de tu compra dentro de los 10 días corridos desde que la recibiste,
              sin necesidad de justificar el motivo (Ley 24.240 / Disposición 954/2025).
            </p>

            <div className="space-y-2">
              <Label htmlFor="arr-nombre">Nombre *</Label>
              <Input
                id="arr-nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                placeholder="Tu nombre"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="arr-email">Email *</Label>
              <Input
                id="arr-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="tu@email.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="arr-pedido">Número de pedido</Label>
              <Input
                id="arr-pedido"
                value={formData.numeroPedido}
                onChange={(e) => setFormData({ ...formData, numeroPedido: e.target.value })}
                placeholder="Si lo tenés a mano"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="arr-motivo">Motivo (opcional)</Label>
              <Textarea
                id="arr-motivo"
                value={formData.motivo}
                onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
                placeholder="No es obligatorio, pero nos ayuda a procesarlo más rápido"
                rows={3}
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button type="submit" className="w-full" disabled={sending}>
              {sending ? (
                "Enviando..."
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Solicitar arrepentimiento
                </>
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
