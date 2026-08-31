import { NextResponse } from "next/server"
import { Resend } from "resend"
import fs from "fs/promises"
import path from "path"

const resend = new Resend(process.env.RESEND_API_KEY)
const DATA_FILE = path.join(process.cwd(), "data", "testimonios-recibidos.json")

export async function POST(request: Request) {
  try {
    const { nombre, tienda, rubro, texto, fotoUrl } = await request.json()

    if (!nombre || !texto) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
    }

    const nuevo = {
      nombre,
      tienda: tienda || "",
      rubro: rubro || "",
      texto,
      fotoUrl: fotoUrl || "",
      fecha: new Date().toISOString(),
    }

    let lista: unknown[] = []
    try {
      const actual = await fs.readFile(DATA_FILE, "utf-8")
      lista = JSON.parse(actual)
    } catch {
      lista = []
    }
    lista.push(nuevo)
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true })
    await fs.writeFile(DATA_FILE, JSON.stringify(lista, null, 2))

    await resend.emails.send({
      from: `tol.ar - Testimonios <ventas@tiendaonline.com.ar>`,
      to: "soporte@tiendaonline.com.ar",
      subject: `[tol.ar] Nuevo testimonio de ${nombre}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width:600px; margin:0 auto;">
          <h2>Nuevo testimonio recibido</h2>
          <p><b>Nombre:</b> ${nombre}</p>
          <p><b>Tienda:</b> ${tienda || "-"}</p>
          <p><b>Rubro:</b> ${rubro || "-"}</p>
          ${fotoUrl ? `<p><b>Foto:</b><br><img src="${fotoUrl}" style="max-width:200px;border-radius:8px;"></p>` : ""}
          <p><b>Testimonio:</b></p>
          <div style="background:#f9f9f9;border-left:4px solid #000;padding:15px;white-space:pre-wrap;">${texto}</div>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error guardando testimonio:", error)
    return NextResponse.json({ error: "Error al guardar el testimonio" }, { status: 500 })
  }
}
