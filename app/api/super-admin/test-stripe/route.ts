import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { secret_key } = await request.json()

    if (!secret_key) {
      return NextResponse.json({ error: "Secret key requerida" }, { status: 400 })
    }

    // Probar la conexión con Stripe
    const response = await fetch("https://api.stripe.com/v1/balance", {
      headers: {
        Authorization: `Bearer ${secret_key}`,
      },
    })

    if (response.ok) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: "Clave inválida" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error testing Stripe:", error)
    return NextResponse.json({ error: "Error de conexión" }, { status: 500 })
  }
}
