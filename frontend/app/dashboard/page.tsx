import type { Metadata } from "next"
import { DashboardOverview } from "@/components/dashboard/dashboard-overview"

export const metadata: Metadata = {
  title: "Dashboard | Linkly",
  description: "Manage your shortened links and view analytics",
}

export default function DashboardPage() {
  return <DashboardOverview />
}
