import { cookies } from "next/headers"
import { SuperAdminDashboard } from "@/components/super-admin/super-admin-dashboard"
import { AdminLogin } from "@/components/super-admin/admin-login"

export default async function SuperAdminPage() {
  const cookieStore = await cookies()
  const isAuthenticated = cookieStore.get("super_admin")?.value === "true"

  if (!isAuthenticated) {
    return <AdminLogin />
  }

  return <SuperAdminDashboard />
}