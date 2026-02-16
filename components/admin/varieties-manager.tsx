"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Save, Palette, X, GripVertical } from "lucide-react"

interface Variety {
  id: string
  name: string // Ej: "Aroma", "Color", "Sabor"
  options: string[] // Ej: ["Lavanda", "Rosa", "Vainilla"]
}

interface VarietiesManagerProps {
  storeId: string
}

export function VarietiesManager({ storeId }: VarietiesManagerProps) {
  const [varieties, setVarieties] = useState<Variety[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [newVarietyName, setNewVarietyName] = useState("")
  const [editingVariety, setEditingVariety] = useState<string | null>(null)
  const [newOptionValue, setNewOptionValue] = useState("")

  useEffect(() => {
    fetchVarieties()
  }, [storeId])

  const fetchVarieties = async () => {
    try {
      const res = await fetch(`/api/admin/varieties?storeId=${storeId}`)
      if (res.ok) {
        const data = await res.json()
        setVarieties(data.varieties || [])
      }
    } catch (error) {
      console.error("Error fetching varieties:", error)
    } finally {
      setLoading(false)
    }
  }

  const saveVarieties = async () => {
    setSaving(true)
    try {
      const res = await fetch("/api/admin/varieties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storeId, varieties }),
      })
      if (res.ok) {
        // Exito
      }
    } catch (error) {
      console.error("Error saving varieties:", error)
    } finally {
      setSaving(false)
    }
  }

  const addVariety = () => {
    if (!newVarietyName.trim()) return
    const newVariety: Variety = {
      id: Date.now().toString(),
      name: newVarietyName.trim(),
      options: [],
    }
    setVarieties([...varieties, newVariety])
    setNewVarietyName("")
    setEditingVariety(newVariety.id)
  }

  const removeVariety = (id: string) => {
    setVarieties(varieties.filter((v) => v.id !== id))
  }

  const addOptionToVariety = (varietyId: string) => {
    if (!newOptionValue.trim()) return
    setVarieties(
      varieties.map((v) =>
        v.id === varietyId ? { ...v, options: [...v.options, newOptionValue.trim()] } : v
      )
    )
    setNewOptionValue("")
  }

  const removeOptionFromVariety = (varietyId: string, optionIndex: number) => {
    setVarieties(
      varieties.map((v) =>
        v.id === varietyId
          ? { ...v, options: v.options.filter((_, i) => i !== optionIndex) }
          : v
      )
    )
  }

  const updateVarietyName = (varietyId: string, newName: string) => {
    setVarieties(
      varieties.map((v) => (v.id === varietyId ? { ...v, name: newName } : v))
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Palette className="w-6 h-6 text-primary" />
            Variedades Personalizadas
          </h2>
          <p className="text-muted-foreground mt-1">
            Crea opciones personalizadas para tus productos: aromas, colores, sabores, etc.
          </p>
        </div>
        <Button onClick={saveVarieties} disabled={saving}>
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Guardando..." : "Guardar cambios"}
        </Button>
      </div>

      {/* Agregar nueva variedad */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Agregar nueva variedad</CardTitle>
          <CardDescription>
            Ej: "Aroma", "Color", "Sabor", "Material", "Talle personalizado"
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Nombre de la variedad (ej: Aroma)"
              value={newVarietyName}
              onChange={(e) => setNewVarietyName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addVariety()}
            />
            <Button onClick={addVariety} disabled={!newVarietyName.trim()}>
              <Plus className="w-4 h-4 mr-2" />
              Agregar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de variedades */}
      {varieties.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Palette className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg mb-2">No tenes variedades configuradas</h3>
            <p className="text-muted-foreground max-w-md">
              Agrega variedades personalizadas para que tus clientes puedan elegir opciones como aromas, colores, sabores, etc.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {varieties.map((variety) => (
            <Card key={variety.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GripVertical className="w-4 h-4 text-muted-foreground cursor-move" />
                    {editingVariety === variety.id ? (
                      <Input
                        value={variety.name}
                        onChange={(e) => updateVarietyName(variety.id, e.target.value)}
                        className="w-48 h-8"
                        autoFocus
                        onBlur={() => setEditingVariety(null)}
                        onKeyDown={(e) => e.key === "Enter" && setEditingVariety(null)}
                      />
                    ) : (
                      <CardTitle
                        className="text-lg cursor-pointer hover:text-primary"
                        onClick={() => setEditingVariety(variety.id)}
                      >
                        {variety.name}
                      </CardTitle>
                    )}
                    <Badge variant="secondary">{variety.options.length} opciones</Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => removeVariety(variety.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Opciones existentes */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {variety.options.map((option, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="pl-3 pr-1 py-1 flex items-center gap-1"
                    >
                      {option}
                      <button
                        onClick={() => removeOptionFromVariety(variety.id, index)}
                        className="ml-1 hover:bg-red-100 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3 text-red-500" />
                      </button>
                    </Badge>
                  ))}
                </div>

                {/* Agregar opcion */}
                <div className="flex gap-2">
                  <Input
                    placeholder={`Agregar opcion a "${variety.name}" (ej: Lavanda)`}
                    value={editingVariety === variety.id ? newOptionValue : ""}
                    onChange={(e) => {
                      setEditingVariety(variety.id)
                      setNewOptionValue(e.target.value)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        addOptionToVariety(variety.id)
                      }
                    }}
                    onFocus={() => setEditingVariety(variety.id)}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addOptionToVariety(variety.id)}
                    disabled={!newOptionValue.trim() || editingVariety !== variety.id}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Preview */}
      {varieties.length > 0 && (
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-lg">Vista previa</CardTitle>
            <CardDescription>
              Asi veran tus clientes las opciones en cada producto
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-white p-4 rounded-lg border space-y-4">
              {varieties.map((variety) => (
                <div key={variety.id}>
                  <Label className="text-sm font-medium mb-2 block">{variety.name}</Label>
                  <div className="flex flex-wrap gap-2">
                    {variety.options.length > 0 ? (
                      variety.options.map((option, index) => (
                        <Button
                          key={index}
                          variant={index === 0 ? "default" : "outline"}
                          size="sm"
                          className="cursor-pointer"
                        >
                          {option}
                        </Button>
                      ))
                    ) : (
                      <span className="text-muted-foreground text-sm">
                        Sin opciones configuradas
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
