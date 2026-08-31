export const dynamic = "force-dynamic"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
const BUCKET = "store-legal-docs"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const isAuthenticated = cookieStore.get("super_admin")?.value === "true"

    if (!isAuthenticated) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401, headers: { "Cache-Control": "no-store" } })
    }

    const { data: consents, error } = await supabase
      .from("store_minor_consent")
      .select("id, store_id, menor_nombre, menor_fecha_nacimiento, menor_dni, adulto_nombre, adulto_dni, adulto_relacion, adulto_email, adulto_telefono, created_at, pdf_path, stores(subdomain, site_title)")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching minor consents:", error)
      return NextResponse.json({ error: "Error al obtener autorizaciones" }, { status: 500, headers: { "Cache-Control": "no-store" } })
    }

    const withUrls = await Promise.all(
      (consents || []).map(async (c: any) => {
        const { data: signed } = await supabase.storage.from(BUCKET).createSignedUrl(c.pdf_path, 3600)
        return { ...c, signedUrl: signed?.signedUrl || null }
      })
    )

    return NextResponse.json({ consents: withUrls }, { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Error del servidor" }, { status: 500, headers: { "Cache-Control": "no-store" } })
  }
}
