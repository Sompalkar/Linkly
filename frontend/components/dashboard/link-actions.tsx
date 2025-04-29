"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/context/auth-context"
import { Copy, ExternalLink, Trash2, Loader2 } from "lucide-react"
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
import { fetchLinkById, deleteLink } from "@/lib/api"

type LinkActionsProps = {
  id: string
}

export function LinkActions({ id }: LinkActionsProps) {
  const [shortUrl, setShortUrl] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { token } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  // Fetch the short URL if not already loaded
  const getShortUrl = async () => {
    if (shortUrl) return shortUrl

    if (!token) return null

    try {
      const data = await fetchLinkById(token, id)
      if (data.success) {
        setShortUrl(data.link.shortUrl)
        return data.link.shortUrl
      }
      return null
    } catch (error) {
      console.error("Error fetching link:", error)
      return null
    }
  }

  const copyToClipboard = async () => {
    const url = await getShortUrl()
    if (!url) {
      toast({
        title: "Error",
        description: "Could not retrieve the short URL",
        variant: "destructive",
      })
      return
    }

    navigator.clipboard.writeText(url)
    toast({
      title: "Copied to clipboard",
      description: "The link has been copied to your clipboard",
    })
  }

  const openLink = async () => {
    const url = await getShortUrl()
    if (!url) {
      toast({
        title: "Error",
        description: "Could not retrieve the short URL",
        variant: "destructive",
      })
      return
    }

    window.open(url, "_blank")
  }

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!token) return

    try {
      setIsDeleting(true)
      await deleteLink(token, id)

      toast({
        title: "Link deleted",
        description: "The link has been successfully deleted",
      })

      router.push("/dashboard/links")
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete link",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
    }
  }

  return (
    <>
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" onClick={copyToClipboard}>
          <Copy className="h-4 w-4 mr-1" />
          Copy
        </Button>
        <Button variant="outline" size="sm" onClick={openLink}>
          <ExternalLink className="h-4 w-4 mr-1" />
          Open
        </Button>
        <Button variant="outline" size="sm" onClick={handleDeleteClick} className="text-red-500 hover:text-red-700">
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the link and all associated analytics data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700" disabled={isDeleting}>
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
