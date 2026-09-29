import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

// Tiendas template / infraestructura que nunca se pueden borrar por acá,
// igual que en /api/super-admin/stores
const PROTECTED_SUBDOMAINS = ["perfumes", "ropa", "zapatos", "electronicos", "base", "pruebas", "template", "arielmobilia"]

export async function POST(request: NextRequest) {
  try {
    const { subdomain, password } = await request.json()

    if (!subdomain || !password) {
      return NextResponse.json({ error: "Faltan datos" }, { status: 400 })
    }

    const subdomainLower = subdomain.toLowerCase()

    // Solo el dueño de ESTA tienda (con su cookie de sesión) puede darla de baja
    const cookieStore = await cookies()
    const isAuthenticated = cookieStore.get(`admin_${subdomainLower}`)?.value === "true"
    if (!isAuthenticated) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    if (PROTECTED_SUBDOMAINS.includes(subdomainLower)) {
      return NextResponse.json({ error: "Esta tienda no se puede dar de baja" }, { status: 403 })
    }

    const { data: store, error } = await supabase
      .from("stores")
      .select("id, admin_password")
      .ilike("subdomain", subdomainLower)
      .single()

    if (error || !store) {
      return NextResponse.json({ error: "Tienda no encontrada" }, { status: 404 })
    }

    if (store.admin_password !== password) {
      return NextResponse.json({ error: "La contraseña no es correcta" }, { status: 401 })
    }

    // Borrado real y definitivo: el cascade de la base borra productos,
    // pedidos, categorías y todo lo asociado a esta tienda.
    const { error: deleteError } = await supabase.from("stores").delete().eq("id", store.id)

    if (deleteError) {
      return NextResponse.json({ error: "No se pudo dar de baja la tienda" }, { status: 500 })
    }

    const response = NextResponse.json({ success: true })
    response.cookies.set(`admin_${subdomainLower}`, "", { maxAge: 0, path: "/" })
    return response
  } catch (error) {
    console.error("Delete account error:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
