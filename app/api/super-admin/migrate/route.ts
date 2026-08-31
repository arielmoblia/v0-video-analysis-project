import { NextResponse, NextRequest } from "next/server"
import { cookies } from "next/headers"
import { spawn } from "child_process"
import { writeFileSync, readFileSync, existsSync, mkdirSync, appendFileSync } from "fs"
import path from "path"

const STATUS_FILE = "/tmp/tolar-migrate-status.txt"
const LOG_FILE = "/tmp/migrate.log"
const META_FILE = "/tmp/tolar-migrate-meta.json"
const SECRET_FILE = "/etc/tolar/migrations-prod.env"
const BACKUP_DIR = "/var/backups/tolar-db"
const BACKUP_REUSE_MS = 15 * 60 * 1000
const MIGRATIONS_DIR = path.join(process.cwd(), "supabase", "migrations")
// La base de producción corre Postgres 17; el pg_dump/psql del sistema (16) se niega
// a operar contra un server más nuevo ("server version mismatch"), por eso se usan
// los binarios del paquete postgresql-client-17 explícitamente.
const PG_DUMP_BIN = "/usr/lib/postgresql/17/bin/pg_dump"
const PSQL_BIN = "/usr/lib/postgresql/17/bin/psql"

function isAuthed(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  return cookieStore.get("super_admin")?.value === "true"
}

function getProdDatabaseUrl(): string {
  const content = readFileSync(SECRET_FILE, "utf8")
  const line = content.split("\n").find(l => l.startsWith("DATABASE_URL="))
  if (!line) throw new Error("DATABASE_URL no encontrada en " + SECRET_FILE)
  return line.slice("DATABASE_URL=".length).trim()
}

function readMeta(): any {
  if (!existsSync(META_FILE)) return {}
  try { return JSON.parse(readFileSync(META_FILE, "utf8")) } catch { return {} }
}

function writeMeta(meta: any) {
  writeFileSync(META_FILE, JSON.stringify(meta))
}

async function getPendingMigrations(): Promise<string[]> {
  const dbUrl = getProdDatabaseUrl()
  const allFiles = require("fs").readdirSync(MIGRATIONS_DIR).filter((f: string) => f.endsWith(".sql")).sort()
  const { execFileSync } = require("child_process")
  const out = execFileSync(PSQL_BIN, [dbUrl, "-t", "-A", "-c", "SELECT filename FROM public.schema_migrations"], { encoding: "utf8" })
  const applied = new Set(out.split("\n").map((l: string) => l.trim()).filter(Boolean))
  return allFiles.filter((f: string) => !applied.has(f))
}

export async function GET() {
  const cookieStore = await cookies()
  if (!isAuthed(cookieStore)) return NextResponse.json({ error: "No autorizado" }, { status: 401, headers: { "Cache-Control": "no-store" } })

  let pending: string[] = []
  let pendingError = ""
  try {
    pending = await getPendingMigrations()
  } catch (e: any) {
    pendingError = e.message || String(e)
  }

  const status = existsSync(STATUS_FILE) ? readFileSync(STATUS_FILE, "utf8").trim() : "idle"
  let log = ""
  try {
    const lines = readFileSync(LOG_FILE, "utf8").trim().split("\n")
    log = lines[lines.length - 1] || ""
  } catch {}
  const meta = readMeta()

  return NextResponse.json(
    { status, log, pending, pendingError, backupFile: meta.backupFile || null, backupAt: meta.backupAt || null },
    { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } }
  )
}

