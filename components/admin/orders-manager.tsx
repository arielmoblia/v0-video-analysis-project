"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Package, Truck, CheckCircle, Clock, Eye, X, DollarSign, Printer, Trash2, ExternalLink, Copy, Check, FileText } from "lucide-react"

interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  selectedSize?: string
  size?: string
  image_url?: string
  source_url?: string
}

interface Order {
  id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  customer_dni?: string
  shipping_method: string
  shipping_label?: string
  shipping_address: string
  shipping_street_number?: string
  shipping_province?: string
  shipping_city: string
  shipping_postal_code?: string
  payment_method: string
  payment_id?: string | null
  items: OrderItem[]
  total: number
  status: string
  created_at: string
  notes?: string
  invoiced_at?: string | null
  shipping_cost?: number | null
  shipping_guide_id?: string | null
  shipping_guide_pdf_url?: string | null
  shipping_guide_amount?: number | null
  shipping_guide_generated_at?: string | null
  shipping_guide_paid_at?: string | null
}

interface OrdersManagerProps {
  storeId: string
  storeName?: string
  isDropship?: boolean
  sourceUrl?: string | null
  subdomain?: string
}

// Genera la guía de envío automática vía API de Enviamelo (cobra real en la cuenta
// del transportista). Mientras se prueba el flujo, solo esta tienda la ve.
const ENVIAMELO_AUTO_GUIDE_SUBDOMAINS = ["prueba3", "doppiam"]

// Cronograma de estado con chequeo de stock automático, tilde de Facturado y pago de
// la guía integrado. Todavía en prueba: solo prueba3 lo ve. Las demás tiendas (incluida
// doppiam, que ya tiene clientes probando la guía real) siguen con el flujo anterior.
const CRONOGRAMA_SUBDOMAINS = ["prueba3"]

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  purchased_at_source: "bg-violet-100 text-violet-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  refunded: "bg-orange-100 text-orange-800",
}

const statusLabels: Record<string, string> = {
  pending: "Pendiente",
  confirmed: "Confirmado",
  purchased_at_source: "Comprado en origen",
  shipped: "Enviado",
  delivered: "Entregado",
  cancelled: "Cancelado",
  refunded: "Reembolsado",
}

