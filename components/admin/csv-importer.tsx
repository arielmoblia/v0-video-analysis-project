"use client"

import React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, FileSpreadsheet, Download, AlertCircle, CheckCircle2, X, Loader2, Eye, ArrowLeft } from "lucide-react"

interface CsvImporterProps {
  storeId: string
  onClose: () => void
}

interface ParsedProduct {
  name: string
  description: string
  price: number
  compare_price?: number
  category?: string
  image_url?: string
  stock?: number
  sizes?: string
  valid: boolean
  errors: string[]
}

export function CsvImporter({ storeId, onClose }: CsvImporterProps) {
  const [step, setStep] = useState<"upload" | "preview" | "importing" | "done">("upload")
  const [file, setFile] = useState<File | null>(null)
  const [parsedProducts, setParsedProducts] = useState<ParsedProduct[]>([])
  const [importResults, setImportResults] = useState<{ success: number; errors: number; messages: string[] }>({ success: 0, errors: 0, messages: [] })
  const [progress, setProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const parseCSV = (text: string): ParsedProduct[] => {
    const lines = text.split(/\r?\n/).filter(line => line.trim())
    if (lines.length < 2) return []

    // Detectar separador (coma o punto y coma)
    const header = lines[0]
    const separator = header.includes(";") ? ";" : ","
    
    const headers = header.split(separator).map(h => h.trim().toLowerCase().replace(/['"]/g, ""))
    
    // Mapear columnas flexibles
    const nameIdx = headers.findIndex(h => ["nombre", "name", "producto", "titulo", "title"].includes(h))
    const descIdx = headers.findIndex(h => ["descripcion", "description", "detalle", "desc"].includes(h))
    const priceIdx = headers.findIndex(h => ["precio", "price", "valor", "monto"].includes(h))
    const comparePriceIdx = headers.findIndex(h => ["precio_anterior", "compare_price", "precio_tachado", "precio_original", "precio original"].includes(h))
    const categoryIdx = headers.findIndex(h => ["categoria", "category", "rubro", "tipo"].includes(h))
    const imageIdx = headers.findIndex(h => ["imagen", "image", "image_url", "foto", "url_imagen"].includes(h))
    const stockIdx = headers.findIndex(h => ["stock", "cantidad", "inventario", "qty"].includes(h))
    const sizesIdx = headers.findIndex(h => ["talles", "sizes", "tallas", "variantes"].includes(h))

    if (nameIdx === -1 || priceIdx === -1) {
      return [{
        name: "",
        description: "",
        price: 0,
        valid: false,
        errors: ["El archivo debe tener al menos las columnas 'nombre' y 'precio'"]
      }]
    }

    const products: ParsedProduct[] = []

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(separator).map(v => v.trim().replace(/^["']|["']$/g, ""))
      const errors: string[] = []

      const name = values[nameIdx] || ""
      const description = descIdx >= 0 ? (values[descIdx] || "") : ""
      const priceStr = values[priceIdx] || ""
      const price = Number.parseFloat(priceStr.replace(/[^0-9.,]/g, "").replace(",", "."))
      const comparePriceStr = comparePriceIdx >= 0 ? (values[comparePriceIdx] || "") : ""
      const comparePrice = comparePriceStr ? Number.parseFloat(comparePriceStr.replace(/[^0-9.,]/g, "").replace(",", ".")) : undefined
      const category = categoryIdx >= 0 ? (values[categoryIdx] || "") : ""
      const imageUrl = imageIdx >= 0 ? (values[imageIdx] || "") : ""
      const stockStr = stockIdx >= 0 ? (values[stockIdx] || "") : ""
      const stock = stockStr ? Number.parseInt(stockStr) : undefined
      const sizes = sizesIdx >= 0 ? (values[sizesIdx] || "") : ""

      if (!name) errors.push("Falta el nombre")
      if (Number.isNaN(price) || price <= 0) errors.push("Precio invalido")
      if (comparePrice !== undefined && Number.isNaN(comparePrice)) errors.push("Precio anterior invalido")

      products.push({
        name,
        description,
        price: Number.isNaN(price) ? 0 : price,
        compare_price: comparePrice,
        category,
        image_url: imageUrl,
        stock,
        sizes,
        valid: errors.length === 0,
        errors,
      })
    }

    return products
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    setFile(selectedFile)
    
    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      const products = parseCSV(text)
      setParsedProducts(products)
      setStep("preview")
    }
    reader.readAsText(selectedFile, "UTF-8")
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && (droppedFile.name.endsWith(".csv") || droppedFile.name.endsWith(".txt"))) {
      setFile(droppedFile)
      const reader = new FileReader()
      reader.onload = (event) => {
        const text = event.target?.result as string
        const products = parseCSV(text)
        setParsedProducts(products)
        setStep("preview")
      }
      reader.readAsText(droppedFile, "UTF-8")
    }
  }

  const startImport = async () => {
    const validProducts = parsedProducts.filter(p => p.valid)
    if (validProducts.length === 0) return

    setStep("importing")
    let success = 0
    let errors = 0
    const messages: string[] = []

    for (let i = 0; i < validProducts.length; i++) {
      const product = validProducts[i]
      setProgress(Math.round(((i + 1) / validProducts.length) * 100))

      try {
        const res = await fetch("/api/admin/products/import", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            storeId,
            product: {
              name: product.name,
              description: product.description,
              price: product.price,
              compare_price: product.compare_price || null,
              category_name: product.category || null,
              image_url: product.image_url || null,
              stock: product.stock ?? null,
              sizes: product.sizes || null,
            }
          })
        })

        if (res.ok) {
          success++
        } else {
          const data = await res.json()
          errors++
          messages.push(`"${product.name}": ${data.error}`)
        }
      } catch {
        errors++
        messages.push(`"${product.name}": Error de conexion`)
      }
    }

    setImportResults({ success, errors, messages })
    setStep("done")
  }

  const downloadTemplate = () => {
    const template = "nombre;descripcion;precio;precio_anterior;categoria;imagen;stock;talles\nRemera Basica;Remera de algodon premium;2500;3500;Remeras;https://url-de-imagen.com/remera.jpg;50;S|M|L|XL\nPantalon Jean;Jean clasico corte recto;8900;;Pantalones;;30;28|30|32|34\n"
    const blob = new Blob([template], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "plantilla-productos-tolar.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  const validCount = parsedProducts.filter(p => p.valid).length
  const invalidCount = parsedProducts.filter(p => !p.valid).length

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onClose} className="bg-transparent">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Volver
        </Button>
        <div>
          <h2 className="text-xl font-bold">Importar Productos desde CSV</h2>
          <p className="text-sm text-muted-foreground">Carga masiva de productos usando un archivo CSV</p>
        </div>
      </div>

      {step === "upload" && (
        <div className="space-y-4">
          {/* Descargar plantilla */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Paso 1: Descarga la plantilla</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Descarga nuestra plantilla CSV con las columnas correctas. Llena los datos de tus productos y subi el archivo.
              </p>
              <Button variant="outline" onClick={downloadTemplate} className="bg-transparent">
                <Download className="w-4 h-4 mr-2" />
                Descargar Plantilla CSV
              </Button>
            </CardContent>
          </Card>

          {/* Columnas aceptadas */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Columnas aceptadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">nombre *</span>
                  <span className="text-muted-foreground">Nombre del producto</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">precio *</span>
                  <span className="text-muted-foreground">Precio de venta</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">descripcion</span>
                  <span className="text-muted-foreground">Descripcion</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">precio_anterior</span>
                  <span className="text-muted-foreground">Precio tachado</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">categoria</span>
                  <span className="text-muted-foreground">Nombre categoria</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">imagen</span>
                  <span className="text-muted-foreground">URL de imagen</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">stock</span>
                  <span className="text-muted-foreground">Cantidad en stock</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">talles</span>
                  <span className="text-muted-foreground">{'Talles separados por |'}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">* Columnas obligatorias. El separador puede ser coma (,) o punto y coma (;)</p>
            </CardContent>
          </Card>

          {/* Upload zone */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Paso 2: Subi tu archivo</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center cursor-pointer hover:border-green-400 hover:bg-green-50/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
              >
                <FileSpreadsheet className="w-12 h-12 mx-auto text-slate-400 mb-3" />
                <p className="font-medium mb-1">Arrastra tu archivo CSV aqui</p>
                <p className="text-sm text-muted-foreground mb-3">o hace clic para seleccionarlo</p>
                <Button variant="outline" size="sm" className="bg-transparent">
                  <Upload className="w-4 h-4 mr-2" />
                  Seleccionar archivo
                </Button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.txt"
                className="hidden"
                onChange={handleFileChange}
              />
            </CardContent>
          </Card>
        </div>
      )}

      {step === "preview" && (
        <div className="space-y-4">
          {/* Resumen */}
          <div className="flex gap-4">
            <Card className="flex-1">
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-green-600">{validCount}</p>
                <p className="text-sm text-muted-foreground">Productos validos</p>
              </CardContent>
            </Card>
            {invalidCount > 0 && (
              <Card className="flex-1">
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold text-red-500">{invalidCount}</p>
                  <p className="text-sm text-muted-foreground">Con errores</p>
                </CardContent>
              </Card>
            )}
            <Card className="flex-1">
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-slate-600">{parsedProducts.length}</p>
                <p className="text-sm text-muted-foreground">Total filas</p>
              </CardContent>
            </Card>
          </div>

          {/* Preview tabla */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Vista previa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-auto max-h-[400px] border rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 sticky top-0">
                    <tr>
                      <th className="p-2 text-left font-medium">#</th>
                      <th className="p-2 text-left font-medium">Nombre</th>
                      <th className="p-2 text-left font-medium">Precio</th>
                      <th className="p-2 text-left font-medium">Categoria</th>
                      <th className="p-2 text-left font-medium">Stock</th>
                      <th className="p-2 text-left font-medium">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedProducts.map((p, i) => (
                      <tr key={i} className={`border-t ${p.valid ? "" : "bg-red-50"}`}>
                        <td className="p-2 text-muted-foreground">{i + 1}</td>
                        <td className="p-2 font-medium">{p.name || "-"}</td>
                        <td className="p-2">{p.price > 0 ? `$${p.price.toLocaleString()}` : "-"}</td>
                        <td className="p-2 text-muted-foreground">{p.category || "-"}</td>
                        <td className="p-2">{p.stock ?? "-"}</td>
                        <td className="p-2">
                          {p.valid ? (
                            <span className="inline-flex items-center gap-1 text-green-600 text-xs">
                              <CheckCircle2 className="w-3 h-3" /> OK
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-red-500 text-xs" title={p.errors.join(", ")}>
                              <AlertCircle className="w-3 h-3" /> {p.errors[0]}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Botones */}
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => { setStep("upload"); setParsedProducts([]); setFile(null) }} className="bg-transparent">
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
            <Button onClick={startImport} disabled={validCount === 0} className="bg-green-600 hover:bg-green-700 text-white">
              <Upload className="w-4 h-4 mr-2" />
              Importar {validCount} productos
            </Button>
          </div>
        </div>
      )}

      {step === "importing" && (
        <Card>
          <CardContent className="p-8 text-center">
            <Loader2 className="w-12 h-12 mx-auto animate-spin text-green-600 mb-4" />
            <h3 className="text-lg font-bold mb-2">Importando productos...</h3>
            <p className="text-muted-foreground mb-4">No cierres esta ventana</p>
            <div className="w-full bg-slate-200 rounded-full h-3 mb-2">
              <div className="bg-green-600 h-3 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-sm text-muted-foreground">{progress}%</p>
          </CardContent>
        </Card>
      )}

      {step === "done" && (
        <div className="space-y-4">
          <Card>
            <CardContent className="p-8 text-center">
              <CheckCircle2 className="w-16 h-16 mx-auto text-green-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">Importacion completada</h3>
              <div className="flex gap-6 justify-center mb-4">
                <div>
                  <p className="text-3xl font-bold text-green-600">{importResults.success}</p>
                  <p className="text-sm text-muted-foreground">Importados</p>
                </div>
                {importResults.errors > 0 && (
                  <div>
                    <p className="text-3xl font-bold text-red-500">{importResults.errors}</p>
                    <p className="text-sm text-muted-foreground">Con errores</p>
                  </div>
                )}
              </div>
              {importResults.messages.length > 0 && (
                <div className="text-left bg-red-50 p-3 rounded-lg mt-4 max-h-40 overflow-auto">
                  <p className="font-medium text-red-700 text-sm mb-1">Errores:</p>
                  {importResults.messages.map((msg, i) => (
                    <p key={i} className="text-xs text-red-600">{msg}</p>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          <div className="flex justify-center">
            <Button onClick={onClose} className="bg-green-600 hover:bg-green-700 text-white">
              Volver a Productos
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