export async function POST(req: NextRequest) {
  const cookieStore = await cookies()
  if (!isAuthed(cookieStore)) return NextResponse.json({ error: "No autorizado" }, { status: 401, headers: { "Cache-Control": "no-store" } })

  const body = await req.json().catch(() => ({}))
  const step = body.step

  const currentStatus = existsSync(STATUS_FILE) ? readFileSync(STATUS_FILE, "utf8").trim() : "idle"
  if (currentStatus === "backing_up" || currentStatus === "migrating") {
    return NextResponse.json({ status: currentStatus }, { headers: { "Cache-Control": "no-store" } })
  }

  let dbUrl: string
  try {
    dbUrl = getProdDatabaseUrl()
  } catch (e: any) {
    return NextResponse.json({ error: "No se pudo leer credencial de producción: " + e.message }, { status: 500 })
  }

  if (step === "backup") {
    const existingMeta = readMeta()
    if (existingMeta.backupFile && existingMeta.backupAt && existsSync(existingMeta.backupFile)) {
      const ageMs = Date.now() - new Date(existingMeta.backupAt).getTime()
      if (ageMs < BACKUP_REUSE_MS) {
        writeFileSync(STATUS_FILE, "backup_done")
        appendFileSync(LOG_FILE, `[${new Date()}] Backup reciente reutilizado (${Math.round(ageMs / 1000)}s): ${existingMeta.backupFile}\n`)
        return NextResponse.json(
          { status: "backup_done", backupFile: existingMeta.backupFile, backupAt: existingMeta.backupAt, reused: true },
          { headers: { "Cache-Control": "no-store" } }
        )
      }
    }

    mkdirSync(BACKUP_DIR, { recursive: true })
    const stamp = new Date().toISOString().replace(/[:.]/g, "-")
    const backupFile = path.join(BACKUP_DIR, `prod_${stamp}.dump`)
    writeFileSync(STATUS_FILE, "backing_up")
    writeMeta({})
    const script = [
      `echo "[$(date)] Backup de producción iniciado" >> ${LOG_FILE} 2>&1`,
      `${PG_DUMP_BIN} "$DATABASE_URL" -F c -f "${backupFile}" >> ${LOG_FILE} 2>&1`,
      `SIZE=$(stat -c%s "${backupFile}" 2>/dev/null || echo 0)`,
      `if [ "$SIZE" -lt 1000 ]; then echo "[$(date)] Backup sospechosamente chico ($SIZE bytes)" >> ${LOG_FILE} 2>&1; echo error > ${STATUS_FILE}; exit 1; fi`,
      `echo "[$(date)] Backup OK: $SIZE bytes en ${backupFile}" >> ${LOG_FILE} 2>&1`,
      `echo backup_done > ${STATUS_FILE}`
    ].join(" && ") + ` || (echo "[$(date)] Backup FALLIDO" >> ${LOG_FILE} 2>&1 && echo error > ${STATUS_FILE})`

    const child = spawn("bash", ["-c", script], {
      detached: true,
      stdio: "ignore",
      env: { HOME: "/root", PATH: "/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin", DATABASE_URL: dbUrl }
    })
    child.unref()
    writeMeta({ backupFile, backupAt: new Date().toISOString() })
    return NextResponse.json({ status: "backing_up" }, { headers: { "Cache-Control": "no-store" } })
  }

  if (step === "apply") {
    if (body.confirm !== "CONFIRMAR") {
      return NextResponse.json({ error: "Falta escribir CONFIRMAR" }, { status: 400 })
    }
    if (currentStatus !== "backup_done") {
      return NextResponse.json({ error: "Hace falta un backup reciente y exitoso antes de aplicar migraciones (status actual: " + currentStatus + ")" }, { status: 400 })
    }
    const meta = readMeta()
    if (!meta.backupFile || !existsSync(meta.backupFile)) {
      return NextResponse.json({ error: "No se encontró el archivo de backup registrado" }, { status: 400 })
    }

    let pending: string[]
    try {
      pending = await getPendingMigrations()
    } catch (e: any) {
      return NextResponse.json({ error: "No se pudo calcular migraciones pendientes: " + e.message }, { status: 500 })
    }
    if (pending.length === 0) {
      return NextResponse.json({ error: "No hay migraciones pendientes" }, { status: 400 })
    }

    writeFileSync(STATUS_FILE, "migrating")
    const steps = pending.map(f => {
      const filePath = path.join(MIGRATIONS_DIR, f).replace(/"/g, '\\"')
      const escapedName = f.replace(/'/g, "''")
      return [
        `echo "[$(date)] Aplicando ${f}..." >> ${LOG_FILE} 2>&1`,
        `${PSQL_BIN} "$DATABASE_URL" -v ON_ERROR_STOP=1 -f "${filePath}" >> ${LOG_FILE} 2>&1`,
        `${PSQL_BIN} "$DATABASE_URL" -v ON_ERROR_STOP=1 -c "INSERT INTO public.schema_migrations (filename) VALUES ('${escapedName}') ON CONFLICT (filename) DO NOTHING" >> ${LOG_FILE} 2>&1`,
        `echo "[$(date)] ${f} aplicada OK" >> ${LOG_FILE} 2>&1`
      ].join(" && ")
    }).join(" && ")
    const script = `echo "[$(date)] Migración a producción iniciada (backup: ${meta.backupFile})" >> ${LOG_FILE} 2>&1 && ${steps} && echo "[$(date)] Migración terminada" >> ${LOG_FILE} 2>&1 && echo done > ${STATUS_FILE} || (echo "[$(date)] Migración FALLIDA" >> ${LOG_FILE} 2>&1 && echo error > ${STATUS_FILE})`

    const child = spawn("bash", ["-c", script], {
      detached: true,
      stdio: "ignore",
      env: { HOME: "/root", PATH: "/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin", DATABASE_URL: dbUrl }
    })
    child.unref()
    return NextResponse.json({ status: "migrating" }, { headers: { "Cache-Control": "no-store" } })
  }

  return NextResponse.json({ error: "step inválido" }, { status: 400 })
}
