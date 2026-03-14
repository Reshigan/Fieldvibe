import { apiClient } from './api.service'
import { useAuthStore } from '../store/auth.store'

let isRefreshing = false
let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: unknown) => void }> = []

function processQueue(error: unknown, token: string | null) {
  failedQueue.forEach(p => {
    if (error) p.reject(error)
    else if (token) p.resolve(token)
  })
  failedQueue = []
}

export function setupInterceptors() {
  // Request interceptor - add auth token
  apiClient.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  // Response interceptor - retry on 401, exponential backoff on 5xx
  apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config
      if (!originalRequest) return Promise.reject(error)

      // Token refresh on 401
      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject })
          }).then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return apiClient(originalRequest)
          })
        }

        originalRequest._retry = true
        isRefreshing = true

        try {
          const res = await apiClient.post('/auth/refresh')
          const data = res.data as { token?: string }
          const newToken = data.token
          if (newToken) {
            useAuthStore.getState().setToken(newToken)
            processQueue(null, newToken)
            originalRequest.headers.Authorization = `Bearer ${newToken}`
            return apiClient(originalRequest)
          }
        } catch (refreshError) {
          processQueue(refreshError, null)
          useAuthStore.getState().logout()
          return Promise.reject(refreshError)
        } finally {
          isRefreshing = false
        }
      }

      // Exponential backoff retry for 5xx
      if (error.response?.status >= 500 && (!originalRequest._retryCount || originalRequest._retryCount < 3)) {
        originalRequest._retryCount = (originalRequest._retryCount || 0) + 1
        const delay = Math.pow(2, originalRequest._retryCount) * 1000
        await new Promise(resolve => setTimeout(resolve, delay))
        return apiClient(originalRequest)
      }

      return Promise.reject(error)
    }
  )
}
