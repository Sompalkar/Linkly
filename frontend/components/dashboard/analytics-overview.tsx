"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import axios from "axios"

interface AnalyticsData {
  clicksOverTime: Array<{ date: string; clicks: number }>
  topCountries: Array<{ country: string; clicks: number }>
  topReferrers: Array<{ referrer: string; clicks: number }>
  topDevices: Array<{ device: string; clicks: number }>
}

export function AnalyticsOverview() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [timeframe, setTimeframe] = useState("7d")

  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true)
      try {
        const response = await axios.get(`/analytics/overview?timeframe=${timeframe}`)
        if (response.data.success) {
          setAnalyticsData(response.data.analytics)
        }
      } catch (error) {
        console.error("Error fetching analytics:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalytics()
  }, [timeframe])

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-[200px]" />
          <Skeleton className="h-10 w-[120px]" />
        </div>
        <Skeleton className="h-[300px] w-full" />
      </div>
    )
  }

  // Mock data for the chart
  const mockData = {
    clicksOverTime: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      clicks: Math.floor(Math.random() * 100) + 10,
    })),
    topCountries: [
      { country: "United States", clicks: 245 },
      { country: "United Kingdom", clicks: 133 },
      { country: "Germany", clicks: 98 },
      { country: "Canada", clicks: 76 },
      { country: "Australia", clicks: 62 },
    ],
    topReferrers: [
      { referrer: "Direct", clicks: 312 },
      { referrer: "Google", clicks: 147 },
      { referrer: "Twitter", clicks: 94 },
      { referrer: "Facebook", clicks: 68 },
      { referrer: "LinkedIn", clicks: 53 },
    ],
    topDevices: [
      { device: "Mobile", clicks: 423 },
      { device: "Desktop", clicks: 312 },
      { device: "Tablet", clicks: 89 },
    ],
  }

  // Filter data based on timeframe
  const filterDataByTimeframe = () => {
    const days = timeframe === "7d" ? 7 : timeframe === "30d" ? 30 : 90
    return mockData.clicksOverTime.slice(-days)
  }

  const chartData = filterDataByTimeframe()

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Click Performance</h3>
        <Tabs value={timeframe} onValueChange={setTimeframe} className="w-[200px]">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="7d">7D</TabsTrigger>
            <TabsTrigger value="30d">30D</TabsTrigger>
            <TabsTrigger value="90d">90D</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Chart */}
      <div className="h-[300px] w-full">
        <div className="relative h-full">
          <div className="absolute inset-0 flex items-end">
            {chartData.map((item, i) => (
              <div key={i} className="flex-1 flex flex-col justify-end items-center group">
                <div className="relative">
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.clicks} clicks
                  </div>
                </div>
                <div
                  className="w-full max-w-[20px] bg-gradient-to-t from-cyan-500 to-blue-600 rounded-t mx-auto transition-all hover:opacity-80"
                  style={{ height: `${(item.clicks / 100) * 100}%`, minHeight: "10px" }}
                ></div>
                <div className="text-xs text-muted-foreground mt-1 rotate-45 origin-left">
                  {new Date(item.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {/* Top Countries */}
        <Card className="p-4">
          <h4 className="text-sm font-medium mb-3">Top Countries</h4>
          <div className="space-y-2">
            {mockData.topCountries.slice(0, 5).map((item, i) => (
              <div key={i} className="flex justify-between items-center">
                <span className="text-sm">{item.country}</span>
                <span className="text-sm font-medium">{item.clicks}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Referrers */}
        <Card className="p-4">
          <h4 className="text-sm font-medium mb-3">Top Referrers</h4>
          <div className="space-y-2">
            {mockData.topReferrers.slice(0, 5).map((item, i) => (
              <div key={i} className="flex justify-between items-center">
                <span className="text-sm">{item.referrer}</span>
                <span className="text-sm font-medium">{item.clicks}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Devices */}
        <Card className="p-4">
          <h4 className="text-sm font-medium mb-3">Device Breakdown</h4>
          <div className="space-y-2">
            {mockData.topDevices.map((item, i) => (
              <div key={i} className="flex justify-between items-center">
                <span className="text-sm">{item.device}</span>
                <span className="text-sm font-medium">{item.clicks}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
