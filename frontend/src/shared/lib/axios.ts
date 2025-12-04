import axios from 'axios'
import { useAuthStore } from '@/app/store/auth-store'
import { authApi } from '@/features/auth/services/auth-api'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token
    if (token) {
      config.headers = config.headers ?? {}
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

let isRefreshing = false
let refreshPromise: Promise<void> | null = null
const pendingRequests: Array<() => void> = []

// Response interceptor with refresh logic
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status
    const originalRequest = error.config

    // If no response or not 401, just propagate
    if (!status || status !== 401) {
      return Promise.reject(error)
    }

    // Do not attempt refresh for auth endpoints themselves
    if (
      originalRequest?.url?.includes('/auth/login') ||
      originalRequest?.url?.includes('/auth/refresh') ||
      originalRequest?._retry
    ) {
      return Promise.reject(error)
    }

    // If we don't have a token in memory, nothing to refresh
    const { token, setSessionExpired } = useAuthStore.getState()
    if (!token) {
      setSessionExpired()
      return Promise.reject(error)
    }

    if (!isRefreshing) {
      isRefreshing = true
      originalRequest._retry = true

      refreshPromise = (async () => {
        try {
          const { token: newToken, user } = await authApi.refresh()
          useAuthStore.setState({
            token: newToken,
            user,
            isAuthenticated: true,
            sessionExpired: false,
          })
        } catch (refreshError) {
          // Refresh failed (likely 401) → mark session expired
          setSessionExpired()
          throw refreshError
        } finally {
          isRefreshing = false
        }
      })()
    }

    try {
      await refreshPromise
      // After successful refresh, retry all pending requests
      pendingRequests.forEach((cb) => cb())
      pendingRequests.length = 0

      const newToken = useAuthStore.getState().token
      if (newToken && originalRequest) {
        originalRequest.headers = originalRequest.headers ?? {}
        originalRequest.headers.Authorization = `Bearer ${newToken}`
      }
      return apiClient(originalRequest)
    } catch (refreshError) {
      pendingRequests.length = 0
      return Promise.reject(refreshError)
    }
  }
)

export default apiClient
