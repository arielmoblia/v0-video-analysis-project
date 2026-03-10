import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const adminCookie = cookieStore.get("super_admin")
    if (!adminCookie || adminCookie.value !== "true") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: stores, error } = await supabase
      .from("stores")
      .select("id, username, email, subdomain, site_title, plan, created_at, updated_at, status")
      .eq("status", "inactive")
      .order("updated_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const mapped = (stores || []).map((s) => ({
      ...s,
      deleted_at: s.updated_at,
      reason: "inactividad",
    }))

    return NextResponse.json({ stores: mapped })
  } catch (error) {
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}