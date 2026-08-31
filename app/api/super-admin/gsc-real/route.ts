import { NextResponse } from "next/server"
import { leerSearchConsole } from "../../seo-chat-general/lib-fuentes"

export async function GET() {
  const gsc = await leerSearchConsole()
  return NextResponse.json(gsc, { headers: { "Cache-Control": "no-store" } })
}
