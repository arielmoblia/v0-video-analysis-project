import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    const { storeId, markupPercent } = await request.json()

    if (!storeId) {
      return NextResponse.json({ success: false, error: "Falta storeId" }, { status: 400 })
    }

    const markup = Math.max(0, Math.min(500, Number(markupPercent) || 0))

    const { error } = await supabase
      .from("stores")
      .update({ markup_percent: markup })
      .eq("id", storeId)

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, markupPercent: markup })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
