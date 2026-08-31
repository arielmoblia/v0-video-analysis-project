import PDFDocument from "pdfkit/js/pdfkit.standalone.js"

interface FacturaItem {
  name: string
  price: number
  quantity: number
  size?: string
  selectedSize?: string
}

interface FacturaOrder {
  id: string
  created_at: string
  invoiced_at?: string | null
  customer_name: string
  customer_email: string
  customer_phone?: string
  items: FacturaItem[]
  total: number
  shipping_cost?: number
  shipping_method: string
  shipping_label?: string
  shipping_address?: string
  shipping_address_full?: string
  shipping_address_detail?: string
  shipping_city?: string
  shipping_postal_code?: string
  shipping_notes?: string
  payment_method: string
  status: string
  notes?: string
}

interface FacturaStore {
  site_title?: string
  address?: string
  phone?: string
  email?: string
  whatsapp_number?: string
}

const paymentLabels: Record<string, string> = {
  cash: "Efectivo",
  card: "Tarjeta presencial",
  transfer: "Transferencia bancaria",
  mercadopago: "Mercado Pago",
  mobbex: "Mobbex",
  modo: "MODO",
  uala: "Ualá Bis",
  rapipago: "Rapipago / Pago Fácil",
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

function money(n: number): string {
  return `$${Number(n || 0).toLocaleString("es-AR")}`
}

export async function generateFacturaPdf(order: FacturaOrder, store: FacturaStore): Promise<Buffer> {
  const doc = new PDFDocument({ size: "A4", margin: 40 })
  const chunks: Buffer[] = []

  doc.on("data", (chunk) => chunks.push(chunk))
  const done = new Promise<Buffer>((resolve) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)))
  })

  const storeName = store.site_title || "Tienda"

  // Encabezado
  doc.fontSize(20).font("Helvetica-Bold").text(storeName, { align: "left" })
  doc.moveDown(0.2)
  doc.fontSize(9).font("Helvetica").fillColor("#555")
  if (store.address) doc.text(store.address)
  if (store.phone) doc.text(`Tel: ${store.phone}`)
  if (store.email) doc.text(store.email)
  doc.fillColor("#000")

  doc.moveUp(store.address || store.phone || store.email ? 3 : 0)
  doc.fontSize(16).font("Helvetica-Bold").text("FACTURA", 0, doc.y, { align: "right" })
  doc.fontSize(10).font("Helvetica").text(`N° ${order.id.slice(0, 8).toUpperCase()}`, { align: "right" })
  doc.text(new Date(order.invoiced_at || order.created_at).toLocaleString("es-AR"), { align: "right" })
  doc.fontSize(8).fillColor("#888").text("Documento interno, sin CAE de AFIP", { align: "right" })
  doc.fillColor("#000")

  doc.moveDown(1)
  doc.moveTo(40, doc.y).lineTo(555, doc.y).strokeColor("#ccc").stroke()
  doc.moveDown(0.8)

  // Datos cliente / envio
  const colX = [40, 300]
  const startY = doc.y

  doc.fontSize(9).font("Helvetica-Bold").text("CLIENTE", colX[0], startY)
  doc.font("Helvetica").fontSize(10)
  doc.text(order.customer_name, colX[0])
  doc.fontSize(9).fillColor("#555")
  doc.text(order.customer_email, colX[0])
  if (order.customer_phone) doc.text(`Tel: ${order.customer_phone}`, colX[0])
  doc.fillColor("#000")

  doc.fontSize(9).font("Helvetica-Bold").text("ENVÍO", colX[1], startY)
  doc.font("Helvetica").fontSize(10)
  doc.text(
    order.shipping_label || (order.shipping_method === "pickup" ? "Retiro en local" : "Envío a domicilio"),
    colX[1],
  )
  doc.fontSize(9).fillColor("#555")
  const addressFull = order.shipping_address_full || order.shipping_address
  if (addressFull) doc.text(addressFull, colX[1], doc.y, { width: 250 })
  if (order.shipping_address_detail) doc.text(order.shipping_address_detail, colX[1], doc.y, { width: 250 })
  const cityLine = [order.shipping_city, order.shipping_postal_code].filter(Boolean).join(" - ")
  if (cityLine) doc.text(cityLine, colX[1], doc.y, { width: 250 })
  doc.fillColor("#000")

  doc.moveDown(1.5)

  doc.fontSize(9).font("Helvetica-Bold").text("FORMA DE PAGO: ", { continued: true })
  doc.font("Helvetica").text(paymentLabels[order.payment_method] || order.payment_method || "-")
  doc.font("Helvetica-Bold").text("ESTADO DEL PEDIDO: ", { continued: true })
  doc.font("Helvetica").text(statusLabels[order.status] || order.status)

  if (order.shipping_notes) {
    doc.moveDown(0.3)
    doc.font("Helvetica-Bold").text("NOTAS DE ENVÍO: ", { continued: true })
    doc.font("Helvetica").text(order.shipping_notes)
  }
  if (order.notes) {
    doc.moveDown(0.3)
    doc.font("Helvetica-Bold").text("OBSERVACIONES DEL CLIENTE: ", { continued: true })
    doc.font("Helvetica").text(order.notes)
  }

  doc.moveDown(1)

  // Tabla de productos
  const tableTop = doc.y
  const cols = { name: 40, size: 300, qty: 360, price: 410, subtotal: 480 }
  doc.font("Helvetica-Bold").fontSize(9)
  doc.rect(40, tableTop, 515, 20).fill("#f0f0f0")
  doc.fillColor("#000")
  doc.text("Producto", cols.name + 5, tableTop + 6)
  doc.text("Talle", cols.size, tableTop + 6)
  doc.text("Cant.", cols.qty, tableTop + 6)
  doc.text("Precio", cols.price, tableTop + 6)
  doc.text("Subtotal", cols.subtotal, tableTop + 6)

  let y = tableTop + 20
  doc.font("Helvetica").fontSize(9)

  for (const item of order.items || []) {
    const rowHeight = 22
    doc.moveTo(40, y).lineTo(555, y).strokeColor("#e5e5e5").stroke()
    doc.text(item.name, cols.name + 5, y + 6, { width: 250 })
    doc.text(item.size || item.selectedSize || "-", cols.size, y + 6)
    doc.text(String(item.quantity), cols.qty, y + 6)
    doc.text(money(item.price), cols.price, y + 6)
    doc.text(money(item.price * item.quantity), cols.subtotal, y + 6)
    y += rowHeight

    if (y > 720) {
      doc.addPage()
      y = 40
    }
  }

  doc.moveTo(40, y).lineTo(555, y).strokeColor("#ccc").stroke()
  y += 10

  const shippingCost = Number(order.shipping_cost || 0)
  if (shippingCost > 0) {
    doc.font("Helvetica").fontSize(10).text("Envío", cols.price, y)
    doc.text(money(shippingCost), cols.subtotal, y)
    y += 18
  }

  doc.font("Helvetica-Bold").fontSize(12).text("TOTAL", cols.price, y)
  doc.text(money(order.total), cols.subtotal, y)

  doc.moveDown(4)
  doc.fontSize(8).fillColor("#888").text(`Generado por tol.ar - ${new Date().toLocaleString("es-AR")}`, 40, doc.page.height - 60, {
    align: "center",
    width: 515,
  })

  doc.end()
  return done
}
