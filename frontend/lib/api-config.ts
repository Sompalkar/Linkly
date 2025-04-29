// API configuration for the application
// This centralizes all API endpoint configurations

// Base API URL - change this to match your backend URL
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

// API endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    REGISTER: `${API_BASE_URL}/api/auth/register`,
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    LOGOUT: `${API_BASE_URL}/api/auth/logout`,
    ME: `${API_BASE_URL}/api/auth/me`,
    UPDATE_PROFILE: `${API_BASE_URL}/api/auth/profile`,
    CHANGE_PASSWORD: `${API_BASE_URL}/api/auth/password`,
  },

  // Link endpoints
  LINKS: {
    BASE: `${API_BASE_URL}/api/links`,
    DETAIL: (id: string) => `${API_BASE_URL}/api/links/${id}`,
  },

  // Domain endpoints
  DOMAINS: {
    BASE: `${API_BASE_URL}/api/domains`,
    VERIFY: (id: string) => `${API_BASE_URL}/api/domains/${id}/verify`,
    DEFAULT: (id: string) => `${API_BASE_URL}/api/domains/${id}/default`,
  },

  // Analytics endpoints
  ANALYTICS: {
    OVERALL: `${API_BASE_URL}/api/analytics/overall`,
    LINK: (id: string) => `${API_BASE_URL}/api/analytics/links/${id}`,
  },
}

// Helper function to add query parameters to URLs
export function addQueryParams(url: string, params: Record<string, string | number | boolean | undefined>): string {
  const queryParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      queryParams.append(key, String(value))
    }
  })

  const queryString = queryParams.toString()
  if (queryString) {
    return `${url}?${queryString}`
  }

  return url
}
