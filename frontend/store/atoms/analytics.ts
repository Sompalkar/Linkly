import { atom } from "recoil"

export interface AnalyticsData {
  totalClicks: number
  totalLinks: number
  clickRate: number
  topCountries: Array<{ country: string; clicks: number }>
  topDevices: Array<{ device: string; clicks: number }>
  topBrowsers: Array<{ browser: string; clicks: number }>
  clicksByDate: Array<{ date: string; clicks: number }>
  topLinks: Array<{
    id: string
    title: string
    shortUrl: string
    clicks: number
  }>
}

export const analyticsState = atom<AnalyticsData>({
  key: "analyticsState",
  default: {
    totalClicks: 0,
    totalLinks: 0,
    clickRate: 0,
    topCountries: [],
    topDevices: [],
    topBrowsers: [],
    clicksByDate: [],
    topLinks: [],
  },
})

export const analyticsLoadingState = atom<boolean>({
  key: "analyticsLoadingState",
  default: false,
})
