import { createClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No se proporcionó archivo" }, { status: 400 })
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Solo se permiten imágenes" }, { status: 400 })
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "La imagen no puede superar 5MB" }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    console.log("[upload] URL:", supabaseUrl)
    console.log("[upload] Key present:", !!supabaseKey)

    const supabase = createClient(supabaseUrl!, supabaseKey!)

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const ext = file.name.split(".").pop() || "jpg"
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    console.log("[upload] Uploading:", filename, "size:", buffer.length)

    const { error, data } = await supabase.storage
      .from("store-images")
      .upload(filename, buffer, { contentType: file.type, upsert: false })

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