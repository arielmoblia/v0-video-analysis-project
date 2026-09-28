import { NextResponse } from "next/server"
import { Resend } from "resend"
import { mkdir, writeFile } from "fs/promises"
import path from "path"

const resend = new Resend(process.env.RESEND_API_KEY)

// Resend limita el email a ~40MB en total entre adjuntos
const MAX_TOTAL_BYTES = 35 * 1024 * 1024

export async function POST(request: Request) {
  try {
    const form = await request.formData()
    const name = String(form.get("name") || "")
    const email = String(form.get("email") || "")
    const whatsapp = String(form.get("whatsapp") || "")
    const storeUrl = String(form.get("storeUrl") || "")
    const csv = form.get("csv") as File | null
    const fotos = form.getAll("fotos") as File[]

    if (!name || !email || !whatsapp || !storeUrl || !csv) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
    }

    const totalBytes = csv.size + fotos.reduce((sum, f) => sum + f.size, 0)
    if (totalBytes > MAX_TOTAL_BYTES) {
      return NextResponse.json(
        { error: "Los archivos pesan demasiado para enviar por acá. Mandanos el CSV solo y coordinamos las fotos por WhatsApp." },
        { status: 413 }
      )
    }

    const slug = storeUrl
      .replace(/^https?:\/\//, "")
      .replace(/[^a-z0-9.-]+/gi, "-")
      .toLowerCase()
      .substring(0, 60)
    const stamp = new Date().toISOString().replace(/[:.]/g, "-")
    const dir = path.join(process.cwd(), "migraciones-pendientes", `${stamp}_${slug}`)
    await mkdir(dir, { recursive: true })

    const attachments: { filename: string; content: Buffer }[] = []

    const csvBuffer = Buffer.from(await csv.arrayBuffer())
    await writeFile(path.join(dir, csv.name || "productos.csv"), csvBuffer)
    attachments.push({ filename: csv.name || "productos.csv", content: csvBuffer })

    for (const foto of fotos) {
      const buffer = Buffer.from(await foto.arrayBuffer())
      await writeFile(path.join(dir, foto.name), buffer)
      attachments.push({ filename: foto.name, content: buffer })
    }

    await writeFile(
      path.join(dir, "solicitud.json"),
      JSON.stringify({ name, email, whatsapp, storeUrl, recibido: new Date().toISOString() }, null, 2)
    )

    await resend.emails.send({
      from: `tol.ar - Migraciones <ventas@tiendaonline.com.ar>`,
      to: "soporte@tiendaonline.com.ar",
      subject: `[Migración Tiendanube] ${name} — ${storeUrl}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2>Nueva solicitud de migración desde Tiendanube</h2>
          <p><strong>Nombre:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>WhatsApp:</strong> ${whatsapp}</p>
          <p><strong>Tienda actual:</strong> <a href="${storeUrl}">${storeUrl}</a></p>
          <p><strong>Fotos adjuntas:</strong> ${fotos.length}</p>
          <p>Archivos también guardados en el servidor en: <code>${dir}</code></p>
        </div>
      `,
      attachments,
    })

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error("[migracion-tiendanube] Error:", err)
    return NextResponse.json({ error: "No se pudo procesar el envío" }, { status: 500 })
  }
}
