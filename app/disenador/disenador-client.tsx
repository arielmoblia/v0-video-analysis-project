"use client"

import { useEffect, useRef, useState } from "react"

type ElementBase = {
  id: string
  x: number
  y: number
  width: number
  height: number
}

type TextElement = ElementBase & {
  type: "text"
  text: string
  color: string
  fontSize: number
}

type ImageElement = ElementBase & {
  type: "image"
  src: string
}

type DesignElement = TextElement | ImageElement

const CANVAS_W = 900
const CANVAS_H = 1100

// Área de estampado (pecho de la remera) en coordenadas del canvas
const PRINT_AREA = { x: 300, y: 260, width: 300, height: 380 }

const SHIRT_COLORS = [
  { name: "Blanco", hex: "#f5f5f5" },
  { name: "Negro", hex: "#1a1a1a" },
  { name: "Gris", hex: "#8c8c8c" },
  { name: "Rojo", hex: "#c0392b" },
  { name: "Azul", hex: "#2c5aa0" },
  { name: "Verde", hex: "#2e7d32" },
  { name: "Amarillo", hex: "#f1c40f" },
  { name: "Rosa", hex: "#e91e8c" },
]

const HANDLE_SIZE = 16

function drawShirt(ctx: CanvasRenderingContext2D, color: string) {
  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H)

  // Fondo
  ctx.fillStyle = "#eef0f3"
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)

  // Silueta simple de remera (cuerpo + mangas + cuello)
  ctx.save()
  ctx.beginPath()
  const cx = CANVAS_W / 2
  ctx.moveTo(cx - 90, 60) // hombro izq
  ctx.lineTo(cx - 220, 150) // manga izq punta
  ctx.lineTo(cx - 170, 260) // axila izq
  ctx.lineTo(cx - 170, 980) // bajo izq
  ctx.lineTo(cx + 170, 980) // bajo der
  ctx.lineTo(cx + 170, 260) // axila der
  ctx.lineTo(cx + 220, 150) // manga der punta
  ctx.lineTo(cx + 90, 60) // hombro der
  // cuello
  ctx.quadraticCurveTo(cx, 110, cx - 90, 60)
  ctx.closePath()
  ctx.fillStyle = color
  ctx.fill()
  ctx.lineWidth = 3
  ctx.strokeStyle = "rgba(0,0,0,0.15)"
  ctx.stroke()

  // sombreado simple para dar volumen
  const grad = ctx.createLinearGradient(cx - 170, 0, cx + 170, 0)
  grad.addColorStop(0, "rgba(0,0,0,0.10)")
  grad.addColorStop(0.5, "rgba(255,255,255,0.08)")
  grad.addColorStop(1, "rgba(0,0,0,0.10)")
  ctx.fillStyle = grad
  ctx.fill()
  ctx.restore()
}

function drawPrintAreaGuide(ctx: CanvasRenderingContext2D) {
  ctx.save()
  ctx.strokeStyle = "rgba(98,22,47,0.5)"
  ctx.setLineDash([8, 6])
  ctx.lineWidth = 2
  ctx.strokeRect(PRINT_AREA.x, PRINT_AREA.y, PRINT_AREA.width, PRINT_AREA.height)
  ctx.restore()
}

