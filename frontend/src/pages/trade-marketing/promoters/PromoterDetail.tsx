import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import TransactionDetail from '../../../components/transactions/TransactionDetail'
import { tradeMarketingService } from '../../../services/tradeMarketing.service'
import { formatDate } from '../../../utils/format'
import ErrorState from '../../../components/ui/ErrorState'
import LoadingSpinner from '../../../components/ui/LoadingSpinner'

export default function PromoterDetail() {
  const { id } = useParams()
  const [promoter, setPromoter] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPromoter()
  }, [id])

  const loadPromoter = async () => {
    setLoading(true)
    try {
      const data = await tradeMarketingService.getPromoter(id!)
      setPromoter(data)
    } catch (error) {
      console.error('Failed to load promoter:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!promoter) {
    return <ErrorState title="Promoter not found" message="The promoter you are looking for does not exist or has been deleted." />
  }

  const fields = [
    { label: 'First Name', value: promoter.first_name },
    { label: 'Last Name', value: promoter.last_name },
    { label: 'Email', value: promoter.email },
    { label: 'Phone', value: promoter.phone },
    { label: 'Brand', value: promoter.brand_name },
    { label: 'Assigned Location', value: promoter.assigned_location },
    { label: 'Join Date', value: formatDate(promoter.join_date) },
    { label: 'Status', value: promoter.status },
    { label: 'Notes', value: promoter.notes },
    { label: 'Created At', value: formatDate(promoter.created_at) }
  ]

  const statusColor = {
    active: 'green',
    inactive: 'gray',
    on_leave: 'yellow'
  }[promoter.status] as 'green' | 'yellow' | 'red' | 'gray'

  return (
    <TransactionDetail
      title={`${promoter.first_name} ${promoter.last_name}`}
      fields={fields}
      auditTrail={promoter.audit_trail || []}
      editPath={`/trade-marketing/promoters/${id}/edit`}
      backPath="/trade-marketing/promoters"
      status={promoter.status}
      statusColor={statusColor}
    />
  )
}
