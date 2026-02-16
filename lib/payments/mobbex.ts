// Integracion con Mobbex - Alternativa argentina a MercadoPago
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
  customer?: {
    email: string
    name: string
    identification: string
    phone?: string
  }
  options?: {
    domain?: string
    theme?: {
      type?: string
      background?: string
      primaryColor?: string
    }
  }
}

interface MobbexCheckoutResponse {
  result: boolean
  data: {
    id: string
    url: string
    description: string
    total: number
    currency: string
  }
}

interface MobbexWebhookPayload {
  type: string
  data: {
    payment: {
      id: string
      status: {
        code: string
        text: string
      }
      total: number
      currency: string
      reference: string
    }
    entity?: {
      name: string
      uid: string
    }
    customer?: {
      email: string
      name: string
      identification: string
    }
  }
}

const MOBBEX_API_URL = "https://api.mobbex.com/p"

export class MobbexClient {
  private apiKey: string
  private accessToken: string

  constructor(config: MobbexConfig) {
    this.apiKey = config.apiKey
    this.accessToken = config.accessToken
  }

  private async request(endpoint: string, method: string, body?: any) {
    const response = await fetch(`${MOBBEX_API_URL}${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.apiKey,
        "x-access-token": this.accessToken,
      },
      body: body ? JSON.stringify(body) : undefined,
    })

    if (!response.ok) {
      throw new Error(`Mobbex API error: ${response.statusText}`)
    }

    return response.json()
  }

  // Crear checkout (link de pago)
  async createCheckout(checkout: MobbexCheckout): Promise<MobbexCheckoutResponse> {
    return this.request("/checkout", "POST", checkout)
  }

  // Obtener metodos de pago disponibles
  async getPaymentMethods(total: number) {
    return this.request(`/sources?total=${total}`, "GET")
  }

  // Obtener transaccion por referencia
  async getTransaction(reference: string) {
    return this.request(`/transactions/coupon/${reference}`, "GET")
  }

  // Reembolso total
  async refund(transactionId: string) {
    return this.request(`/operations/${transactionId}/refund`, "POST")
  }

  // Reembolso parcial
  async partialRefund(transactionId: string, amount: number) {
    return this.request(`/operations/${transactionId}/refund`, "POST", { total: amount })
  }
}

// Crear cliente de Mobbex para una tienda
export function createMobbexClient(apiKey: string, accessToken: string): MobbexClient {
  return new MobbexClient({ apiKey, accessToken })
}

// Verificar webhook de Mobbex
export function verifyMobbexWebhook(payload: MobbexWebhookPayload): boolean {
  // Mobbex envia webhooks con status codes
  // 200 = aprobado, 2XX = aprobado, 4XX = rechazado/cancelado
  const statusCode = payload.data?.payment?.status?.code
  return statusCode?.startsWith("200") || statusCode?.startsWith("2")
}

// Mapear estado de Mobbex a estado interno
export function mapMobbexStatus(statusCode: string): "pending" | "approved" | "rejected" | "cancelled" {
  if (statusCode.startsWith("200") || statusCode.startsWith("2")) {
    return "approved"
  }
  if (statusCode.startsWith("3")) {
    return "pending"
  }
  if (statusCode.startsWith("4")) {
    return "rejected"
  }
  return "cancelled"
}
