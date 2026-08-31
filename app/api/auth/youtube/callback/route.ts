import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code")
  const error = request.nextUrl.searchParams.get("error")

  if (error || !code) {
    return NextResponse.redirect("https://seo.tol.ar/marketing-redes?error=youtube_auth_failed")
  }

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: existing } = await supabase
      .from("marketing_config")
      .select("id, youtube_client_id, youtube_client_secret")
      .limit(1)
      .single()

    const clientId = existing?.youtube_client_id || process.env.YOUTUBE_CLIENT_ID!
    const clientSecret = existing?.youtube_client_secret || process.env.YOUTUBE_CLIENT_SECRET!

    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: process.env.YOUTUBE_REDIRECT_URI!,
        grant_type: "authorization_code"
      })
    })

    const tokens = await tokenRes.json()

    if (!tokens.access_token) {
      throw new Error("No access token received")
    }

    const expiry = new Date(Date.now() + tokens.expires_in * 1000).toISOString()

    let accountEmail: string | null = null
    try {
      const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
        headers: { Authorization: `Bearer ${tokens.access_token}` }
      })
      const userInfo = await userInfoRes.json()
      accountEmail = userInfo?.email || null
    } catch (err) {
      console.error("YouTube OAuth: no se pudo obtener el email de la cuenta:", err)
    }

    if (existing?.id) {
      await supabase
        .from("marketing_config")
        .update({
          youtube_access_token: tokens.access_token,
          youtube_refresh_token: tokens.refresh_token || null,
          youtube_token_expiry: expiry,
          youtube_connected: true,
          ...(accountEmail ? { youtube_account_email: accountEmail } : {})
        })
        .eq("id", existing.id)
    }

    return NextResponse.redirect("https://seo.tol.ar/marketing-redes?youtube=connected")

  } catch (err) {
    console.error("YouTube OAuth error:", err)
    return NextResponse.redirect("https://seo.tol.ar/marketing-redes?error=youtube_token_failed")
  }
}
