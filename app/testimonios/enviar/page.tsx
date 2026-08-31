import type { Metadata } from "next"
import TestimonioForm from "./form-client"

export const metadata: Metadata = {
  title: "Contanos tu experiencia — tol.ar",
  robots: { index: false, follow: false },
}

export default function EnviarTestimonioPage() {
  return <TestimonioForm />
}
