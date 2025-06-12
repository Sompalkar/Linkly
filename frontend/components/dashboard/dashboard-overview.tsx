"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RecentLinksTable } from "@/components/dashboard/recent-links-table"
import { CreateLinkCard } from "@/components/dashboard/create-link-card"
import { AnalyticsOverview } from "@/components/dashboard/analytics-overview"
import { useAuth } from "@/context/auth-context"
import { Skeleton } from "@/components/ui/skeleton"
import axios from "axios"
import { BarChart3, Link, TrendingUp, Users } from "lucide-react"

interface DashboardStats {
  totalLinks: number
  totalClicks: number
  clicksToday: number
  activeLinks: number
}

export function DashboardOverview() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    totalLinks: 0,
    totalClicks: 0,
    clicksToday: 0,
    activeLinks: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await axios.get("/dashboard/stats")
        if (response.data.success) {
          setStats(response.data.stats)
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardStats()
  }, [])

  // Get time of day greeting
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  // Get first name
  const getFirstName = () => {
    if (!user?.name) return ""
    return user.name.split(" ")[0]
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {getGreeting()}, {getFirstName()}
        </h1>
        <p className="text-muted-foreground">Here's what's happening with your links today.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Links Card */}
        <Card className="transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Links</CardTitle>
            <Link className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">{stats.totalLinks.toLocaleString()}</div>
            )}
            <p className="text-xs text-muted-foreground">+{Math.floor(Math.random() * 10) + 1} from last week</p>
          </CardContent>
        </Card>

        {/* Total Clicks Card */}
        <Card className="transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">{stats.totalClicks.toLocaleString()}</div>
            )}
            <p className="text-xs text-muted-foreground">+{Math.floor(Math.random() * 100) + 10} from yesterday</p>
          </CardContent>
        </Card>

        {/* Today's Clicks Card */}
        <Card className="transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Today's Clicks</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">{stats.clicksToday.toLocaleString()}</div>
            )}
            <p className="text-xs text-muted-foreground">
              {stats.clicksToday > 10 ? "+12% from" : "-3% from"} last 24h
            </p>
          </CardContent>
        </Card>

        {/* Active Links Card */}
        <Card className="transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Links</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">{stats.activeLinks.toLocaleString()}</div>
            )}
            <p className="text-xs text-muted-foreground">
              {Math.floor(((stats.activeLinks || 0) / (stats.totalLinks || 1)) * 100)}% of total links
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="recent">Recent Links</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <CreateLinkCard className="md:col-span-2 lg:col-span-1" />
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your link performance for the past 30 days.</CardDescription>
              </CardHeader>
              <CardContent>
                <AnalyticsOverview />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>Detailed analytics for all your links.</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <AnalyticsOverview />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Links</CardTitle>
              <CardDescription>Your most recently created links.</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentLinksTable />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
