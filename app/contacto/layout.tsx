import { createPageMetadata } from "@/lib/page-metadata"
export const { generateMetadata } = createPageMetadata("contacto")
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
