import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET() {
  try {
    const { data: settings, error } = await supabase
      .from("platform_settings")
      .select("key, value")
      .in("key", ["platform_marketing_pixels", "platform_marketing_seo", "platform_marketing_payments"])

    if (error) {
      console.error("[v0] Supabase error:", error)
    }
    console.log("[v0] Raw settings from DB:", settings)

    const result: Record<string, unknown> = {}
    for (const setting of settings || []) {
      if (setting.key === "platform_marketing_pixels") {
        result.pixels = setting.value
      } else if (setting.key === "platform_marketing_seo") {
        result.seo = setting.value
      } else if (setting.key === "platform_marketing_payments") {
        result.payments = setting.value
      }
    }

    console.log("[v0] Returning result:", result)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching platform marketing:", error)
    return NextResponse.json({ error: "Error fetching settings" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, section, data } = body
    console.log("[v0] POST received:", { type, section, data })
    
    // Soportar ambos formatos: "type" (nuevo) o "section" (viejo)
    const sectionKey = type || section
    let key = "platform_marketing_seo"
    if (sectionKey === "pixels") {
      key = "platform_marketing_pixels"
    } else if (sectionKey === "payments") {
      key = "platform_marketing_payments"
    }
    console.log("[v0] Using key:", key)

    // Obtener datos existentes para hacer merge
    const { data: existing, error: fetchError } = await supabase
      .from("platform_settings")
      .select("value")
      .eq("key", key)
      .single()

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("[v0] Error fetching existing:", fetchError)
    }
    console.log("[v0] Existing data:", existing?.value)

    // Merge de datos existentes con nuevos
    const mergedData = {
      ...(existing?.value || {}),
      ...data
    }
    console.log("[v0] Merged data to save:", mergedData)

    const { error: upsertError } = await supabase.from("platform_settings").upsert(
      {
        key,
        value: mergedData,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "key" }
    )

    if (upsertError) {
      console.error("[v0] Upsert error:", upsertError)
      return NextResponse.json({ error: upsertError.message }, { status: 500 })
    }

    console.log("[v0] Saved successfully!")
    return NextResponse.json({ success: true, saved: mergedData })
  } catch (error) {
    console.error("Error saving platform marketing:", error)
    return NextResponse.json({ error: "Error saving settings" }, { status: 500 })
  }
}
