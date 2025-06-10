import { selector } from "recoil"
import { authState } from "../atoms/auth"

export const userSelector = selector({
  key: "userSelector",
  get: ({ get }) => {
    const auth = get(authState)
    return auth.user
  },
})

export const isAuthenticatedSelector = selector({
  key: "isAuthenticatedSelector",
  get: ({ get }) => {
    const auth = get(authState)
    return auth.isAuthenticated
  },
})

export const authTokenSelector = selector({
  key: "authTokenSelector",
  get: ({ get }) => {
    const auth = get(authState)
    return auth.token
  },
})
