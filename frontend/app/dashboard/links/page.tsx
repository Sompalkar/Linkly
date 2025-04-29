import { LinksTable } from "@/components/dashboard/links-table"
import { CreateLinkButton } from "@/components/dashboard/create-link-button"
import { LinksFilter } from "@/components/dashboard/links-filter"

export default function LinksPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Links</h1>
        <CreateLinkButton />
      </div>

      <LinksFilter />

      <LinksTable />
    </div>
  )
}
