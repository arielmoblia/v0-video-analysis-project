import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const storeId = searchParams.get("storeId")

  if (!storeId) {
    return NextResponse.json({ error: "Store ID required" }, { status: 400 })
  }

  const { data, error } = await supabase
    .from("store_purchased_features")
    .select("feature_code")
    .eq("store_id", storeId)
    .eq("is_active", true)

  if (error) {
    return NextResponse.json({ features: [] })
  }

  const features = data?.map((f) => f.feature_code) || []

  return NextResponse.json({ features })
}
