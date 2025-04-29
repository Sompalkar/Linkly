"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/context/auth-context"
import { fetchOverallAnalytics } from "@/lib/api"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

type ClicksByDate = {
  _id: string
  count: number
}

export function AnalyticsOverview() {
  const { token } = useAuth()
  const [clicksByDate, setClicksByDate] = useState<ClicksByDate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadAnalytics = async () => {
      if (!token) return

      try {
        setLoading(true)
        const data = await fetchOverallAnalytics(token)

        if (data.success) {
          setClicksByDate(data.analytics.clicksByDate || [])
        }
      } catch (error) {
        console.error("Error loading analytics:", error)
      } finally {
        setLoading(false)
      }
    }

    loadAnalytics()
  }, [token])

  // Format data for chart
  const chartData = clicksByDate.map((item) => ({
    date: item._id,
    clicks: item.count,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Click Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-[200px] w-full" />
        ) : chartData.length > 0 ? (
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => {
                    const date = new Date(value)
                    return `${date.getMonth() + 1}/${date.getDate()}`
                  }}
                />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => [`${value} clicks`, "Clicks"]}
                  labelFormatter={(label) => {
                    const date = new Date(label)
                    return date.toLocaleDateString()
                  }}
                />
                <Bar dataKey="clicks" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[200px] w-full flex items-center justify-center">
            <p className="text-muted-foreground">No click data available yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
