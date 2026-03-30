import { createClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const isAuthenticated = cookieStore.get("super_admin")?.value === "true"
    if (!isAuthenticated) return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    const now = new Date()
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const { data: allStores } = await supabase.from("stores").select("id,plan,created_at").neq("plan","templates")
    const totalStores = allStores?.length || 0
    const newStoresThisMonth = allStores?.filter(s => new Date(s.created_at) >= firstOfMonth).length || 0
    const { data: storesWithVisits } = await supabase.from("page_views").select("store_id").gte("created_at", thirtyDaysAgo.toISOString())
    const storeIdsWithVisits = new Set(storesWithVisits?.map(v => v.store_id) || [])
    const storesWithNoVisits = allStores?.filter(s => !storeIdsWithVisits.has(s.id)).length || 0
    const planDistribution: Record<string, number> = { gratis: 0, cositas: 0, socios: 0 }
    allStores?.forEach(s => {
      const plan = s.plan === "free" ? "gratis" : s.plan
      if (planDistribution[plan] !== undefined) planDistribution[plan]++
      else planDistribution[plan] = (planDistribution[plan] || 0) + 1
    })
    return NextResponse.json({ totalStores, newStoresThisMonth, storesWithNoVisits, planDistribution })
  } catch (error) {
    return NextResponse.json({ error: "Error" }, { status: 500 })
  }
}
