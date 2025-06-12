"use client"

import { useEffect, useState } from "react" 
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast" 
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import { Plus, Globe, Check, X, Copy, MoreHorizontal, AlertTriangle, Loader2, ExternalLink } from "lucide-react"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

export default function DomainsPage() { 
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [domainToDelete, setDomainToDelete] = useState<string | null>(null)
  const [newDomainName, setNewDomainName] = useState("")
  const [isAdding, setIsAdding] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
 
      fetchDomains()
    
  }, [ ])

  const fetchDomains = async () => {
     

    try { 
      const response = await fetch(`${API_BASE_URL}/domains`, {
        headers: { 
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        const data = await response.json()
        
      }
    } catch (error) {
      console.error("Error fetching domains:", error) 
    }
  }

  const handleAddDomain = async () => { 

    try {
      setIsAdding(true)
      const response = await fetch(`${API_BASE_URL}/domains`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newDomainName.trim() }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Domain added successfully",
          description: "Please verify your domain by adding the DNS record.",
        })
        setNewDomainName("")
        setAddDialogOpen(false)
        fetchDomains()
      } else {
        toast({
          title: "Error adding domain",
          description: data.message || "Failed to add domain",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error adding domain",
        description: "Network error. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsAdding(false)
    }
  }

  const handleVerifyDomain = async (id: string) => {
 

    try {
      const response = await fetch(`${API_BASE_URL}/domains/${id}/verify`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Domain verified successfully",
          description: "Your domain is now ready to use.",
        })
        fetchDomains()
      } else {
        toast({
          title: "Verification failed",
          description: data.message || "Please check your DNS settings and try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Verification failed",
        description: "Network error. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSetDefault = async (id: string) => {
   

    try {
      const response = await fetch(`${API_BASE_URL}/domains/${id}/default`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        toast({
          title: "Default domain updated",
          description: "This domain is now your default for new links.",
        })
        fetchDomains()
      } else {
        const data = await response.json()
        toast({
          title: "Error setting default",
          description: data.message || "Failed to set default domain",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error setting default",
        description: "Network error. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteDomain = async (id: string) => {
  
    try {
      const response = await fetch(`${API_BASE_URL}/domains/${id}`, {
        method: "DELETE",
        headers: { 
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        toast({
          title: "Domain deleted",
          description: "The domain has been successfully deleted.",
        })
        fetchDomains()
      } else {
        const data = await response.json()
        toast({
          title: "Error deleting domain",
          description: data.message || "Failed to delete domain",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error deleting domain",
        description: "Network error. Please try again.",
        variant: "destructive",
      })
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: "DNS record has been copied to your clipboard",
    })
  }

  if ( isAdding) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 w-32 bg-muted animate-pulse rounded" />
            <div className="h-4 w-48 bg-muted animate-pulse rounded mt-2" />
          </div>
          <div className="h-10 w-32 bg-muted animate-pulse rounded" />
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Custom Domains</h1>
          <p className="text-muted-foreground">Add your own domains to create branded short links</p>
        </div>
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
              <Plus className="h-4 w-4 mr-2" />
              Add Domain
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Custom Domain</DialogTitle>
              <DialogDescription>Enter your domain name to start the verification process.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="domain">Domain Name</Label>
                <Input
                  id="domain"
                  placeholder="example.com"
                  value={newDomainName}
                  onChange={(e) => setNewDomainName(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddDomain} disabled={isAdding || !newDomainName.trim()}>
                {isAdding ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Domain"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Domain Verification Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Domain Verification Guide
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-medium mb-2">Step 1: Add DNS Record</h4>
              <p className="text-sm text-muted-foreground">
                Add a TXT record to your domain's DNS settings with the verification token.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Step 2: Verify Domain</h4>
              <p className="text-sm text-muted-foreground">Click the verify button once you've added the DNS record.</p>
            </div>
          </div>
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">DNS Configuration Example</h4>
            <div className="space-y-1 text-sm font-mono">
              <div>Type: TXT</div>
              <div>Name: @</div>
              <div>Value: linkly-verify=your-verification-token</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Domains List */}
      {/* <div className="space-y-4">
        {length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No custom domains</h3>
              <p className="text-muted-foreground mb-4">Add your first custom domain to create branded short links</p>
              <Button
                onClick={() => setAddDialogOpen(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Domain
              </Button>
            </CardContent>
          </Card>
        ) : (
          domains.domains.map((domain, index) => (
            <motion.div
              key={domain.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <Globe className="h-5 w-5 text-muted-foreground" />
                        <h3 className="text-lg font-semibold">{domain.name}</h3>
                        <div className="flex gap-2">
                          <Badge
                            variant={domain.isVerified ? "default" : "secondary"}
                            className={
                              domain.isVerified
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                : "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
                            }
                          >
                            {domain.isVerified ? (
                              <>
                                <Check className="h-3 w-3 mr-1" />
                                Verified
                              </>
                            ) : (
                              <>
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Unverified
                              </>
                            )}
                          </Badge>
                          {domain.isDefault && (
                            <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                              Default
                            </Badge>
                          )}
                        </div>
                      </div>

                      {!domain.isVerified && (
                        <div className="space-y-3">
                          <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                            <p className="text-sm text-amber-800 dark:text-amber-200 mb-2">
                              Add this TXT record to your DNS:
                            </p>
                            <div className="flex items-center gap-2">
                              <code className="flex-1 text-xs bg-white dark:bg-gray-800 px-2 py-1 rounded border font-mono">
                                linkly-verify={domain.verificationToken}
                              </code>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => copyToClipboard(`linkly-verify=${domain.verificationToken}`)}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-3">
                        <span>Added {new Date(domain.createdAt).toLocaleDateString()}</span>
                        {domain.isVerified && (
                          <span className="flex items-center gap-1">
                            <ExternalLink className="h-3 w-3" />
                            Ready for use
                          </span>
                        )}
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {!domain.isVerified && (
                          <DropdownMenuItem onClick={() => handleVerifyDomain(domain.id)}>
                            <Check className="h-4 w-4 mr-2" />
                            Verify Domain
                          </DropdownMenuItem>
                        )}
                        {domain.isVerified && !domain.isDefault && (
                          <DropdownMenuItem onClick={() => handleSetDefault(domain.id)}>
                            <Globe className="h-4 w-4 mr-2" />
                            Set as Default
                          </DropdownMenuItem>
                        )}
                        {!domain.isDefault && (
                          <DropdownMenuItem
                            onClick={() => {
                              setDomainToDelete(domain.id)
                              setDeleteDialogOpen(true)
                            }}
                            className="text-destructive"
                          >
                            <X className="h-4 w-4 mr-2" />
                            Delete Domain
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div> */}

      {/* Delete Confirmation Dialog */}
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
            <AlertDialogAction
              onClick={() => {
                if (domainToDelete) {
                  handleDeleteDomain(domainToDelete)
                  setDeleteDialogOpen(false)
                  setDomainToDelete(null)
                }
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
