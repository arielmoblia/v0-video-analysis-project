const fs = require("fs")
const { createDecipheriv } = require("crypto")
const { createClient } = require("@supabase/supabase-js")
const env = {}
for (const line of fs.readFileSync(".env.local", "utf8").split("\n")) {
  const m = line.match(/^([A-Z_]+)=(.*)$/)
  if (m) env[m[1]] = m[2]
}
function decrypt(ciphertext) {
  const PREFIX = "enc:v1:"
  if (!ciphertext || !ciphertext.startsWith(PREFIX)) return ciphertext
  const key = Buffer.from(env.ENCRYPTION_KEY, "hex")
  const parts = ciphertext.slice(PREFIX.length).split(":")
  const [ivHex, authTagHex, encryptedHex] = parts
  const iv = Buffer.from(ivHex, "hex")
  const authTag = Buffer.from(authTagHex, "hex")
  const encrypted = Buffer.from(encryptedHex, "hex")
  const decipher = createDecipheriv("aes-256-gcm", key, iv)
  decipher.setAuthTag(authTag)
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8")
}

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

async function main() {
  const { data: pm } = await supabase.from("payment_methods").select("*").eq("store_id", "0a9fa6b9-b94a-429a-8ce8-2f2141b49540").single()
  console.log("test_token decrypted prefix:", decrypt(pm.mercadopago_test_token).slice(0, 12))
  console.log("access_token decrypted prefix:", decrypt(pm.mercadopago_access_token).slice(0, 12))
  console.log("checkout_type:", pm.mercadopago_checkout_type)
}
main()
