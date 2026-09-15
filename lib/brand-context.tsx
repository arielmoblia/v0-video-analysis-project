"use client"

import { createContext, useContext } from "react"

export type Brand = "tol" | "tiendabasica"

const BrandContext = createContext<Brand>("tol")

export function BrandProvider({ brand, children }: { brand: Brand; children: React.ReactNode }) {
  return <BrandContext.Provider value={brand}>{children}</BrandContext.Provider>
}

export function useBrand(): Brand {
  return useContext(BrandContext)
}
