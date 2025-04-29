import { DomainsTable } from "@/components/dashboard/domains-table"
import { AddDomainButton } from "@/components/dashboard/add-domain-button"
import { DomainVerificationGuide } from "@/components/dashboard/domain-verification-guide"

export default function DomainsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Domains</h1>
        <AddDomainButton />
      </div>

      <DomainVerificationGuide />

      <DomainsTable />
    </div>
  )
}
