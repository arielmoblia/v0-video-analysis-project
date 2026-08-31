import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { spawn } from "child_process"
import { writeFileSync, readFileSync, existsSync } from "fs"
const STATUS_FILE = "/tmp/tolar-deploy-status.txt"
export async function GET() {
  if (!existsSync(STATUS_FILE)) return NextResponse.json({ status: "idle", log: "" }, { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } })
  const content = readFileSync(STATUS_FILE, "utf8").trim()
  let log = ""
  try {
    const lines = readFileSync("/tmp/deploy.log", "utf8").trim().split("\n")
    log = lines[lines.length - 1] || ""
  } catch(e) {}
  return NextResponse.json({ status: content, log }, { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } })
}
export async function POST() {
  const cookieStore = await cookies()
  const isAuthenticated = cookieStore.get("super_admin")?.value === "true"
  if (!isAuthenticated) return NextResponse.json({ error: "No autorizado" }, { status: 401, headers: { "Cache-Control": "no-store" } })
  if (existsSync(STATUS_FILE) && readFileSync(STATUS_FILE, "utf8").trim() === "building") {
    return NextResponse.json({ status: "building" }, { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } })
  }
  writeFileSync(STATUS_FILE, "building")
  const child = spawn("bash", ["-c",
    "echo \"[$(date)] Deploy iniciado\" >> /tmp/deploy.log 2>&1 && echo \"[$(date)] Buildeando en dev...\" >> /tmp/deploy.log 2>&1 && cd /var/www/tol.ar-dev && /usr/bin/npm run build >> /tmp/deploy.log 2>&1 && echo \"[$(date)] Build OK, sincronizando fuentes...\" >> /tmp/deploy.log 2>&1 && rsync -a --exclude='.git' --exclude='node_modules' --exclude='.env' --exclude='.env.local' --exclude='.env.production' --exclude='.next' /var/www/tol.ar-dev/ /var/www/tol.ar/ >> /tmp/deploy.log 2>&1 && echo \"[$(date)] Copiando .next a prod...\" >> /tmp/deploy.log 2>&1 && rsync -a /var/www/tol.ar-dev/.next/ /var/www/tol.ar/.next/ >> /tmp/deploy.log 2>&1 && echo \"[$(date)] Reiniciando pm2...\" >> /tmp/deploy.log 2>&1 && /usr/bin/pm2 restart tol.ar >> /tmp/deploy.log 2>&1 && echo \"[$(date)] Deploy terminado\" >> /tmp/deploy.log 2>&1 && echo done > /tmp/tolar-deploy-status.txt || (echo \"[$(date)] Deploy FALLIDO\" >> /tmp/deploy.log 2>&1 && echo error > /tmp/tolar-deploy-status.txt)"
  ], {
    detached: true,
    stdio: "ignore",
    env: {
      HOME: "/root",
      PATH: "/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
      NODE_ENV: "production"
    }
  })
  child.unref()
  return NextResponse.json({ status: "building" }, { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } })
}
