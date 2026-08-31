const fs = require("fs")
const { createClient } = require("@supabase/supabase-js")
const env = {}
for (const line of fs.readFileSync(".env.local", "utf8").split("\n")) {
  const m = line.match(/^([A-Z_]+)=(.*)$/)
  if (m) env[m[1]] = m[2]
}
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

async function main() {
  const { data: pmSample } = await supabase.from("payment_methods").select("*").eq("mercadopago_test_mode", true).neq("mercadopago_test_token", "")
  console.log("=== payment_methods con test_mode=true y token no vacio ===")
  console.log(JSON.stringify(pmSample, null, 2))

  const { data: stores } = await supabase.from("stores").select("id, subdomain").in("id", (pmSample||[]).map(p=>p.store_id))
  console.log("=== esas tiendas ===")
  console.log(JSON.stringify(stores, null, 2))
}
main()
