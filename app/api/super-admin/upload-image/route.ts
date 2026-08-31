import { NextResponse } from "next/server"
import { put } from "@vercel/blob"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    
    if (!file) {
      return NextResponse.json({ error: "No se envio archivo" }, { status: 400, headers: { "Cache-Control": "no-store" } })
    }

    // Validar tipo de archivo
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Solo se permiten imagenes" }, { status: 400, headers: { "Cache-Control": "no-store" } })
    }

    // Validar tamano (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "La imagen no puede superar 5MB" }, { status: 400, headers: { "Cache-Control": "no-store" } })
    }

    const blob = await put(`promo-mail/${Date.now()}-${file.name}`, file, {
      access: "public",
    })

    return NextResponse.json({ url: blob.url }, { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } })
  } catch (error: any) {
    console.error("Error subiendo imagen:", error)
    return NextResponse.json({ error: error.message || "Error subiendo imagen" }, { status: 500, headers: { "Cache-Control": "no-store" } })
  }
}
