import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { HelpCircle, Plus, ShoppingCart, MapPin, FileText } from 'lucide-react'
import Sidebar from './Sidebar'
import Header from './Header'
import MobileBottomTabs from './MobileBottomTabs'
import PageTransition from './PageTransition'
import OfflineIndicator from '../ui/OfflineIndicator'
import HelpPanel from '../help/HelpPanel'
import Breadcrumbs from '../navigation/Breadcrumbs'
import { useKeyboardShortcuts } from '../ui/KeyboardShortcuts'
import { FloatingActionButton } from '../mobile/FloatingActionButton'

export default function DashboardLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [helpPanelOpen, setHelpPanelOpen] = useState(false)
  const navigate = useNavigate()

  // ENH-08: Global keyboard shortcuts
  useKeyboardShortcuts({
    shortcuts: [
      { key: 'd', alt: true, handler: () => navigate('/dashboard'), description: 'Go to Dashboard' },
      { key: 'o', alt: true, handler: () => navigate('/sales/orders'), description: 'Go to Orders' },
      { key: 'c', alt: true, handler: () => navigate('/customers'), description: 'Go to Customers' },
      { key: 'i', alt: true, handler: () => navigate('/inventory'), description: 'Go to Inventory' },
      { key: 'h', alt: true, handler: () => setHelpPanelOpen(true), description: 'Open Help' },
    ]
  })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#06090F] text-gray-900 dark:text-gray-100 flex">
      {/* Desktop sidebar - hidden on mobile, bottom tabs used instead */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <Sidebar 
          collapsed={sidebarCollapsed} 
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0">
        <Header />

        <main className="flex-1 pb-20 lg:pb-8 overflow-x-hidden">
          <div className="w-full mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
            <div className="mb-3 sm:mb-4 hidden sm:block">
              <Breadcrumbs />
            </div>
            <PageTransition>
              <Outlet />
            </PageTransition>
          </div>
        </main>

        <footer className="hidden lg:block border-t border-gray-200 dark:border-white/5 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <span>A Product of</span>
                <a href="https://www.gonxt.tech" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#00E87B] transition-colors font-medium">
                  GONXT
                </a>
              </div>
              <div className="text-xs text-gray-500">
                &copy; 2025 FieldVibe by Vantax. All rights reserved.
              </div>
            </div>
          </div>
        </footer>
      </div>
      
      {/* Mobile bottom tabs - only on small screens */}
      <MobileBottomTabs />
      <OfflineIndicator />

      {/* ENH-14: Mobile FAB for quick actions */}
      <div className="lg:hidden">
        <FloatingActionButton
          actions={[
            { id: 'order', label: 'New Order', icon: <ShoppingCart className="w-5 h-5" />, href: '/sales/orders/create', color: 'bg-blue-500' },
            { id: 'visit', label: 'New Visit', icon: <MapPin className="w-5 h-5" />, href: '/field-operations/visits/create', color: 'bg-green-500' },
            { id: 'invoice', label: 'New Invoice', icon: <FileText className="w-5 h-5" />, href: '/sales/invoices/create', color: 'bg-purple-500' },
          ]}
          mainIcon={<Plus className="w-6 h-6" />}
        />
      </div>

      <button
        onClick={() => setHelpPanelOpen(true)}
        className="fixed bottom-6 right-6 z-40 hidden lg:flex bg-[#00E87B] hover:bg-[#00D06E] text-[#06090F] p-3 rounded-full shadow-lg transition-all hover:scale-105"
        title="Help & Training"
      >
        <HelpCircle className="h-5 w-5" />
      </button>

      <HelpPanel isOpen={helpPanelOpen} onClose={() => setHelpPanelOpen(false)} />
    </div>
  )
}
