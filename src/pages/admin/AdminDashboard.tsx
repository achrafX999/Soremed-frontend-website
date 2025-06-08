"use client"

import { Users, Package2, ClipboardList, TrendingUp, ShoppingCart } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/components/ui/card"

export default function AdminDashboard() {
  const stats = [
    {
      title: "Total Users",
      value: "156",
      change: "+12%",
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: "Active Orders",
      value: "23",
      change: "+5%",
      icon: ClipboardList,
      color: "bg-green-500",
    },
    {
      title: "Products",
      value: "1,254",
      change: "+3%",
      icon: Package2,
      color: "bg-purple-500",
    },
  ]

  const topProducts = [
    {
      id: 1,
      name: "Amoxicillin 500mg",
      unitsSold: 1250,
      category: "Antibiotics",
      trend: "+15%",
    },
    {
      id: 2,
      name: "Ibuprofen 200mg",
      unitsSold: 980,
      category: "Pain Relief",
      trend: "+8%",
    },
    {
      id: 3,
      name: "Vitamin D3 1000IU",
      unitsSold: 875,
      category: "Supplements",
      trend: "+22%",
    },
    {
      id: 4,
      name: "Metformin 500mg",
      unitsSold: 720,
      category: "Diabetes",
      trend: "+5%",
    },
    {
      id: 5,
      name: "Lisinopril 10mg",
      unitsSold: 650,
      category: "Cardiovascular",
      trend: "+12%",
    },
  ]

  return (
    <div className="space-y-6 p-6">
      {/* Header without download button */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
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
              <div className="mt-4 flex items-center text-sm">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-500 font-medium">{stat.change}</span>
                <span className="text-muted-foreground ml-2">vs last month</span>
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
                Top Products
              </CardTitle>
              <CardDescription>Best performing products by sales volume</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={product.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                          {index + 1}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate">{product.name}</p>
                          <p className="text-xs text-muted-foreground">{product.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">{product.unitsSold.toLocaleString()}</p>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3 text-green-500" />
                          <span className="text-xs text-green-500">{product.trend}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t">
                <p className="text-xs text-muted-foreground text-center">
                  Based on sales data from the last 30 days
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
