"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/context/auth-context"
import { Copy, ExternalLink, Loader2 } from "lucide-react"
import { fetchLinkById, updateLink } from "@/lib/api"
import { format } from "date-fns"

type LinkDetailsProps = {
  id: string
  editable?: boolean
}

export function LinkDetails({ id, editable = false }: LinkDetailsProps) {
  const [link, setLink] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    isActive: true,
    password: "",
  })

  const { token } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    const fetchLink = async () => {
      if (!token) return

      try {
        setLoading(true)
        const data = await fetchLinkById(token, id)

        if (data.success) {
          setLink(data.link)
          setFormData({
            title: data.link.title || "",
            isActive: data.link.isActive,
            password: "",
          })
        }
      } catch (error) {
        console.error("Error fetching link:", error)
        toast({
          title: "Error",
          description: "Failed to load link details",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchLink()
  }, [id, token, toast])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: "The link has been copied to your clipboard",
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData({
      ...formData,
      isActive: checked,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return

    try {
      setSaving(true)
      const updateData: any = {
        title: formData.title,
        isActive: formData.isActive,
      }

      if (formData.password) {
        updateData.password = formData.password
      }

      const data = await updateLink(token, id, updateData)

      if (data.success) {
        toast({
          title: "Link updated",
          description: "Your link has been updated successfully",
        })

        // Reset password field
        setFormData({
          ...formData,
          password: "",
        })

        // Refresh link data
        const refreshedData = await fetchLinkById(token, id)
        if (refreshedData.success) {
          setLink(refreshedData.link)
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update link",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-4 w-[300px]" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!link) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Link not found</CardTitle>
          <CardDescription>The requested link could not be found or you don't have access to it.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{editable ? "Edit Link" : "Link Details"}</CardTitle>
        <CardDescription>
          {editable ? "Update your link settings below" : "View the details of your shortened link"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {editable ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Link Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="My awesome link"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password Protection (optional)</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Leave empty to keep current password"
              />
              <p className="text-xs text-muted-foreground">
                {link.password
                  ? "This link is currently password protected. Enter a new password to change it, or leave empty to keep the current one."
                  : "Add a password to restrict access to your link."}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="isActive" checked={formData.isActive} onCheckedChange={handleSwitchChange} />
              <Label htmlFor="isActive">Link is active</Label>
            </div>

            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Original URL</h3>
                <p className="text-sm break-all">{link.originalUrl}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Short URL</h3>
                <div className="flex items-center space-x-2">
                  <p className="text-sm text-purple-500">{link.shortUrl}</p>
                  <Button variant="ghost" size="icon" onClick={() => copyToClipboard(link.shortUrl)}>
                    <Copy className="h-4 w-4" />
                    <span className="sr-only">Copy link</span>
                  </Button>
                  <Button variant="ghost" size="icon" asChild>
                    <a href={link.shortUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                      <span className="sr-only">Open link</span>
                    </a>
                  </Button>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Created</h3>
                <p className="text-sm">{format(new Date(link.createdAt), "PPP")}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Status</h3>
                <div className="flex items-center">
                  <div className={`h-2 w-2 rounded-full mr-2 ${link.isActive ? "bg-green-500" : "bg-red-500"}`} />
                  <p className="text-sm">{link.isActive ? "Active" : "Inactive"}</p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Total Clicks</h3>
                <p className="text-sm font-semibold">{link.clickCount}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Password Protected</h3>
                <p className="text-sm">{link.password ? "Yes" : "No"}</p>
              </div>
              {link.expiresAt && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Expires</h3>
                  <p className="text-sm">{format(new Date(link.expiresAt), "PPP")}</p>
                </div>
              )}
            </div>

            {(link.utmSource || link.utmMedium || link.utmCampaign) && (
              <div>
                <h3 className="text-sm font-medium mb-2">UTM Parameters</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {link.utmSource && (
                    <div>
                      <h4 className="text-xs font-medium text-muted-foreground mb-1">Source</h4>
                      <p className="text-sm">{link.utmSource}</p>
                    </div>
                  )}
                  {link.utmMedium && (
                    <div>
                      <h4 className="text-xs font-medium text-muted-foreground mb-1">Medium</h4>
                      <p className="text-sm">{link.utmMedium}</p>
                    </div>
                  )}
                  {link.utmCampaign && (
                    <div>
                      <h4 className="text-xs font-medium text-muted-foreground mb-1">Campaign</h4>
                      <p className="text-sm">{link.utmCampaign}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
