import { type NextRequest, NextResponse } from "next/server"

const SUPPORTED = ["AR", "CL"]

export async function GET(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || ""

  let countryCode = "AR"
  if (ip) {
    try {
      const geoRes = await fetch(`http://ip-api.com/json/${ip}?fields=countryCode`)
      const geo = await geoRes.json()
      if (geo.countryCode && SUPPORTED.includes(geo.countryCode)) {
        countryCode = geo.countryCode
      }
    } catch {}
  }

  return NextResponse.json({ country: countryCode })
}
