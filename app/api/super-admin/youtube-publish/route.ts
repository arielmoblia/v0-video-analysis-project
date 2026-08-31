import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(request: NextRequest) {
  try {
    const { guion_id, video_id } = await request.json()
    if (!video_id) return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } })

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    if (guion_id && !guion_id.startsWith("extra-")) {
      await supabase.from("marketing_youtube").update({
        estado: "publicado",
        video_url: "https://youtube.com/shorts/" + video_id
      }).eq("id", guion_id)
    }

    return NextResponse.json({ ok: true, url: "https://youtube.com/shorts/" + video_id }, { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } })
  } catch (error) {
    return NextResponse.json({ error: "Error guardando" }, { status: 500, headers: { "Cache-Control": "no-store" } })
  }
}
