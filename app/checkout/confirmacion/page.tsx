import { CheckCircle, Package, Mail, ArrowLeft, Clock, XCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"

export default async function ConfirmacionPage({
  searchParams,
}: {
  searchParams: Promise<{ 
    order?: string
    status?: string
    payment_id?: string
    collection_status?: string
    external_reference?: string
  }>
}) {
  const { order, status, payment_id, collection_status, external_reference } = await searchParams
  
  const supabase = await createClient()
  
  // El orderId puede venir de "order" o "external_reference" (MercadoPago lo devuelve así)
  const orderId = order || external_reference
  
  // Determinar estado del pago
  let paymentStatus: "success" | "pending" | "failure" = "success"
  
  if (collection_status === "approved" || status === "approved") {
    paymentStatus = "success"
  } else if (collection_status === "pending" || status === "pending") {
    paymentStatus = "pending"
  } else if (collection_status === "rejected" || status === "failure") {
    paymentStatus = "failure"
  }
  
  // Actualizar el estado del pedido si tenemos orderId y payment_id
  if (orderId && payment_id && paymentStatus === "success") {
    await supabase
      .from("orders")
      .update({ 
        status: "pagado",
        payment_id: payment_id 
      })
      .eq("id", orderId)
  } else if (orderId && payment_id && paymentStatus === "pending") {
    await supabase
      .from("orders")
      .update({ 
        status: "pendiente_pago",
        payment_id: payment_id 
      })
      .eq("id", orderId)
  }

  const statusConfig = {
    success: {
      icon: CheckCircle,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      title: "¡Pago Confirmado!",
      message: "Gracias por tu compra. Tu pago fue procesado correctamente.",
    },
    pending: {
      icon: Clock,
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
      title: "Pago Pendiente",
      message: "Tu pago está siendo procesado. Te avisaremos cuando se confirme.",
    },
    failure: {
      icon: XCircle,
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      title: "Pago no completado",
      message: "Hubo un problema con tu pago. Podés intentar nuevamente.",
    },
  }

  const config = statusConfig[paymentStatus]
  const StatusIcon = config.icon

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className={`w-16 h-16 ${config.iconBg} rounded-full flex items-center justify-center mx-auto mb-6`}>
          <StatusIcon className={`w-10 h-10 ${config.iconColor}`} />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">{config.title}</h1>

        <p className="text-gray-600 mb-6">{config.message}</p>

        {orderId && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-500 mb-1">Número de pedido</p>
            <p className="font-mono text-sm font-medium text-gray-900">{orderId}</p>
          </div>
        )}

        <div className="space-y-4 text-left mb-8">
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">Confirmación por email</p>
              <p className="text-sm text-gray-500">Te enviamos un email con los detalles de tu pedido.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Package className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">Seguimiento</p>
              <p className="text-sm text-gray-500">Te contactaremos cuando tu pedido esté en camino.</p>
            </div>
          </div>
        </div>

        <Link href="/">
          <Button className="w-full bg-transparent" variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a la tienda
          </Button>
        </Link>
      </div>
    </div>
  )
}
