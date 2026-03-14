import { useState } from 'react'

interface HelpEntry {
  title: string
  content: string
}

const helpContent: Record<string, HelpEntry[]> = {
  dashboard: [
    { title: 'Dashboard Overview', content: 'The dashboard shows key metrics for your distribution operation including revenue, orders, visits, and agent performance.' },
    { title: 'Date Filters', content: 'Use the date range selector to filter metrics by time period. Default is last 30 days.' },
    { title: 'Quick Actions', content: 'Use the quick action buttons to create orders, start visits, or view reports directly from the dashboard.' },
  ],
  customers: [
    { title: 'Managing Customers', content: 'Add, edit, and manage your customer database. Each customer has a unique code, contact details, and territory assignment.' },
    { title: 'Customer Tiers', content: 'Customers are classified into tiers (Gold, Silver, Bronze) based on purchase history. Tier affects pricing and promotions.' },
    { title: 'GPS Coordinates', content: 'Set customer GPS coordinates for route optimization and visit verification.' },
  ],
  products: [
    { title: 'Product Catalog', content: 'Manage your product catalog with SKUs, pricing, and stock levels. Products can be grouped by category and brand.' },
    { title: 'Pricing', content: 'Set base prices and create price lists for different customer tiers or regions.' },
    { title: 'Stock Tracking', content: 'Real-time stock levels are tracked across warehouses and vans.' },
  ],
  orders: [
    { title: 'Sales Orders', content: 'Create and manage sales orders. Orders flow through statuses: Draft > Confirmed > Invoiced > Delivered > Paid.' },
    { title: 'Returns', content: 'Process returns against existing orders. Returned stock is automatically added back to inventory.' },
    { title: 'Payments', content: 'Record payments against invoices. Supports cash, card, mobile money, and bank transfer.' },
  ],
  'van-sales': [
    { title: 'Van Sales Workflow', content: 'Load van > Drive route > Sell to customers > Process returns > Cash reconciliation.' },
    { title: 'Van Loading', content: 'Create van loads from warehouse stock. Each load is tracked with quantities and values.' },
    { title: 'Cash Reconciliation', content: 'At end of day, reconcile cash collected against sales made. Track denominations.' },
  ],
  visits: [
    { title: 'Visit Management', content: 'Track field agent visits to customers. Visits include GPS check-in/out, notes, photos, and outcomes.' },
    { title: 'Quick Visit', content: 'Use the 3-tap Quick Visit flow to start a visit in under 30 seconds.' },
    { title: 'Visit Planning', content: 'Use Plan My Day to get AI-suggested route optimization based on customer priority and location.' },
  ],
  commissions: [
    { title: 'Commission Rules', content: 'Configure commission rules by product, customer tier, or sales volume.' },
    { title: 'Calculations', content: 'Commissions are automatically calculated based on confirmed sales. Review and approve before payout.' },
    { title: 'Payouts', content: 'Process commission payouts and track payment history.' },
  ],
  inventory: [
    { title: 'Stock Management', content: 'Track stock across warehouses with real-time levels, movements, and alerts.' },
    { title: 'Stock Counts', content: 'Perform periodic stock counts to verify physical vs system quantities.' },
    { title: 'Transfers', content: 'Transfer stock between warehouses or to vans.' },
  ],
  campaigns: [
    { title: 'Trade Promotions', content: 'Create and manage trade promotions with discount rules, target products, and validity periods.' },
    { title: 'Campaign Tracking', content: 'Track campaign performance including redemptions, revenue impact, and ROI.' },
    { title: 'Compliance', content: 'Monitor merchandising compliance with photo evidence and scoring.' },
  ],
}

interface HelpPanelProps {
  module: string
  isOpen: boolean
  onClose: () => void
}

export function HelpPanel({ module, isOpen, onClose }: HelpPanelProps) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null)
  const entries = helpContent[module] || helpContent['dashboard']

  if (!isOpen) return null

  return (
    <div className="fixed inset-y-0 right-0 w-80 bg-[#0A0E18] border-l border-[#1a1f2e] shadow-2xl z-50 flex flex-col" role="dialog" aria-label="Help Panel">
      <div className="flex items-center justify-between p-4 border-b border-[#1a1f2e]">
        <h2 className="text-lg font-bold">Help</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-white" aria-label="Close help panel">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {entries.map((entry, idx) => (
          <div key={idx} className="border border-[#1a1f2e] rounded-lg">
            <button
              onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
              className="w-full px-4 py-3 text-left flex justify-between items-center hover:bg-[#1a1f2e]/50"
              aria-expanded={expandedIdx === idx}
            >
              <span className="font-medium text-sm">{entry.title}</span>
              <svg className={`w-4 h-4 transition-transform ${expandedIdx === idx ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {expandedIdx === idx && (
              <div className="px-4 pb-3 text-sm text-gray-400">{entry.content}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
