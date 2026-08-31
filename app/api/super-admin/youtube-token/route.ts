import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: config } = await supabase
      .from("marketing_config")
      .select("youtube_access_token, youtube_refresh_token, youtube_token_expiry, youtube_client_id, youtube_client_secret, id")
      .limit(1)
      .single()

    if (!config?.youtube_access_token) {
      return NextResponse.json({ error: "YouTube no conectado" }, { status: 401, headers: { "Cache-Control": "no-store" } })
    }

    let accessToken = config.youtube_access_token
    const expiry = config.youtube_token_expiry ? new Date(config.youtube_token_expiry) : null

    if (expiry && expiry < new Date() && config.youtube_refresh_token) {
      const refreshRes = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: config.youtube_client_id || process.env.YOUTUBE_CLIENT_ID!,
          client_secret: config.youtube_client_secret || process.env.YOUTUBE_CLIENT_SECRET!,
          refresh_token: config.youtube_refresh_token,
          grant_type: "refresh_token"
        })
      })
      const refreshed = await refreshRes.json()
      if (refreshed.access_token) {
        accessToken = refreshed.access_token
        await supabase.from("marketing_config").update({
          youtube_access_token: refreshed.access_token,
          youtube_token_expiry: new Date(Date.now() + refreshed.expires_in * 1000).toISOString()
        }).eq("id", config.id)
      }
    }

    return NextResponse.json({ access_token: accessToken }, { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } })
  } catch (error) {
    return NextResponse.json({ error: "Error obteniendo token" }, { status: 500, headers: { "Cache-Control": "no-store" } })
  }
}
