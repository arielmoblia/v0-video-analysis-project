export interface PersonasResumenData {
  tolarTotal: number
  tolarSinSenal: number
  tolarConSenal: number
  tiendasCreadas: number
  tiendasConAdminActivo: number
  personasEnTiendas: number
  personasQueCompraron: number
}

export const PERIODOS_VISITAS = [
  { valor: "siempre", label: "Siempre" },
  { valor: "mes", label: "Último mes" },
  { valor: "semana", label: "Última semana" },
] as const

export type PeriodoVisitas = (typeof PERIODOS_VISITAS)[number]["valor"]
