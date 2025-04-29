import { DashboardOverview } from "@/components/dashboard/dashboard-overview"
import { CreateLinkCard } from "@/components/dashboard/create-link-card"
import { RecentLinksTable } from "@/components/dashboard/recent-links-table"
import { AnalyticsOverview } from "@/components/dashboard/analytics-overview"

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <CreateLinkCard />
        <DashboardOverview />
      </div>

      <AnalyticsOverview />

      <div>
        <h2 className="text-2xl font-semibold mb-4">Recent Links</h2>
        <RecentLinksTable />
      </div>
    </div>
  )
}