export default function DisenadorClient() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageCache = useRef<Record<string, HTMLImageElement>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [shirtColor, setShirtColor] = useState(SHIRT_COLORS[0].hex)
  const [elements, setElements] = useState<DesignElement[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const dragState = useRef<{ id: string; mode: "move" | "resize"; offsetX: number; offsetY: number; startW: number; startH: number } | null>(null)

  const selected = elements.find((el) => el.id === selectedId) || null

  const redraw = (hideGuide = false) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    drawShirt(ctx, shirtColor)
    if (!hideGuide) drawPrintAreaGuide(ctx)

    for (const el of elements) {
      ctx.save()
      if (el.type === "text") {
        ctx.fillStyle = el.color
        ctx.font = `bold ${el.fontSize}px sans-serif`
        ctx.textBaseline = "top"
        ctx.fillText(el.text, el.x, el.y, el.width)
      } else {
        const img = imageCache.current[el.src]
        if (img && img.complete) {
          ctx.drawImage(img, el.x, el.y, el.width, el.height)
        }
      }
      if (!hideGuide && el.id === selectedId) {
        ctx.strokeStyle = "#62162f"
        ctx.lineWidth = 2
        ctx.setLineDash([4, 4])
        ctx.strokeRect(el.x, el.y, el.width, el.height)
        ctx.setLineDash([])
        ctx.fillStyle = "#62162f"
        ctx.fillRect(el.x + el.width - HANDLE_SIZE / 2, el.y + el.height - HANDLE_SIZE / 2, HANDLE_SIZE, HANDLE_SIZE)
      }
      ctx.restore()
    }
  }

  useEffect(() => {
    redraw()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shirtColor, elements, selectedId])

  const canvasCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!
    const rect = canvas.getBoundingClientRect()
    const scaleX = CANVAS_W / rect.width
    const scaleY = CANVAS_H / rect.height
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY }
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = canvasCoords(e)
    // buscar de arriba hacia abajo (último dibujado = más arriba)
    for (let i = elements.length - 1; i >= 0; i--) {
      const el = elements[i]
      const handleX = el.x + el.width - HANDLE_SIZE / 2
      const handleY = el.y + el.height - HANDLE_SIZE / 2
      if (el.id === selectedId && x >= handleX && x <= handleX + HANDLE_SIZE && y >= handleY && y <= handleY + HANDLE_SIZE) {
        dragState.current = { id: el.id, mode: "resize", offsetX: 0, offsetY: 0, startW: el.width, startH: el.height }
        return
      }
      if (x >= el.x && x <= el.x + el.width && y >= el.y && y <= el.y + el.height) {
        setSelectedId(el.id)
        dragState.current = { id: el.id, mode: "move", offsetX: x - el.x, offsetY: y - el.y, startW: el.width, startH: el.height }
        return
      }
    }
    setSelectedId(null)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const drag = dragState.current
    if (!drag) return
    const { x, y } = canvasCoords(e)
    setElements((prev) =>
      prev.map((el) => {
        if (el.id !== drag.id) return el
        if (drag.mode === "move") {
          return { ...el, x: x - drag.offsetX, y: y - drag.offsetY }
        }
        const newW = Math.max(20, x - el.x)
        const newH = Math.max(20, y - el.y)
        return { ...el, width: newW, height: newH }
      }),
    )
  }

  const handleMouseUp = () => {
    dragState.current = null
  }

  const addText = () => {
    const text = window.prompt("Texto a agregar:")
    if (!text) return
    const id = `text-${Date.now()}`
    const el: TextElement = {
      id,
      type: "text",
      text,
      color: "#000000",
      fontSize: 40,
      x: PRINT_AREA.x + 20,
      y: PRINT_AREA.y + PRINT_AREA.height / 2 - 20,
      width: PRINT_AREA.width - 40,
      height: 50,
    }
    setElements((prev) => [...prev, el])
    setSelectedId(id)
  }

  const addImage = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      const src = reader.result as string
      const img = new Image()
      img.onload = () => {
        imageCache.current[src] = img
        const maxW = PRINT_AREA.width - 40
        const maxH = PRINT_AREA.height - 40
        const ratio = Math.min(maxW / img.width, maxH / img.height, 1)
        const w = img.width * ratio
        const h = img.height * ratio
        const id = `img-${Date.now()}`
        const el: ImageElement = {
          id,
          type: "image",
          src,
          x: PRINT_AREA.x + (PRINT_AREA.width - w) / 2,
          y: PRINT_AREA.y + (PRINT_AREA.height - h) / 2,
          width: w,
          height: h,
        }
        setElements((prev) => [...prev, el])
        setSelectedId(id)
      }
      img.src = src
    }
    reader.readAsDataURL(file)
  }

  const updateSelected = (patch: Partial<TextElement>) => {
    setElements((prev) => prev.map((el) => (el.id === selectedId ? { ...el, ...patch } : el)))
  }

  const deleteSelected = () => {
    if (!selectedId) return
    setElements((prev) => prev.filter((el) => el.id !== selectedId))
    setSelectedId(null)
  }

  const downloadPNG = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    redraw(true) // sin guía punteada para la descarga
    const dataUrl = canvas.toDataURL("image/png")
    redraw(false) // restaurar guía en pantalla
    const a = document.createElement("a")
    a.href = dataUrl
    a.download = `diseno-remera-${Date.now()}.png`
    a.click()
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f8f4f6", padding: "24px", fontFamily: "sans-serif" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#62162f", marginBottom: 4 }}>
          Diseñador de remeras — prueba
        </h1>
        <p style={{ color: "#666", marginBottom: 20, fontSize: 14 }}>
          Herramienta en revisión. Elegí color, agregá texto o imagen, arrastrá para mover y usá el cuadradito de la
          esquina para cambiar tamaño. Al descargar se genera un PNG de {CANVAS_W}x{CANVAS_H}px sin la guía punteada.
        </p>

        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          <canvas
            ref={canvasRef}
            width={CANVAS_W}
            height={CANVAS_H}
            style={{ width: 450, height: 550, background: "#fff", border: "1px solid #ddd", borderRadius: 8, cursor: "pointer" }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />

          <div style={{ flex: 1, minWidth: 260 }}>
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Color de remera</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {SHIRT_COLORS.map((c) => (
                  <button
                    key={c.hex}
                    onClick={() => setShirtColor(c.hex)}
                    title={c.name}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: c.hex,
                      border: shirtColor === c.hex ? "3px solid #62162f" : "1px solid #ccc",
                      cursor: "pointer",
                    }}
                  />
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
              <button onClick={addText} style={btnStyle}>
                + Agregar texto
              </button>
              <button onClick={() => fileInputRef.current?.click()} style={btnStyle}>
                + Subir imagen
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) addImage(file)
                  e.target.value = ""
                }}
              />
            </div>

            {selected && (
              <div style={{ background: "#fff", border: "1px solid #eee", borderRadius: 8, padding: 16, marginBottom: 20 }}>
                <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Elemento seleccionado</p>
                {selected.type === "text" && (
                  <>
                    <label style={{ fontSize: 12, color: "#666" }}>Texto</label>
                    <input
                      value={(selected as TextElement).text}
                      onChange={(e) => updateSelected({ text: e.target.value })}
                      style={inputStyle}
                    />
                    <label style={{ fontSize: 12, color: "#666" }}>Color de texto</label>
                    <input
                      type="color"
                      value={(selected as TextElement).color}
                      onChange={(e) => updateSelected({ color: e.target.value })}
                      style={{ width: "100%", marginBottom: 10 }}
                    />
                    <label style={{ fontSize: 12, color: "#666" }}>Tamaño de fuente ({(selected as TextElement).fontSize}px)</label>
                    <input
                      type="range"
                      min={16}
                      max={100}
                      value={(selected as TextElement).fontSize}
                      onChange={(e) => updateSelected({ fontSize: Number(e.target.value) })}
                      style={{ width: "100%", marginBottom: 10 }}
                    />
                  </>
                )}
                <button onClick={deleteSelected} style={{ ...btnStyle, background: "#c0392b", color: "#fff", width: "100%" }}>
                  Eliminar elemento
                </button>
              </div>
            )}

            <button onClick={downloadPNG} style={{ ...btnStyle, background: "#62162f", color: "#fff", width: "100%", padding: "12px" }}>
              Descargar PNG ({CANVAS_W}x{CANVAS_H}px)
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const btnStyle: React.CSSProperties = {
  padding: "8px 14px",
  borderRadius: 6,
  border: "1px solid #ddd",
  background: "#fff",
  cursor: "pointer",
  fontSize: 13,
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "6px 8px",
  border: "1px solid #ddd",
  borderRadius: 6,
  marginBottom: 10,
  fontSize: 13,
}
