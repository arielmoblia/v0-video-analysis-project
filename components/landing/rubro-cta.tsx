"use client"

import { useState, lazy, Suspense } from "react"
import { ArrowRight } from "lucide-react"

const SignupModal = lazy(() => import("@/components/landing/signup-modal").then(m => ({ default: m.SignupModal })))

interface RubroCtaProps {
  template: string
  label?: string
}

export function RubroCta({ template, label = "Crear mi tienda gratis" }: RubroCtaProps) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 bg-white text-green-700 px-8 py-4 rounded-full font-semibold hover:bg-green-50 transition-colors"
      >
        {label} <ArrowRight className="w-4 h-4" />
      </button>
      {open && (
        <Suspense fallback={null}>
          <SignupModal isOpen={open} onClose={() => setOpen(false)} preselectedTemplate={template} />
        </Suspense>
      )}
    </>
  )
}
