"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface MinorConsentStatusProps {
  subdomain: string
}

export function MinorConsentStatus({ subdomain }: MinorConsentStatusProps) {
  const [loading, setLoading] = useState(true)
  const [exists, setExists] = useState(false)
  const [createdAt, setCreatedAt] = useState<string | null>(null)
  const [signedUrl, setSignedUrl] = useState<string | null>(null)

  useEffect(() => {
    fetch(`/api/store-minor-consent?subdomain=${subdomain}`)
      .then((res) => res.json())
      .then((data) => {
        setExists(!!data.exists)
        setCreatedAt(data.createdAt || null)
        setSignedUrl(data.signedUrl || null)
      })
      .finally(() => setLoading(false))
  }, [subdomain])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Autorización de Menor de Edad</CardTitle>
        <CardDescription>
          Documento de autorización parental, si el titular de la tienda es menor de 18 años
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading && <p className="text-sm text-neutral-500">Verificando...</p>}
        {!loading && exists && (
          <div className="space-y-2">
            <p className="text-sm text-green-600">
              Autorización registrada{createdAt ? ` el ${new Date(createdAt).toLocaleDateString("es-AR")}` : ""}.
              Este documento no puede editarse ni reemplazarse.
            </p>
            {signedUrl && (
              <Button variant="outline" onClick={() => window.open(signedUrl, "_blank")}>
                Ver documento (PDF)
              </Button>
            )}
          </div>
        )}
        {!loading && !exists && (
          <p className="text-sm text-neutral-500">
            No hay ninguna autorización de menor registrada para esta tienda.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
