"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/context/auth-context"
import { Copy, Check, MoreHorizontal, AlertTriangle } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { fetchDomains, verifyDomain, setDefaultDomain, deleteDomain } from "@/lib/api"

type Domain = {
  id: string
  name: string
  isVerified: boolean
  verificationToken: string
  isDefault: boolean
  createdAt: string
}

export function DomainsTable() {
  const [domains, setDomains] = useState<Domain[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [domainToDelete, setDomainToDelete] = useState<string | null>(null)
  const { token } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    fetchDomainsData()
  }, [token])

  const fetchDomainsData = async () => {
    if (!token) return

    try {
      setLoading(true)
      const data = await fetchDomains(token)

      if (data.success) {
        setDomains(data.domains)
      }
    } catch (error) {
      console.error("Error fetching domains:", error)
      toast({
        title: "Error",
        description: "Failed to load domains",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: "The verification token has been copied to your clipboard",
    })
  }

  const handleVerifyDomain = async (id: string) => {
    if (!token) return

    try {
      const data = await verifyDomain(token, id)

      if (data.success) {
        toast({
          title: "Domain verified",
          description: "Your domain has been successfully verified",
        })
        fetchDomainsData()
      }
    } catch (error) {
      toast({
        title: "Verification failed",
        description: error instanceof Error ? error.message : "Failed to verify domain. Check your DNS settings.",
        variant: "destructive",
      })
    }
  }

  const handleSetDefaultDomain = async (id: string) => {
    if (!token) return

    try {
      const data = await setDefaultDomain(token, id)

      if (data.success) {
        toast({
          title: "Default domain updated",
          description: "Your default domain has been updated successfully",
        })
        fetchDomainsData()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to set default domain",
        variant: "destructive",
      })
    }
  }

  const handleDeleteClick = (id: string) => {
    setDomainToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!domainToDelete || !token) return

    try {
      await deleteDomain(token, domainToDelete)

      toast({
        title: "Domain deleted",
        description: "The domain has been successfully deleted",
      })

      fetchDomainsData()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete domain",
        variant: "destructive",
      })
    } finally {
      setDeleteDialogOpen(false)
      setDomainToDelete(null)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
            <div className="flex space-x-2">
              <Skeleton className="h-9 w-9 rounded-md" />
              <Skeleton className="h-9 w-9 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (domains.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg">
        <p className="text-muted-foreground">No domains found. Add your first domain to get started!</p>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-lg border">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left p-4 font-medium">Domain</th>
              <th className="text-center p-4 font-medium hidden md:table-cell">Status</th>
              <th className="text-center p-4 font-medium hidden md:table-cell">Default</th>
              <th className="text-right p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {domains.map((domain) => (
              <tr key={domain.id} className="border-b">
                <td className="p-4">
                  <div className="space-y-1">
                    <div className="font-medium">{domain.name}</div>
                    {!domain.isVerified && (
                      <div className="text-sm text-muted-foreground flex items-center">
                        <AlertTriangle className="h-3 w-3 mr-1 text-amber-500" />
                        Not verified
                      </div>
                    )}
                  </div>
                </td>
                <td className="p-4 text-center hidden md:table-cell">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      domain.isVerified
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        : "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
                    }`}
                  >
                    {domain.isVerified ? "Verified" : "Unverified"}
                  </span>
                </td>
                <td className="p-4 text-center hidden md:table-cell">
                  {domain.isDefault ? (
                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                      <Check className="h-3 w-3 mr-1" />
                      Default
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-xs">-</span>
                  )}
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    {!domain.isVerified && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(`shortener-verify=${domain.verificationToken}`)}
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        Token
                      </Button>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">More options</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {!domain.isVerified && (
                          <DropdownMenuItem onClick={() => handleVerifyDomain(domain.id)}>
                            Verify domain
                          </DropdownMenuItem>
                        )}
                        {!domain.isDefault && domain.isVerified && (
                          <DropdownMenuItem onClick={() => handleSetDefaultDomain(domain.id)}>
                            Set as default
                          </DropdownMenuItem>
                        )}
                        {!domain.isDefault && (
                          <DropdownMenuItem onClick={() => handleDeleteClick(domain.id)}>
                            Delete domain
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the domain and all associated links will no
              longer work.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
