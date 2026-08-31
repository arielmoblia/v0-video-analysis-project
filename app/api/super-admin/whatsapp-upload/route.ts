import { NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import path from "path"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File
    if (!file) return NextResponse.json({ error: "No file" }, { status: 400, headers: { "Cache-Control": "no-store" } })

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const uploadDir = "/tmp/wa-media"
    await mkdir(uploadDir, { recursive: true })

    const filename = Date.now() + "-" + file.name.replace(/[^a-zA-Z0-9._-]/g, "")
    const filepath = path.join(uploadDir, filename)
    await writeFile(filepath, buffer)

    return NextResponse.json({ url: filepath, filename }, { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500, headers: { "Cache-Control": "no-store" } })
  }
}
