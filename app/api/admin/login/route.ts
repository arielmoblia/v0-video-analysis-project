import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import { rateLimit, resetRateLimit } from "@/lib/utils/rate-limit"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { subdomain, username, password } = await request.json()

    if (!subdomain || !username || !password) {
      return NextResponse.json({ error: "Faltan datos" }, { status: 400 })
    }

    const subdomainLower = subdomain.toLowerCase()
    
    // Rate limiting - prevenir fuerza bruta
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"
    const rateLimitKey = `login_${ip}_${subdomainLower}`
    const { success, remaining, resetIn } = rateLimit(rateLimitKey)
    
    if (!success) {
      const minutesLeft = Math.ceil(resetIn / 60000)
      return NextResponse.json({ 
        error: `Demasiados intentos. Intentá de nuevo en ${minutesLeft} minutos.` 
      }, { status: 429 })
    }

    const { data: store, error } = await supabase.from("stores").select("*").ilike("subdomain", subdomainLower).single()

    if (error || !store) {
      return NextResponse.json({ error: "Tienda no encontrada", remaining }, { status: 404 })
    }

    // Verificar credenciales
    if (store.username !== username || store.admin_password !== password) {
      return NextResponse.json({ error: "Credenciales incorrectas", remaining }, { status: 401 })
    }
    
    // Login exitoso - resetear rate limit
    resetRateLimit(rateLimitKey)

    // Registrar ultimo login al admin
    await supabase.from("stores").update({ last_admin_login_at: new Date().toISOString() }).eq("id", store.id)

    const cookieStore = await cookies()
    cookieStore.set(`admin_${subdomainLower}`, "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 días
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
