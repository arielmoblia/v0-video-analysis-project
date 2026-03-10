"use client"

import type React from "react"
import { useState, useRef, useCallback } from "react"
import { X, ImageIcon, Loader2, Plus, GripVertical } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MultiImageUploadProps {
  value: string[]
  onChange: (urls: string[]) => void
  maxImages?: number
}

export function MultiImageUpload({ value = [], onChange, maxImages = 5 }: MultiImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const uploadFile = async (file: File) => {
    setError(null)
    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Error al subir imagen")
      }

      // Agregar la nueva imagen al array
      onChange([...value, data.url])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al subir imagen")
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (value.length >= maxImages) {
      setError(`Máximo ${maxImages} imágenes permitidas`)
      return
    }

    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith("image/")) {
      uploadFile(file)
    } else {
      setError("Solo se permiten archivos de imagen")
    }
  }, [value, maxImages])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (value.length >= maxImages) {
        setError(`Máximo ${maxImages} imágenes permitidas`)
        return
      }
      uploadFile(file)
    }
  }

  const handleRemove = (index: number) => {
    const newImages = value.filter((_, i) => i !== index)
    onChange(newImages)
  }

  const handleSetPrimary = (index: number) => {
    if (index === 0) return // Ya es principal
    const newImages = [...value]
    const [moved] = newImages.splice(index, 1)
    newImages.unshift(moved)
    onChange(newImages)
  }

  return (
    <div className="space-y-3">
      {/* Imagen principal */}
      {value.length > 0 && (
        <div className="relative">
          <img
            src={value[0] || "/images/placeholders/placeholder.svg"}
            alt="Imagen principal"
            className="w-full h-48 object-cover rounded-lg border-2 border-green-500"
          />
          <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
            Principal
          </span>
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8"
            onClick={() => handleRemove(0)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Miniaturas adicionales */}
      {value.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          {value.slice(1).map((url, index) => (
            <div 
              key={url} 
              className="relative group cursor-pointer"
              onClick={() => handleSetPrimary(index + 1)}
            >
              <img
                src={url || "/images/placeholders/placeholder.svg"}
                alt={`Imagen ${index + 2}`}
                className="w-16 h-16 object-cover rounded border hover:border-green-500 transition-colors"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center">
                <span className="text-white text-[10px] text-center px-1">Hacer principal</span>
              </div>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute -top-2 -right-2 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation()
                  handleRemove(index + 1)
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Zona de carga */}
      {value.length < maxImages && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`
            border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors
            ${isDragging ? "border-black bg-neutral-50" : "border-neutral-300 hover:border-neutral-400"}
            ${isUploading ? "pointer-events-none opacity-50" : ""}
            ${value.length > 0 ? "py-3" : "py-6"}
          `}
        >
          {isUploading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="h-5 w-5 text-neutral-400 animate-spin" />
              <p className="text-sm text-neutral-500">Subiendo imagen...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              {value.length === 0 ? (
                <>
                  <div className="h-12 w-12 rounded-full bg-neutral-100 flex items-center justify-center mb-3">
                    <ImageIcon className="h-6 w-6 text-neutral-400" />
                  </div>
                  <p className="text-sm font-medium text-neutral-700">Arrastra imagenes aqui</p>
                  <p className="text-xs text-neutral-500 mt-1">o hace clic para seleccionar</p>
                  <p className="text-xs text-neutral-400 mt-2">PNG, JPG hasta 5MB (max {maxImages} imagenes)</p>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Plus className="h-4 w-4 text-neutral-500" />
                  <span className="text-sm text-neutral-600">Agregar otra imagen ({value.length}/{maxImages})</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <input ref={inputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />

      {error && <p className="text-sm text-red-600">{error}</p>}
      
      {value.length > 1 && (
        <p className="text-xs text-neutral-500">
          Hace clic en una miniatura para convertirla en imagen principal
        </p>
      )}
    </div>
  )
}
