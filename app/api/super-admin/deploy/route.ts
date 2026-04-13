import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { spawn } from "child_process"
import { writeFileSync, readFileSync, existsSync } from "fs"

const STATUS_FILE = "/tmp/tolar-deploy-status.txt"

export async function GET() {
  if (!existsSync(STATUS_FILE)) return NextResponse.json({ status: "idle" })
  const content = readFileSync(STATUS_FILE, "utf8").trim()
  return NextResponse.json({ status: content })
}

export async function POST() {
  const cookieStore = await cookies()
  const isAuthenticated = cookieStore.get("super_admin")?.value === "true"
  if (!isAuthenticated) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  writeFileSync(STATUS_FILE, "building")

  const child = spawn("bash", ["-c",
    "cd /var/www/tol.ar-dev && /usr/bin/npm run build >> /tmp/deploy.log 2>&1 && rsync -a --exclude='.git' --exclude='node_modules' --exclude='.env' --exclude='.env.local' --exclude='.env.production' /var/www/tol.ar-dev/ /var/www/tol.ar/ >> /tmp/deploy.log 2>&1 && /usr/bin/npm install --legacy-peer-deps --prefix /var/www/tol.ar >> /tmp/deploy.log 2>&1 && /usr/bin/pm2 restart tol.ar >> /tmp/deploy.log 2>&1 && echo done > /tmp/tolar-deploy-status.txt || echo error > /tmp/tolar-deploy-status.txt"
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

  return NextResponse.json({ status: "building" })
}
