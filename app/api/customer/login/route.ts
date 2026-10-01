import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import { rateLimit, resetRateLimit } from "@/lib/utils/rate-limit"
import { getCustomerByEmail, createSession, verifyPassword } from "@/lib/services/customers"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { subdomain, email, password } = await request.json()

    if (!subdomain || !email || !password) {
      return NextResponse.json({ error: "Faltan datos" }, { status: 400 })
    }

    const subdomainLower = String(subdomain).toLowerCase()

    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"
    const rateLimitKey = `customer_login_${ip}_${subdomainLower}`
    const { success, resetIn } = rateLimit(rateLimitKey)
    if (!success) {
      const minutesLeft = Math.ceil(resetIn / 60000)
      return NextResponse.json({ error: `Demasiados intentos. Intentá de nuevo en ${minutesLeft} minutos.` }, { status: 429 })
    }

    const { data: store } = await supabase.from("stores").select("id").ilike("subdomain", subdomainLower).single()
    if (!store) {
      return NextResponse.json({ error: "Tienda no encontrada" }, { status: 404 })
    }

    const customer = await getCustomerByEmail(store.id, email)
    if (!customer || !(await verifyPassword(password, customer.password_hash))) {
      return NextResponse.json({ error: "Email o contraseña incorrectos" }, { status: 401 })
    }

    resetRateLimit(rateLimitKey)

    const token = await createSession(customer.id, store.id)
    const cookieStore = await cookies()
    cookieStore.set(`customer_${subdomainLower}`, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    })

    return NextResponse.json({ success: true, customer: { name: customer.name, email: customer.email } })
  } catch (error) {
    console.error("Customer login error:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
