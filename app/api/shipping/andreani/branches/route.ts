import { NextRequest, NextResponse } from "next/server"

// API de Andreani para obtener sucursales
const ANDREANI_BRANCHES_URL = "https://external-services.api.flexipaas.com/woo/seguridad/sucursales/"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const codigoPostal = searchParams.get("cp")
    const provincia = searchParams.get("provincia")

    // Construir query params
    const params = new URLSearchParams()
    if (codigoPostal) params.append("codigoPostal", codigoPostal)
    if (provincia) params.append("provincia", provincia)

    // Llamar a la API de Andreani
    const response = await fetch(`${ANDREANI_BRANCHES_URL}?${params.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      console.error("[v0] Error Andreani Sucursales API:", response.status)
      return NextResponse.json({ 
        error: "Error al consultar sucursales",
      }, { status: response.status })
    }

    const data = await response.json()

    return NextResponse.json({
      success: true,
      branches: data,
    })

  } catch (error) {
    console.error("[v0] Error obteniendo sucursales Andreani:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
