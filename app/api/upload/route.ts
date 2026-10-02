import { createClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"
import sharp from "sharp"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const type = (formData.get("type") as string) || "product"

    if (!file) {
      return NextResponse.json({ error: "No se proporcionó archivo" }, { status: 400 })
    }
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Solo se permiten imágenes" }, { status: 400 })
    }
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "La imagen no puede superar 10MB" }, { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    let processed: Buffer
    if (type === "banner") {
      processed = await sharp(buffer)
        .resize(1920, 1080, { fit: "inside", withoutEnlargement: true })
        .webp({ quality: 90 })
        .toBuffer()
    } else if (type === "logo") {
      processed = await sharp(buffer)
        .resize(400, 400, { fit: "inside", withoutEnlargement: true })
        .webp({ quality: 90 })
        .toBuffer()
    } else if (type === "qr") {
      // Códigos QR (ej. Data Fiscal de AFIP): menos compresión, para que no pierdan nitidez y sigan siendo escaneables
      processed = await sharp(buffer)
        .resize(500, 500, { fit: "inside", withoutEnlargement: true })
        .webp({ quality: 95 })
        .toBuffer()
    } else {
      processed = await sharp(buffer)
        .resize(800, 1000, { fit: "inside", withoutEnlargement: true })
        .webp({ quality: 90 })
        .toBuffer()
    }

    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.webp`
    console.log("[upload] Original:", buffer.length, "Comprimido:", processed.length)

    const { error } = await supabase.storage
      .from("store-images")
      .upload(filename, processed, { contentType: "image/webp", upsert: false })

    if (error) {
      console.error("[upload] Supabase error:", JSON.stringify(error))
      return NextResponse.json({ error: "Error al subir la imagen", detail: error.message }, { status: 500 })
    }

    const { data: urlData } = supabase.storage.from("store-images").getPublicUrl(filename)
    console.log("[upload] Success:", urlData.publicUrl)
    return NextResponse.json({ url: urlData.publicUrl })
  } catch (error) {
    console.error("[upload] Exception:", error)
    return NextResponse.json({ error: "Error al subir la imagen", detail: String(error) }, { status: 500 })
  }
}
