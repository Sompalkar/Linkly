// Base API URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

// Helper function for API requests
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      credentials: "include",
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong")
    }

    return data
  } catch (error) {
    console.error("API request error:", error)
    throw error
  }
}

// Auth API calls
export async function loginUser(email: string, password: string) {
  return apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  })
}

export async function registerUser(name: string, email: string, password: string) {
  return apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  })
}

export async function logoutUser() {
  return apiRequest("/auth/logout", {
    method: "POST",
  })
}

export async function getCurrentUser(token: string) {
  return apiRequest("/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

// Link API calls
export async function createLink(token: string, linkData: any) {
  console.log("Creating link with data:", linkData)
  return apiRequest("/links", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(linkData),
  })
}

export async function createBulkLinks(token: string, data: { urls: any[] }) {
  return apiRequest("/links/bulk", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })
}

export async function getLinks(token: string, page = 1, limit = 10, params: any = {}) {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...params,
  })

  return apiRequest(`/links?${queryParams.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export async function fetchLinks(token: string, page = 1, limit = 10) {
  return getLinks(token, page, limit)
}

export async function getLinkById(token: string, id: string) {
  return apiRequest(`/links/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export async function updateLink(token: string, id: string, linkData: any) {
  return apiRequest(`/links/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(linkData),
  })
}

export async function deleteLink(token: string, id: string) {
  return apiRequest(`/links/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export async function getTags(token: string) {
  return apiRequest("/links/tags", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

// Domain API calls
export async function createDomain(token: string, domainData: any) {
  return apiRequest("/domains", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(domainData),
  })
}

export async function fetchDomains(token: string) {
  try {
    console.log("Fetching domains with token:", token ? "Token exists" : "No token")
    const response = await apiRequest("/domains", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    console.log("Domains response:", response)
    return response
  } catch (error) {
    console.error("Error fetching domains:", error)
    // Return a default domain structure for development
    return {
      success: true,
      data: {
        domains: [
          {
            id: "default-dev-domain",
            name: "somn.in",
            isDefault: true,
            isVerified: true,
          },
        ],
      },
    }
  }
}

export async function getDomainById(token: string, id: string) {
  return apiRequest(`/domains/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export async function updateDomain(token: string, id: string, domainData: any) {
  return apiRequest(`/domains/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(domainData),
  })
}

export async function deleteDomain(token: string, id: string) {
  return apiRequest(`/domains/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export async function verifyDomain(token: string, id: string) {
  return apiRequest(`/domains/${id}/verify`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export async function setDefaultDomain(token: string, id: string) {
  return apiRequest(`/domains/${id}/default`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

// Analytics API calls
export async function getAnalytics(token: string, params: any = {}) {
  const queryParams = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      queryParams.append(key, String(value))
    }
  }

  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : ""

  return apiRequest(`/analytics/overall${queryString}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export async function fetchOverallAnalytics(token: string, params: any = {}) {
  return getAnalytics(token, params)
}

export async function getLinkAnalytics(token: string, linkId: string, params: any = {}) {
  const queryParams = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      queryParams.append(key, String(value))
    }
  }

  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : ""

  return apiRequest(`/analytics/links/${linkId}${queryString}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}
