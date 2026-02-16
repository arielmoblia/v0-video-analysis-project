import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    // Verificar autenticacion del super admin
    const cookieStore = await cookies()
    const authCookie = cookieStore.get("super_admin_auth")
    
    if (!authCookie || authCookie.value !== "true") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Obtener tiendas borradas
    const { data: stores, error } = await supabase
      .from("deleted_stores")
      .select("*")
      .order("deleted_at", { ascending: false })

    if (error) {
      console.error("Error fetching deleted stores:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ stores: stores || [] })
  } catch (error) {
    console.error("Error in deleted-stores API:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
