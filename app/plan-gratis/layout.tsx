import { createPageMetadata } from "@/lib/page-metadata"
export const { generateMetadata } = createPageMetadata("plan-gratis")
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
