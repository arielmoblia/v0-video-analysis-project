import { createPageMetadata } from "@/lib/page-metadata"
export const { generateMetadata } = createPageMetadata("empleos")
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
