"use client"

import { useState, useEffect } from "react"
import { Loader2, MapPin, Clock, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EnviameloPoint {
  id: number
  name: string
  address: string
  location: string
  province: string
  postalCode: string
  lat: number
  lng: number
  schedules: { day: number; start: string; end: string }[]
}

interface Props {
  storeId: string
  postalCode: string
  onSelect: (point: EnviameloPoint) => void
  onClose: () => void
  selectedPoint?: EnviameloPoint | null
}

const DAYS = ["", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]

function formatSchedule(schedules: { day: number; start: string; end: string }[]) {
  const active = schedules.filter(s => s.start !== "00:00:00")
  if (active.length === 0) return "Consultar horarios"
  const days = active.map(s => DAYS[s.day]).join(", ")
  const first = active[0]
  return `${days} ${first.start.slice(0, 5)} a ${first.end.slice(0, 5)}hs`
}

export function EnviameloPointsPicker({ storeId, postalCode, onSelect, onClose, selectedPoint }: Props) {
  const [points, setPoints] = useState<EnviameloPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [province, setProvince] = useState("")

  useEffect(() => {
    const fetchPoints = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/shipping/enviamelo/points?storeId=${storeId}&postalCode=${postalCode}`)
        const data = await res.json()
        if (data.points) {
          setPoints(data.points)
          setProvince(data.province)
        } else {
          setError("No se encontraron puntos de retiro")
        }
      } catch {
        setError("Error al cargar los puntos")
      } finally {
        setLoading(false)
      }
    }
    fetchPoints()
  }, [storeId, postalCode])

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-lg">Elegí tu punto de retiro</h3>
              {province && <p className="text-sm text-neutral-500">Puntos disponibles en {province}</p>}
            </div>
            <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600 text-xl font-light">✕</button>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-neutral-400 mr-2" />
              <span className="text-sm text-neutral-500">Buscando puntos cercanos...</span>
            </div>
          )}

          {error && (
            <div className="py-6 text-center text-sm text-red-600">{error}</div>
          )}

          {!loading && !error && points.length === 0 && (
            <div className="py-6 text-center text-sm text-neutral-500">
              No hay puntos de retiro disponibles para este código postal.
            </div>
          )}

          {!loading && points.length > 0 && (
            <div className="space-y-3">
              {points.map((point) => {
                const isSelected = selectedPoint?.id === point.id
                return (
                  <div
                    key={point.id}
                    onClick={() => onSelect(point)}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      isSelected
                        ? "border-black bg-black/5"
                        : "border-neutral-200 hover:border-neutral-400"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <MapPin className="h-4 w-4 text-neutral-500 shrink-0" />
                          <span className="font-medium text-sm">{point.name}</span>
                        </div>
                        <p className="text-sm text-neutral-700 ml-6">{point.address} — {point.location}</p>
                        <div className="flex items-center gap-1 mt-2 ml-6">
                          <Clock className="h-3 w-3 text-neutral-400" />
                          <span className="text-xs text-neutral-500">{formatSchedule(point.schedules)}</span>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="bg-black rounded-full p-1 shrink-0">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {!loading && points.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <Button
                className="w-full bg-black hover:bg-gray-800 text-white"
                onClick={onClose}
                disabled={!selectedPoint}
              >
                {selectedPoint ? `Confirmar — ${selectedPoint.address}` : "Elegí un punto"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
