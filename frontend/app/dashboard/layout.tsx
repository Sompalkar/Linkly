import type React from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { QuickLinkCreator } from "@/components/dashboard/quick-link-creator"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout>
      {children}
      <QuickLinkCreator />
    </DashboardLayout>
  )
}
