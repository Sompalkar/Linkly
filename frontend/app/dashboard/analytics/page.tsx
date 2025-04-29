import { DateRangePicker } from "@/components/dashboard/date-range-picker"
import { AnalyticsOverview } from "@/components/dashboard/analytics-overview"
import { AnalyticsCharts } from "@/components/dashboard/analytics-charts"
import { TopLinksTable } from "@/components/dashboard/top-links-table"

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <DateRangePicker />
      </div>

      <AnalyticsOverview />

      <AnalyticsCharts />

      <div>
        <h2 className="text-2xl font-semibold mb-4">Top Performing Links</h2>
        <TopLinksTable />
      </div>
    </div>
  )
}
