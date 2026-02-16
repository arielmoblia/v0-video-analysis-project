import { createClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

// Cliente de Supabase con service role para el webhook
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Verificar firma de MercadoPago
function verifyWebhookSignature(request: NextRequest, body: string): boolean {
  const secret = process.env.TOLAR_MP_WEBHOOK_SECRET
  if (!secret) {
    console.log("[MP Webhook] No hay secret configurado, aceptando sin verificar")
    return true
  }

  const xSignature = request.headers.get("x-signature")
  const xRequestId = request.headers.get("x-request-id")

  if (!xSignature || !xRequestId) {
    console.log("[MP Webhook] Faltan headers de firma")
    return false
  }

  // Parsear x-signature (formato: ts=xxx,v1=xxx)
  const parts = xSignature.split(",")
  const tsValue = parts.find((p) => p.startsWith("ts="))?.split("=")[1]
  const v1Value = parts.find((p) => p.startsWith("v1="))?.split("=")[1]

  if (!tsValue || !v1Value) {
    console.log("[MP Webhook] Formato de firma invalido")
    return false
  }

  // Obtener data.id del body
  const bodyJson = JSON.parse(body)
  const dataId = bodyJson.data?.id

  // Crear string para firmar
  const manifest = `id:${dataId};request-id:${xRequestId};ts:${tsValue};`
  
  // Calcular HMAC
  const hmac = crypto.createHmac("sha256", secret)
  hmac.update(manifest)
  const calculatedSignature = hmac.digest("hex")

  const isValid = calculatedSignature === v1Value
  console.log("[MP Webhook] Verificacion de firma:", isValid ? "OK" : "FALLIDA")
  
  return isValid
}

export async function POST(request: NextRequest) {
  try {
    // Leer body como texto para verificar firma
    const bodyText = await request.text()
    
    // Verificar firma
    if (!verifyWebhookSignature(request, bodyText)) {
      console.error("[MP Webhook] Firma invalida, rechazando")
      return NextResponse.json({ error: "Firma invalida" }, { status: 401 })
    }

    const body = JSON.parse(bodyText)

    console.log("[MP Webhook] Notificacion recibida:", body.type, body.data?.id)

    // MercadoPago envia notificaciones de tipo "payment"
    if (body.type === "payment" && body.data?.id) {
      const paymentId = body.data.id

      // Obtener detalles del pago desde MercadoPago
      const accessToken = process.env.TOLAR_MP_ACCESS_TOKEN
      
      if (!accessToken) {
        console.error("[v0] TOLAR_MP_ACCESS_TOKEN no configurado")
        return NextResponse.json({ error: "Token no configurado" }, { status: 500 })
      }

      const paymentResponse = await fetch(
        `https://api.mercadopago.com/v1/payments/${paymentId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )

      if (!paymentResponse.ok) {
        console.error("[v0] Error obteniendo pago:", await paymentResponse.text())
        return NextResponse.json({ error: "Error obteniendo pago" }, { status: 500 })
      }

      const payment = await paymentResponse.json()
      console.log("[v0] Detalles del pago:", JSON.stringify(payment, null, 2))

      const externalReference = payment.external_reference
      const status = payment.status // approved, pending, rejected, etc.

      if (!externalReference || !externalReference.startsWith("tolar_features_")) {
        console.log("[v0] Pago no es de features TOL.AR, ignorando")
        return NextResponse.json({ received: true })
      }

      // Actualizar el estado de la compra
      const { data: purchase, error: purchaseError } = await supabase
        .from("feature_purchases")
        .update({
          payment_id: paymentId.toString(),
          status: status,
          paid_at: status === "approved" ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
        })
        .eq("external_reference", externalReference)
        .select()
        .single()

      if (purchaseError) {
        console.error("[v0] Error actualizando purchase:", purchaseError)
      }

      // Si el pago fue aprobado, activar las features
      if (status === "approved" && purchase) {
        console.log("[v0] Pago aprobado! Activando features para store:", purchase.store_id)
        
        const features = purchase.features as { code: string }[]
        
        for (const feature of features) {
          // Insertar o actualizar la feature como activa
          const { error: featureError } = await supabase
            .from("store_purchased_features")
            .upsert({
              store_id: purchase.store_id,
              feature_code: feature.code,
              is_active: true,
              is_gifted: false,
              purchased_at: new Date().toISOString(),
            }, {
              onConflict: "store_id,feature_code"
            })

          if (featureError) {
            console.error("[v0] Error activando feature:", feature.code, featureError)
          } else {
            console.log("[v0] Feature activada:", feature.code)
          }
        }

        console.log("[v0] Todas las features activadas correctamente")
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("[v0] Error en webhook TOL.AR:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}

// MercadoPago tambien puede hacer GET para verificar el endpoint
export async function GET() {
  return NextResponse.json({ status: "ok", service: "TOL.AR MercadoPago Webhook" })
}
