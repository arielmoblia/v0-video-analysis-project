import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import PDFDocument from "pdfkit"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

const TERMINOS_VERSION = "v1-2026-08"
const BUCKET = "store-legal-docs"

function buildTexto(adultoNombre: string, adultoDni: string, adultoRelacion: string, menorNombre: string) {
  return `Yo, ${adultoNombre}, DNI ${adultoDni}, en carácter de ${adultoRelacion} de ${menorNombre}, autorizo expresamente a que utilice la plataforma tol.ar para crear y administrar una tienda online, incluyendo la recepción de pagos a través de Mercado Pago u otros medios habilitados, asumiendo la responsabilidad legal por dicho uso.`
}

function generarPDF(data: {
  subdomain: string
  menorNombre: string
  menorFechaNacimiento: string
  menorDni: string
  adultoNombre: string
  adultoDni: string
  adultoRelacion: string
  adultoEmail: string
  adultoTelefono: string
  texto: string
  ip: string
  userAgent: string
  fecha: string
}): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 })
    const chunks: Buffer[] = []
    doc.on("data", (chunk) => chunks.push(chunk))
    doc.on("end", () => resolve(Buffer.concat(chunks)))
    doc.on("error", reject)

    doc.fontSize(18).text("Autorización Parental de Uso de Plataforma tol.ar", { align: "center" })
    doc.moveDown(1.5)

    doc.fontSize(12).text(`Tienda: ${data.subdomain}.tol.ar`)
    doc.text(`Fecha y hora de la autorización: ${data.fecha}`)
    doc.moveDown()

    doc.fontSize(14).text("Datos del menor", { underline: true })
    doc.fontSize(12)
    doc.text(`Nombre completo: ${data.menorNombre}`)
    doc.text(`Fecha de nacimiento: ${data.menorFechaNacimiento}`)
    doc.text(`DNI: ${data.menorDni}`)
    doc.moveDown()

    doc.fontSize(14).text("Datos del adulto responsable", { underline: true })
    doc.fontSize(12)
    doc.text(`Nombre completo: ${data.adultoNombre}`)
    doc.text(`DNI: ${data.adultoDni}`)
    doc.text(`Relación con el menor: ${data.adultoRelacion}`)
    doc.text(`Email de contacto: ${data.adultoEmail}`)
    doc.text(`Teléfono de contacto: ${data.adultoTelefono}`)
    doc.moveDown()

    doc.fontSize(14).text("Declaración de autorización", { underline: true })
    doc.fontSize(12).text(data.texto, { align: "justify" })
    doc.moveDown()

    doc.fontSize(12).text("El adulto responsable declara haber leído y aceptado los Términos y Condiciones y la Política de Privacidad de tol.ar vigentes al momento de esta autorización.")
    doc.moveDown(1.5)

    doc.fontSize(9).fillColor("#666666")
    doc.text(`Versión de Términos y Condiciones aceptada: ${TERMINOS_VERSION}`)
    doc.text(`IP de origen: ${data.ip}`)
    doc.text(`Navegador/dispositivo: ${data.userAgent}`)
    doc.text("Este documento se generó automáticamente y no puede ser editado ni reemplazado una vez creado.")

    doc.end()
  })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const {
    subdomain,
    menorNombre,
    menorFechaNacimiento,
    menorDni,
    adultoNombre,
    adultoDni,
    adultoRelacion,
    adultoEmail,
    adultoTelefono,
    aceptaTerminos,
  } = body || {}

  if (
    !subdomain || !menorNombre || !menorFechaNacimiento || !menorDni ||
    !adultoNombre || !adultoDni || !adultoRelacion || !adultoEmail || !adultoTelefono
  ) {
    return NextResponse.json({ error: "Faltan datos obligatorios del formulario" }, { status: 400 })
  }
  if (!aceptaTerminos) {
    return NextResponse.json({ error: "Hace falta aceptar la declaración y los Términos y Condiciones" }, { status: 400 })
  }

  const { data: store } = await supabase.from("stores").select("id").ilike("subdomain", subdomain).single()
  if (!store) return NextResponse.json({ error: "Tienda no encontrada" }, { status: 404 })

  const { data: existing } = await supabase
    .from("store_minor_consent")
    .select("id")
    .eq("store_id", store.id)
    .maybeSingle()

  if (existing) {
    return NextResponse.json({ error: "Ya existe una autorización registrada para esta tienda" }, { status: 409 })
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown"
  const userAgent = request.headers.get("user-agent") || "unknown"
  const fecha = new Date().toISOString()
  const texto = buildTexto(adultoNombre, adultoDni, adultoRelacion, menorNombre)

  let pdfBuffer: Buffer
  try {
    pdfBuffer = await generarPDF({
      subdomain, menorNombre, menorFechaNacimiento, menorDni,
      adultoNombre, adultoDni, adultoRelacion, adultoEmail, adultoTelefono,
      texto, ip, userAgent, fecha,
    })
  } catch (err) {
    return NextResponse.json({ error: "Error al generar el documento" }, { status: 500 })
  }

  const pdfPath = `${store.id}/autorizacion-menor.pdf`
  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(pdfPath, pdfBuffer, { contentType: "application/pdf", upsert: false })

  if (uploadError) {
    return NextResponse.json({ error: "Error al guardar el documento", detail: uploadError.message }, { status: 500 })
  }

  const { error: insertError } = await supabase.from("store_minor_consent").insert({
    store_id: store.id,
    menor_nombre: menorNombre,
    menor_fecha_nacimiento: menorFechaNacimiento,
    menor_dni: menorDni,
    adulto_nombre: adultoNombre,
    adulto_dni: adultoDni,
    adulto_relacion: adultoRelacion,
    adulto_email: adultoEmail,
    adulto_telefono: adultoTelefono,
    texto_autorizacion: texto,
    terminos_version: TERMINOS_VERSION,
    ip_address: ip,
    user_agent: userAgent,
    pdf_path: pdfPath,
    created_at: fecha,
  })

  if (insertError) {
    await supabase.storage.from(BUCKET).remove([pdfPath])
    return NextResponse.json({ error: "Error al registrar la autorización", detail: insertError.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}

export async function GET(request: NextRequest) {
  const subdomain = request.nextUrl.searchParams.get("subdomain")
  if (!subdomain) return NextResponse.json({ error: "Falta subdomain" }, { status: 400 })

  const { data: store } = await supabase.from("stores").select("id").ilike("subdomain", subdomain).single()
  if (!store) return NextResponse.json({ error: "Tienda no encontrada" }, { status: 404 })

  const { data: consent } = await supabase
    .from("store_minor_consent")
    .select("created_at, pdf_path")
    .eq("store_id", store.id)
    .maybeSingle()

  if (!consent) return NextResponse.json({ exists: false })

  const cookieStore = await cookies()
  const isAdmin = cookieStore.get(`admin_${String(subdomain).toLowerCase()}`)?.value === "true"

  if (!isAdmin) {
    return NextResponse.json({ exists: true, createdAt: consent.created_at })
  }

  const { data: signed } = await supabase.storage.from(BUCKET).createSignedUrl(consent.pdf_path, 3600)

  return NextResponse.json({ exists: true, createdAt: consent.created_at, signedUrl: signed?.signedUrl || null })
}
