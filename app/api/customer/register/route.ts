import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import { rateLimit } from "@/lib/utils/rate-limit"
import { hasStoreFeature } from "@/lib/services/stores"
import { createCustomer, createSession, getCustomerByEmail } from "@/lib/services/customers"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { subdomain, name, email, phone, password } = await request.json()

    if (!subdomain || !name || !email || !password) {
      return NextResponse.json({ error: "Faltan datos" }, { status: 400 })
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "La contraseña tiene que tener al menos 6 caracteres" }, { status: 400 })
    }

    const subdomainLower = String(subdomain).toLowerCase()

    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"
    const { success, resetIn } = rateLimit(`customer_register_${ip}`)
    if (!success) {
      const minutesLeft = Math.ceil(resetIn / 60000)
      return NextResponse.json({ error: `Demasiados intentos. Intentá de nuevo en ${minutesLeft} minutos.` }, { status: 429 })
    }

    const { data: store } = await supabase.from("stores").select("id").ilike("subdomain", subdomainLower).single()
    if (!store) {
      return NextResponse.json({ error: "Tienda no encontrada" }, { status: 404 })
    }

    if (!(await hasStoreFeature(store.id, "customer_accounts"))) {
      return NextResponse.json({ error: "Esta tienda todavía no activó cuentas de cliente" }, { status: 403 })
    }

    const existing = await getCustomerByEmail(store.id, email)
    if (existing) {
      return NextResponse.json({ error: "Ya existe una cuenta con ese email en esta tienda" }, { status: 409 })
    }

    const customer = await createCustomer(store.id, name, email, phone || null, password)
    if (!customer) {
      return NextResponse.json({ error: "No se pudo crear la cuenta" }, { status: 500 })
    }

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
    console.error("Customer register error:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
