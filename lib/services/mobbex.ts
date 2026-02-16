// Mobbex Payment Integration Service
// Documentacion: https://github.com/mobbexco/nodejs

interface MobbexConfig {
  apiKey: string
  accessToken: string
}

interface MobbexCheckoutItem {
  image?: string
  quantity: number
  description: string
  total: number
}

interface MobbexCheckout {
  total: number
  currency: string
  reference: string
  description: string
  items: MobbexCheckoutItem[]
  return_url: string
  webhook: string
  test?: boolean
  options?: {
    domain?: string
    theme?: {
      type?: string
      background?: string
      showHeader?: boolean
      header?: {
        name?: string
        logo?: string
      }
    }
  }
  customer?: {
    email?: string
    name?: string
    identification?: string
    phone?: string
  }
}

interface MobbexResponse {
  result: boolean
  data?: {
    id: string
    url: string
    description: string
    currency: string
    total: number
  }
  error?: string
}

const MOBBEX_API_URL = "https://api.mobbex.com/p/checkout"

export async function createMobbexCheckout(
  config: MobbexConfig,
  checkout: MobbexCheckout
): Promise<MobbexResponse> {
  try {
    const response = await fetch(MOBBEX_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": config.apiKey,
        "x-access-token": config.accessToken,
      },
      body: JSON.stringify(checkout),
    })

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error creating Mobbex checkout:", error)
    return {
      result: false,
      error: "Error al conectar con Mobbex",
    }
  }
}

export async function verifyMobbexWebhook(
  transactionId: string,
  config: MobbexConfig
): Promise<any> {
  try {
    const response = await fetch(
      `https://api.mobbex.com/p/transactions/get?id=${transactionId}`,
      {
        method: "GET",
        headers: {
          "x-api-key": config.apiKey,
          "x-access-token": config.accessToken,
        },
      }
    )

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error verifying Mobbex transaction:", error)
    return null
  }
}

// Crear checkout para una orden
export async function createMobbexOrderCheckout(
  config: MobbexConfig,
  order: {
    orderId: string
    total: number
    items: { name: string; quantity: number; price: number; image?: string }[]
    customerEmail?: string
    customerName?: string
    storeName: string
    storeSubdomain: string
  }
): Promise<MobbexResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://tol.ar"
  
  const checkout: MobbexCheckout = {
    total: order.total,
    currency: "ARS",
    reference: order.orderId,
    description: `Pedido #${order.orderId} - ${order.storeName}`,
    items: order.items.map((item) => ({
      image: item.image || "",
      quantity: item.quantity,
      description: item.name,
      total: item.price * item.quantity,
    })),
    return_url: `${baseUrl}/${order.storeSubdomain}/checkout/success?order=${order.orderId}`,
    webhook: `${baseUrl}/api/webhooks/mobbex?store=${order.storeSubdomain}`,
    options: {
      theme: {
        type: "light",
        showHeader: true,
        header: {
          name: order.storeName,
        },
      },
    },
    customer: {
      email: order.customerEmail,
      name: order.customerName,
    },
  }

  return createMobbexCheckout(config, checkout)
}
