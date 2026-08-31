"use client"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface ConsentRow {
  id: string
  store_id: string
  menor_nombre: string
  menor_fecha_nacimiento: string
  menor_dni: string
  adulto_nombre: string
  adulto_dni: string
  adulto_relacion: string
  adulto_email: string
  adulto_telefono: string
  created_at: string
  signedUrl: string | null
  stores: { subdomain: string; site_title: string } | null
}

export function MenoresManager() {
  const [consents, setConsents] = useState<ConsentRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/super-admin/minor-consents")
      .then((res) => res.json())
      .then((data) => setConsents(data.consents || []))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Menores</h2>
        <p className="text-slate-500 text-sm mt-1">
          Autorizaciones parentales registradas para tiendas creadas por menores de 18 años. Documentos inmutables — no se pueden editar ni reemplazar.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Autorizaciones registradas</CardTitle>
          <CardDescription>{consents.length} tienda(s) con autorización de menor de edad</CardDescription>
        </CardHeader>
        <CardContent>
          {loading && <p className="text-sm text-slate-500">Cargando...</p>}
          {!loading && consents.length === 0 && (
            <p className="text-sm text-slate-500">Todavía no hay ninguna autorización de menor registrada.</p>
          )}
          {!loading && consents.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs font-medium text-slate-500 border-b">
                    <th className="py-2 px-2">Tienda</th>
                    <th className="py-2 px-2">Menor</th>
                    <th className="py-2 px-2">Adulto responsable</th>
                    <th className="py-2 px-2">Relación</th>
                    <th className="py-2 px-2">Contacto</th>
                    <th className="py-2 px-2">Fecha</th>
                    <th className="py-2 px-2">Documento</th>
                  </tr>
                </thead>
                <tbody>
                  {consents.map((c) => (
                    <tr key={c.id} className="border-b last:border-0">
                      <td className="py-2 px-2 font-medium text-slate-800">{c.stores?.subdomain || c.store_id}.tol.ar</td>
                      <td className="py-2 px-2">{c.menor_nombre} <span className="text-slate-400">· DNI {c.menor_dni}</span></td>
                      <td className="py-2 px-2">{c.adulto_nombre} <span className="text-slate-400">· DNI {c.adulto_dni}</span></td>
                      <td className="py-2 px-2">{c.adulto_relacion}</td>
                      <td className="py-2 px-2">{c.adulto_email}<br /><span className="text-slate-400">{c.adulto_telefono}</span></td>
                      <td className="py-2 px-2 whitespace-nowrap">{new Date(c.created_at).toLocaleDateString("es-AR")}</td>
                      <td className="py-2 px-2">
                        {c.signedUrl && (
                          <Button variant="outline" size="sm" onClick={() => window.open(c.signedUrl!, "_blank")}>
                            Ver PDF
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
