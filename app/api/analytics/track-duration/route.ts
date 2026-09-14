import { createClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { viewId, durationSeconds } = await request.json()
    if (!viewId || !durationSeconds || durationSeconds < 1) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }
    await supabase.from("page_views").update({ duration_seconds: Math.round(durationSeconds) }).eq("id", viewId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error tracking duration:", error)
    return NextResponse.json({ error: "Failed to track duration" }, { status: 500 })
  }
}
