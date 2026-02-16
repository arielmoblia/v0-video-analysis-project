"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Package, Truck, CheckCircle, Clock, Eye, X, DollarSign, Printer, Trash2 } from "lucide-react"

interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  selectedSize?: string
  size?: string
  image_url?: string
}

interface Order {
  id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  shipping_method: string
  shipping_address: string
  shipping_city: string
  payment_method: string
  items: OrderItem[]
  total: number
  status: string
  created_at: string
}

interface OrdersManagerProps {
  storeId: string
  storeName?: string
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  refunded: "bg-orange-100 text-orange-800",
}

const statusLabels: Record<string, string> = {
  pending: "Pendiente",
  confirmed: "Confirmado",
  shipped: "Enviado",
  delivered: "Entregado",
  cancelled: "Cancelado",
  refunded: "Reembolsado",
}

export function OrdersManager({ storeId, storeName = "Tienda" }: OrdersManagerProps) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showRefundModal, setShowRefundModal] = useState(false)
  const [refundReason, setRefundReason] = useState("")
  const [processing, setProcessing] = useState(false)
  const printRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchOrders()
  }, [storeId])

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
            <p class="value">${selectedOrder.shipping_method === "pickup" ? "Retiro en local" : "Envío a domicilio"}</p>
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
      printWindow.document.write(printContent)
      printWindow.document.close()
      printWindow.focus()
      printWindow.print()
      printWindow.close()
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
                      {getShippingLabel(order.shipping_method)}
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
                      <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>
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
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6" ref={printRef}>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-semibold">Pedido #{selectedOrder.id.slice(0, 8)}</h3>
                  <p className="text-sm text-neutral-500">{new Date(selectedOrder.created_at).toLocaleString()}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handlePrint}>
                    <Printer className="w-4 h-4 mr-1" /> Imprimir
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(null)}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="bg-neutral-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2 text-sm text-neutral-500">CLIENTE</h4>
                  <p className="font-semibold">{selectedOrder.customer_name}</p>
                  <p className="text-sm text-neutral-600">{selectedOrder.customer_email}</p>
                  {selectedOrder.customer_phone && (
                    <p className="text-sm text-neutral-600">Tel: {selectedOrder.customer_phone}</p>
                  )}
                </div>

                <div className="bg-neutral-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2 text-sm text-neutral-500">ENVÍO</h4>
                  <p className="font-semibold">
                    {selectedOrder.shipping_method === "pickup" ? "Retiro en local" : "Envío a domicilio"}
                  </p>
                  {selectedOrder.shipping_address && (
                    <>
                      <p className="text-sm text-neutral-600">{selectedOrder.shipping_address}</p>
                      <p className="text-sm text-neutral-600">{selectedOrder.shipping_city}</p>
                    </>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="bg-neutral-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2 text-sm text-neutral-500">MÉTODO DE PAGO</h4>
                  <p className="font-semibold">{getPaymentLabel(selectedOrder.payment_method)}</p>
                </div>

                <div className="bg-neutral-50 p-4 rounded-lg">
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
                    <thead className="bg-neutral-50">
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
                                  src={item.image_url || "/placeholder.svg"}
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
                    <tfoot className="bg-neutral-50">
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
              {selectedOrder.shipping_address && (
                <div className="mb-6">
                  <h4 className="font-medium mb-2 text-sm text-neutral-500">DIRECCION DE ENTREGA</h4>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-neutral-700">{selectedOrder.shipping_address}</p>
                  </div>
                </div>
              )}

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

              <div className="estado-section">
                <h4 className="font-medium mb-3 text-sm text-neutral-500">CAMBIAR ESTADO</h4>
                <div className="estado-buttons">
                  <span
                    className={`estado-btn estado-pending ${selectedOrder.status === "pending" ? "active" : ""}`}
                    onClick={() => updateOrderStatus(selectedOrder.id, "pending")}
                  >
                    ◯ Pendiente
                  </span>
                  <span
                    className={`estado-btn estado-confirmed ${selectedOrder.status === "confirmed" ? "active" : ""}`}
                    onClick={() => updateOrderStatus(selectedOrder.id, "confirmed")}
                  >
                    ◉ Confirmado
                  </span>
                  <span
                    className={`estado-btn estado-shipped ${selectedOrder.status === "shipped" ? "active" : ""}`}
                    onClick={() => updateOrderStatus(selectedOrder.id, "shipped")}
                  >
                    📦 Enviado
                  </span>
                  <span
                    className={`estado-btn estado-delivered ${selectedOrder.status === "delivered" ? "active" : ""}`}
                    onClick={() => updateOrderStatus(selectedOrder.id, "delivered")}
                  >
                    ✓ Entregado
                  </span>
                </div>
              </div>

              {selectedOrder.status !== "refunded" && selectedOrder.status !== "cancelled" && (
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
    </div>
  )
}
