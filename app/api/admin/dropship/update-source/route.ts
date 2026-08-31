import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    const { storeId, sourceUrl } = await request.json()

    if (!storeId) {
      return NextResponse.json({ success: false, error: "Falta storeId" }, { status: 400 })
    }

    const cleanUrl = typeof sourceUrl === "string" ? sourceUrl.trim() : ""

    if (!cleanUrl) {
      return NextResponse.json({ success: false, error: "Falta la URL de la tienda madre" }, { status: 400 })
    }

    const { error } = await supabase
      .from("stores")
      .update({ source_url: cleanUrl })
      .eq("id", storeId)

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, sourceUrl: cleanUrl })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
