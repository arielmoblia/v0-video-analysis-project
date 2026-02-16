import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("core_versions")
      .select("*")
      .order("released_at", { ascending: false })

    if (error) throw error

    return NextResponse.json({ versions: data })
  } catch (error) {
    console.error("Error fetching core versions:", error)
    return NextResponse.json({ error: "Error fetching versions" }, { status: 500 })
  }
}
