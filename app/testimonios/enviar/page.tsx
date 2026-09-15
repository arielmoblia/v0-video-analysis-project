import type { Metadata } from "next"
import TestimonioForm from "./form-client"
import { getBrand } from "@/lib/get-brand"

export const metadata: Metadata = {
  title: "Contanos tu experiencia — tol.ar",
  robots: { index: false, follow: false },
}

export default async function EnviarTestimonioPage() {
  const brand = await getBrand()
  return <TestimonioForm brand={brand} />
}
