const fs = require("fs")
const { createClient } = require("@supabase/supabase-js")
const env = {}
for (const line of fs.readFileSync(".env.local", "utf8").split("\n")) {
  const m = line.match(/^([A-Z_]+)=(.*)$/)
  if (m) env[m[1]] = m[2]
}
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

async function main() {
  const { data: franchimayorista } = await supabase.from("stores").select("*").eq("subdomain", "franchimayorista").single()
  console.log("=== franchimayorista store ===")
  console.log(JSON.stringify(franchimayorista, null, 2))

  const { data: pmSample } = await supabase.from("payment_methods").select("*").not("mercadopago_test_token", "is", null).limit(1)
  console.log("=== sample payment_methods with test token ===")
  console.log(JSON.stringify(pmSample, null, 2))
}
main()
