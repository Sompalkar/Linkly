"use client"

import { useState, useEffect } from "react"
import NextLink from "next/link"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/context/auth-context"
import { Copy, ExternalLink } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { fetchLinks } from "@/lib/api"

type LinkType = {
  id: string
  originalUrl: string
  shortUrl: string
  title: string
  clickCount: number
  createdAt: string
}

export function RecentLinksTable() {
  const [links, setLinks] = useState<LinkType[]>([])
  const [loading, setLoading] = useState(true)
  const { token } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    const loadLinks = async () => {
      if (!token) return

      try {
        setLoading(true)
        const data = await fetchLinks(token, 1, 5)

        if (data.success) {
          setLinks(data.links)
        }
      } catch (error) {
        console.error("Error fetching links:", error)
      } finally {
        setLoading(false)
      }
    }

    loadLinks()
  }, [token])

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

  if (links.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg">
        <p className="text-muted-foreground">No links created yet. Create your first link above!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {links.map((link) => (
        <div key={link.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg">
          <div className="space-y-1 mb-4 md:mb-0">
            <NextLink href={`/dashboard/links/${link.id}`} className="font-medium hover:underline">
              {link.title || link.originalUrl}
            </NextLink>
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-sm">
              <span className="text-cyan-500">{link.shortUrl}</span>
              <span className="text-muted-foreground hidden md:inline">•</span>
              <span className="text-muted-foreground">{link.clickCount} clicks</span>
              <span className="text-muted-foreground hidden md:inline">•</span>
              <span className="text-muted-foreground">
                Created {formatDistanceToNow(new Date(link.createdAt), { addSuffix: true })}
              </span>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="icon" onClick={() => copyToClipboard(link.shortUrl)}>
              <Copy className="h-4 w-4" />
              <span className="sr-only">Copy link</span>
            </Button>
            <Button variant="outline" size="icon" asChild>
              <a href={link.shortUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
                <span className="sr-only">Open link</span>
              </a>
            </Button>
          </div>
        </div>
      ))}
      <div className="text-center">
        <Button variant="outline" asChild>
          <NextLink href="/dashboard/links">View all links</NextLink>
        </Button>
      </div>
    </div>
  )
}
