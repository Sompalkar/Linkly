"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/context/auth-context"
import { fetchOverallAnalytics } from "@/lib/api"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

type ClicksByDate = {
  _id: string
  count: number
}

type ClicksByDevice = {
  _id: string
  count: number
}

type ClicksByCountry = {
  _id: string
  count: number
}

type ClicksByBrowser = {
  _id: string
  count: number
}

type AnalyticsData = {
  clicksByDate: ClicksByDate[]
  clicksByDevice: ClicksByDevice[]
  clicksByCountry: ClicksByCountry[]
  clicksByBrowser: ClicksByBrowser[]
}

export function AnalyticsCharts() {
  const { token } = useAuth()
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    clicksByDate: [],
    clicksByDevice: [],
    clicksByCountry: [],
    clicksByBrowser: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadAnalytics = async () => {
      if (!token) return

      try {
        setLoading(true)
        const data = await fetchOverallAnalytics(token)

        if (data.success) {
          setAnalyticsData({
            clicksByDate: data.analytics.clicksByDate || [],
            clicksByDevice: data.analytics.clicksByDevice || [],
            clicksByCountry: data.analytics.clicksByCountry || [],
            clicksByBrowser: data.analytics.clicksByBrowser || [],
          })
        }
      } catch (error) {
        console.error("Error loading analytics:", error)
      } finally {
        setLoading(false)
      }
    }

    loadAnalytics()
  }, [token])

  // Format data for charts
  const dateChartData = analyticsData.clicksByDate.map((item) => ({
    date: new Date(item._id).toLocaleDateString(),
    clicks: item.count,
  }))

  const deviceChartData = analyticsData.clicksByDevice.map((item) => ({
    name: item._id || "Unknown",
    value: item.count,
  }))

  const countryChartData = analyticsData.clicksByCountry.slice(0, 5).map((item) => ({
    name: item._id || "Unknown",
    value: item.count,
  }))

  const browserChartData = analyticsData.clicksByBrowser.slice(0, 5).map((item) => ({
    name: item._id || "Unknown",
    value: item.count,
  }))

  // Colors for pie charts
  const COLORS = ["#8b5cf6", "#a78bfa", "#c4b5fd", "#ddd6fe", "#ede9fe"]

  return (
    <Tabs defaultValue="clicks" className="w-full">
      <TabsList className="grid w-full md:w-[400px] grid-cols-4">
        <TabsTrigger value="clicks">Clicks</TabsTrigger>
        <TabsTrigger value="devices">Devices</TabsTrigger>
        <TabsTrigger value="countries">Countries</TabsTrigger>
        <TabsTrigger value="browsers">Browsers</TabsTrigger>
      </TabsList>

      <TabsContent value="clicks" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Click Activity Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : dateChartData.length > 0 ? (
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dateChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="clicks" stroke="#8b5cf6" strokeWidth={2} activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[300px] w-full flex items-center justify-center">
                <p className="text-muted-foreground">No click data available yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="devices" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Clicks by Device</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : deviceChartData.length > 0 ? (
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={deviceChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {deviceChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[300px] w-full flex items-center justify-center">
                <p className="text-muted-foreground">No device data available yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="countries" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Top Countries</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : countryChartData.length > 0 ? (
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={countryChartData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="Clicks" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[300px] w-full flex items-center justify-center">
                <p className="text-muted-foreground">No country data available yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="browsers" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Top Browsers</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : browserChartData.length > 0 ? (
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={browserChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {browserChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[300px] w-full flex items-center justify-center">
                <p className="text-muted-foreground">No browser data available yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
