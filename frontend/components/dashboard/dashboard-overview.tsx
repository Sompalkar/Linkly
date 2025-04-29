"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { BarChart3, LinkIcon, MousePointerClick } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { fetchLinks, fetchOverallAnalytics } from "@/lib/api"

export function DashboardOverview() {
  const { token } = useAuth()
  const [stats, setStats] = useState({
    totalLinks: 0,
    totalClicks: 0,
    clickRate: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      if (!token) return

      try {
        setLoading(true)

        // Fetch links count
        const linksData = await fetchLinks(token, 1, 1)
        const totalLinks = linksData.pagination?.total || 0

        // Fetch analytics
        const analyticsData = await fetchOverallAnalytics(token)
        const totalClicks = analyticsData.analytics?.totalClicks || 0

        // Calculate click rate
        const clickRate = totalLinks > 0 ? Math.round((totalClicks / totalLinks) * 10) / 10 : 0

        setStats({
          totalLinks,
          totalClicks,
          clickRate,
        })
      } catch (error) {
        console.error("Error loading dashboard stats:", error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [token])

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard
        title="Total Links"
        value={stats.totalLinks}
        icon={<LinkIcon className="h-4 w-4 text-cyan-500" />}
        loading={loading}
      />
      <StatCard
        title="Total Clicks"
        value={stats.totalClicks}
        icon={<MousePointerClick className="h-4 w-4 text-cyan-500" />}
        loading={loading}
      />
      <StatCard
        title="Avg. Clicks/Link"
        value={stats.clickRate}
        icon={<BarChart3 className="h-4 w-4 text-cyan-500" />}
        loading={loading}
      />
    </div>
  )
}

function StatCard({
  title,
  value,
  icon,
  loading,
}: {
  title: string
  value: number
  icon: React.ReactNode
  loading: boolean
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-20" />
        ) : (
          <div className="text-2xl font-bold">{value.toLocaleString()}</div>
        )}
      </CardContent>
    </Card>
  )
}
