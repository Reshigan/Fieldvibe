import { useState, useEffect } from 'react'

interface StaleDataBannerProps {
  lastFetched?: Date | null
  thresholdMs?: number
  onRefresh?: () => void
}

export default function StaleDataBanner({ lastFetched, thresholdMs = 300000, onRefresh }: StaleDataBannerProps) {
  const [isStale, setIsStale] = useState(false)

  useEffect(() => {
    if (!lastFetched) return
    const check = () => {
      setIsStale(Date.now() - lastFetched.getTime() > thresholdMs)
    }
    check()
    const interval = setInterval(check, 30000)
    return () => clearInterval(interval)
  }, [lastFetched, thresholdMs])

  if (!isStale) return null
  return (
    <div className="bg-amber-900/80 border border-amber-600 rounded-lg px-3 py-2 mb-3 flex items-center justify-between text-xs text-amber-100" role="alert">
      <span>Data may be outdated. Last updated {lastFetched ? new Date(lastFetched).toLocaleTimeString() : 'unknown'}.</span>
      {onRefresh && (
        <button onClick={onRefresh} className="ml-2 underline hover:no-underline font-medium">
          Refresh now
        </button>
      )}
    </div>
  )
}
