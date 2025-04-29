import { LinkDetails } from "@/components/dashboard/link-details"
import { LinkAnalytics } from "@/components/dashboard/link-analytics"
import { LinkActions } from "@/components/dashboard/link-actions"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function LinkDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Link Details</h1>
        <LinkActions id={params.id} />
      </div>

      <LinkDetails id={params.id} />

      <Tabs defaultValue="analytics" className="w-full">
        <TabsList className="grid w-full md:w-[400px] grid-cols-2">
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="analytics" className="mt-6">
          <LinkAnalytics id={params.id} />
        </TabsContent>
        <TabsContent value="settings" className="mt-6">
          <LinkDetails id={params.id} editable />
        </TabsContent>
      </Tabs>
    </div>
  )
}
