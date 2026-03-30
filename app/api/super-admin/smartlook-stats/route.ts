import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const isAuthenticated = cookieStore.get("super_admin")?.value === "true"
    if (!isAuthenticated) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

    const token = "cd629ed9da78d7d7c445c43e7ccbc86f8869d2655affe888eeaaf820ff20079b"
    const projectId = "wf4je1lke0xwvcbbp81a2o8q"

    const now = new Date()
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const res = await fetch(`https://api.smartlook.com/v3/projects/${projectId}/recordings?from=${firstOfMonth.toISOString()}&limit=1`, {
      headers: { Authorization: `Bearer ${token}` }
    })

    if (!res.ok) return NextResponse.json({ sessions: 0, url: `https://app.smartlook.com` })

    const data = await res.json()
    return NextResponse.json({
      sessions: data.totalCount || 0,
      url: "https://app.smartlook.com/org/vq72x3vilvwbhabt1fyti0dn/project/wf4je1lke0xwvcbbp81a2o8q/recordings?segment=all"
    })
  } catch (error) {
    return NextResponse.json({ sessions: 0, url: "https://app.smartlook.com" })
  }
}
