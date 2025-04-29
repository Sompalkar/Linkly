// API utility functions

// Base URL for API calls
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

// API utility functions for authentication
export async function registerUser(name: string, email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
    credentials: "include",
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Registration failed")
  }

  return await response.json()
}

export async function loginUser(email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Login failed")
  }

  return await response.json()
}

export async function logoutUser(token: string) {
  const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Logout failed")
  }

  return await response.json()
}

export async function getCurrentUser(token: string) {
  const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  })

  if (!response.ok) {
    throw new Error("Failed to fetch user")
  }

  return await response.json()
}

// API utility functions for links
export async function fetchLinks(token: string, page = 1, limit = 10) {
  const response = await fetch(`${API_BASE_URL}/api/links?page=${page}&limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  })

  if (!response.ok) {
    throw new Error("Failed to fetch links")
  }

  return await response.json()
}

export async function fetchLinkById(token: string, id: string) {
  const response = await fetch(`${API_BASE_URL}/api/links/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  })

  if (!response.ok) {
    throw new Error("Failed to fetch link")
  }

  return await response.json()
}

export async function createLink(token: string, linkData: any) {
  const response = await fetch(`${API_BASE_URL}/api/links`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(linkData),
    credentials: "include",
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Failed to create link")
  }

  return await response.json()
}

export async function updateLink(token: string, linkId: string, linkData: any) {
  const response = await fetch(`${API_BASE_URL}/api/links/${linkId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(linkData),
    credentials: "include",
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Failed to update link")
  }

  return await response.json()
}

export async function deleteLink(token: string, linkId: string) {
  const response = await fetch(`${API_BASE_URL}/api/links/${linkId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Failed to delete link")
  }

  return await response.json()
}

// API utility functions for domains
export async function fetchDomains(token: string) {
  const response = await fetch(`${API_BASE_URL}/api/domains`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  })

  if (!response.ok) {
    throw new Error("Failed to fetch domains")
  }

  return await response.json()
}

export async function createDomain(token: string, name: string) {
  const response = await fetch(`${API_BASE_URL}/api/domains`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name }),
    credentials: "include",
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Failed to create domain")
  }

  return await response.json()
}

export async function verifyDomain(token: string, domainId: string) {
  const response = await fetch(`${API_BASE_URL}/api/domains/${domainId}/verify`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Failed to verify domain")
  }

  return await response.json()
}

export async function setDefaultDomain(token: string, domainId: string) {
  const response = await fetch(`${API_BASE_URL}/api/domains/${domainId}/default`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Failed to set default domain")
  }

  return await response.json()
}

export async function deleteDomain(token: string, domainId: string) {
  const response = await fetch(`${API_BASE_URL}/api/domains/${domainId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Failed to delete domain")
  }

  return await response.json()
}

// API utility functions for analytics
export async function fetchOverallAnalytics(token: string, startDate?: string, endDate?: string) {
  let url = `${API_BASE_URL}/api/analytics/overall`

  if (startDate || endDate) {
    const params = new URLSearchParams()
    if (startDate) params.append("startDate", startDate)
    if (endDate) params.append("endDate", endDate)
    url += `?${params.toString()}`
  }

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  })

  if (!response.ok) {
    throw new Error("Failed to fetch analytics")
  }

  return await response.json()
}

export async function fetchLinkAnalytics(token: string, linkId: string, startDate?: string, endDate?: string) {
  let url = `${API_BASE_URL}/api/analytics/links/${linkId}`

  if (startDate || endDate) {
    const params = new URLSearchParams()
    if (startDate) params.append("startDate", startDate)
    if (endDate) params.append("endDate", endDate)
    url += `?${params.toString()}`
  }

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  })

  if (!response.ok) {
    throw new Error("Failed to fetch link analytics")
  }

  return await response.json()
}
