"use client"

import { useState, useEffect } from "react"
import NextLink from "next/link"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/context/auth-context"
import { Copy, ExternalLink } from "lucide-react"
import { fetchOverallAnalytics } from "@/lib/api"

type TopLink = {
  _id: string
  count: number
  originalUrl: string
  slug: string
  title: string
  domain: string
}

export function TopLinksTable() {
  const [topLinks, setTopLinks] = useState<TopLink[]>([])
  const [loading, setLoading] = useState(true)
  const { token } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    const loadTopLinks = async () => {
      if (!token) return

      try {
        setLoading(true)
        const data = await fetchOverallAnalytics(token)

        if (data.success) {
          setTopLinks(data.analytics.topLinks || [])
        }
      } catch (error) {
        console.error("Error fetching top links:", error)
        toast({
          title: "Error",
          description: "Failed to load top performing links",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadTopLinks()
  }, [token, toast])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: "The link has been copied to your clipboard",
    })
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
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

  if (topLinks.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg">
        <p className="text-muted-foreground">
          No link data available yet. Create and share some links to see analytics.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="text-left p-4 font-medium">Link</th>
            <th className="text-center p-4 font-medium">Clicks</th>
            <th className="text-right p-4 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {topLinks.map((link) => {
            const shortUrl = `${link.domain}/${link.slug}`
            return (
              <tr key={link._id} className="border-b">
                <td className="p-4">
                  <div className="space-y-1">
                    <NextLink href={`/dashboard/links/${link._id}`} className="font-medium hover:underline">
                      {link.title || link.originalUrl}
                    </NextLink>
                    <div className="text-sm text-purple-500">{shortUrl}</div>
                  </div>
                </td>
                <td className="p-4 text-center font-medium">{link.count}</td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => copyToClipboard(shortUrl)}>
                      <Copy className="h-4 w-4" />
                      <span className="sr-only">Copy link</span>
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                      <a href={shortUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                        <span className="sr-only">Open link</span>
                      </a>
                    </Button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
