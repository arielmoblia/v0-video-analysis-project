import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  const subdomain = request.nextUrl.searchParams.get("subdomain")
  if (!subdomain) return NextResponse.json({ authenticated: false })
  const cookieStore = await cookies()
  const authenticated = cookieStore.get(`admin_${subdomain.toLowerCase()}`)?.value === "true"
  return NextResponse.json({ authenticated }, { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } })
}
