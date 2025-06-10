import { atom } from "recoil"

export interface User {
  id: string
  name: string
  email: string
  role: string
  isVerified: boolean
  createdAt: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

export const authState = atom<AuthState>({
  key: "authState",
  default: {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  },
})
