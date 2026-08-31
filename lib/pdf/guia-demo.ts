import PDFDocument from "pdfkit/js/pdfkit.standalone.js"

interface GuiaDemoData {
  storeName: string
  recipientName: string
  recipientLastName: string
  recipientDni: string
  recipientPhone: string
  recipientEmail: string
  product: string
  province: string
  location: string
  street: string
  height: string
  floor?: string
  departament?: string
  postalCode: string
  weight: string
  dimensions: string
  note?: string
}

function fakeTrackingCode(): string {
  const n = Math.floor(100000000 + Math.random() * 900000000)
  return `DEMO-${n}`
}

// Guía de ejemplo con el mismo tipo de datos que devolvería la API real de
// Enviamelo, pero sin llamarla: no genera ningún envío real ni cobra nada.
// Sirve para probar el flujo del sistema y mostrarle la idea a Enviamelo.
export async function generateGuiaDemoPdf(data: GuiaDemoData): Promise<Buffer> {
  const doc = new PDFDocument({ size: "A4", margin: 40 })
  const chunks: Buffer[] = []

  doc.on("data", (chunk) => chunks.push(chunk))
  const done = new Promise<Buffer>((resolve) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)))
  })

  const tracking = fakeTrackingCode()

  // Marca de agua diagonal
  doc.save()
  doc.rotate(-40, { origin: [300, 400] })
  doc.fontSize(90).fillColor("#f3c6c6").font("Helvetica-Bold")
  doc.text("DEMO - NO VÁLIDA", 0, 380, { align: "center", width: 600 })
  doc.restore()
  doc.fillColor("#000")
  doc.x = 40
  doc.y = 40

  doc.fontSize(9).font("Helvetica-Bold").fillColor("#b91c1c")
  doc.text("EJEMPLO / VISTA PREVIA — no es una guía real, no genera ningún envío ni cobro", { align: "center" })
  doc.fillColor("#000")
  doc.moveDown(0.8)

  doc.fontSize(18).font("Helvetica-Bold").text("Guía de envío", { align: "left" })
  doc.fontSize(9).font("Helvetica").fillColor("#555").text("Enviamelo (simulado)")
  doc.fillColor("#000")

  doc.moveUp(2)
  doc.fontSize(10).font("Helvetica-Bold").text(`N° ${tracking}`, 0, doc.y, { align: "right" })
  doc.fontSize(9).font("Helvetica").fillColor("#888")
  doc.text(new Date().toLocaleString("es-AR"), { align: "right" })
  doc.fillColor("#000")

  doc.moveDown(1)
  doc.moveTo(40, doc.y).lineTo(555, doc.y).strokeColor("#ccc").stroke()
  doc.moveDown(0.8)

  const colX = [40, 300]
  const startY = doc.y

  doc.fontSize(9).font("Helvetica-Bold").text("REMITENTE", colX[0], startY)
  doc.font("Helvetica").fontSize(10)
  doc.text(data.storeName, colX[0])

  doc.fontSize(9).font("Helvetica-Bold").text("DESTINATARIO", colX[1], startY)
  doc.font("Helvetica").fontSize(10)
  doc.text(`${data.recipientName} ${data.recipientLastName}`, colX[1])
  doc.fontSize(9).fillColor("#555")
  doc.text(`DNI: ${data.recipientDni}`, colX[1])
  doc.text(`Tel: ${data.recipientPhone}`, colX[1])
  doc.text(data.recipientEmail, colX[1])
  doc.fillColor("#000")

  doc.moveDown(2)
  doc.moveTo(40, doc.y).lineTo(555, doc.y).strokeColor("#ccc").stroke()
  doc.moveDown(0.8)

  doc.fontSize(9).font("Helvetica-Bold").text("DIRECCIÓN DE ENTREGA")
  doc.font("Helvetica").fontSize(10)
  const alturaPiso = [data.height, data.floor, data.departament].filter(Boolean).join(", piso ")
  doc.text(`${data.street} ${alturaPiso}`)
  doc.text(`${data.location}, ${data.province} (CP ${data.postalCode})`)

  doc.moveDown(1)
  doc.fontSize(9).font("Helvetica-Bold").text("PRODUCTO: ", { continued: true })
  doc.font("Helvetica").text(data.product)
  doc.font("Helvetica-Bold").text("PESO: ", { continued: true })
  doc.font("Helvetica").text(`${data.weight} kg`, { continued: true })
  doc.text("   DIMENSIONES: ", { continued: true })
  doc.text(`${data.dimensions} cm`)

  if (data.note) {
    doc.moveDown(0.5)
    doc.font("Helvetica-Bold").text("NOTA: ", { continued: true })
    doc.font("Helvetica").text(data.note)
  }

  doc.moveDown(2)
  doc.moveTo(40, doc.y).lineTo(555, doc.y).strokeColor("#ccc").stroke()
  doc.moveDown(0.8)

  // Bloque tipo código de barras (visual, no escaneable)
  const barY = doc.y
  let barX = 40
  for (let i = 0; i < 60; i++) {
    const w = Math.random() > 0.5 ? 2 : 4
    const h = 45
    doc.rect(barX, barY, w, h).fill("#000")
    barX += w + 2
  }
  doc.fillColor("#000")
  doc.fontSize(11).font("Helvetica-Bold").text(tracking, 40, barY + 50)

  doc.fontSize(8).fillColor("#888").text(
    `Documento de ejemplo generado por tol.ar - ${new Date().toLocaleString("es-AR")}. No representa un envío real ni un compromiso de Enviamelo.`,
    40,
    doc.page.height - 60,
    { align: "center", width: 515 },
  )

  doc.end()
  return done
}
