import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { createMobbexClient } from "@/lib/payments/mobbex"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { storeId, orderId, items, customer, returnUrl } = body

    // Obtener credenciales de Mobbex de la tienda
    const { data: store } = await supabase
      .from("stores")
      .select("mobbex_api_key, mobbex_access_token, site_title, subdomain")
      .eq("id", storeId)
      .single()

    if (!store?.mobbex_api_key || !store?.mobbex_access_token) {
      return NextResponse.json(
        { error: "Mobbex no esta configurado para esta tienda" },
        { status: 400 }
      )
    }

    const mobbex = createMobbexClient(store.mobbex_api_key, store.mobbex_access_token)

    // Calcular total
    const total = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0)

    // Crear checkout en Mobbex
    const checkout = await mobbex.createCheckout({
      total,
      currency: "ARS",
      reference: orderId,
      description: `Compra en ${store.site_title}`,
      items: items.map((item: any) => ({
        description: item.name,
        quantity: item.quantity,
        total: item.price * item.quantity,
        image: item.image || undefined,
      })),
      customer: customer ? {
        email: customer.email,
        name: customer.name,
        identification: customer.dni || "",
        phone: customer.phone || undefined,
      } : undefined,
      return_url: returnUrl || `https://${store.subdomain}.tol.ar/checkout/success`,
      webhook: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/mobbex/webhook`,
      options: {
        theme: {
          type: "light",
          primaryColor: "#000000",
        },
      },
    })

    if (!checkout.result) {
      throw new Error("Error al crear checkout en Mobbex")
    }

    return NextResponse.json({
      success: true,
      checkoutUrl: checkout.data.url,
      checkoutId: checkout.data.id,
    })
  } catch (error) {
    console.error("Error creating Mobbex checkout:", error)
    return NextResponse.json(
      { error: "Error al procesar el pago" },
      { status: 500 }
    )
  }
}
