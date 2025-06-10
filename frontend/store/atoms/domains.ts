import { atom } from "recoil"

export interface Domain {
  id: string
  name: string
  isVerified: boolean
  verificationToken: string
  isDefault: boolean
  createdAt: string
  userId: string
}

export interface DomainsState {
  domains: Domain[]
  isLoading: boolean
}

export const domainsState = atom<DomainsState>({
  key: "domainsState",
  default: {
    domains: [],
    isLoading: false,
  },
})
