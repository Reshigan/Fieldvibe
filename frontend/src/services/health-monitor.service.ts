import { apiClient } from './api.service'

interface HealthStatus {
  apiHealthy: boolean
  errorRate: number
  lastCheck: string
  recentErrors: number
}

class HealthMonitorService {
  private errorCount = 0
  private requestCount = 0
  private intervalId: ReturnType<typeof setInterval> | null = null

  getStatus(): HealthStatus {
    return {
      apiHealthy: this.errorCount < 5,
      errorRate: this.requestCount > 0 ? this.errorCount / this.requestCount : 0,
      lastCheck: new Date().toISOString(),
      recentErrors: this.errorCount,
    }
  }

  recordRequest(success: boolean) {
    this.requestCount++
    if (!success) this.errorCount++
    // Reset counters every 100 requests
    if (this.requestCount > 100) {
      this.requestCount = 0
      this.errorCount = 0
    }
  }

  async checkApiHealth(): Promise<boolean> {
    try {
      const res = await fetch(apiClient.defaults.baseURL + '/health', { method: 'GET', signal: AbortSignal.timeout(5000) })
      return res.ok
    } catch {
      return false
    }
  }

  start(intervalMs = 300000) {
    if (this.intervalId) return
    this.intervalId = setInterval(async () => {
      const healthy = await this.checkApiHealth()
      if (!healthy) {
        console.warn('[HealthMonitor] API health check failed')
      }
    }, intervalMs)
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
  }
}

export const healthMonitor = new HealthMonitorService()
