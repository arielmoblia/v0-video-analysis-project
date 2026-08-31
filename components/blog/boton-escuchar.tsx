"use client"

import { useEffect, useState } from "react"
import { Volume2, Square } from "lucide-react"

// Lee en voz alta el cuerpo del artículo (solo párrafos y listas, no títulos ni subtítulos)
// usando la síntesis de voz del navegador. No depende de ningún servicio pago.
export function BotonEscuchar({ contenidoId }: { contenidoId: string }) {
  const [leyendo, setLeyendo] = useState(false)
  const [disponible, setDisponible] = useState(false)

  useEffect(() => {
    setDisponible(typeof window !== "undefined" && "speechSynthesis" in window)
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  function elegirVozEspanol() {
    const voces = window.speechSynthesis.getVoices()
    return (
      voces.find((v) => v.lang === "es-AR") ||
      voces.find((v) => v.lang?.startsWith("es")) ||
      null
    )
  }

  function alternarLectura() {
    if (!disponible) return

    if (leyendo) {
      window.speechSynthesis.cancel()
      setLeyendo(false)
      return
    }

    const contenedor = document.getElementById(contenidoId)
    if (!contenedor) return

    const texto = Array.from(contenedor.querySelectorAll("p, li"))
      .map((el) => el.textContent?.trim())
      .filter(Boolean)
      .join(". ")

    if (!texto) return

    const utterance = new SpeechSynthesisUtterance(texto)
    const voz = elegirVozEspanol()
    if (voz) utterance.voice = voz
    utterance.lang = voz?.lang || "es-AR"
    utterance.rate = 1
    utterance.onend = () => setLeyendo(false)
    utterance.onerror = () => setLeyendo(false)

    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utterance)
    setLeyendo(true)
  }

  if (!disponible) return null

  return (
    <button
      onClick={alternarLectura}
      className="flex items-center gap-1.5 text-orange-700 hover:text-orange-900 text-sm font-medium"
      title={leyendo ? "Detener lectura" : "Escuchar el artículo"}
    >
      {leyendo ? <Square className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      {leyendo ? "Detener" : "Escuchar"}
    </button>
  )
}
