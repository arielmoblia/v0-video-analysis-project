import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { deleteSession } from "@/lib/services/customers"

export async function POST(request: NextRequest) {
  try {
    const { subdomain } = await request.json()
    if (!subdomain) return NextResponse.json({ error: "Falta subdomain" }, { status: 400 })

    const subdomainLower = String(subdomain).toLowerCase()
    const cookieStore = await cookies()
    const token = cookieStore.get(`customer_${subdomainLower}`)?.value

    if (token) await deleteSession(token)

    cookieStore.set(`customer_${subdomainLower}`, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Customer logout error:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
