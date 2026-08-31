import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET() {
  try {
    const cookieStore = await cookies()
    if (cookieStore.get("super_admin")?.value !== "true") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401, headers: { "Cache-Control": "no-store" } })
    }
    const { data } = await supabase.from("geo_preguntas").select("*").order("orden")
    return NextResponse.json({ success: true, data }, { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } })
  } catch {
    return NextResponse.json({ error: "Error" }, { status: 500, headers: { "Cache-Control": "no-store" } })
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    if (cookieStore.get("super_admin")?.value !== "true") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401, headers: { "Cache-Control": "no-store" } })
    }
    const body = await request.json()
    if (body.action === "add") {
      const { data } = await supabase.from("geo_preguntas").insert({ pregunta: body.pregunta, orden: body.orden }).select().single()
      return NextResponse.json({ success: true, data }, { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } })
    }
    if (body.action === "update") {
      await supabase.from("geo_preguntas").update({ pregunta: body.pregunta }).eq("id", body.id)
      return NextResponse.json({ success: true }, { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } })
    }
    if (body.action === "delete") {
      await supabase.from("geo_preguntas").delete().eq("id", body.id)
      return NextResponse.json({ success: true }, { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } })
    }
    if (body.action === "toggle") {
      await supabase.from("geo_preguntas").update({ activa: body.activa }).eq("id", body.id)
      return NextResponse.json({ success: true }, { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } })
    }
    return NextResponse.json({ error: "Acción no válida" }, { status: 400, headers: { "Cache-Control": "no-store" } })
  } catch {
    return NextResponse.json({ error: "Error" }, { status: 500, headers: { "Cache-Control": "no-store" } })
  }
}
