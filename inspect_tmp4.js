const fs = require("fs")
const { createClient } = require("@supabase/supabase-js")
const env = {}
for (const line of fs.readFileSync(".env.local", "utf8").split("\n")) {
  const m = line.match(/^([A-Z_]+)=(.*)$/)
  if (m) env[m[1]] = m[2]
}
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

async function main() {
  const storeId = "37403360-86b3-455e-a8d4-067198ebccb9"
  const { count } = await supabase.from("products").select("*", { count: "exact", head: true }).eq("store_id", storeId)
  console.log("total productos franchimayorista:", count)

  const { data: sample } = await supabase.from("products").select("*").eq("store_id", storeId).limit(1).single()
  console.log(JSON.stringify(sample, null, 2))

  const { data: cats } = await supabase.from("categories").select("*").eq("store_id", storeId).limit(3)
  console.log("=== categorias sample ===")
  console.log(JSON.stringify(cats, null, 2))
  const { count: catCount } = await supabase.from("categories").select("*", { count: "exact", head: true }).eq("store_id", storeId)
  console.log("total categorias:", catCount)
}
main()
