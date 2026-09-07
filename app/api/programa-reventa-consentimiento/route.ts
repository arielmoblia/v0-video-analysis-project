import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import fs from "fs/promises"
import path from "path"

const resend = new Resend(process.env.RESEND_API_KEY)
const DATA_FILE = path.join(process.cwd(), "data", "reventa-consentimientos.json")
const TERMINOS_VERSION = "v1-2026-09"

export async function POST(request: NextRequest) {
  try {
    const { negocio, email, decision } = await request.json()

    if (!decision || (decision !== "si" && decision !== "no")) {
      return NextResponse.json({ error: "Falta la decisión (si/no)" }, { status: 400 })
    }

    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown"
    const userAgent = request.headers.get("user-agent") || "unknown"
    const fecha = new Date().toISOString()

    const registro = {
      negocio: negocio || "",
      email: email || "",
      decision,
      terminos_version: TERMINOS_VERSION,
      ip,
      user_agent: userAgent,
      fecha,
    }

    let lista: unknown[] = []
    try {
      const actual = await fs.readFile(DATA_FILE, "utf-8")
      lista = JSON.parse(actual)
    } catch {
      lista = []
    }
    lista.push(registro)
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true })
    await fs.writeFile(DATA_FILE, JSON.stringify(lista, null, 2))

    await resend.emails.send({
      from: `tol.ar - Programa de reventa <ventas@tiendaonline.com.ar>`,
      to: "soporte@tiendaonline.com.ar",
      subject: decision === "si"
        ? `[Programa reventa] ${negocio || "Un negocio"} dijo SÍ`
        : `[Programa reventa] ${negocio || "Un negocio"} dijo que no`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width:600px; margin:0 auto;">
          <h2>${decision === "si" ? "✅ Nueva aceptación" : "❌ Rechazo"} — Programa de reventa online</h2>
          <p><b>Negocio:</b> ${negocio || "(sin nombre)"}</p>
          <p><b>Email:</b> ${email || "(sin email)"}</p>
          <p><b>Decisión:</b> ${decision === "si" ? "Sí, quiere sumarse" : "No, gracias"}</p>
          <p><b>Fecha/hora:</b> ${fecha}</p>
          <p><b>IP:</b> ${ip}</p>
          <p><b>Versión de términos:</b> ${TERMINOS_VERSION}</p>
        </div>
      `,
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Error registrando consentimiento programa-reventa:", error)
    return NextResponse.json({ error: "Error al registrar la respuesta" }, { status: 500 })
  }
}
