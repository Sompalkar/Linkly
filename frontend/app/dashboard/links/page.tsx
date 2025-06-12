"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useRecoilValue, useRecoilState } from "recoil"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { authTokenSelector } from "@/store/selectors/auth"
import { linksState, tagsState } from "@/store/atoms/links"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import {
  MoreHorizontal,
  Copy,
  ExternalLink,
  Edit,
  Trash2,
  BarChart3,
  Search,
  Filter,
  Plus,
  Eye,
  Calendar,
  Tag,
  Download,
  Link2,
} from "lucide-react"
import { format } from "date-fns"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

export default function LinksPage() {
  const router = useRouter()
  const token = useRecoilValue(authTokenSelector)
  const [links, setLinks] = useRecoilState(linksState)
  const [tags, setTags] = useRecoilState(tagsState)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [linkToDelete, setLinkToDelete] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (token) {
      fetchLinks()
      fetchTags()
    }
  }, [token, links.currentPage, links.searchTerm, links.selectedTag, links.sortBy, links.sortOrder])

  const fetchLinks = async () => {
    if (!token) return

    try {
      setLinks((prev) => ({ ...prev, isLoading: true }))

      const params = new URLSearchParams({
        page: links.currentPage.toString(),
        limit: "10",
        sortBy: links.sortBy,
        sortOrder: links.sortOrder,
      })

      if (links.searchTerm) params.append("search", links.searchTerm)
      if (links.selectedTag) params.append("tag", links.selectedTag)

      const response = await fetch(`${API_BASE_URL}/links?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        const data = await response.json()
        setLinks((prev) => ({
          ...prev,
          links: data.links || [],
          totalLinks: data.pagination?.total || 0,
          totalPages: data.pagination?.pages || 1,
          isLoading: false,
        }))
      }
    } catch (error) {
      console.error("Error fetching links:", error)
      toast({
        title: "Error fetching links",
        description: "Failed to load your links",
        variant: "destructive",
      })
      setLinks((prev) => ({ ...prev, isLoading: false }))
    }
  }

  const fetchTags = async () => {
    if (!token) return

    try {
      const response = await fetch(`${API_BASE_URL}/links/tags`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        const data = await response.json()
        setTags(data.tags || [])
      }
    } catch (error) {
      console.error("Error fetching tags:", error)
    }
  }

  const handleCopyLink = (shortUrl: string) => {
    navigator.clipboard.writeText(shortUrl)
    toast({
      title: "Copied to clipboard",
      description: "Short URL has been copied to your clipboard",
    })
  }

  const handleDeleteLink = async (id: string) => {
    if (!token) return

    try {
      const response = await fetch(`${API_BASE_URL}/links/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        toast({
          title: "Link deleted",
          description: "The link has been successfully deleted",
        })
        fetchLinks()
      } else {
        const data = await response.json()
        toast({
          title: "Error deleting link",
          description: data.message || "Failed to delete the link",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error deleting link",
        description: "Network error. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDownloadQR = (qrCode: string, title: string) => {
    const link = document.createElement("a")
    link.href = qrCode
    link.download = `${title}-qr-code.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const updateSearchTerm = (term: string) => {
    setLinks((prev) => ({ ...prev, searchTerm: term, currentPage: 1 }))
  }

  const updateSelectedTag = (tag: string) => {
    setLinks((prev) => ({ ...prev, selectedTag: tag, currentPage: 1 }))
  }

  const updateSort = (sortBy: string, sortOrder: "asc" | "desc") => {
    setLinks((prev) => ({ ...prev, sortBy, sortOrder, currentPage: 1 }))
  }

  const updatePage = (page: number) => {
    setLinks((prev) => ({ ...prev, currentPage: page }))
  }

  if (links.isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 w-32 bg-muted animate-pulse rounded" />
            <div className="h-4 w-48 bg-muted animate-pulse rounded mt-2" />
          </div>
          <div className="h-10 w-32 bg-muted animate-pulse rounded" />
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-muted animate-pulse rounded" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Links</h1>
          <p className="text-muted-foreground">Manage and monitor your shortened URLs</p>
        </div>
        <Button
          onClick={() => router.push("/dashboard")}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Link
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search links..."
                  value={links.searchTerm}
                  onChange={(e) => updateSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="min-w-[120px]">
                    <Tag className="h-4 w-4 mr-2" />
                    {links.selectedTag || "All Tags"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Filter by Tag</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => updateSelectedTag("")}>All Tags</DropdownMenuItem>
                  {tags.map((tag) => (
                    <DropdownMenuItem key={tag} onClick={() => updateSelectedTag(tag)}>
                      {tag}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Sort
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => updateSort("createdAt", "desc")}>Newest First</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => updateSort("createdAt", "asc")}>Oldest First</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => updateSort("clickCount", "desc")}>Most Clicks</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => updateSort("title", "asc")}>Alphabetical</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Links Grid */}
      <div className="grid gap-4">
        <AnimatePresence>
          {links.links.map((link, index) => (
            <motion.div
              key={link.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold truncate">{link.title || "Untitled Link"}</h3>
                        <Badge variant={link.isActive ? "default" : "secondary"}>
                          {link.isActive ? "Active" : "Inactive"}
                        </Badge>
                        {link.expiresAt && new Date(link.expiresAt) < new Date() && (
                          <Badge variant="destructive">Expired</Badge>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Short:</span>
                          <code className="text-sm bg-muted px-2 py-1 rounded font-mono">{link.shortUrl}</code>
                          <Button size="sm" variant="ghost" onClick={() => handleCopyLink(link.shortUrl)}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Original:</span>
                          <span className="text-sm truncate max-w-md">{link.originalUrl}</span>
                        </div>

                        {link.description && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Description:</span>
                            <span className="text-sm text-muted-foreground">{link.description}</span>
                          </div>
                        )}

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <BarChart3 className="h-4 w-4" />
                            <span>{link.clickCount} clicks</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>Created {format(new Date(link.createdAt), "MMM dd, yyyy")}</span>
                          </div>
                        </div>

                        {link.tags && link.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {link.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {link.tags.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{link.tags.length - 3} more
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => handleCopyLink(link.shortUrl)}>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy Link
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => window.open(link.shortUrl, "_blank")}>
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Open Link
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push(`/dashboard/links/${link.id}`)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push(`/dashboard/links/${link.id}/analytics`)}>
                          <BarChart3 className="h-4 w-4 mr-2" />
                          Analytics
                        </DropdownMenuItem>
                        {link.qrCode && (
                          <DropdownMenuItem onClick={() => handleDownloadQR(link.qrCode, link.title)}>
                            <Download className="h-4 w-4 mr-2" />
                            Download QR
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => router.push(`/dashboard/links/${link.id}/edit`)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setLinkToDelete(link.id)
                            setDeleteDialogOpen(true)
                          }}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {links.links.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Link2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No links found</h3>
            <p className="text-muted-foreground mb-4">
              {links.searchTerm || links.selectedTag
                ? "Try adjusting your search or filter criteria"
                : "Create your first short link to get started"}
            </p>
            <Button
              onClick={() => router.push("/dashboard")}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Link
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {links.totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => updatePage(Math.max(links.currentPage - 1, 1))}
            disabled={links.currentPage === 1}
          >
            Previous
          </Button>
          <div className="flex items-center space-x-1">
            {[...Array(links.totalPages)].map((_, i) => (
              <Button
                key={i + 1}
                variant={links.currentPage === i + 1 ? "default" : "outline"}
                size="sm"
                onClick={() => updatePage(i + 1)}
                className="w-8 h-8"
              >
                {i + 1}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => updatePage(Math.min(links.currentPage + 1, links.totalPages))}
            disabled={links.currentPage === links.totalPages}
          >
            Next
          </Button>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the link and all its analytics data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (linkToDelete) {
                  handleDeleteLink(linkToDelete)
                  setDeleteDialogOpen(false)
                  setLinkToDelete(null)
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
