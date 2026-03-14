import { useOnlineStatus } from '../../hooks/useOnlineStatus'

export default function OfflineBanner() {
  const isOnline = useOnlineStatus()
  if (isOnline) return null
  return (
    <div className="fixed top-0 left-0 right-0 z-[9998] bg-yellow-600 text-white text-center py-1 text-xs font-medium" role="alert">
      You are offline. Changes will sync when connection is restored.
    </div>
  )
}
