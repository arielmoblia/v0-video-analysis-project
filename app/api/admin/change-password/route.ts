import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import { rateLimit } from "@/lib/utils/rate-limit"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { subdomain, currentPassword, newPassword } = await request.json()

    if (!subdomain || !currentPassword || !newPassword) {
      return NextResponse.json({ error: "Faltan datos" }, { status: 400 })
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: "La nueva contraseña tiene que tener al menos 6 caracteres" }, { status: 400 })
    }

    const subdomainLower = subdomain.toLowerCase()

    // Solo el dueño de ESTA tienda (con su cookie de sesión) puede cambiar su contraseña
    const cookieStore = await cookies()
    const isAuthenticated = cookieStore.get(`admin_${subdomainLower}`)?.value === "true"
    if (!isAuthenticated) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"
    const { success, resetIn } = rateLimit(`changepw_${ip}_${subdomainLower}`)
    if (!success) {
      const minutesLeft = Math.ceil(resetIn / 60000)
      return NextResponse.json({ error: `Demasiados intentos. Intentá de nuevo en ${minutesLeft} minutos.` }, { status: 429 })
    }

    const { data: store, error } = await supabase
      .from("stores")
      .select("id, admin_password")
      .ilike("subdomain", subdomainLower)
      .single()

    if (error || !store) {
      return NextResponse.json({ error: "Tienda no encontrada" }, { status: 404 })
    }

    if (store.admin_password !== currentPassword) {
      return NextResponse.json({ error: "La contraseña actual no es correcta" }, { status: 401 })
    }

    const { error: updateError } = await supabase
      .from("stores")
      .update({ admin_password: newPassword })
      .eq("id", store.id)

    if (updateError) {
      return NextResponse.json({ error: "No se pudo cambiar la contraseña" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Change password error:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
