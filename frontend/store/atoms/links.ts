import { atom } from "recoil"

export interface Link {
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
  updatedAt: string
  isActive: boolean
  expiresAt?: string
  password?: string
  userId: string
  domainId: string
}

export interface LinksState {
  links: Link[]
  totalLinks: number
  currentPage: number
  totalPages: number
  isLoading: boolean
  searchTerm: string
  selectedTag: string
  sortBy: string
  sortOrder: "asc" | "desc"
}

export const linksState = atom<LinksState>({
  key: "linksState",
  default: {
    links: [],
    totalLinks: 0,
    currentPage: 1,
    totalPages: 1,
    isLoading: false,
    searchTerm: "",
    selectedTag: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  },
})

export const tagsState = atom<string[]>({
  key: "tagsState",
  default: [],
})
