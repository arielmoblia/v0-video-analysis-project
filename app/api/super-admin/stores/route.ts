export const dynamic = "force-dynamic"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET() {
  try {
    const cookieStore = await cookies()
    const isAuthenticated = cookieStore.get("super_admin")?.value === "true"

    if (!isAuthenticated) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401, headers: { "Cache-Control": "no-store" } })
    }

    const { data: stores, error } = await supabase.from("stores").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching stores:", error)
      return NextResponse.json({ error: "Error al obtener tiendas" }, { status: 500, headers: { "Cache-Control": "no-store" } })
    }

    return NextResponse.json({ stores: stores || [] }, { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Error del servidor" }, { status: 500, headers: { "Cache-Control": "no-store" } })
  }
}

export async function DELETE(request: Request) {
  try {
    const cookieStore = await cookies()
    const isAuthenticated = cookieStore.get("super_admin")?.value === "true"

    if (!isAuthenticated) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401, headers: { "Cache-Control": "no-store" } })
    }

    const { searchParams } = new URL(request.url)
    const storeId = searchParams.get("id")

    if (!storeId) {
      return NextResponse.json({ error: "ID de tienda requerido" }, { status: 400, headers: { "Cache-Control": "no-store" } })
    }

    // Proteger solo tiendas template reales y arielmobilia (NO tiendas de clientes creadas desde templates)
    const PROTECTED_SUBDOMAINS = ["perfumes", "ropa", "zapatos", "electronicos", "base", "pruebas", "template", "arielmobilia"]
    const { data: storeToDelete } = await supabase.from("stores").select("subdomain").eq("id", storeId).single()
    if (storeToDelete && PROTECTED_SUBDOMAINS.includes(storeToDelete.subdomain)) {
      return NextResponse.json({ error: "No se puede eliminar una tienda template protegida" }, { status: 403, headers: { "Cache-Control": "no-store" } })
    }

    // Delete store (cascade will delete related data)
    const { error } = await supabase.from("stores").delete().eq("id", storeId)

    if (error) {
      console.error("Error deleting store:", error)
      return NextResponse.json({ error: "Error al borrar tienda" }, { status: 500, headers: { "Cache-Control": "no-store" } })
    }

    return NextResponse.json({ success: true }, { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Error del servidor" }, { status: 500, headers: { "Cache-Control": "no-store" } })
  }
}
