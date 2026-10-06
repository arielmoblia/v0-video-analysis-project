import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET(request: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const { data: config } = await supabase
    .from("marketing_config")
    .select("youtube_client_id")
    .limit(1)
    .single()

  const clientId = config?.youtube_client_id || process.env.YOUTUBE_CLIENT_ID!
  const redirectUri = process.env.YOUTUBE_REDIRECT_URI!

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "https://www.googleapis.com/auth/youtube.force-ssl https://www.googleapis.com/auth/yt-analytics.readonly https://www.googleapis.com/auth/userinfo.email",
    access_type: "offline",
    prompt: "consent"
  })

  return NextResponse.redirect(
    "https://accounts.google.com/o/oauth2/v2/auth?" + params.toString()
  )
}
