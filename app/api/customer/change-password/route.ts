import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import { rateLimit } from "@/lib/utils/rate-limit"
import { getCustomerBySession, getCustomerByEmail, verifyPassword, updateCustomerPassword } from "@/lib/services/customers"

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

    const subdomainLower = String(subdomain).toLowerCase()

    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"
    const { success, resetIn } = rateLimit(`customer_changepw_${ip}_${subdomainLower}`)
    if (!success) {
      const minutesLeft = Math.ceil(resetIn / 60000)
      return NextResponse.json({ error: `Demasiados intentos. Intentá de nuevo en ${minutesLeft} minutos.` }, { status: 429 })
    }

    const { data: store } = await supabase.from("stores").select("id").ilike("subdomain", subdomainLower).single()
    if (!store) return NextResponse.json({ error: "Tienda no encontrada" }, { status: 404 })

    const cookieStore = await cookies()
    const token = cookieStore.get(`customer_${subdomainLower}`)?.value
    const session = token ? await getCustomerBySession(token, store.id) : null
    if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

    const customer = await getCustomerByEmail(store.id, session.email)
    if (!customer || !(await verifyPassword(currentPassword, customer.password_hash))) {
      return NextResponse.json({ error: "La contraseña actual no es correcta" }, { status: 401 })
    }

    const ok = await updateCustomerPassword(customer.id, newPassword)
    if (!ok) return NextResponse.json({ error: "No se pudo cambiar la contraseña" }, { status: 500 })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Customer change-password error:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
