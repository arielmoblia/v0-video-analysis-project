"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Wand2, Loader2, ExternalLink, Check, Sparkles, Palette, Type, Layout } from "lucide-react"

interface AIDesignManagerProps {
  storeId: string
  hasFeature: boolean
  currentDesign?: {
    primaryColor: string
    secondaryColor: string
    accentColor: string
    backgroundColor: string
    textColor: string
    fontFamily: string
    style: string
    sourceUrl: string
  } | null
}

export function AIDesignManager({ storeId, hasFeature, currentDesign }: AIDesignManagerProps) {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState("")
  const [applied, setApplied] = useState(false)

  const analyzeUrl = async () => {
    if (!url.trim()) {
      setError("Ingresá una URL")
      return
    }

    setLoading(true)
    setError("")
    setResult(null)

    try {
      const response = await fetch("/api/ai-design/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, storeId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Error al analizar")
      }

      setResult(data)
    } catch (err: any) {
      setError(err.message || "Error al analizar la URL")
    } finally {
      setLoading(false)
    }
  }

  const applyDesign = async () => {
    if (!result) return

    setLoading(true)
    try {
      const response = await fetch("/api/ai-design/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storeId, design: result }),
      })

      if (!response.ok) {
        throw new Error("Error al aplicar el diseño")
      }

      setApplied(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!hasFeature) {
    return (
      <Card className="border-dashed">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Wand2 className="w-8 h-8 text-white" />
          </div>
          <CardTitle>Diseño con IA</CardTitle>
          <CardDescription>
            Pegá la URL de un sitio que te guste y nuestra IA analizará los colores, tipografía y estilo para aplicarlo a tu tienda.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button variant="outline" asChild>
            <a href="/diseno-ia">Más información</a>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Wand2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle>Diseño con IA</CardTitle>
              <CardDescription>Ingresá la URL de un sitio que te guste</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder="https://ejemplo.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={loading}
              />
            </div>
            <Button onClick={analyzeUrl} disabled={loading || !url.trim()}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analizando...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Analizar
                </>
              )}
            </Button>
          </div>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          {result && !applied && (
            <Card className="bg-muted/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  Análisis completado
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Colores */}
                <div>
                  <Label className="flex items-center gap-2 mb-2">
                    <Palette className="w-4 h-4" />
                    Paleta de colores detectada
                  </Label>
                  <div className="flex gap-2">
                    {[result.primaryColor, result.secondaryColor, result.accentColor, result.backgroundColor].map((color, i) => (
                      <div key={i} className="flex flex-col items-center gap-1">
                        <div
                          className="w-12 h-12 rounded-lg border shadow-sm"
                          style={{ backgroundColor: color }}
                        />
                        <span className="text-xs text-muted-foreground">{color}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tipografía */}
                <div>
                  <Label className="flex items-center gap-2 mb-2">
                    <Type className="w-4 h-4" />
                    Tipografía sugerida
                  </Label>
                  <Badge variant="secondary">{result.fontFamily}</Badge>
                </div>

                {/* Estilo */}
                <div>
                  <Label className="flex items-center gap-2 mb-2">
                    <Layout className="w-4 h-4" />
                    Estilo detectado
                  </Label>
                  <p className="text-sm text-muted-foreground">{result.style}</p>
                </div>

                <Button onClick={applyDesign} className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Aplicando...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Aplicar este diseño a mi tienda
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}

          {applied && (
            <Card className="bg-green-50 border-green-200">
              <CardContent className="pt-6 text-center">
                <Check className="w-12 h-12 text-green-500 mx-auto mb-2" />
                <p className="font-medium text-green-800">Diseño aplicado correctamente</p>
                <p className="text-sm text-green-600">Los cambios ya están visibles en tu tienda</p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Diseño actual */}
      {currentDesign && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Diseño actual aplicado</CardTitle>
            <CardDescription>
              Basado en: <a href={currentDesign.sourceUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
                {currentDesign.sourceUrl} <ExternalLink className="w-3 h-3" />
              </a>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              {[currentDesign.primaryColor, currentDesign.secondaryColor, currentDesign.accentColor, currentDesign.backgroundColor].map((color, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-lg border shadow-sm"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
