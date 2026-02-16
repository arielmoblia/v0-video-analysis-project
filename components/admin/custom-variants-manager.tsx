"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, GripVertical, Save, Loader2, Palette, Package } from "lucide-react"
import { toast } from "sonner"

interface VariantOption {
  id: string
  name: string
  stock?: number
}

interface VariantType {
  id: string
  name: string
  options: VariantOption[]
}

interface CustomVariantsManagerProps {
  storeId: string
}

export function CustomVariantsManager({ storeId }: CustomVariantsManagerProps) {
  const [variantTypes, setVariantTypes] = useState<VariantType[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadVariants()
  }, [storeId])

  const loadVariants = async () => {
    try {
      const res = await fetch(`/api/admin/custom-variants?storeId=${storeId}`)
      if (res.ok) {
        const data = await res.json()
        setVariantTypes(data.variant_types || [])
      }
    } catch (error) {
      console.error("Error loading variants:", error)
    } finally {
      setLoading(false)
    }
  }

  const saveVariants = async () => {
    setSaving(true)
    try {
      const res = await fetch("/api/admin/custom-variants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storeId, variant_types: variantTypes }),
      })
      if (res.ok) {
        toast.success("Variantes guardadas correctamente")
      } else {
        toast.error("Error al guardar las variantes")
      }
    } catch (error) {
      toast.error("Error al guardar las variantes")
    } finally {
      setSaving(false)
    }
  }

  const addVariantType = () => {
    setVariantTypes([
      ...variantTypes,
      {
        id: crypto.randomUUID(),
        name: "",
        options: [],
      },
    ])
  }

  const removeVariantType = (typeId: string) => {
    setVariantTypes(variantTypes.filter((t) => t.id !== typeId))
  }

  const updateVariantTypeName = (typeId: string, name: string) => {
    setVariantTypes(
      variantTypes.map((t) => (t.id === typeId ? { ...t, name } : t))
    )
  }

  const addOption = (typeId: string) => {
    setVariantTypes(
      variantTypes.map((t) =>
        t.id === typeId
          ? {
              ...t,
              options: [...t.options, { id: crypto.randomUUID(), name: "", stock: 0 }],
            }
          : t
      )
    )
  }

  const removeOption = (typeId: string, optionId: string) => {
    setVariantTypes(
      variantTypes.map((t) =>
        t.id === typeId
          ? { ...t, options: t.options.filter((o) => o.id !== optionId) }
          : t
      )
    )
  }

  const updateOption = (typeId: string, optionId: string, field: "name" | "stock", value: string | number) => {
    setVariantTypes(
      variantTypes.map((t) =>
        t.id === typeId
          ? {
              ...t,
              options: t.options.map((o) =>
                o.id === optionId ? { ...o, [field]: value } : o
              ),
            }
          : t
      )
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Variantes Personalizables</h3>
          <p className="text-sm text-muted-foreground">
            Crea tipos de variantes personalizadas para tus productos (ej: Aroma, Color, Sabor, Material)
          </p>
        </div>
        <Button onClick={saveVariants} disabled={saving}>
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Guardar
        </Button>
      </div>

      <div className="space-y-4">
        {variantTypes.map((variantType) => (
          <Card key={variantType.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <GripVertical className="w-5 h-5 text-muted-foreground cursor-grab" />
                <div className="flex-1">
                  <Input
                    value={variantType.name}
                    onChange={(e) => updateVariantTypeName(variantType.id, e.target.value)}
                    placeholder="Nombre del tipo (ej: Aroma, Color, Sabor)"
                    className="font-medium"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeVariantType(variantType.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Opciones disponibles</Label>
                <div className="space-y-2">
                  {variantType.options.map((option) => (
                    <div key={option.id} className="flex items-center gap-2">
                      <Input
                        value={option.name}
                        onChange={(e) => updateOption(variantType.id, option.id, "name", e.target.value)}
                        placeholder="Nombre de la opcion (ej: Lavanda, Rojo, Vainilla)"
                        className="flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeOption(variantType.id, option.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addOption(variantType.id)}
                  className="mt-2"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Agregar opcion
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {variantTypes.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-8 text-center">
              <Palette className="w-12 h-12 text-muted-foreground mb-4" />
              <CardTitle className="text-base mb-1">No hay variantes configuradas</CardTitle>
              <CardDescription className="mb-4">
                Crea variantes personalizadas como Aroma, Color, Sabor, Material, etc.
              </CardDescription>
              <Button onClick={addVariantType}>
                <Plus className="w-4 h-4 mr-2" />
                Crear primer tipo de variante
              </Button>
            </CardContent>
          </Card>
        )}

        {variantTypes.length > 0 && (
          <Button variant="outline" onClick={addVariantType} className="w-full bg-transparent">
            <Plus className="w-4 h-4 mr-2" />
            Agregar otro tipo de variante
          </Button>
        )}
      </div>

      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="py-4">
          <div className="flex gap-3">
            <Package className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800">
              <p className="font-medium mb-1">Como usar las variantes</p>
              <p>
                Una vez que guardes los tipos de variantes, podras asignarlos a tus productos
                en la seccion de edicion de cada producto. Los clientes veran estas opciones
                al momento de agregar el producto al carrito.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default CustomVariantsManager
