import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const storeId = searchParams.get("storeId")

  if (!storeId) {
    return NextResponse.json({ error: "storeId is required" }, { status: 400 })
  }

  const { data, error } = await supabase
    .from("stores")
    .select("marketing_settings")
    .eq("id", storeId)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const settings = data?.marketing_settings || {}

  return NextResponse.json({
    cartRecovery: settings.cartRecovery || {
      enabled: false,
      delay_hours: 2,
      email_subject: "¡Olvidaste algo en tu carrito!",
      email_message: "Hola {nombre}, notamos que dejaste productos en tu carrito. ¡Completá tu compra ahora!"
    },
    pixels: settings.pixels || {
      meta_pixel_id: "",
      tiktok_pixel_id: "",
      google_analytics_id: ""
    },
    crossSelling: settings.crossSelling || {
      enabled: false,
      max_products: 4
    }
  })
}

export async function POST(request: Request) {
  const body = await request.json()
  const { storeId, section, data } = body

  if (!storeId || !section || !data) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  

  // Get current settings
  const { data: store } = await supabase
    .from("stores")
    .select("marketing_settings")
    .eq("id", storeId)
    .single()

  const currentSettings = store?.marketing_settings || {}
  
  // Update the specific section
  const updatedSettings = {
    ...currentSettings,
    [section]: data
  }

  const { error } = await supabase
    .from("stores")
    .update({ marketing_settings: updatedSettings })
    .eq("id", storeId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
