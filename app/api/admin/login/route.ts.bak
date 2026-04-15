import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { rateLimit, resetRateLimit } from "@/lib/utils/rate-limit"

export async function POST(request: NextRequest) {
  try {
    const { subdomain, username, password } = await request.json()

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

    const supabase = await createClient()

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
