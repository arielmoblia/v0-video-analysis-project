import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// API de Andreani para cotizar envíos
const ANDREANI_API_URL = "https://external-services.api.flexipaas.com/woo/seguridad/cotizaciones/"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      storeId, 
      cpOrigen,      // Código postal origen (tienda)
      cpDestino,     // Código postal destino (cliente)
      pesoTotal,     // Peso en gramos
      volumenTotal,  // Volumen en cm3 (alto x ancho x largo)
      valorDeclarado // Valor del producto para seguro
    } = body

    if (!storeId || !cpDestino) {
      return NextResponse.json({ error: "Faltan datos requeridos" }, { status: 400 })
    }

    const supabase = await createClient()

    // Obtener credenciales de Andreani de la tienda
    const { data: shipping, error: shippingError } = await supabase
      .from("shipping_methods")
      .select("andreani_user, andreani_password, andreani_account, andreani_contract, origin_postal_code")
      .eq("store_id", storeId)
      .single()

    if (shippingError || !shipping) {
      return NextResponse.json({ error: "Configuración de envío no encontrada" }, { status: 404 })
    }

    if (!shipping.andreani_user || !shipping.andreani_password || !shipping.andreani_account) {
      return NextResponse.json({ error: "Credenciales de Andreani no configuradas" }, { status: 400 })
    }

    // Preparar request a Andreani
    const params = new URLSearchParams({
      cp_origen: cpOrigen || shipping.origin_postal_code || "1000",
      cp_destino: cpDestino,
      peso_total: String(pesoTotal || 1000), // Default 1kg
      volumen_total: String(volumenTotal || 1000), // Default 1000cm3
      valor_declarado: String(valorDeclarado || 0),
      api_user: shipping.andreani_user,
      api_password: shipping.andreani_password,
      api_nrocuenta: shipping.andreani_account,
      operativa: shipping.andreani_contract || "",
      api_key: "",
      api_confirmarretiro: "",
    })

    // Llamar a la API de Andreani
    const response = await fetch(`${ANDREANI_API_URL}?${params.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      console.error("[v0] Error Andreani API:", response.status, response.statusText)
      return NextResponse.json({ 
        error: "Error al consultar Andreani",
        details: response.statusText 
      }, { status: response.status })
    }

    const data = await response.json()

    // Retornar cotización formateada
    return NextResponse.json({
      success: true,
      quote: {
        carrier: "Andreani",
        priceWithoutTax: data.tarifaSinIva?.total || 0,
        priceWithTax: data.tarifaConIva?.total || 0,
        estimatedDays: "2-5 días hábiles",
        weightCharged: data.pesoAforado || pesoTotal,
      },
      raw: data,
    })

  } catch (error) {
    console.error("[v0] Error en cotización Andreani:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
