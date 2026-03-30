import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  const cookieStore = await cookies()
  const authenticated = cookieStore.get("super_admin")?.value === "true"
  return NextResponse.json({ authenticated })
}
