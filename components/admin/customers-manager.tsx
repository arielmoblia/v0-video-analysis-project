"use client"
import { useState, useEffect } from "react"
import { Loader2, Mail } from "lucide-react"
import { formatPrice } from "@/lib/currency"

interface CustomersManagerProps {
  storeId: string
  country?: string | null
}

interface CustomerRow {
  id: string
  name: string
  email: string
  phone: string | null
  created_at: string
  orderCount: number
  totalSpent: number
}

export function CustomersManager({ storeId, country }: CustomersManagerProps) {
  const [loading, setLoading] = useState(true)
  const [customers, setCustomers] = useState<CustomerRow[]>([])

  useEffect(() => {
    fetch(`/api/admin/customers?storeId=${storeId}`)
      .then((r) => r.json())
      .then((data) => {
        setCustomers(data.customers || [])
        setLoading(false)
      })
  }, [storeId])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const sorted = [...customers].sort((a, b) => b.totalSpent - a.totalSpent)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Clientes</h1>
        <p className="text-xl text-muted-foreground mt-2">
          Los que se registraron con cuenta en tu tienda, ordenados por cuánto gastaron. Usalo para mandarles promos.
        </p>
      </div>

      {sorted.length === 0 ? (
        <p className="text-sm text-slate-400">Todavía no hay clientes registrados.</p>
      ) : (
        <div className="rounded-lg border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr className="text-left text-slate-500">
                <th className="px-4 py-3 font-medium">Nombre</th>
                <th className="px-4 py-3 font-medium">Contacto</th>
                <th className="px-4 py-3 font-medium text-right">Pedidos</th>
                <th className="px-4 py-3 font-medium text-right">Gastado</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((c) => (
                <tr key={c.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium text-slate-800">{c.name}</td>
                  <td className="px-4 py-3 text-slate-500">
                    <div className="flex items-center gap-2">
                      <a href={`mailto:${c.email}`} className="hover:underline flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5" />
                        {c.email}
                      </a>
                    </div>
                    {c.phone && <p className="text-xs text-slate-400 mt-0.5">{c.phone}</p>}
                  </td>
                  <td className="px-4 py-3 text-right text-slate-600">{c.orderCount}</td>
                  <td className="px-4 py-3 text-right font-semibold text-slate-800">{formatPrice(c.totalSpent, country)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
