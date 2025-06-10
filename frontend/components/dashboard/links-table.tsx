"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { useAuth } from "@/context/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { getLinks, deleteLink, getTags } from "@/lib/api"
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
import { motion, AnimatePresence } from "framer-motion"
import { format } from "date-fns"

interface Link {
  id: string
  originalUrl: string
  shortUrl: string
  slug: string
  title: string
  description: string
  clickCount: number
  qrCode: string
  tags: string[]
  createdAt: string
  isActive: boolean
  expiresAt?: string
}

interface TableTag {
  name: string
  count: number
}

export function LinksTable() {
  const [links, setLinks] = useState<Link[]>([])
  const [tags, setTags] = useState<TableTag[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTag, setSelectedTag] = useState("")
  const [sortBy, setSortBy] = useState("createdAt")
  const [sortOrder, setSortOrder] = useState("desc")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const { token } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const fetchLinks = async () => {
    if (!token) return

    try {
      setIsLoading(true)
      const params: any = {
        page: currentPage,
        limit: 10,
        sortBy,
        sortOrder,
      }

      if (searchTerm) params.search = searchTerm
      if (selectedTag) params.tag = selectedTag

      const data = await getLinks(token, params.page, params.limit)
      setLinks(data.links)
      setTotalPages(data.pagination.pages)
    } catch (error) {
      console.error("Error fetching links:", error)
      toast({
        title: "Error fetching links",
        description: "Failed to load your links",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchTags = async () => {
    if (!token) return

    try {
      const data = await getTags(token)
      setTags(data.tags)
    } catch (error) {
      console.error("Error fetching tags:", error)
    }
  }

  useEffect(() => {
    fetchLinks()
  }, [token, currentPage, searchTerm, selectedTag, sortBy, sortOrder])

  useEffect(() => {
    fetchTags()
  }, [token])

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
      await deleteLink(token, id)
      toast({
        title: "Link deleted",
        description: "The link has been successfully deleted",
      })
      fetchLinks()
    } catch (error) {
      toast({
        title: "Error deleting link",
        description: "Failed to delete the link",
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

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-6 bg-muted rounded w-32 animate-pulse"></div>
          <div className="h-4 bg-muted rounded w-48 animate-pulse"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded animate-pulse"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Your Links</h2>
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
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="min-w-[120px]">
                    <Tag className="h-4 w-4 mr-2" />
                    {selectedTag || "All Tags"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Filter by Tag</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setSelectedTag("")}>All Tags</DropdownMenuItem>
                  {tags.map((tag) => (
                    <DropdownMenuItem key={tag.name} onClick={() => setSelectedTag(tag.name)}>
                      <div className="flex items-center justify-between w-full">
                        <span>{tag.name}</span>
                        <Badge variant="secondary" className="ml-2">
                          {tag.count}
                        </Badge>
                      </div>
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
                  <DropdownMenuItem
                    onClick={() => {
                      setSortBy("createdAt")
                      setSortOrder("desc")
                    }}
                  >
                    Newest First
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setSortBy("createdAt")
                      setSortOrder("asc")
                    }}
                  >
                    Oldest First
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setSortBy("clickCount")
                      setSortOrder("desc")
                    }}
                  >
                    Most Clicks
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setSortBy("title")
                      setSortOrder("asc")
                    }}
                  >
                    Alphabetical
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Links Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Link</TableHead>
                  <TableHead>Original URL</TableHead>
                  <TableHead>Clicks</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {links.map((link, index) => (
                    <motion.tr
                      key={link.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                      className="group hover:bg-muted/50"
                    >
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium truncate max-w-xs">{link.title}</div>
                          <div className="text-sm text-muted-foreground font-mono">{link.shortUrl}</div>
                          {link.description && (
                            <div className="text-xs text-muted-foreground truncate max-w-xs">{link.description}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate text-sm" title={link.originalUrl}>
                          {link.originalUrl}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <BarChart3 className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{link.clickCount}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {link.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {link.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{link.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{format(new Date(link.createdAt), "MMM dd, yyyy")}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Badge variant={link.isActive ? "default" : "secondary"}>
                            {link.isActive ? "Active" : "Inactive"}
                          </Badge>
                          {link.expiresAt && new Date(link.expiresAt) < new Date() && (
                            <Badge variant="destructive">Expired</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
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
                            <DropdownMenuItem onClick={() => handleDownloadQR(link.qrCode, link.title)}>
                              <Download className="h-4 w-4 mr-2" />
                              Download QR
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => router.push(`/dashboard/links/${link.id}/edit`)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteLink(link.id)} className="text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>

          {links.length === 0 && (
            <div className="text-center py-12">
              <Link2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No links found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || selectedTag
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
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <div className="flex items-center space-x-1">
            {[...Array(totalPages)].map((_, i) => (
              <Button
                key={i + 1}
                variant={currentPage === i + 1 ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(i + 1)}
                className="w-8 h-8"
              >
                {i + 1}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
