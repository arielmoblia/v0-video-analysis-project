import { createPageMetadata } from "@/lib/page-metadata"
export const { generateMetadata } = createPageMetadata("plan-socio")
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
