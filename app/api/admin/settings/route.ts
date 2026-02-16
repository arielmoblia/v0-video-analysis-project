import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      storeId,
      banner_image,
      banner_title,
      banner_subtitle,
      top_bar_enabled,
      top_bar_text,
      social_instagram,
      social_facebook,
      social_twitter,
      social_tiktok,
      social_whatsapp,
      footer_subtitle,
    } = body

    if (!storeId) {
      return NextResponse.json({ error: "Store ID requerido" }, { status: 400 })
    }

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    const { data, error } = await supabase
      .from("stores")
      .update({
        banner_image,
        banner_title,
        banner_subtitle,
        top_bar_enabled,
        top_bar_text,
        social_instagram,
        social_facebook,
        social_twitter,
        social_tiktok,
        social_whatsapp,
        footer_subtitle,
      })
      .eq("id", storeId)
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: "No se encontró la tienda" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
