import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const days = parseInt(searchParams.get("days") || "30")

  const since = new Date()
  since.setDate(since.getDate() - days)

  const EXCLUDED_IPS = ["104.50.231.150", "2600:1700:2ab0:7a30:35e1:dbf5:ef76:486f", "::ffff:104.50.231.150"]

  const { data, error } = await supabase
    .from("stores")
    .select("referral_source, creator_ip")
    .gte("created_at", since.toISOString())
    .not("referral_source", "is", null)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const filtered = (data || []).filter(r => !EXCLUDED_IPS.includes(r.creator_ip))
  const counts: Record<string, number> = {}
  for (const row of filtered) {
    const src = row.referral_source || "otro"
    counts[src] = (counts[src] || 0) + 1
  }

  const total = Object.values(counts).reduce((a, b) => a + b, 0)
  const items = Object.entries(counts)
    .map(([id, count]) => ({ id, count, pct: total ? Math.round(count / total * 100) : 0 }))
    .sort((a, b) => b.count - a.count)

  return NextResponse.json({ total, items })
}
