import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { utmSource, utmMedium, utmCampaign, path } = await request.json()
    if (!utmSource || typeof utmSource !== "string") {
      return NextResponse.json({ error: "utmSource requerido" }, { status: 400 })
    }

    const { error } = await supabase.from("utm_visits").insert({
      utm_source: utmSource.slice(0, 100),
      utm_medium: typeof utmMedium === "string" ? utmMedium.slice(0, 100) : null,
      utm_campaign: typeof utmCampaign === "string" ? utmCampaign.slice(0, 100) : null,
      path: typeof path === "string" ? path.slice(0, 300) : null,
    })

    if (error) {
      console.error("Error tracking utm visit:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed to track" }, { status: 500 })
  }
}
