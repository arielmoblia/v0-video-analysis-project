import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import fs from "fs/promises"
import path from "path"

const resend = new Resend(process.env.RESEND_API_KEY)
const DATA_FILE = path.join(process.cwd(), "data", "afiliados-registro.json")
const TERMINOS_VERSION = "v1-2026-09"

// Código corto único para el link de referido (ej. tol.ar/?ref=ANA4F2).
// No usa el email para no exponerlo en una URL pública.
function generarCodigo(nombre: string, existentes: Set<string>): string {
  const base = (nombre || "afiliado")
    .normalize("NFD").replace(/[̀-ͯ]/g, "") // saca acentos
    .replace(/[^a-zA-Z]/g, "")
    .slice(0, 4)
    .toUpperCase() || "AFIL"
  let codigo = ""
  do {
    const sufijo = Math.random().toString(36).slice(2, 6).toUpperCase()
    codigo = `${base}${sufijo}`
  } while (existentes.has(codigo))
  return codigo
}

export async function POST(request: NextRequest) {
  try {
    const { nombre, email, cuit, comoPromociona, modeloComision } = await request.json()

    if (!nombre || !email) {
      return NextResponse.json({ error: "Falta nombre o email" }, { status: 400 })
    }

    const modeloComisionValido = modeloComision === "porcentaje" ? "porcentaje" : "fijo"

    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown"
    const userAgent = request.headers.get("user-agent") || "unknown"
    const fecha = new Date().toISOString()

    let lista: { codigo?: string }[] = []
    try {
      const actual = await fs.readFile(DATA_FILE, "utf-8")
      lista = JSON.parse(actual)
    } catch {
      lista = []
    }

    const codigosExistentes = new Set(lista.map((r) => r.codigo).filter(Boolean) as string[])
    const codigo = generarCodigo(nombre, codigosExistentes)

    const registro = {
      id: Date.now(),
      codigo,
      nombre,
      email,
      cuit: cuit || "",
      comoPromociona: comoPromociona || "",
      modelo_comision: modeloComisionValido,
      estado: "pendiente",
      terminos_version: TERMINOS_VERSION,
      ip,
      user_agent: userAgent,
      fecha,
    }

    lista.push(registro)
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true })
    await fs.writeFile(DATA_FILE, JSON.stringify(lista, null, 2))

    await resend.emails.send({
      from: `tol.ar - Programa de Afiliados <ventas@tiendaonline.com.ar>`,
      to: "soporte@tiendaonline.com.ar",
      subject: `[Afiliados] Nueva inscripción: ${nombre}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width:600px; margin:0 auto;">
          <h2>Nueva inscripción — Programa de Afiliados</h2>
          <p><b>Nombre:</b> ${nombre}</p>
          <p><b>Email:</b> ${email}</p>
          <p><b>Código asignado:</b> ${codigo}</p>
          <p><b>CUIT:</b> ${cuit || "(no informado)"}</p>
          <p><b>Cómo piensa promocionar:</b> ${comoPromociona || "(no informado)"}</p>
          <p><b>Modelo de comisión elegido:</b> ${modeloComisionValido === "porcentaje" ? "Porcentaje mientras crece" : "Monto fijo por tienda"}</p>
          <p><b>Fecha/hora:</b> ${fecha}</p>
          <p><b>IP:</b> ${ip}</p>
          <p><b>Versión de términos:</b> ${TERMINOS_VERSION}</p>
        </div>
      `,
    })

    return NextResponse.json({ ok: true, codigo })
  } catch (error) {
    console.error("Error registrando afiliado:", error)
    return NextResponse.json({ error: "Error al registrar la inscripción" }, { status: 500 })
  }
}
