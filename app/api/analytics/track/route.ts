import { createClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
const BLOCKED_IPS = ["104.50.231.150", "::ffff:104.50.231.150", "2600:1700:2ab0:7a30:35e1:dbf5:ef76:486f"]

export async function POST(request: NextRequest) {
  try {
    const { storeId, pagePath, visitorId, referrer } = await request.json()
    if (!storeId || !pagePath) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }
    const userAgent = request.headers.get("user-agent") || ""
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || request.headers.get("x-real-ip") || ""

    if (BLOCKED_IPS.includes(ip)) {
      return NextResponse.json({ success: true })
    }

    let country = null, city = null
    if (ip) {
      try {
        const geoRes = await fetch(`http://ip-api.com/json/${ip}?fields=country,city&lang=es`)
        const geo = await geoRes.json()
        if (geo.country) { country = geo.country; city = geo.city || null }
      } catch {}
    }
    const { data } = await supabase.from("page_views").insert({
      store_id: storeId,
      page_path: pagePath,
      visitor_id: visitorId,
      user_agent: userAgent,
      ip: ip || null,
      referrer: referrer || null,
      country,
      city,
    }).select("id").single()
    return NextResponse.json({ success: true, id: data?.id })
  } catch (error) {
    console.error("Error tracking page view:", error)
    return NextResponse.json({ error: "Failed to track" }, { status: 500 })
  }
}
