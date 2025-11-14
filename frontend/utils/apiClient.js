"use client"

import { useAuth } from "../context/AuthContext"

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001"

export const useApiClient = () => {
  const { token, logout } = useAuth()

  const request = async (endpoint, options = {}) => {
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      })

      if (response.status === 401) {
        logout()
        window.location.href = "/login"
        throw new Error("Session expired. Please login again.")
      }

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "API request failed")
      }

      return await response.json()
    } catch (error) {
      console.error("[v0] API Error:", error)
      throw error
    }
  }

  return {
    get: (endpoint) => request(endpoint),
    post: (endpoint, data) => request(endpoint, { method: "POST", body: JSON.stringify(data) }),
    put: (endpoint, data) => request(endpoint, { method: "PUT", body: JSON.stringify(data) }),
    delete: (endpoint) => request(endpoint, { method: "DELETE" }),
  }
}
