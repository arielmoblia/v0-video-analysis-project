import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function PATCH(req: Request, { params }: { params: Promise<{ subdomain: string }> }) {
  const { subdomain } = await params
  const body = await req.json()
  const { referral_source } = body
  const { error } = await supabase
    .from("stores")
    .update({ referral_source })
    .eq("subdomain", subdomain)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
