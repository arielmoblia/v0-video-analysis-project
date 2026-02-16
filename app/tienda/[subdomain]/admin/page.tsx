import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { AdminLogin } from "@/components/admin/admin-login"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { getStoreBySubdomain } from "@/lib/store-context"

interface AdminPageProps {
  params: Promise<{ subdomain: string }>
}

export default async function AdminPage({ params }: AdminPageProps) {
  const { subdomain } = await params
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
