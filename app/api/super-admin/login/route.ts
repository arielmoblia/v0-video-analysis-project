import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { rateLimit, resetRateLimit } from "@/lib/rate-limit"

const SUPER_ADMIN_PASSWORD = process.env.SUPER_ADMIN_PASSWORD || "tolar2024admin"

export async function POST(request: NextRequest) {
  try {
    // Rate limiting más estricto para super admin
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"
    const rateLimitKey = `superadmin_${ip}`
    const { success, resetIn } = rateLimit(rateLimitKey)
    
    if (!success) {
      const minutesLeft = Math.ceil(resetIn / 60000)
      return NextResponse.json({ 
        error: `Demasiados intentos. Intentá de nuevo en ${minutesLeft} minutos.` 
      }, { status: 429 })
    }

    const { password } = await request.json()

    if (password !== SUPER_ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 })
    }
    
    // Login exitoso - resetear rate limit
    resetRateLimit(rateLimitKey)

    const cookieStore = await cookies()
    cookieStore.set("super_admin", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Super admin login error:", error)
    return NextResponse.json({ error: "Error al iniciar sesión" }, { status: 500 })
  }
}
