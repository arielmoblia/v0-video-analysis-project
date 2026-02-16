import { redirect } from "next/navigation"
import { getStoreBySubdomain } from "@/lib/store-context"
import { CheckoutForm } from "@/components/store/checkout-form"

export const revalidate = 0

interface CheckoutPageProps {
  params: Promise<{ subdomain: string }>
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const { subdomain } = await params
  const store = await getStoreBySubdomain(subdomain)

  if (!store) {
    redirect("/")
  }

  return <CheckoutForm store={store} />
}
