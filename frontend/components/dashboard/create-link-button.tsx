"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/context/auth-context"
import { Plus, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { fetchDomains, createLink } from "@/lib/api"

export function CreateLinkButton() {
  const [open, setOpen] = useState(false)
  const [url, setUrl] = useState("")
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [domainId, setDomainId] = useState("")
  const [domains, setDomains] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingDomains, setIsLoadingDomains] = useState(false)
  const { token } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const handleOpenChange = (open: boolean) => {
    setOpen(open)
    if (open) {
      loadDomains()
    } else {
      resetForm()
    }
  }

  const loadDomains = async () => {
    if (!token) return

    try {
      setIsLoadingDomains(true)
      const data = await fetchDomains(token)

      if (data.success) {
        setDomains(data.domains)

        // Set default domain
        const defaultDomain = data.domains.find((d: any) => d.isDefault)
        if (defaultDomain) {
          setDomainId(defaultDomain.id)
        } else if (data.domains.length > 0) {
          setDomainId(data.domains[0].id)
        }
      }
    } catch (error) {
      console.error("Error loading domains:", error)
      toast({
        title: "Error",
        description: "Failed to load domains",
        variant: "destructive",
      })
    } finally {
      setIsLoadingDomains(false)
    }
  }

  const resetForm = () => {
    setUrl("")
    setTitle("")
    setSlug("")
    setDomainId("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!url) {
      toast({
        title: "URL is required",
        description: "Please enter a URL to shorten",
        variant: "destructive",
      })
      return
    }

    if (!domainId) {
      toast({
        title: "Domain is required",
        description: "Please select a domain",
        variant: "destructive",
      })
      return
    }

    if (!token) {
      toast({
        title: "Authentication required",
        description: "Please log in to create links",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const data = await createLink(token, {
        originalUrl: url,
        domainId,
        title: title || undefined,
        slug: slug || undefined,
      })

      toast({
        title: "Link created!",
        description: `Your shortened URL is: ${data.link.shortUrl}`,
      })

      setOpen(false)
      resetForm()
      router.refresh()
    } catch (error) {
      toast({
        title: "Error creating link",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Link
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a new link</DialogTitle>
          <DialogDescription>Enter the details for your new shortened link.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="url">URL to shorten *</Label>
              <Input
                id="url"
                placeholder="https://example.com/very-long-url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="title">Title (optional)</Label>
              <Input
                id="title"
                placeholder="My awesome link"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="domain">Domain *</Label>
              <Select value={domainId} onValueChange={setDomainId} disabled={isLoading || isLoadingDomains}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a domain" />
                </SelectTrigger>
                <SelectContent>
                  {isLoadingDomains ? (
                    <SelectItem value="loading" disabled>
                      Loading domains...
                    </SelectItem>
                  ) : domains.length === 0 ? (
                    <SelectItem value="none" disabled>
                      No domains available
                    </SelectItem>
                  ) : (
                    domains.map((domain) => (
                      <SelectItem key={domain.id} value={domain.id}>
                        {domain.name} {domain.isDefault ? "(Default)" : ""}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="slug">Custom slug (optional)</Label>
              <Input
                id="slug"
                placeholder="my-custom-slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">Leave empty to generate a random slug</p>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Link"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
