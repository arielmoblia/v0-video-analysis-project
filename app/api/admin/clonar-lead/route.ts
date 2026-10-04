import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

const LEADS_PATH = path.join(process.cwd(), "data", "clonar-leads.json")

export async function GET() {
  try {
    const raw = await fs.readFile(LEADS_PATH, "utf-8")
    return NextResponse.json({ leads: JSON.parse(raw) })
  } catch {
    return NextResponse.json({ leads: [] })
  }
}

export async function POST(request: Request) {
  const { storeId, subdomain, modalidadId, modalidadTitulo, link } = await request.json()

  if (!storeId || !modalidadId || typeof modalidadId !== "string") {
    return NextResponse.json({ error: "Falta la opción elegida" }, { status: 400 })
  }

  let leads: unknown[] = []
  try {
    leads = JSON.parse(await fs.readFile(LEADS_PATH, "utf-8"))
  } catch {
    leads = []
  }

  leads.push({
    id: `clonar-${Date.now()}`,
    storeId,
    subdomain: subdomain || null,
    modalidadId,
    modalidadTitulo: modalidadTitulo || null,
    link: typeof link === "string" ? link.slice(0, 500) : "",
    fecha: new Date().toISOString(),
  })

  await fs.mkdir(path.dirname(LEADS_PATH), { recursive: true })
  await fs.writeFile(LEADS_PATH, JSON.stringify(leads, null, 2))

  return NextResponse.json({ ok: true })
}
