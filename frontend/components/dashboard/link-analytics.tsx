"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DateRangePicker } from "@/components/dashboard/date-range-picker"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/context/auth-context"
import { fetchLinkAnalytics } from "@/lib/api"
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

type LinkAnalyticsProps = {
  id: string
}

export function LinkAnalytics({ id }: LinkAnalyticsProps) {
  const [analyticsData, setAnalyticsData] = useState<any>({
    totalClicks: 0,
    clicksByDate: [],
    clicksByBrowser: [],
    clicksByDevice: [],
    clicksByCountry: [],
    clicksByReferrer: [],
  })
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState<{
    startDate?: string
    endDate?: string
  }>({})

  const { token } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    fetchAnalyticsData()
  }, [id, token, dateRange])

  const fetchAnalyticsData = async () => {
    if (!token) return

    try {
      setLoading(true)
      const data = await fetchLinkAnalytics(token, id, dateRange.startDate, dateRange.endDate)

      if (data.success) {
        setAnalyticsData(data.analytics)
      }
    } catch (error) {
      console.error("Error fetching link analytics:", error)
      toast({
        title: "Error",
        description: "Failed to load analytics data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDateRangeChange = (range: { startDate?: string; endDate?: string }) => {
    setDateRange(range)
  }

  // Format data for charts
  const dateChartData =
    analyticsData.clicksByDate?.map((item: any) => ({
      date: new Date(item._id).toLocaleDateString(),
      clicks: item.count,
    })) || []

  const deviceChartData =
    analyticsData.clicksByDevice?.map((item: any) => ({
      name: item._id || "Unknown",
      value: item.count,
    })) || []

  const browserChartData =
    analyticsData.clicksByBrowser?.map((item: any) => ({
      name: item._id || "Unknown",
      value: item.count,
    })) || []

  const countryChartData =
    analyticsData.clicksByCountry?.map((item: any) => ({
      name: item._id || "Unknown",
      value: item.count,
    })) || []

  const referrerChartData =
    analyticsData.clicksByReferrer?.map((item: any) => ({
      name: item._id || "Unknown",
      value: item.count,
    })) || []

  // Colors for pie charts
  const COLORS = ["#8b5cf6", "#a78bfa", "#c4b5fd", "#ddd6fe", "#ede9fe", "#f5f3ff"]

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold">Link Analytics</h2>
        <DateRangePicker onRangeChange={handleDateRangeChange} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">{analyticsData.totalClicks}</div>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="clicks" className="w-full">
        <TabsList className="grid w-full md:w-[600px] grid-cols-5">
          <TabsTrigger value="clicks">Clicks</TabsTrigger>
          <TabsTrigger value="devices">Devices</TabsTrigger>
          <TabsTrigger value="browsers">Browsers</TabsTrigger>
          <TabsTrigger value="countries">Countries</TabsTrigger>
          <TabsTrigger value="referrers">Referrers</TabsTrigger>
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
                  <p className="text-muted-foreground">No click data available for this period</p>
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
                  <p className="text-muted-foreground">No device data available for this period</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="browsers" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Clicks by Browser</CardTitle>
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
                  <p className="text-muted-foreground">No browser data available for this period</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="countries" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Clicks by Country</CardTitle>
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
                  <p className="text-muted-foreground">No country data available for this period</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="referrers" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Clicks by Referrer</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-[300px] w-full" />
              ) : referrerChartData.length > 0 ? (
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={referrerChartData} layout="vertical">
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
                  <p className="text-muted-foreground">No referrer data available for this period</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