export function OrdersManager({ storeId, storeName = "Tienda", isDropship = false, sourceUrl = null, subdomain = "" }: OrdersManagerProps) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showRefundModal, setShowRefundModal] = useState(false)
  const [refundReason, setRefundReason] = useState("")
  const [processing, setProcessing] = useState(false)
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const printRef = useRef<HTMLDivElement>(null)

  const canAutoGuide = ENVIAMELO_AUTO_GUIDE_SUBDOMAINS.includes(subdomain)
  const canCronograma = CRONOGRAMA_SUBDOMAINS.includes(subdomain)
  const [showGuiaModal, setShowGuiaModal] = useState(false)
  const [guiaLoading, setGuiaLoading] = useState(false)
  const [guiaError, setGuiaError] = useState<string | null>(null)
  const [guiaResult, setGuiaResult] = useState<{ id: number; pdf: string; amount: number | null } | null>(null)
  const [guiaPaymentInfo, setGuiaPaymentInfo] = useState<{ alias: string; cbu: string } | null>(null)

  const [checkingStock, setCheckingStock] = useState(false)
  const [stockMissing, setStockMissing] = useState<{ name: string; size?: string | null; requested: number; available: number }[] | null>(null)
  const [invoicing, setInvoicing] = useState(false)
  const [markingShippingPaid, setMarkingShippingPaid] = useState(false)

  // Pestañas del detalle de pedido (Pedido/Pago/Stock/Devolver/Remito-Factura/Envío/Entrega).
  // Solo se muestran en canCronograma (prueba3) para no tocar el layout de las demás tiendas.
  const [activeTab, setActiveTab] = useState<"pedido" | "pago" | "stock" | "devolver" | "remito" | "envio" | "entrega">("pedido")
  const [printCopies, setPrintCopies] = useState(1)
  const [stockCheckItems, setStockCheckItems] = useState<{ name: string; size?: string | null; requested: number; available: number; sufficient: boolean }[] | null>(null)
  const [stockCheckedAt, setStockCheckedAt] = useState<string | null>(null)
  const [stockCheckingTab, setStockCheckingTab] = useState(false)
  const [guiaForm, setGuiaForm] = useState({
    recipientName: "",
    recipientLastName: "",
    recipientDni: "",
    recipientPhone: "",
    recipientEmail: "",
    product: "",
    province: "",
    location: "",
    street: "",
    height: "",
    floor: "",
    departament: "",
    postalCode: "",
    weight: "1",
    dimensions: "20x20x20",
    note: "",
  })

  const openGuiaModal = (order: Order) => {
    const [firstName, ...rest] = (order.customer_name || "").trim().split(" ")
    setGuiaResult(null)
    setGuiaPaymentInfo(null)
    setGuiaError(null)
    setGuiaForm({
      recipientName: firstName || "",
      recipientLastName: rest.join(" ") || "",
      recipientDni: order.customer_dni || "",
      recipientPhone: order.customer_phone || "",
      recipientEmail: order.customer_email || "",
      product: order.items?.[0]?.name || "Pedido " + storeName,
      province: order.shipping_province || "",
      location: order.shipping_city || "",
      street: order.shipping_address || "",
      height: order.shipping_street_number || "",
      floor: "",
      departament: "",
      postalCode: order.shipping_postal_code || "",
      weight: "1",
      dimensions: "20x20x20",
      note: "",
    })
    setShowGuiaModal(true)
  }

  const guiaMissingFields = [
    !guiaForm.recipientName && "Nombre",
    !guiaForm.recipientLastName && "Apellido",
    !guiaForm.recipientDni && "DNI",
    !guiaForm.recipientPhone && "Teléfono",
    !guiaForm.recipientEmail && "Email",
    !guiaForm.product && "Producto",
    !guiaForm.province && "Provincia",
    !guiaForm.location && "Localidad",
    !guiaForm.street && "Calle",
    !guiaForm.height && "Altura",
    !guiaForm.postalCode && "Código postal",
    !guiaForm.weight && "Peso",
    !guiaForm.dimensions && "Dimensiones",
  ].filter(Boolean) as string[]

  const guiaFormValid = guiaMissingFields.length === 0

  const [guiaDemoLoading, setGuiaDemoLoading] = useState(false)

  const submitGuiaDemo = async () => {
    setGuiaDemoLoading(true)
    setGuiaError(null)
    try {
      const res = await fetch("/api/shipping/enviamelo/operation-demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeId,
          weight: Number(guiaForm.weight),
          dimensions: guiaForm.dimensions,
          postalCode: guiaForm.postalCode,
          recipientName: guiaForm.recipientName,
          recipientLastName: guiaForm.recipientLastName,
          recipientDni: guiaForm.recipientDni,
          recipientPhone: guiaForm.recipientPhone,
          recipientEmail: guiaForm.recipientEmail,
          product: guiaForm.product,
          province: guiaForm.province,
          location: guiaForm.location,
          street: guiaForm.street,
          height: guiaForm.height,
          floor: guiaForm.floor,
          departament: guiaForm.departament,
          note: guiaForm.note,
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setGuiaError(data.error || "No se pudo generar la vista previa")
      } else {
        const blob = await res.blob()
        window.open(URL.createObjectURL(blob), "_blank")
      }
    } catch (error) {
      setGuiaError("Error de conexión al generar la vista previa")
    } finally {
      setGuiaDemoLoading(false)
    }
  }

  const submitGuia = async () => {
    if (!selectedOrder) return
    setGuiaLoading(true)
    setGuiaError(null)
    try {
      const res = await fetch("/api/shipping/enviamelo/operation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeId,
          weight: Number(guiaForm.weight),
          dimensions: guiaForm.dimensions,
          postalCode: guiaForm.postalCode,
          recipientName: guiaForm.recipientName,
          recipientLastName: guiaForm.recipientLastName,
          recipientDni: guiaForm.recipientDni,
          recipientPhone: guiaForm.recipientPhone,
          recipientEmail: guiaForm.recipientEmail,
          product: guiaForm.product,
          province: guiaForm.province,
          location: guiaForm.location,
          street: guiaForm.street,
          height: guiaForm.height,
          floor: guiaForm.floor,
          departament: guiaForm.departament,
          note: guiaForm.note,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setGuiaError(data.error || "No se pudo generar la guía")
        return
      }

      setGuiaResult(data)

      if (canCronograma) {
        await fetch("/api/admin/orders/save-guide", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: selectedOrder.id,
            guideId: data.id,
            pdfUrl: data.pdf,
            amount: data.amount,
          }),
        })
        setSelectedOrder({
          ...selectedOrder,
          shipping_guide_id: data.id != null ? String(data.id) : null,
          shipping_guide_pdf_url: data.pdf,
          shipping_guide_amount: data.amount,
          shipping_guide_generated_at: new Date().toISOString(),
        })
        fetchOrders()

        fetch("/api/shipping/enviamelo/payment-info")
          .then((r) => r.json())
          .then((info) => setGuiaPaymentInfo(info))
          .catch(() => setGuiaPaymentInfo(null))
      }
    } catch (error) {
      setGuiaError("Error de conexión al generar la guía")
    } finally {
      setGuiaLoading(false)
    }
  }

  const checkStockAndConfirm = async (order: Order) => {
    setCheckingStock(true)
    setStockMissing(null)
    try {
      const res = await fetch("/api/admin/orders/check-stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order.id }),
      })
      const data = await res.json()
      if (!res.ok) {
        setStockMissing([{ name: data.error || "No se pudo chequear el stock", requested: 0, available: 0 }])
        return
      }
      if (!data.ok) {
        setStockMissing(data.missing || [])
        return
      }
      await updateOrderStatus(order.id, "confirmed")
    } catch (error) {
      setStockMissing([{ name: "Error de conexión al chequear el stock", requested: 0, available: 0 }])
    } finally {
      setCheckingStock(false)
    }
  }

  // Chequeo de stock "de solo lectura" para la pestaña Stock: no cambia el estado del
  // pedido (a diferencia de checkStockAndConfirm, que además confirma si hay stock).
  const checkStockTab = async () => {
    if (!selectedOrder) return
    setStockCheckingTab(true)
    try {
      const res = await fetch("/api/admin/orders/check-stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: selectedOrder.id }),
      })
      const data = await res.json()
      if (res.ok) {
        setStockCheckItems(data.items || [])
        setStockCheckedAt(new Date().toISOString())
      }
    } catch (error) {
      console.error("Error checking stock:", error)
    } finally {
      setStockCheckingTab(false)
    }
  }

  const markInvoiced = async (order: Order) => {
    setInvoicing(true)
    try {
      const res = await fetch("/api/admin/orders/mark-invoiced", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order.id }),
      })
      const data = await res.json()
      if (res.ok) {
        setSelectedOrder({ ...order, invoiced_at: data.order?.invoiced_at || new Date().toISOString() })
        fetchOrders()
      }
    } catch (error) {
      console.error("Error marking invoiced:", error)
    } finally {
      setInvoicing(false)
    }
  }

  const markShippingPaid = async (order: Order) => {
    setMarkingShippingPaid(true)
    try {
      const res = await fetch("/api/admin/orders/mark-shipping-paid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order.id }),
      })
      const data = await res.json()
      if (res.ok) {
        setSelectedOrder({ ...order, shipping_guide_paid_at: data.order?.shipping_guide_paid_at || new Date().toISOString() })
        fetchOrders()
      }
    } catch (error) {
      console.error("Error marking shipping paid:", error)
    } finally {
      setMarkingShippingPaid(false)
    }
  }

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(fieldName)
    setTimeout(() => setCopiedField(null), 2000)
  }

  useEffect(() => {
    fetchOrders()
  }, [storeId])

  useEffect(() => {
    if (!canCronograma || activeTab !== "envio" || !selectedOrder) return
    fetch("/api/shipping/enviamelo/payment-info")
      .then((r) => r.json())
      .then((info) => setGuiaPaymentInfo(info))
      .catch(() => setGuiaPaymentInfo(null))
  }, [canCronograma, activeTab, selectedOrder?.id])

  const fetchOrders = async () => {
    try {
      const res = await fetch(`/api/admin/orders?store_id=${storeId}`)
      const data = await res.json()
      setOrders(data.orders || [])
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, status: string) => {
    setProcessing(true)
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status, storeName }),
      })

      if (res.ok) {
        fetchOrders()
        if (selectedOrder?.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status })
        }
      }
    } catch (error) {
      console.error("Error updating order:", error)
    } finally {
      setProcessing(false)
    }
  }

  const processRefund = async () => {
    if (!selectedOrder) return
    setProcessing(true)
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: selectedOrder.id,
          status: "refunded",
          storeName,
          refundReason,
        }),
      })

      if (res.ok) {
        fetchOrders()
        setSelectedOrder({ ...selectedOrder, status: "refunded" })
        setShowRefundModal(false)
        setRefundReason("")
      }
    } catch (error) {
      console.error("Error processing refund:", error)
    } finally {
      setProcessing(false)
    }
  }

  const deleteOrder = async (orderId: string) => {
    if (!confirm("¿Estás seguro de eliminar este pedido? Esta acción no se puede deshacer.")) return

    try {
      const res = await fetch(`/api/admin/orders?orderId=${orderId}`, {
        method: "DELETE",
      })

      if (res.ok) {
        fetchOrders()
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(null)
        }
      }
    } catch (error) {
      console.error("Error deleting order:", error)
    }
  }

  const getPaymentLabel = (method: string) => {
    const labels: Record<string, string> = {
      cash: "Efectivo",
      card: "Tarjeta",
      transfer: "Transferencia",
      mercadopago: "Mercado Pago",
    }
    return labels[method] || method
  }

  const getShippingLabel = (method: string) => {
    return method === "pickup" ? "Retiro" : "Envío"
  }

  const handlePrint = () => {
    if (!selectedOrder) return

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Pedido #${selectedOrder.id.slice(0, 8)}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; }
          .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #000; padding-bottom: 15px; }
          .header h1 { font-size: 24px; margin: 0 0 5px 0; }
          .header h2 { font-size: 16px; color: #666; margin: 0 0 5px 0; font-weight: normal; }
          .header p { font-size: 12px; color: #888; margin: 5px 0; }
          .grid { display: flex; gap: 15px; margin-bottom: 15px; }
          .grid-item { flex: 1; background: #f5f5f5; padding: 15px; border-radius: 8px; }
          .grid-item h4 { font-size: 10px; color: #666; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 1px; }
          .grid-item p { margin: 3px 0; font-size: 13px; }
          .grid-item .value { font-weight: bold; font-size: 14px; }
          .products-title { font-size: 10px; color: #666; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
          th { background: #f5f5f5; padding: 10px; text-align: left; font-size: 12px; font-weight: 600; border: 1px solid #e0e0e0; }
          th.center { text-align: center; }
          th.right { text-align: right; }
          td { padding: 10px; border: 1px solid #e0e0e0; font-size: 13px; vertical-align: middle; }
          td.center { text-align: center; }
          td.right { text-align: right; }
          .product-cell { display: flex; align-items: center; gap: 10px; }
          .product-img { width: 50px; height: 50px; object-fit: cover; border-radius: 4px; }
          .talle { background: #000; color: #fff; padding: 3px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }
          .total-row { background: #f5f5f5; font-weight: bold; }
          .total-row td { font-size: 14px; }
          .total-row td:last-child { font-size: 16px; }
          .estado-section { margin-top: 20px; padding: 15px; border: 2px solid #000; border-radius: 8px; }
          .estado-section h4 { font-size: 10px; color: #666; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 1px; }
          .estado-buttons { display: flex; gap: 10px; flex-wrap: wrap; }
          .estado-btn { padding: 8px 16px; border-radius: 20px; font-size: 12px; font-weight: 600; border: 2px solid #e0e0e0; background: #fff; }
          .estado-btn.active { background: #000; color: #fff; border-color: #000; }
          .estado-pending { border-color: #fbbf24; }
          .estado-pending.active { background: #fef3c7; color: #92400e; border-color: #fbbf24; }
          .estado-confirmed { border-color: #3b82f6; }
          .estado-confirmed.active { background: #dbeafe; color: #1e40af; border-color: #3b82f6; }
          .estado-shipped { border-color: #8b5cf6; }
          .estado-shipped.active { background: #ede9fe; color: #6d28d9; border-color: #8b5cf6; }
          .estado-delivered { border-color: #22c55e; }
          .estado-delivered.active { background: #dcfce7; color: #166534; border-color: #22c55e; }
          .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px dashed #ccc; }
          .footer p { font-size: 12px; color: #666; margin: 5px 0; }
          @media print {
            body { padding: 10px; }
            .grid-item { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .talle { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            th { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .total-row { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .estado-btn { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .estado-btn.active { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .estado-section { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${storeName}</h1>
          <h2>Pedido #${selectedOrder.id.slice(0, 8)}</h2>
          <p>${new Date(selectedOrder.created_at).toLocaleString()}</p>
        </div>
        
        <div class="grid">
          <div class="grid-item">
            <h4>Cliente</h4>
            <p class="value">${selectedOrder.customer_name}</p>
            <p>${selectedOrder.customer_email}</p>
            ${selectedOrder.customer_phone ? `<p>Tel: ${selectedOrder.customer_phone}</p>` : ""}
          </div>
          <div class="grid-item">
            <h4>Envío</h4>
            <p class="value">${selectedOrder.shipping_label || (selectedOrder.shipping_method === "pickup" ? "Retiro en local" : "Envío a domicilio")}</p>
            ${selectedOrder.shipping_address ? `<p>${selectedOrder.shipping_address}</p>` : ""}
            ${selectedOrder.shipping_city ? `<p>${selectedOrder.shipping_city}</p>` : ""}
          </div>
        </div>
        
        <div class="grid">
          <div class="grid-item">
            <h4>Método de Pago</h4>
            <p class="value">${getPaymentLabel(selectedOrder.payment_method)}</p>
          </div>
          <div class="grid-item">
            <h4>Estado</h4>
            <p class="value">${statusLabels[selectedOrder.status] || selectedOrder.status}</p>
          </div>
        </div>
        
        <div class="products-title">Productos</div>
        <table>
          <thead>
            <tr>
              <th>Producto</th>
              <th class="center">Talle</th>
              <th class="center">Cant.</th>
              <th class="right">Precio</th>
              <th class="right">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${(selectedOrder.items || [])
              .map(
                (item) => `
              <tr>
                <td>
                  <div class="product-cell">
                    ${item.image_url ? `<img src="${item.image_url}" class="product-img" />` : ""}
                    <span>${item.name}</span>
                  </div>
                </td>
                <td class="center">
                  ${item.size || item.selectedSize ? `<span class="talle">${item.size || item.selectedSize}</span>` : "-"}
                </td>
                <td class="center">${item.quantity}</td>
                <td class="right">$${Number(item.price).toLocaleString()}</td>
                <td class="right">$${(item.price * item.quantity).toLocaleString()}</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
          <tfoot>
            <tr class="total-row">
              <td colspan="4" style="text-align: right;">TOTAL</td>
              <td class="right">$${Number(selectedOrder.total).toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>
        
        ${selectedOrder.notes ? `
        <div style="margin: 15px 0; padding: 10px; background: #fef9c3; border: 1px solid #fde047; border-radius: 8px;">
          <h4 style="margin: 0 0 5px 0; font-size: 12px; color: #666;">OBSERVACIONES</h4>
          <p style="margin: 0; font-size: 14px;">${selectedOrder.notes}</p>
        </div>
        ` : ''}
        
        ${selectedOrder.shipping_address ? `
        <div style="margin: 15px 0; padding: 10px; background: #dbeafe; border: 1px solid #93c5fd; border-radius: 8px;">
          <h4 style="margin: 0 0 5px 0; font-size: 12px; color: #666;">DIRECCION DE ENTREGA</h4>
          <p style="margin: 0; font-size: 14px;">${selectedOrder.shipping_address}</p>
        </div>
        ` : ''}
        
        <div class="estado-section">
          <h4>Cambiar Estado</h4>
          <div class="estado-buttons">
            <span class="estado-btn estado-pending ${selectedOrder.status === "pending" ? "active" : ""}">◯ Pendiente</span>
            <span class="estado-btn estado-confirmed ${selectedOrder.status === "confirmed" ? "active" : ""}">◉ Confirmado</span>
            <span class="estado-btn estado-shipped ${selectedOrder.status === "shipped" ? "active" : ""}">📦 Enviado</span>
            <span class="estado-btn estado-delivered ${selectedOrder.status === "delivered" ? "active" : ""}">✓ Entregado</span>
          </div>
        </div>
        
        <div class="footer">
          <p><strong>¡Gracias por tu compra!</strong></p>
          <p>${storeName}</p>
        </div>
      </body>
      </html>
    `

    const printWindow = window.open("", "_blank")
    if (printWindow) {
      // Repite el body tantas veces como copias se hayan pedido (canCronograma), separadas
      // por salto de página, en vez de abrir un print() por copia.
      const bodyMatch = printContent.match(/<body>([\s\S]*)<\/body>/)
      const headPart = printContent.split("<body>")[0]
      const copies = Math.max(1, printCopies)
      const finalHtml =
        copies > 1 && bodyMatch
          ? `${headPart}<body>${Array.from({ length: copies }, () => bodyMatch[1]).join('<div style="page-break-after: always"></div>')}</body></html>`
          : printContent
      printWindow.document.write(finalHtml)
      printWindow.document.close()
      printWindow.focus()
      printWindow.print()
      printWindow.close()
    }
  }

  // Junta los 3 papeles que van pegados al paquete: remito, factura (comprobante
  // interno mientras no está AFIP real conectado) y la guía de transporte.
  const handlePrintPaquete = () => {
    if (!selectedOrder) return
    window.open(`/api/admin/orders/remito?orderId=${selectedOrder.id}`, "_blank")
    handlePrint()
    if (selectedOrder.shipping_guide_pdf_url) {
      window.open(selectedOrder.shipping_guide_pdf_url, "_blank")
    }
  }

  if (loading) {
    return <div className="text-center py-8">Cargando pedidos...</div>
  }

  return (
    <div>
      <h2 className="text-2xl font-light tracking-wide mb-6">Pedidos</h2>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <ShoppingCart className="w-12 h-12 mx-auto text-neutral-300 mb-4" />
            <p className="text-neutral-500">No hay pedidos todavía</p>
            <p className="text-sm text-neutral-400">Los pedidos aparecerán aquí cuando los clientes compren</p>
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-sm text-neutral-500">
                <th className="pb-3 font-medium">Pedido</th>
                <th className="pb-3 font-medium">Cliente</th>
                <th className="pb-3 font-medium">Email</th>
                <th className="pb-3 font-medium">Teléfono</th>
                <th className="pb-3 font-medium">Envío</th>
                <th className="pb-3 font-medium">Pago</th>
                <th className="pb-3 font-medium">Total</th>
                <th className="pb-3 font-medium">Estado</th>
                <th className="pb-3 font-medium">Fecha</th>
                <th className="pb-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-neutral-50">
                  <td className="py-3 font-medium">#{order.id.slice(0, 8)}</td>
                  <td className="py-3">{order.customer_name}</td>
                  <td className="py-3 text-sm text-neutral-500">{order.customer_email}</td>
                  <td className="py-3 text-sm">{order.customer_phone || "-"}</td>
                  <td className="py-3">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${order.shipping_method === "pickup" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"}`}
                    >
                      {order.shipping_label || getShippingLabel(order.shipping_method)}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className="text-xs px-2 py-1 rounded-full bg-neutral-100">
                      {getPaymentLabel(order.payment_method)}
                    </span>
                  </td>
                  <td className="py-3 font-semibold">${Number(order.total).toLocaleString()}</td>
                  <td className="py-3">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${statusColors[order.status] || statusColors.pending}`}
                    >
                      {statusLabels[order.status] || order.status}
                    </span>
                  </td>
                  <td className="py-3 text-sm text-neutral-500">{new Date(order.created_at).toLocaleDateString()}</td>
                  <td className="py-3">
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedOrder(order)
                          setActiveTab("pedido")
                          setStockCheckItems(null)
                          setStockCheckedAt(null)
                          setPrintCopies(1)
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteOrder(order.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedOrder && !showRefundModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <div className={canCronograma ? "" : "p-6"} ref={printRef}>
              <div className={canCronograma ? "flex justify-between items-center px-6 py-[18px] border-b border-neutral-200" : "flex justify-between items-start mb-6"}>
                <div>
                  {canCronograma ? (
                    <>
                      <h3 className="text-[18px] font-bold text-neutral-900">Pedido #{selectedOrder.id.slice(0, 8)} — tienda {subdomain}.tol.ar</h3>
                      <span className="text-[13px] text-neutral-500">Fecha: {new Date(selectedOrder.created_at).toLocaleString()} · Estado: {statusLabels[selectedOrder.status] || selectedOrder.status}</span>
                    </>
                  ) : (
                    <>
                      <h3 className="text-xl font-semibold">Pedido #{selectedOrder.id.slice(0, 8)}</h3>
                      <p className="text-sm text-neutral-500">{new Date(selectedOrder.created_at).toLocaleString()}</p>
                    </>
                  )}
                </div>
                <div className="flex gap-2 items-center">
                  {canCronograma ? (
                    <>
                      <div className="flex items-center gap-1.5 bg-[#fafafa] border border-neutral-200 rounded-lg px-2.5 py-1.5">
                        <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wide">Copias</label>
                        <input
                          type="number"
                          min={1}
                          max={20}
                          value={printCopies}
                          onChange={(e) => setPrintCopies(Math.max(1, Math.min(20, Number(e.target.value) || 1)))}
                          className="w-12 border border-neutral-300 rounded px-1 py-0.5 text-sm text-center"
                        />
                      </div>
                      <Button
                        size="sm"
                        className="bg-neutral-900 hover:bg-neutral-800 text-white"
                        onClick={() => {
                          if (activeTab === "remito") {
                            window.open(`/api/admin/orders/remito?orderId=${selectedOrder.id}`, "_blank")
                          } else {
                            handlePrint()
                          }
                        }}
                      >
                        <Printer className="w-4 h-4 mr-1" /> Imprimir
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outline" size="sm" onClick={handlePrint}>
                        <Printer className="w-4 h-4 mr-1" /> Imprimir
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`/api/admin/orders/remito?orderId=${selectedOrder.id}`, "_blank")}
                      >
                        <FileText className="w-4 h-4 mr-1" /> Remito
                      </Button>
                      {selectedOrder.shipping_method !== "pickup" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (canAutoGuide) {
                              openGuiaModal(selectedOrder)
                              return
                            }
                            const datosGuia = [
                              selectedOrder.customer_name,
                              selectedOrder.customer_phone || "",
                              selectedOrder.shipping_address || "",
                              selectedOrder.shipping_city || "",
                              selectedOrder.shipping_postal_code || "",
                            ].filter(Boolean).join("\n")
                            copyToClipboard(datosGuia, "guia")
                            window.open("https://app.enviamelo.com.ar", "_blank")
                          }}
                        >
                          <Truck className="w-4 h-4 mr-1" /> {copiedField === "guia" ? "Copiado" : "Guía"}
                        </Button>
                      )}
                      {selectedOrder.shipping_method !== "pickup" && canAutoGuide && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-violet-300 text-violet-700 hover:bg-violet-50"
                          onClick={() => openGuiaModal(selectedOrder)}
                        >
                          <Truck className="w-4 h-4 mr-1" /> Guía automática (test)
                        </Button>
                      )}
                    </>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(null)}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {canCronograma && (() => {
                const tabDone: Record<string, boolean> = {
                  pedido: true,
                  pago: selectedOrder.payment_method !== "mercadopago" || !!selectedOrder.payment_id,
                  stock: ["confirmed", "purchased_at_source", "shipped", "delivered"].includes(selectedOrder.status),
                  devolver: selectedOrder.status === "refunded",
                  remito: !!selectedOrder.invoiced_at,
                  envio: selectedOrder.shipping_method === "pickup" || !!selectedOrder.shipping_guide_generated_at,
                  entrega: selectedOrder.status === "delivered",
                }
                return (
                <div className="flex min-h-[420px]">
                  <div className="w-[190px] bg-black border-r border-neutral-800 py-3 shrink-0">
                    {([
                      { key: "pedido", label: "Pedido" },
                      { key: "pago", label: "Pago" },
                      { key: "stock", label: "Stock" },
                      { key: "devolver", label: "Devolver" },
                      { key: "remito", label: "Remito / Factura" },
                      { key: "envio", label: "Envío" },
                      { key: "entrega", label: "Entrega" },
                    ] as const).map((t) => (
                      <button
                        key={t.key}
                        onClick={() => setActiveTab(t.key)}
                        className={`flex items-center justify-between w-full text-left bg-transparent border-l-[3px] px-5 py-3.5 text-sm font-semibold ${
                          activeTab === t.key
                            ? "text-white bg-neutral-900 border-l-[#7c3aed]"
                            : "text-neutral-400 border-l-transparent hover:bg-neutral-900 hover:text-white"
                        }`}
                      >
                        {t.label}
                        {tabDone[t.key] ? (
                          <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                        ) : (
                          <Clock className="w-4 h-4 text-neutral-600 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="flex-1 p-6 overflow-x-auto">
                  {activeTab === "pedido" && (
                    <>
                  <h2 className="text-[16px] font-semibold text-neutral-900 mb-4">Detalle del pedido</h2>
                  <div className="grid grid-cols-4 gap-3.5 mb-4">
                    <div className="bg-[#fafafa] border border-neutral-200 rounded-lg p-3.5">
                      <div className="text-[11px] font-bold text-neutral-500 uppercase tracking-wide mb-1.5">Cliente</div>
                      <p className="text-sm font-bold text-neutral-900">{selectedOrder.customer_name}</p>
                      <p className="text-xs text-neutral-500 mt-0.5">{selectedOrder.customer_email}</p>
                      {selectedOrder.customer_phone && (
                        <p className="text-xs text-neutral-500 mt-0.5">Tel: {selectedOrder.customer_phone}</p>
                      )}
                    </div>

                    <div className="bg-[#fafafa] border border-neutral-200 rounded-lg p-3.5">
                      <div className="text-[11px] font-bold text-neutral-500 uppercase tracking-wide mb-1.5">Envío</div>
                      <p className="text-sm font-bold text-neutral-900">
                        {selectedOrder.shipping_label || (selectedOrder.shipping_method === "pickup" ? "Retiro en local" : "Envío a domicilio")}
                      </p>
                      {typeof selectedOrder.shipping_address === "string" && selectedOrder.shipping_address && (
                        <>
                          <p className="text-xs text-neutral-500 mt-0.5">{selectedOrder.shipping_address}</p>
                          <p className="text-xs text-neutral-500 mt-0.5">{selectedOrder.shipping_city}</p>
                        </>
                      )}
                    </div>

                    <div className="bg-[#fafafa] border border-neutral-200 rounded-lg p-3.5">
                      <div className="text-[11px] font-bold text-neutral-500 uppercase tracking-wide mb-1.5">Método de pago</div>
                      <p className="text-sm font-bold text-neutral-900">{getPaymentLabel(selectedOrder.payment_method)}</p>
                    </div>

                    <div className="bg-[#fafafa] border border-neutral-200 rounded-lg p-3.5">
                      <div className="text-[11px] font-bold text-neutral-500 uppercase tracking-wide mb-1.5">Estado actual</div>
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${statusColors[selectedOrder.status] || statusColors.pending}`}
                      >
                        {statusLabels[selectedOrder.status] || selectedOrder.status}
                      </span>
                    </div>
                  </div>

                  {stockMissing && stockMissing.length > 0 && (
                    <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-sm font-medium text-red-800 mb-1">No hay stock suficiente:</p>
                      <ul className="text-sm text-red-700 list-disc pl-5 mb-2">
                        {stockMissing.map((m, i) => (
                          <li key={i}>
                            {m.name}{m.size ? ` (talle ${m.size})` : ""}: pediste {m.requested}, quedan {m.available}
                          </li>
                        ))}
                      </ul>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => setStockMissing(null)}>
                          Cerrar
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            setStockMissing(null)
                            setActiveTab("devolver")
                          }}
                        >
                          Cancelar y devolver dinero
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="mb-6">
                    <h4 className="font-medium mb-3 text-sm text-neutral-500">PASO A PASO DEL PEDIDO</h4>
                    <div className="flex flex-nowrap items-center overflow-x-auto">
                      {([
                        { key: "pago", label: "Pago", done: selectedOrder.payment_method !== "mercadopago" || !!selectedOrder.payment_id },
                        { key: "stock", label: "Confirmado", done: ["confirmed", "purchased_at_source", "shipped", "delivered"].includes(selectedOrder.status) },
                        { key: "remito", label: "Facturado", done: !!selectedOrder.invoiced_at },
                        { key: "envio", label: "Guía de envío", done: selectedOrder.shipping_method === "pickup" || !!selectedOrder.shipping_guide_generated_at },
                        { key: "entrega", label: "Entregado", done: selectedOrder.status === "delivered" },
                      ] as const).map((s, i, arr) => (
                        <div key={s.key} className="flex items-center">
                          <button
                            onClick={() => setActiveTab(s.key)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border whitespace-nowrap ${
                              s.done
                                ? "bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200"
                                : "bg-neutral-100 text-neutral-500 border-neutral-200 hover:bg-neutral-200"
                            }`}
                          >
                            {s.done ? <CheckCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                            {s.label}
                          </button>
                          {i < arr.length - 1 && (
                            <div className={`h-[2px] w-4 shrink-0 ${s.done ? "bg-emerald-300" : "bg-neutral-200"}`} />
                          )}
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-neutral-400 mt-2">Tocá un paso para ir directo a esa pestaña y ver los botones de acción.</p>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-medium mb-3 text-sm text-neutral-500">PRODUCTOS</h4>
                    <div className="border rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-neutral-100">
                          <tr className="text-left text-sm">
                            <th className="p-3 font-medium">Producto</th>
                            <th className="p-3 font-medium text-center">Talle</th>
                            <th className="p-3 font-medium text-center">Cant.</th>
                            <th className="p-3 font-medium text-right">Precio</th>
                            <th className="p-3 font-medium text-right">Subtotal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(selectedOrder.items || []).map((item, index) => (
                            <tr key={index} className="border-t">
                              <td className="p-3">
                                <div className="flex items-center gap-3">
                                  {item.image_url && (
                                    <img
                                      src={item.image_url || "/images/placeholders/placeholder.svg"}
                                      alt={item.name}
                                      className="w-12 h-12 object-cover rounded"
                                    />
                                  )}
                                  <span className="font-medium">{item.name}</span>
                                </div>
                              </td>
                              <td className="p-3 text-center">
                                {item.size || item.selectedSize ? (
                                  <span className="bg-black text-white px-2 py-1 rounded text-sm">
                                    {item.size || item.selectedSize}
                                  </span>
                                ) : (
                                  <span className="text-neutral-400">-</span>
                                )}
                              </td>
                              <td className="p-3 text-center">{item.quantity}</td>
                              <td className="p-3 text-right">${Number(item.price).toLocaleString()}</td>
                              <td className="p-3 text-right font-semibold">
                                ${(item.price * item.quantity).toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-neutral-100">
                          <tr className="border-t">
                            <td colSpan={4} className="p-3 text-right font-bold">
                              TOTAL
                            </td>
                            <td className="p-3 text-right font-bold text-lg">
                              ${Number(selectedOrder.total).toLocaleString()}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>

                  {/* Observaciones del cliente */}
                  {selectedOrder.notes && (
                    <div className="mb-6">
                      <h4 className="font-medium mb-2 text-sm text-neutral-500">OBSERVACIONES</h4>
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <p className="text-sm text-neutral-700">{selectedOrder.notes}</p>
                      </div>
                    </div>
                  )}

                  {/* Seccion Dropshipping - Solo para tiendas dropship */}
                  {isDropship && (
                    <div className="mb-6 border-2 border-violet-300 rounded-lg overflow-hidden">
                      <div className="bg-violet-100 px-4 py-3 border-b border-violet-200">
                        <h4 className="font-bold text-violet-900 flex items-center gap-2">
                          <Package className="w-5 h-5" />
                          Comprar en tienda madre
                        </h4>
                        <p className="text-xs text-violet-700 mt-1">
                          Copia los datos del cliente y compra el producto en la tienda de origen
                        </p>
                      </div>
                      <div className="p-4 bg-white">
                        {/* Datos para copiar */}
                        <div className="space-y-3 mb-4">
                          <div className="flex items-center justify-between bg-neutral-100 p-3 rounded-lg">
                            <div>
                              <p className="text-xs text-neutral-500">Nombre completo</p>
                              <p className="font-medium">{selectedOrder.customer_name}</p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyToClipboard(selectedOrder.customer_name, "name")}
                              className="shrink-0"
                            >
                              {copiedField === "name" ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                            </Button>
                          </div>

                          {selectedOrder.customer_phone && (
                            <div className="flex items-center justify-between bg-neutral-100 p-3 rounded-lg">
                              <div>
                                <p className="text-xs text-neutral-500">Telefono</p>
                                <p className="font-medium">{selectedOrder.customer_phone}</p>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => copyToClipboard(selectedOrder.customer_phone, "phone")}
                                className="shrink-0"
                              >
                                {copiedField === "phone" ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                              </Button>
                            </div>
                          )}

                          {typeof selectedOrder.shipping_address === "string" && selectedOrder.shipping_address && (
                            <div className="flex items-center justify-between bg-neutral-100 p-3 rounded-lg">
                              <div>
                                <p className="text-xs text-neutral-500">Direccion de envio</p>
                                <p className="font-medium">{selectedOrder.shipping_address}</p>
                                {selectedOrder.shipping_city && (
                                  <p className="text-sm text-neutral-600">{selectedOrder.shipping_city}</p>
                                )}
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => copyToClipboard(
                                  `${selectedOrder.shipping_address}${selectedOrder.shipping_city ? `, ${selectedOrder.shipping_city}` : ""}`,
                                  "address"
                                )}
                                className="shrink-0"
                              >
                                {copiedField === "address" ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                              </Button>
                            </div>
                          )}

                          {/* Boton copiar todo */}
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => {
                              const fullAddress = [
                                selectedOrder.customer_name,
                                selectedOrder.customer_phone || "",
                                selectedOrder.shipping_address || "",
                                selectedOrder.shipping_city || ""
                              ].filter(Boolean).join("\n")
                              copyToClipboard(fullAddress, "all")
                            }}
                          >
                            {copiedField === "all" ? (
                              <>
                                <Check className="w-4 h-4 mr-2 text-green-600" />
                                Copiado
                              </>
                            ) : (
                              <>
                                <Copy className="w-4 h-4 mr-2" />
                                Copiar todos los datos
                              </>
                            )}
                          </Button>
                        </div>

                        {/* Botones para comprar en tienda madre */}
                        <div className="border-t pt-4 space-y-2">
                          {(selectedOrder.items || []).map((item, index) => (
                            <a
                              key={index}
                              href={item.source_url || sourceUrl || "#"}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between bg-violet-600 hover:bg-violet-700 text-white px-4 py-3 rounded-lg transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                {item.image_url && (
                                  <img src={item.image_url} alt="" className="w-10 h-10 rounded object-cover" />
                                )}
                                <div>
                                  <p className="font-medium text-sm">{item.name}</p>
                                  <p className="text-xs text-violet-200">
                                    {item.size || item.selectedSize ? `Talle: ${item.size || item.selectedSize} · ` : ""}
                                    Cantidad: {item.quantity}
                                  </p>
                                </div>
                              </div>
                              <ExternalLink className="w-5 h-5" />
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {canCronograma && activeTab === "pago" && (
                <>
                  <h2 className="text-[16px] font-semibold text-neutral-900 mb-4">Pago</h2>
                  <div className="bg-[#fafafa] border border-neutral-200 rounded-lg p-4 mb-3.5">
                    <p className="text-sm text-neutral-500 mb-2">Estado del pago</p>
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${statusColors[selectedOrder.status] || statusColors.pending}`}
                    >
                      {statusLabels[selectedOrder.status] || selectedOrder.status}
                    </span>
                  </div>
                  <div className="bg-[#fafafa] border border-neutral-200 rounded-lg p-4">
                    <p className="text-sm text-neutral-500 mb-2">Medio de pago</p>
                    <p className="text-sm text-neutral-900 my-1"><b className="text-neutral-500 font-semibold mr-1.5">Medio:</b> {getPaymentLabel(selectedOrder.payment_method)}</p>
                    <p className="text-sm text-neutral-900 my-1"><b className="text-neutral-500 font-semibold mr-1.5">Monto:</b> ${Number(selectedOrder.total).toLocaleString()}</p>
                    {selectedOrder.payment_method === "mercadopago" ? (
                      selectedOrder.payment_id ? (
                        <>
                          <p className="text-sm text-neutral-900 my-1"><b className="text-neutral-500 font-semibold mr-1.5">ID de operación MP:</b> {selectedOrder.payment_id}</p>
                          <button
                            className="inline-block bg-white border border-neutral-300 text-neutral-900 px-3 py-1.5 rounded-md text-xs font-semibold mt-2 hover:bg-neutral-100"
                            onClick={() => window.open("https://www.mercadopago.com.ar/activities", "_blank")}
                          >
                            Verificar en Mercado Pago ↗
                          </button>
                        </>
                      ) : (
                        <p className="text-sm text-amber-800 mt-2">Todavía no llegó la confirmación de pago de Mercado Pago para este pedido (sin ID de operación guardado).</p>
                      )
                    ) : (
                      <p className="text-sm text-neutral-500 mt-2">Este pedido no se pagó por Mercado Pago, no hay un link de verificación automático para {getPaymentLabel(selectedOrder.payment_method)}.</p>
                    )}
                  </div>
                </>
              )}

              {canCronograma && activeTab === "stock" && (
                <>
                  <h2 className="text-[16px] font-semibold text-neutral-900 mb-4">Stock</h2>
                  <div className="bg-[#fafafa] border border-neutral-200 rounded-lg p-4 mb-3.5">
                    <p className="text-sm text-neutral-500 mb-2">Stock real disponible ahora</p>
                    {!stockCheckItems ? (
                      <p className="text-sm text-neutral-500">Todavía no se consultó el stock de este pedido en esta sesión. Tocá "Verificar ahora".</p>
                    ) : (
                      <div className="space-y-3">
                        {stockCheckItems.map((item, i) => (
                          <div key={i} className="flex items-baseline gap-2.5">
                            <span className={`text-[32px] font-extrabold ${item.sufficient ? "text-neutral-900" : "text-red-800"}`}>{item.available}</span>
                            <span className="text-sm text-neutral-900">unidades de <b>{item.name}{item.size ? ` (talle ${item.size})` : ""}</b> — pedido: {item.requested}</span>
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${item.sufficient ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}>
                              {item.sufficient ? "En stock" : "Sin stock suficiente"}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="text-xs text-neutral-500 mt-2.5">
                      {stockCheckedAt ? `Última consulta: ${new Date(stockCheckedAt).toLocaleString()}` : "Sin consultar aún"}{" "}
                      <button
                        className="inline-block bg-white border border-neutral-300 text-neutral-900 px-3 py-1.5 rounded-md text-xs font-semibold ml-1 hover:bg-neutral-100"
                        onClick={checkStockTab}
                        disabled={stockCheckingTab}
                      >
                        {stockCheckingTab ? "Verificando..." : "Verificar ahora"}
                      </button>
                    </div>
                  </div>

                  <div className="bg-[#fafafa] border border-neutral-200 rounded-lg p-4">
                    <p className="text-sm text-neutral-500 mb-2">Confirmar pedido</p>
                    {["confirmed", "purchased_at_source", "shipped", "delivered"].includes(selectedOrder.status) ? (
                      <p className="text-sm text-emerald-700">Pedido confirmado.</p>
                    ) : (
                      <>
                        <p className="text-xs text-neutral-500 mb-2.5">
                          Chequea el stock real contra la base y, si alcanza, confirma el pedido. Si no alcanza, te avisa qué falta.
                        </p>
                        <Button
                          size="sm"
                          onClick={() => checkStockAndConfirm(selectedOrder)}
                          disabled={processing || checkingStock}
                        >
                          <Package className="w-4 h-4 mr-1" /> {checkingStock ? "Chequeando stock..." : "Confirmar pedido"}
                        </Button>
                      </>
                    )}
                  </div>
                </>
              )}

              {canCronograma && activeTab === "devolver" && (
                <>
                  <h2 className="text-[16px] font-semibold text-neutral-900 mb-4">Devolver</h2>
                  {selectedOrder.status === "refunded" ? (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-sm text-emerald-800">
                      Este pedido ya fue reembolsado.
                    </div>
                  ) : (
                    <div className="bg-[#fafafa] border border-neutral-200 rounded-lg p-4">
                      <p className="text-sm text-neutral-900 mb-3">
                        Vas a devolver <strong>${Number(selectedOrder.total).toLocaleString()}</strong> a{" "}
                        <strong>{selectedOrder.customer_name}</strong>, a la cuenta de donde salió el pago.
                      </p>
                      <label className="block text-sm font-medium mb-2 text-neutral-700">Motivo (opcional, se le avisa al cliente)</label>
                      <textarea
                        value={refundReason}
                        onChange={(e) => setRefundReason(e.target.value)}
                        className="w-full max-w-[380px] border border-neutral-300 rounded-md p-2 text-sm mb-3 bg-white"
                        rows={3}
                        placeholder="Ej: Falta de stock, error en el pedido..."
                      />
                      <button
                        className="block bg-red-700 hover:bg-red-800 disabled:bg-neutral-300 text-white font-semibold text-sm px-4 py-2.5 rounded-md"
                        onClick={processRefund}
                        disabled={processing}
                      >
                        {processing ? "Procesando..." : `Devolver $${Number(selectedOrder.total).toLocaleString()} y avisar por mail`}
                      </button>
                    </div>
                  )}
                </>
              )}

              {canCronograma && activeTab === "remito" && (
                <>
                  <h2 className="text-[16px] font-semibold text-neutral-900 mb-4">Remito / Factura</h2>
                  <div className="grid grid-cols-2 gap-5 items-start">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-xs font-bold text-neutral-500 uppercase tracking-wide">Remito</div>
                        <button
                          className="inline-flex items-center bg-neutral-900 hover:bg-neutral-800 text-white px-3 py-1.5 rounded-md text-xs font-semibold"
                          onClick={() => window.open(`/api/admin/orders/remito?orderId=${selectedOrder.id}`, "_blank")}
                        >
                          <Printer className="w-3.5 h-3.5 mr-1" /> Imprimir
                        </button>
                      </div>
                      <div className="bg-white border border-neutral-200 rounded-md shadow-[0_4px_14px_rgba(0,0,0,0.08)] overflow-hidden">
                        <iframe src={`/api/admin/orders/remito?orderId=${selectedOrder.id}`} className="w-full h-80" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-xs font-bold text-neutral-500 uppercase tracking-wide">
                          Factura
                          {selectedOrder.invoiced_at && (
                            <span className="ml-2 text-[11px] font-medium normal-case text-emerald-700">
                              (facturado el {new Date(selectedOrder.invoiced_at).toLocaleString()})
                            </span>
                          )}
                        </div>
                        <button
                          className="inline-flex items-center bg-neutral-900 hover:bg-neutral-800 text-white px-3 py-1.5 rounded-md text-xs font-semibold"
                          onClick={() => window.open(`/api/admin/orders/factura?orderId=${selectedOrder.id}`, "_blank")}
                        >
                          <Printer className="w-3.5 h-3.5 mr-1" /> Imprimir
                        </button>
                      </div>
                      <div className="bg-white border border-neutral-200 rounded-md shadow-[0_4px_14px_rgba(0,0,0,0.08)] overflow-hidden">
                        <iframe src={`/api/admin/orders/factura?orderId=${selectedOrder.id}`} className="w-full h-80" />
                      </div>
                      <button
                        className={`inline-block mt-3 px-3 py-1.5 rounded-md text-xs font-semibold text-white disabled:bg-neutral-300 ${selectedOrder.invoiced_at ? "bg-emerald-600 hover:bg-emerald-700" : "bg-neutral-900 hover:bg-neutral-800"}`}
                        onClick={() => markInvoiced(selectedOrder)}
                        disabled={invoicing || !!selectedOrder.invoiced_at}
                      >
                        {invoicing ? "Marcando..." : selectedOrder.invoiced_at ? "Facturado ✓" : "Marcar facturado"}
                      </button>
                      <p className="text-[11px] text-neutral-400 mt-3">
                        La factura con CAE real de AFIP todavía depende del proyecto de facturación electrónica (falta correr la migración en Supabase); por ahora esto solo deja constancia interna.
                      </p>
                    </div>
                  </div>
                </>
              )}

              {canCronograma && activeTab === "envio" && (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-[16px] font-semibold text-neutral-900">Envío</h2>
                    {selectedOrder.shipping_cost != null && (
                      <span className="text-lg font-bold text-neutral-900">${Number(selectedOrder.shipping_cost).toLocaleString()}</span>
                    )}
                  </div>
                  {selectedOrder.shipping_method === "pickup" ? (
                    <p className="text-sm text-neutral-500">Este pedido es retiro en local, no lleva guía de transporte.</p>
                  ) : (
                    <div className="flex flex-col gap-4">
                    <div className="bg-[#fafafa] border border-neutral-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-neutral-500">1. Pago a Enviamelo (Mercado Pago)</p>
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${selectedOrder.shipping_guide_paid_at ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                          {selectedOrder.shipping_guide_paid_at ? "Pagado" : "Pendiente"}
                        </span>
                      </div>
                      {selectedOrder.shipping_guide_amount != null ? (
                        <p className="text-sm text-neutral-900 mb-2.5">
                          Monto a transferir por este envío: <b>${Number(selectedOrder.shipping_guide_amount).toLocaleString()}</b>
                        </p>
                      ) : (
                        <p className="text-xs text-neutral-500 mb-2.5">
                          Todavía no se generó la guía, así que no hay un monto exacto de Enviamelo — usá el precio de envío de arriba como referencia, o generá la guía primero.
                        </p>
                      )}
                      {guiaPaymentInfo && (guiaPaymentInfo.alias || guiaPaymentInfo.cbu) ? (
                        <div className="space-y-2 mb-2.5">
                          {guiaPaymentInfo.alias && (
                            <div className="flex items-center justify-between bg-white rounded p-2 border border-neutral-200">
                              <span className="text-sm">Alias: <strong>{guiaPaymentInfo.alias}</strong></span>
                              <Button variant="outline" size="sm" onClick={() => copyToClipboard(guiaPaymentInfo.alias, "envio-alias")}>
                                {copiedField === "envio-alias" ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                              </Button>
                            </div>
                          )}
                          {guiaPaymentInfo.cbu && (
                            <div className="flex items-center justify-between bg-white rounded p-2 border border-neutral-200">
                              <span className="text-sm">CBU: <strong>{guiaPaymentInfo.cbu}</strong></span>
                              <Button variant="outline" size="sm" onClick={() => copyToClipboard(guiaPaymentInfo.cbu, "envio-cbu")}>
                                {copiedField === "envio-cbu" ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                              </Button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded p-2 mb-2.5">
                          Falta cargar el alias/CBU de Enviamelo en el sistema (ENVIAMELO_PAYMENT_ALIAS / ENVIAMELO_PAYMENT_CBU) — sin eso no hay a quién mandarle la plata desde acá.
                        </p>
                      )}
                      {guiaPaymentInfo && (guiaPaymentInfo.alias || guiaPaymentInfo.cbu) && (
                        <p className="text-xs text-neutral-500 mb-2.5">
                          En Mercado Pago: <b>Tu dinero → Transferir</b>, pegá el alias/CBU de arriba{selectedOrder.shipping_guide_amount != null ? ` y cargá $${Number(selectedOrder.shipping_guide_amount).toLocaleString()}` : ""}. La página de "Actividad" de MP no sirve para esto, es solo el historial.
                        </p>
                      )}
                      <div className="flex flex-wrap gap-2">
                        <button
                          className="inline-flex items-center bg-white border border-neutral-300 text-neutral-900 px-3 py-1.5 rounded-md text-xs font-semibold hover:bg-neutral-100"
                          onClick={() => window.open("https://www.mercadopago.com.ar/money-out/transfer/dashboard", "_blank")}
                        >
                          <DollarSign className="w-3.5 h-3.5 mr-1" /> Pagar con Mercado Pago al transporte
                        </button>
                        {!selectedOrder.shipping_guide_paid_at && (
                          <button
                            className="inline-flex items-center bg-emerald-600 text-white px-3 py-1.5 rounded-md text-xs font-semibold hover:bg-emerald-700 disabled:opacity-50"
                            onClick={() => markShippingPaid(selectedOrder)}
                            disabled={markingShippingPaid}
                          >
                            {markingShippingPaid ? "Marcando..." : "Ya transferí — marcar como pagado"}
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="bg-[#fafafa] border border-neutral-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-neutral-500">2. Guía de transporte (vía Enviamelo)</p>
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${selectedOrder.shipping_guide_generated_at ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}>
                          {selectedOrder.shipping_guide_generated_at ? "Generada" : "Sin generar"}
                        </span>
                      </div>
                      {selectedOrder.shipping_guide_generated_at ? (
                        <>
                          <p className="text-sm text-neutral-900 mt-2"><b className="text-neutral-500 font-semibold mr-1.5">N° de guía:</b> {selectedOrder.shipping_guide_id}</p>
                          <p className="text-xs text-neutral-500 mt-1">{new Date(selectedOrder.shipping_guide_generated_at).toLocaleString()}</p>
                          {selectedOrder.shipping_guide_pdf_url && (
                            <button
                              className="inline-block bg-white border border-neutral-300 text-neutral-900 px-3 py-1.5 rounded-md text-xs font-semibold mt-2.5 hover:bg-neutral-100"
                              onClick={() => window.open(selectedOrder.shipping_guide_pdf_url!, "_blank")}
                            >
                              Ver / imprimir etiqueta
                            </button>
                          )}
                        </>
                      ) : !selectedOrder.shipping_guide_paid_at ? (
                        <p className="text-xs text-neutral-500 mt-2.5">
                          Bloqueado hasta marcar el paso 1 como pagado.
                        </p>
                      ) : (
                        <div className="mt-2.5">
                          <button
                            className="inline-flex items-center bg-white border border-neutral-300 text-neutral-900 px-3 py-1.5 rounded-md text-xs font-semibold hover:bg-neutral-100"
                            onClick={() => openGuiaModal(selectedOrder)}
                          >
                            <Truck className="w-3.5 h-3.5 mr-1" /> Generar guía con Enviamelo
                          </button>
                        </div>
                      )}
                    </div>
                    </div>
                  )}
                </>
              )}

              {canCronograma && activeTab === "entrega" && (
                <>
                  <h2 className="text-[16px] font-semibold text-neutral-900 mb-4">Entrega</h2>
                  {!selectedOrder.shipping_guide_id && selectedOrder.shipping_method !== "pickup" && (
                    <p className="text-sm text-neutral-500 mb-3.5">Todavía no se generó la guía en la pestaña Envío — igual podés marcar la entrega manualmente cuando corresponda.</p>
                  )}
                  {selectedOrder.shipping_guide_id && (
                    <div className="bg-[#fafafa] border border-neutral-200 rounded-lg p-4 mb-3.5">
                      <p className="text-sm text-neutral-500 mb-2">Confirmación de entrega (según Enviamelo)</p>
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${selectedOrder.status === "delivered" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                        {selectedOrder.status === "delivered" ? "Entregado" : "Aún no entregado"}
                      </span>
                      <p className="text-sm text-neutral-900 mt-2"><b className="text-neutral-500 font-semibold mr-1.5">Guía:</b> #{selectedOrder.shipping_guide_id}</p>
                      <p className="text-sm text-neutral-900 mt-1"><b className="text-neutral-500 font-semibold mr-1.5">Estado interno:</b> {statusLabels[selectedOrder.status] || selectedOrder.status}</p>
                      <p className="text-xs text-neutral-500 mt-2.5">
                        Enviamelo es un agregador: la confirmación real de entrega (firma o foto del transportista) hay que verla en el tracking del transportista asignado, no llega estructurada por esta API todavía.
                      </p>
                      {selectedOrder.shipping_guide_pdf_url && (
                        <button
                          className="inline-block bg-white border border-neutral-300 text-neutral-900 px-3 py-1.5 rounded-md text-xs font-semibold mt-2.5 hover:bg-neutral-100"
                          onClick={() => window.open(selectedOrder.shipping_guide_pdf_url!, "_blank")}
                        >
                          Ver etiqueta / datos de envío
                        </button>
                      )}
                    </div>
                  )}
                  <div className="bg-[#fafafa] border border-neutral-200 rounded-lg p-4">
                    <p className="text-sm text-neutral-500 mb-2">Marcar entrega</p>
                    {selectedOrder.status === "delivered" ? (
                      <p className="text-sm text-emerald-700">Pedido marcado como entregado.</p>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => updateOrderStatus(selectedOrder.id, "delivered")}
                        disabled={processing}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" /> Marcar como entregado
                      </Button>
                    )}
                  </div>
                </>
              )}
                  </div>
                </div>
                )
              })()}

              {!canCronograma && (
                <>
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div className="bg-neutral-100 p-4 rounded-lg">
                      <h4 className="font-medium mb-2 text-sm text-neutral-500">CLIENTE</h4>
                      <p className="font-semibold">{selectedOrder.customer_name}</p>
                      <p className="text-sm text-neutral-600">{selectedOrder.customer_email}</p>
                      {selectedOrder.customer_phone && (
                        <p className="text-sm text-neutral-600">Tel: {selectedOrder.customer_phone}</p>
                      )}
                    </div>

                    <div className="bg-neutral-100 p-4 rounded-lg">
                      <h4 className="font-medium mb-2 text-sm text-neutral-500">ENVÍO</h4>
                      <p className="font-semibold">
                        {selectedOrder.shipping_label || (selectedOrder.shipping_method === "pickup" ? "Retiro en local" : "Envío a domicilio")}
                      </p>
                      {typeof selectedOrder.shipping_address === "string" && selectedOrder.shipping_address && (
                        <>
                          <p className="text-sm text-neutral-600">{selectedOrder.shipping_address}</p>
                          <p className="text-sm text-neutral-600">{selectedOrder.shipping_city}</p>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div className="bg-neutral-100 p-4 rounded-lg">
                      <h4 className="font-medium mb-2 text-sm text-neutral-500">MÉTODO DE PAGO</h4>
                      <p className="font-semibold">{getPaymentLabel(selectedOrder.payment_method)}</p>
                    </div>

                    <div className="bg-neutral-100 p-4 rounded-lg">
                      <h4 className="font-medium mb-2 text-sm text-neutral-500">ESTADO ACTUAL</h4>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[selectedOrder.status] || statusColors.pending}`}
                      >
                        {statusLabels[selectedOrder.status] || selectedOrder.status}
                      </span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-medium mb-3 text-sm text-neutral-500">PRODUCTOS</h4>
                    <div className="border rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-neutral-100">
                          <tr className="text-left text-sm">
                            <th className="p-3 font-medium">Producto</th>
                            <th className="p-3 font-medium text-center">Talle</th>
                            <th className="p-3 font-medium text-center">Cant.</th>
                            <th className="p-3 font-medium text-right">Precio</th>
                            <th className="p-3 font-medium text-right">Subtotal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(selectedOrder.items || []).map((item, index) => (
                            <tr key={index} className="border-t">
                              <td className="p-3">
                                <div className="flex items-center gap-3">
                                  {item.image_url && (
                                    <img
                                      src={item.image_url || "/images/placeholders/placeholder.svg"}
                                      alt={item.name}
                                      className="w-12 h-12 object-cover rounded"
                                    />
                                  )}
                                  <span className="font-medium">{item.name}</span>
                                </div>
                              </td>
                              <td className="p-3 text-center">
                                {item.size || item.selectedSize ? (
                                  <span className="bg-black text-white px-2 py-1 rounded text-sm">
                                    {item.size || item.selectedSize}
                                  </span>
                                ) : (
                                  <span className="text-neutral-400">-</span>
                                )}
                              </td>
                              <td className="p-3 text-center">{item.quantity}</td>
                              <td className="p-3 text-right">${Number(item.price).toLocaleString()}</td>
                              <td className="p-3 text-right font-semibold">
                                ${(item.price * item.quantity).toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-neutral-100">
                          <tr className="border-t">
                            <td colSpan={4} className="p-3 text-right font-bold">
                              TOTAL
                            </td>
                            <td className="p-3 text-right font-bold text-lg">
                              ${Number(selectedOrder.total).toLocaleString()}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>

                  {/* Observaciones del cliente */}
                  {selectedOrder.notes && (
                    <div className="mb-6">
                      <h4 className="font-medium mb-2 text-sm text-neutral-500">OBSERVACIONES</h4>
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <p className="text-sm text-neutral-700">{selectedOrder.notes}</p>
                      </div>
                    </div>
                  )}

                  {/* Direccion de entrega */}
                  {typeof selectedOrder.shipping_address === "string" && selectedOrder.shipping_address && (
                    <div className="mb-6">
                      <h4 className="font-medium mb-2 text-sm text-neutral-500">DIRECCION DE ENTREGA</h4>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-sm text-neutral-700">{selectedOrder.shipping_address}</p>
                      </div>
                    </div>
                  )}

                  {/* Seccion Dropshipping - Solo para tiendas dropship */}
                  {isDropship && (
                    <div className="mb-6 border-2 border-violet-300 rounded-lg overflow-hidden">
                      <div className="bg-violet-100 px-4 py-3 border-b border-violet-200">
                        <h4 className="font-bold text-violet-900 flex items-center gap-2">
                          <Package className="w-5 h-5" />
                          Comprar en tienda madre
                        </h4>
                        <p className="text-xs text-violet-700 mt-1">
                          Copia los datos del cliente y compra el producto en la tienda de origen
                        </p>
                      </div>
                      <div className="p-4 bg-white">
                        {/* Datos para copiar */}
                        <div className="space-y-3 mb-4">
                          <div className="flex items-center justify-between bg-neutral-100 p-3 rounded-lg">
                            <div>
                              <p className="text-xs text-neutral-500">Nombre completo</p>
                              <p className="font-medium">{selectedOrder.customer_name}</p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyToClipboard(selectedOrder.customer_name, "name")}
                              className="shrink-0"
                            >
                              {copiedField === "name" ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                            </Button>
                          </div>

                          {selectedOrder.customer_phone && (
                            <div className="flex items-center justify-between bg-neutral-100 p-3 rounded-lg">
                              <div>
                                <p className="text-xs text-neutral-500">Telefono</p>
                                <p className="font-medium">{selectedOrder.customer_phone}</p>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => copyToClipboard(selectedOrder.customer_phone, "phone")}
                                className="shrink-0"
                              >
                                {copiedField === "phone" ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                              </Button>
                            </div>
                          )}

                          {typeof selectedOrder.shipping_address === "string" && selectedOrder.shipping_address && (
                            <div className="flex items-center justify-between bg-neutral-100 p-3 rounded-lg">
                              <div>
                                <p className="text-xs text-neutral-500">Direccion de envio</p>
                                <p className="font-medium">{selectedOrder.shipping_address}</p>
                                {selectedOrder.shipping_city && (
                                  <p className="text-sm text-neutral-600">{selectedOrder.shipping_city}</p>
                                )}
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => copyToClipboard(
                                  `${selectedOrder.shipping_address}${selectedOrder.shipping_city ? `, ${selectedOrder.shipping_city}` : ""}`,
                                  "address"
                                )}
                                className="shrink-0"
                              >
                                {copiedField === "address" ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                              </Button>
                            </div>
                          )}

                          {/* Boton copiar todo */}
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => {
                              const fullAddress = [
                                selectedOrder.customer_name,
                                selectedOrder.customer_phone || "",
                                selectedOrder.shipping_address || "",
                                selectedOrder.shipping_city || ""
                              ].filter(Boolean).join("\n")
                              copyToClipboard(fullAddress, "all")
                            }}
                          >
                            {copiedField === "all" ? (
                              <>
                                <Check className="w-4 h-4 mr-2 text-green-600" />
                                Copiado
                              </>
                            ) : (
                              <>
                                <Copy className="w-4 h-4 mr-2" />
                                Copiar todos los datos
                              </>
                            )}
                          </Button>
                        </div>

                        {/* Botones para comprar en tienda madre */}
                        <div className="border-t pt-4 space-y-2">
                          {(selectedOrder.items || []).map((item, index) => (
                            <a
                              key={index}
                              href={item.source_url || sourceUrl || "#"}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between bg-violet-600 hover:bg-violet-700 text-white px-4 py-3 rounded-lg transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                {item.image_url && (
                                  <img src={item.image_url} alt="" className="w-10 h-10 rounded object-cover" />
                                )}
                                <div>
                                  <p className="font-medium text-sm">{item.name}</p>
                                  <p className="text-xs text-violet-200">
                                    {item.size || item.selectedSize ? `Talle: ${item.size || item.selectedSize} · ` : ""}
                                    Cantidad: {item.quantity}
                                  </p>
                                </div>
                              </div>
                              <ExternalLink className="w-5 h-5" />
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {!canCronograma && (
                <div className="mb-6">
                  <h4 className="font-medium mb-3 text-sm text-neutral-500">CAMBIAR ESTADO</h4>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant={selectedOrder.status === "pending" ? "default" : "outline"}
                      onClick={() => updateOrderStatus(selectedOrder.id, "pending")}
                      disabled={processing}
                    >
                      <Clock className="w-4 h-4 mr-1" /> Pendiente
                    </Button>
                    <Button
                      size="sm"
                      variant={selectedOrder.status === "confirmed" ? "default" : "outline"}
                      onClick={() => updateOrderStatus(selectedOrder.id, "confirmed")}
                      disabled={processing}
                    >
                      <Package className="w-4 h-4 mr-1" /> Confirmado
                    </Button>
                    {isDropship && (
                      <Button
                        size="sm"
                        variant={selectedOrder.status === "purchased_at_source" ? "default" : "outline"}
                        onClick={() => updateOrderStatus(selectedOrder.id, "purchased_at_source")}
                        disabled={processing}
                        className={selectedOrder.status === "purchased_at_source" ? "bg-violet-600 hover:bg-violet-700" : "border-violet-300 text-violet-700 hover:bg-violet-50"}
                      >
                        <ShoppingCart className="w-4 h-4 mr-1" /> Comprado en origen
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant={selectedOrder.status === "shipped" ? "default" : "outline"}
                      onClick={() => updateOrderStatus(selectedOrder.id, "shipped")}
                      disabled={processing}
                    >
                      <Truck className="w-4 h-4 mr-1" /> Enviado
                    </Button>
                    <Button
                      size="sm"
                      variant={selectedOrder.status === "delivered" ? "default" : "outline"}
                      onClick={() => updateOrderStatus(selectedOrder.id, "delivered")}
                      disabled={processing}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" /> Entregado
                    </Button>
                  </div>
                </div>
              )}

              {!canCronograma && selectedOrder.status !== "refunded" && selectedOrder.status !== "cancelled" && (
                <div className="border-t pt-4">
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => setShowRefundModal(true)}
                    disabled={processing}
                  >
                    <DollarSign className="w-4 h-4 mr-2" />
                    Devolver dinero
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showRefundModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold">Procesar reembolso</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowRefundModal(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <p className="text-neutral-600 mb-4">
                Vas a reembolsar <strong>${Number(selectedOrder.total).toLocaleString()}</strong> al cliente{" "}
                <strong>{selectedOrder.customer_name}</strong>.
              </p>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Motivo del reembolso (opcional)</label>
                <textarea
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  className="w-full border rounded-lg p-3 text-sm"
                  rows={3}
                  placeholder="Ej: Producto sin stock, error en el pedido..."
                />
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => setShowRefundModal(false)}
                  disabled={processing}
                >
                  Cancelar
                </Button>
                <Button variant="destructive" className="flex-1" onClick={processRefund} disabled={processing}>
                  {processing ? "Procesando..." : "Confirmar reembolso"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showGuiaModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold">Guía automática (test) — Enviamelo</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowGuiaModal(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {!guiaResult ? (
                <>
                  <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                    "Generar guía" genera un envío real y cobra en la cuenta de Enviamelo. Si querés probar el sistema sin gastar nada, usá "Vista previa (demo)": arma un PDF de ejemplo con estos mismos datos, sin llamar a Enviamelo.
                  </p>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="block text-xs font-medium mb-1">Nombre</label>
                      <input className="w-full border rounded-lg p-2 text-sm" value={guiaForm.recipientName}
                        onChange={(e) => setGuiaForm({ ...guiaForm, recipientName: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Apellido</label>
                      <input className="w-full border rounded-lg p-2 text-sm" value={guiaForm.recipientLastName}
                        onChange={(e) => setGuiaForm({ ...guiaForm, recipientLastName: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">DNI</label>
                      <input className="w-full border rounded-lg p-2 text-sm" value={guiaForm.recipientDni}
                        onChange={(e) => setGuiaForm({ ...guiaForm, recipientDni: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Teléfono</label>
                      <input className="w-full border rounded-lg p-2 text-sm" value={guiaForm.recipientPhone}
                        onChange={(e) => setGuiaForm({ ...guiaForm, recipientPhone: e.target.value })} />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-medium mb-1">Email</label>
                      <input className="w-full border rounded-lg p-2 text-sm" value={guiaForm.recipientEmail}
                        onChange={(e) => setGuiaForm({ ...guiaForm, recipientEmail: e.target.value })} />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-medium mb-1">Producto</label>
                      <input className="w-full border rounded-lg p-2 text-sm" value={guiaForm.product}
                        onChange={(e) => setGuiaForm({ ...guiaForm, product: e.target.value })} />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-medium mb-1">Provincia</label>
                      <select className="w-full border rounded-lg p-2 text-sm" value={guiaForm.province}
                        onChange={(e) => setGuiaForm({ ...guiaForm, province: e.target.value })}>
                        <option value="">Seleccionar...</option>
                        {["Capital Federal", "Buenos Aires-GBA", "Buenos Aires", "Santa Fe", "Entre Ríos",
                          "Corrientes", "Tucumán", "Salta", "Córdoba", "Mendoza", "Neuquén", "Río Negro",
                          "Chubut", "Santa Cruz"].map((p) => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Localidad</label>
                      <input className="w-full border rounded-lg p-2 text-sm" value={guiaForm.location}
                        onChange={(e) => setGuiaForm({ ...guiaForm, location: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Código postal</label>
                      <input className="w-full border rounded-lg p-2 text-sm" value={guiaForm.postalCode}
                        onChange={(e) => setGuiaForm({ ...guiaForm, postalCode: e.target.value })} />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-medium mb-1">Calle</label>
                      <input className="w-full border rounded-lg p-2 text-sm" value={guiaForm.street}
                        onChange={(e) => setGuiaForm({ ...guiaForm, street: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Altura</label>
                      <input className="w-full border rounded-lg p-2 text-sm" value={guiaForm.height}
                        onChange={(e) => setGuiaForm({ ...guiaForm, height: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Piso (opcional)</label>
                      <input className="w-full border rounded-lg p-2 text-sm" value={guiaForm.floor}
                        onChange={(e) => setGuiaForm({ ...guiaForm, floor: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Depto (opcional)</label>
                      <input className="w-full border rounded-lg p-2 text-sm" value={guiaForm.departament}
                        onChange={(e) => setGuiaForm({ ...guiaForm, departament: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Peso (kg)</label>
                      <input className="w-full border rounded-lg p-2 text-sm" value={guiaForm.weight}
                        onChange={(e) => setGuiaForm({ ...guiaForm, weight: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Dimensiones (LxAxA cm)</label>
                      <input className="w-full border rounded-lg p-2 text-sm" value={guiaForm.dimensions}
                        onChange={(e) => setGuiaForm({ ...guiaForm, dimensions: e.target.value })} />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-medium mb-1">Nota (opcional)</label>
                      <input className="w-full border rounded-lg p-2 text-sm" value={guiaForm.note}
                        onChange={(e) => setGuiaForm({ ...guiaForm, note: e.target.value })} />
                    </div>
                  </div>

                  {guiaError && (
                    <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3 mb-3">{guiaError}</p>
                  )}

                  {guiaMissingFields.length > 0 && (
                    <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3 mb-3">
                      Falta completar: {guiaMissingFields.join(", ")}
                    </p>
                  )}

                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setShowGuiaModal(false)} disabled={guiaLoading || guiaDemoLoading}>
                      Cancelar
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 border-violet-300 text-violet-700 hover:bg-violet-50"
                      onClick={submitGuiaDemo}
                      disabled={!guiaFormValid || guiaLoading || guiaDemoLoading}
                    >
                      {guiaDemoLoading ? "Generando..." : "Vista previa (demo)"}
                    </Button>
                    <Button className="flex-1" onClick={submitGuia} disabled={!guiaFormValid || guiaLoading || guiaDemoLoading}>
                      {guiaLoading ? "Generando..." : "Generar guía"}
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                    Guía generada. Transacción #{guiaResult.id}.
                  </p>

                  {canCronograma && guiaResult.amount != null && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                      <p className="text-sm font-medium text-blue-900 mb-2">
                        Transferile a Enviamelo ${Number(guiaResult.amount).toLocaleString()} por este envío
                      </p>
                      {guiaPaymentInfo && (guiaPaymentInfo.alias || guiaPaymentInfo.cbu) ? (
                        <div className="space-y-2">
                          {guiaPaymentInfo.alias && (
                            <div className="flex items-center justify-between bg-white rounded p-2">
                              <span className="text-sm">Alias: <strong>{guiaPaymentInfo.alias}</strong></span>
                              <Button variant="outline" size="sm" onClick={() => copyToClipboard(guiaPaymentInfo.alias, "guia-alias")}>
                                {copiedField === "guia-alias" ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                              </Button>
                            </div>
                          )}
                          {guiaPaymentInfo.cbu && (
                            <div className="flex items-center justify-between bg-white rounded p-2">
                              <span className="text-sm">CBU: <strong>{guiaPaymentInfo.cbu}</strong></span>
                              <Button variant="outline" size="sm" onClick={() => copyToClipboard(guiaPaymentInfo.cbu, "guia-cbu")}>
                                {copiedField === "guia-cbu" ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                              </Button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-xs text-blue-700">
                          Todavía no se cargó el alias/CBU de Enviamelo en el sistema — transferilo desde tu cuenta de Mercado Pago con los datos que tengas de Enviamelo.
                        </p>
                      )}
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setShowGuiaModal(false)}>
                      Cerrar
                    </Button>
                    <Button className="flex-1" onClick={() => window.open(guiaResult.pdf, "_blank")}>
                      Ver / imprimir etiqueta
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
