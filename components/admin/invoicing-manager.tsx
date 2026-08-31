"use client"
import { useState, useEffect } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ExternalLink, CheckCircle2, Upload } from "lucide-react"

interface InvoicingManagerProps {
  storeId: string
  subdomain: string
}

interface Step {
  id: string
  title: string
  desc: string
  linkLabel?: string
  linkUrl?: string
}

const STEPS: Step[] = [
  {
    id: "clave_fiscal",
    title: "1. Conseguí tu Clave Fiscal (nivel 3)",
    desc: "Si todavía no la tenés: la sacás gratis con la app ARCA Móvil (con tu DNI tarjeta) o desde un cajero automático con tu tarjeta de débito, sin turno.",
    linkLabel: "Ver cómo sacarla",
    linkUrl: "https://www.afip.gob.ar/clavefiscal/ayuda/obtener-clave-fiscal.asp",
  },
  {
    id: "inscripcion",
    title: "2. Estar inscripto (Monotributo o Responsable Inscripto)",
    desc: "Si vendés y todavía no estás inscripto en ARCA, primero tenés que darte de alta. Si ya facturás o tenés monotributo, este paso ya lo tenés hecho.",
  },
  {
    id: "generar_certificado",
    title: "3. Generá tu propio Certificado Digital para Facturación Electrónica",
    desc: "Entrá con tu Clave Fiscal a \"Administrador de Relaciones de Clave Fiscal\" → \"Administrador de Certificados Digitales\" → Nuevo certificado, y elegí el servicio Facturación Electrónica (WSFE). Lo generás a tu propio nombre, con tu CUIT — no le das nada a tol.ar en este paso. Vas a terminar con dos archivos para guardar: tu certificado y tu clave privada.",
    linkLabel: "Entrar a ARCA",
    linkUrl: "https://www.afip.gob.ar",
  },
]

