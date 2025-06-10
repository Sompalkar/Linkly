"use client"

import type React from "react"

import { RecoilRoot } from "recoil"
import { AuthProvider } from "./auth-provider"

export function RecoilProvider({ children }: { children: React.ReactNode }) {
  return (
    <RecoilRoot>
      <AuthProvider>{children}</AuthProvider>
    </RecoilRoot>
  )
}
