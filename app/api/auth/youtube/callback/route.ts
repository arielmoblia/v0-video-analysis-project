import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code")
  const error = request.nextUrl.searchParams.get("error")

  if (error || !code) {
    return NextResponse.redirect("http://157.173.212.229:3003/admin?tab=marketing&error=youtube_auth_failed")
  }

  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.YOUTUBE_CLIENT_ID!,
        client_secret: process.env.YOUTUBE_CLIENT_SECRET!,
        redirect_uri: process.env.YOUTUBE_REDIRECT_URI!,
        grant_type: "authorization_code"
      })
    })

    const tokens = await tokenRes.json()

    if (!tokens.access_token) {
      throw new Error("No access token received")
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const expiry = new Date(Date.now() + tokens.expires_in * 1000).toISOString()

    const { data: existing } = await supabase
      .from("marketing_config")
      .select("id")
      .limit(1)
      .single()

    if (existing?.id) {
      await supabase
        .from("marketing_config")
        .update({
          youtube_access_token: tokens.access_token,
          youtube_refresh_token: tokens.refresh_token || null,
          youtube_token_expiry: expiry,
          youtube_connected: true
        })
        .eq("id", existing.id)
    }

    return NextResponse.redirect("http://157.173.212.229:3003/admin?tab=marketing&youtube=connected")

  } catch (err) {
    console.error("YouTube OAuth error:", err)
    return NextResponse.redirect("http://157.173.212.229:3003/admin?tab=marketing&error=youtube_token_failed")
  }
}
