"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

interface MinorConsentFormProps {
  subdomain?: string
}

export function MinorConsentForm({ subdomain: fixedSubdomain }: MinorConsentFormProps) {
  const [checking, setChecking] = useState(!!fixedSubdomain)
  const [alreadyExists, setAlreadyExists] = useState(false)
  const [createdAt, setCreatedAt] = useState<string | null>(null)

  const [subdomainInput, setSubdomainInput] = useState("")
  const subdomain = fixedSubdomain || subdomainInput.trim()

  const [menorNombre, setMenorNombre] = useState("")
  const [menorFechaNacimiento, setMenorFechaNacimiento] = useState("")
  const [menorDni, setMenorDni] = useState("")
  const [adultoNombre, setAdultoNombre] = useState("")
  const [adultoDni, setAdultoDni] = useState("")
  const [adultoRelacion, setAdultoRelacion] = useState("padre")
  const [adultoEmail, setAdultoEmail] = useState("")
  const [adultoTelefono, setAdultoTelefono] = useState("")
  const [aceptaTerminos, setAceptaTerminos] = useState(false)

  const [sending, setSending] = useState(false)
  const [message, setMessage] = useState("")
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!fixedSubdomain) return
    fetch(`/api/store-minor-consent?subdomain=${fixedSubdomain}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.exists) {
          setAlreadyExists(true)
          setCreatedAt(data.createdAt || null)
        }
      })
      .finally(() => setChecking(false))
  }, [fixedSubdomain])

  const handleSubmit = async () => {
    setMessage("")
    if (!subdomain) {
      setMessage("Ingresá el subdominio de la tienda")
      return
    }
    if (!menorNombre || !menorFechaNacimiento || !menorDni || !adultoNombre || !adultoDni || !adultoEmail || !adultoTelefono) {
      setMessage("Completá todos los campos obligatorios")
      return
    }
    if (!aceptaTerminos) {
      setMessage("Hace falta aceptar la declaración y los Términos y Condiciones")
      return
    }

    setSending(true)
    try {
      const res = await fetch("/api/store-minor-consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subdomain,
          menorNombre,
          menorFechaNacimiento,
          menorDni,
          adultoNombre,
          adultoDni,
          adultoRelacion,
          adultoEmail,
          adultoTelefono,
          aceptaTerminos,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        setSuccess(true)
      } else {
        setMessage(data.error || "Error al registrar la autorización")
      }
    } catch {
      setMessage("Error de conexión")
    } finally {
      setSending(false)
    }
  }

  if (checking) return null

  if (success) {
    return (
      <div className="container mx-auto px-4 max-w-4xl pb-12">
        <Card>
          <CardContent className="pt-6">
            <p className="text-green-600 font-medium">
              Autorización registrada correctamente. El documento queda guardado en el panel de administración de la
              tienda.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (alreadyExists) {
    return (
      <div className="container mx-auto px-4 max-w-4xl pb-12">
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">
              Ya existe una autorización parental registrada para esta tienda
              {createdAt ? ` (${new Date(createdAt).toLocaleDateString("es-AR")})` : ""}.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 max-w-4xl pb-12">
      <Card>
        <CardHeader>
          <CardTitle>Formulario de Autorización Parental</CardTitle>
          <CardDescription>
            Completar solo si quien va a usar esta tienda es menor de 18 años. Debe completarlo el padre, madre o
            tutor legal.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!fixedSubdomain && (
            <div>
              <Label>Subdominio de la tienda (ej: mitienda)</Label>
              <Input value={subdomainInput} onChange={(e) => setSubdomainInput(e.target.value)} placeholder="mitienda" />
            </div>
          )}

          <div>
            <h3 className="font-semibold mb-3">Datos del menor</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Nombre completo</Label>
                <Input value={menorNombre} onChange={(e) => setMenorNombre(e.target.value)} />
              </div>
              <div>
                <Label>Fecha de nacimiento</Label>
                <Input type="date" value={menorFechaNacimiento} onChange={(e) => setMenorFechaNacimiento(e.target.value)} />
              </div>
              <div>
                <Label>DNI</Label>
                <Input value={menorDni} onChange={(e) => setMenorDni(e.target.value)} />
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Datos del adulto responsable</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Nombre completo</Label>
                <Input value={adultoNombre} onChange={(e) => setAdultoNombre(e.target.value)} />
              </div>
              <div>
                <Label>DNI</Label>
                <Input value={adultoDni} onChange={(e) => setAdultoDni(e.target.value)} />
              </div>
              <div>
                <Label>Relación con el menor</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={adultoRelacion}
                  onChange={(e) => setAdultoRelacion(e.target.value)}
                >
                  <option value="padre">Padre</option>
                  <option value="madre">Madre</option>
                  <option value="tutor legal">Tutor legal</option>
                </select>
              </div>
              <div>
                <Label>Email de contacto</Label>
                <Input type="email" value={adultoEmail} onChange={(e) => setAdultoEmail(e.target.value)} />
              </div>
              <div>
                <Label>Teléfono de contacto</Label>
                <Input value={adultoTelefono} onChange={(e) => setAdultoTelefono(e.target.value)} />
              </div>
            </div>
          </div>

          {adultoNombre && adultoDni && menorNombre && (
            <div className="bg-neutral-50 border border-neutral-200 rounded-md p-4 text-sm text-neutral-700">
              Yo, {adultoNombre}, DNI {adultoDni}, en carácter de {adultoRelacion} de {menorNombre}, autorizo
              expresamente a que utilice la plataforma tol.ar para crear y administrar una tienda online, incluyendo
              la recepción de pagos a través de Mercado Pago u otros medios habilitados, asumiendo la responsabilidad
              legal por dicho uso.
            </div>
          )}

          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="aceptaTerminosMenor"
              checked={aceptaTerminos}
              onChange={(e) => setAceptaTerminos(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300"
            />
            <Label htmlFor="aceptaTerminosMenor" className="text-sm font-normal cursor-pointer">
              Confirmo la declaración anterior y declaro haber leído y aceptado los Términos y Condiciones y la
              Política de Privacidad de tol.ar.
            </Label>
          </div>

          {message && <p className="text-sm text-red-500">{message}</p>}

          <Button onClick={handleSubmit} disabled={sending}>
            {sending ? "Guardando..." : "Registrar autorización"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
