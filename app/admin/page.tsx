import { cookies, headers } from "next/headers"
import { redirect } from "next/navigation"
import { SuperAdminLogin } from "@/components/super-admin/super-admin-login"
import { SuperAdminDashboard } from "@/components/super-admin/super-admin-dashboard"
import { AdminLogin } from "@/components/admin/admin-login"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { getStoreBySubdomain } from "@/lib/store-context"

export default async function SuperAdminPage() {
  const headersList = await headers()
  const host = headersList.get("host") || ""

  if (host.includes("tol.ar") && !host.startsWith("www.") && host !== "tol.ar") {
    const subdomain = host.split(".")[0]
    if (subdomain && subdomain !== "tol" && subdomain !== "www") {
      const store = await getStoreBySubdomain(subdomain)

      if (!store) {
        redirect("/")
      }

      const cookieStore = await cookies()
      const authCookie = cookieStore.get(`admin_${subdomain}`)
      const isAuthenticated = authCookie?.value === "true"

      if (!isAuthenticated) {
        return <AdminLogin store={store} subdomain={subdomain} />
      }

      return <AdminDashboard store={store} subdomain={subdomain} />
    }
  }

  // Super admin de tol.ar
  const cookieStore = await cookies()
  const isAuthenticated = cookieStore.get("super_admin")?.value === "true"

  if (!isAuthenticated) {
    return <SuperAdminLogin />
  }

  return <SuperAdminDashboard />
}
