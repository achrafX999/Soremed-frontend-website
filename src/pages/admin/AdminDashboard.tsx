"use client"
import { useEffect, useState } from 'react'
import { Users, Package2, ClipboardList, ShoppingCart } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/components/ui/card"
import api from '../../api/axios'

interface TopProduct {
  productName: string
  totalQuantity: number
}

interface DashboardMetrics {
  totalUsers: number
  activeOrders: number
  totalProducts: number
  topProducts: TopProduct[]
}

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api
      .get<DashboardMetrics>('/admin/dashboard')
      .then(res => setMetrics(res.data))
      .catch(err => {
        console.error(err)
        setError('Failed to load dashboard metrics')
      })
      .finally(() => setLoading(false))
  }, [])

  const stats = metrics
    ? [
        { title: 'Total des utilisateurs', value: metrics.totalUsers, icon: Users, color: 'bg-blue-500' },
        { title: 'Commandes actives', value: metrics.activeOrders, icon: ClipboardList, color: 'bg-green-500' },
        { title: 'Produits', value: metrics.totalProducts, icon: Package2, color: 'bg-purple-500' },
      ]
    : []

  if (loading) return <div>Loading dashboard…</div>
  if (error) return <div className="text-red-600">{error}</div>

  return (
    <div className="space-y-6 p-6">
      {/* Header without download button */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Tableau de bord administrateur</h1>
      </div>

      {/* Unified grid: stats + full-width Top Products */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stats cards */}
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-semibold">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                Totaux actuels
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Top Products spans full width */}
        <div className="md:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Top produits
              </CardTitle>
              <CardDescription>Meilleurs produits par volume de ventes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics?.topProducts.map((product, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                          {index + 1}
                        </div>
                        <p className="text-sm font-medium truncate">{product.productName}</p>
                      </div>
                      <p className="text-sm font-semibold">{product.totalQuantity.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t">
                
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}