export function InvoicingManager({ storeId, subdomain }: InvoicingManagerProps) {
  const storageKey = `invoicing_progress_${storeId}`
  const [done, setDone] = useState<string[]>([])

  const [certStatus, setCertStatus] = useState<{ exists: boolean; cuit?: string; uploadedAt?: string } | null>(null)
  const [cuit, setCuit] = useState("")
  const [certFile, setCertFile] = useState<File | null>(null)
  const [keyFile, setKeyFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey)
      if (raw) setDone(JSON.parse(raw))
    } catch {}
  }, [storageKey])

  useEffect(() => {
    fetch(`/api/store-invoicing-cert?subdomain=${encodeURIComponent(subdomain)}`)
      .then(r => r.json())
      .then(data => setCertStatus(data))
      .catch(() => setCertStatus({ exists: false }))
  }, [subdomain])

  const toggle = (id: string) => {
    setDone(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
      try { localStorage.setItem(storageKey, JSON.stringify(next)) } catch {}
      return next
    })
  }

  const readFileAsText = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ""))
    reader.onerror = reject
    reader.readAsText(file)
  })

  const handleUpload = async () => {
    setUploadError(null)
    if (!cuit || !certFile || !keyFile) {
      setUploadError("Completá el CUIT y subí los dos archivos")
      return
    }
    setUploading(true)
    try {
      const [certPem, keyPem] = await Promise.all([readFileAsText(certFile), readFileAsText(keyFile)])
      const res = await fetch("/api/store-invoicing-cert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subdomain, cuit, certPem, keyPem }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Error al subir el certificado")
      setCertStatus({ exists: true, cuit, uploadedAt: new Date().toISOString() })
      setCertFile(null)
      setKeyFile(null)
    } catch (err: any) {
      setUploadError(err.message || "Error al subir el certificado")
    } finally {
      setUploading(false)
    }
  }

  const stepsDone = STEPS.filter(s => done.includes(s.id)).length
  const totalSteps = STEPS.length + 1
  const completed = stepsDone + (certStatus?.exists ? 1 : 0)
  const allDone = completed === totalSteps

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Facturación electrónica</h1>
        <p className="text-xl text-muted-foreground mt-2">
          Facturás con tu propio certificado, a tu nombre y con tu CUIT — igual que cuando facturás a mano, solo que el sistema lo hace automático por vos. tol.ar no queda como representante tuyo ante ARCA.
        </p>
      </div>

      <div className="rounded-lg bg-slate-50 px-4 py-3 flex items-center justify-between">
        <p className="text-sm font-medium text-slate-700">
          {allDone ? "¡Completaste todos los pasos!" : `Progreso: ${completed} de ${totalSteps} pasos`}
        </p>
        <div className="w-40 h-2 rounded-full bg-slate-200 overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all"
            style={{ width: `${(completed / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {allDone && (
        <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 flex items-center gap-2 text-green-800 text-sm">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          Listo, tu certificado quedó cargado. En cuanto conectemos la facturación automática de tu lado, tus facturas van a empezar a salir solas.
        </div>
      )}

      <div className="space-y-3">
        {STEPS.map(step => {
          const isDone = done.includes(step.id)
          return (
            <div
              key={step.id}
              className={`flex gap-4 rounded-lg border px-4 py-4 transition-colors ${
                isDone ? "bg-green-50 border-green-200" : "bg-white border-slate-200"
              }`}
            >
              <Checkbox checked={isDone} onCheckedChange={() => toggle(step.id)} className="mt-1" />
              <div className="flex-1 space-y-1">
                <p className={`font-semibold text-sm ${isDone ? "text-green-800 line-through" : "text-slate-800"}`}>
                  {step.title}
                </p>
                <p className="text-sm text-slate-500">{step.desc}</p>
                {step.linkUrl && (
                  <a
                    href={step.linkUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline mt-1"
                  >
                    {step.linkLabel} <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          )
        })}

        <div className={`rounded-lg border px-4 py-4 ${certStatus?.exists ? "bg-green-50 border-green-200" : "bg-white border-slate-200"}`}>
          <div className="flex gap-4">
            <div className="mt-1">{certStatus?.exists ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <Upload className="w-4 h-4 text-slate-400" />}</div>
            <div className="flex-1 space-y-3">
              <div>
                <p className={`font-semibold text-sm ${certStatus?.exists ? "text-green-800" : "text-slate-800"}`}>
                  4. Subí tu certificado acá
                </p>
                <p className="text-sm text-slate-500">
                  Subí los dos archivos que descargaste en el paso anterior. Quedan guardados cifrados y solo se usan para facturar automáticamente a tu nombre — la responsabilidad y la firma siguen siendo tuyas.
                </p>
              </div>

              {certStatus?.exists ? (
                <p className="text-sm text-green-700">
                  Certificado cargado para CUIT {certStatus.cuit}. Si necesitás reemplazarlo (por ejemplo porque venció), subí uno nuevo abajo.
                </p>
              ) : null}

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label htmlFor="inv-cuit" className="text-xs">CUIT</Label>
                  <Input id="inv-cuit" placeholder="20-12345678-9" value={cuit} onChange={e => setCuit(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="inv-cert" className="text-xs">Certificado (.crt / .pem)</Label>
                  <Input id="inv-cert" type="file" accept=".crt,.pem,.cer" onChange={e => setCertFile(e.target.files?.[0] || null)} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="inv-key" className="text-xs">Clave privada (.key)</Label>
                  <Input id="inv-key" type="file" accept=".key,.pem" onChange={e => setKeyFile(e.target.files?.[0] || null)} />
                </div>
                <div className="flex items-end">
                  <Button onClick={handleUpload} disabled={uploading} className="w-full">
                    {uploading ? "Subiendo..." : "Guardar certificado"}
                  </Button>
                </div>
              </div>
              {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}
            </div>
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-400">
        El progreso de los pasos 1 a 3 se guarda en este navegador. El certificado subido en el paso 4 queda guardado del lado del servidor, así que lo vas a ver cargado desde cualquier computadora.
      </p>
    </div>
  )
}
