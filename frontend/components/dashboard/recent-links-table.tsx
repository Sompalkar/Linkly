"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Copy, ExternalLink, MoreHorizontal, QrCode } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import axios from "axios"

interface Link {
  id: string
  originalUrl: string
  shortUrl: string
  slug: string
  clicks: number
  createdAt: string
}

export function RecentLinksTable() {
  const [links, setLinks] = useState<Link[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const response = await axios.get("/links/recent")
        if (response.data.success) {
          setLinks(response.data.links)
        }
      } catch (error) {
        console.error("Error fetching recent links:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLinks()
  }, [])

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url)
    toast({
      title: "Copied to clipboard",
      description: "Link has been copied to your clipboard.",
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
            <div className="flex space-x-2">
              <Skeleton className="h-9 w-9 rounded-md" />
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
      <div className="text-center py-8">
        <p className="text-muted-foreground">No links created yet. Create your first link above!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {links.map((link) => (
        <div
          key={link.id}
          className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
        >
          <div className="space-y-1 mb-4 md:mb-0">
            <div className="flex items-center">
              <h3 className="font-medium truncate max-w-[300px]">{link.shortUrl}</h3>
              <span className="ml-2 text-xs bg-cyan-100 dark:bg-cyan-900 text-cyan-800 dark:text-cyan-200 px-2 py-0.5 rounded-full">
                {link.clicks} clicks
              </span>
            </div>
            <p className="text-sm text-muted-foreground truncate max-w-[350px]">{link.originalUrl}</p>
            <p className="text-xs text-muted-foreground">Created {new Date(link.createdAt).toLocaleDateString()}</p>
          </div>
          <div className="flex space-x-2">
            <Button size="icon" variant="outline" onClick={() => copyToClipboard(link.shortUrl)}>
              <Copy className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="outline" asChild>
              <a href={link.shortUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
            <Button size="icon" variant="outline">
              <QrCode className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="outline">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
