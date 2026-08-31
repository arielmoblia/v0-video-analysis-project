import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

const SETTINGS_KEY = "promocion_redes_confirmaciones"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const subdomain = searchParams.get("subdomain")
  if (!subdomain) return NextResponse.json({ error: "Falta subdomain" }, { status: 400 })

  const { data: store } = await supabase
    .from("stores")
    .select("subdomain, site_title")
    .eq("subdomain", subdomain)
    .maybeSingle()
  if (!store) return NextResponse.json({ error: "No encontramos esa tienda" }, { status: 404 })

  const { data } = await supabase.from("platform_settings").select("*").eq("key", SETTINGS_KEY).maybeSingle()
  const confirmaciones = data?.value || {}
  const ya = confirmaciones[subdomain] || null

  return NextResponse.json({
    subdomain: store.subdomain,
    siteTitle: store.site_title,
    yaConfirmado: !!ya,
    fecha: ya?.fecha || null,
  }, { headers: { "Cache-Control": "no-store" } })
}

export async function POST(request: Request) {
  try {
    const { subdomain } = await request.json()
    if (!subdomain) return NextResponse.json({ error: "Falta subdomain" }, { status: 400 })

    const { data: store } = await supabase.from("stores").select("id, subdomain").eq("subdomain", subdomain).maybeSingle()
    if (!store) return NextResponse.json({ error: "No encontramos esa tienda" }, { status: 404 })

    const { data: existing } = await supabase.from("platform_settings").select("*").eq("key", SETTINGS_KEY).maybeSingle()
    const current = existing?.value || {}
    const updated = { ...current, [subdomain]: { ok: true, fecha: new Date().toISOString() } }

    const { error } = await supabase.from("platform_settings").upsert(
      { key: SETTINGS_KEY, value: updated, updated_at: new Date().toISOString() },
      { onConflict: "key" },
    )
    if (error) throw error

    return NextResponse.json({ success: true }, { headers: { "Cache-Control": "no-store" } })
  } catch (error) {
    console.error("Error guardando promocion-redes:", error)
    return NextResponse.json({ error: "Error al guardar" }, { status: 500 })
  }
}
