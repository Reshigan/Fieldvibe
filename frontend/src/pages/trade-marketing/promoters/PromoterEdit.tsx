import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import TransactionForm from '../../../components/transactions/TransactionForm'
import { tradeMarketingService } from '../../../services/tradeMarketing.service'
import ErrorState from '../../../components/ui/ErrorState'
import LoadingSpinner from '../../../components/ui/LoadingSpinner'

export default function PromoterEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
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

  const fields = [
    {
      name: 'first_name',
      label: 'First Name',
      type: 'text' as const,
      required: true
    },
    {
      name: 'last_name',
      label: 'Last Name',
      type: 'text' as const,
      required: true
    },
    {
      name: 'email',
      label: 'Email',
      type: 'text' as const,
      required: true
    },
    {
      name: 'phone',
      label: 'Phone',
      type: 'text' as const
    },
    {
      name: 'brand_name',
      label: 'Brand',
      type: 'text' as const,
      required: true
    },
    {
      name: 'assigned_location',
      label: 'Assigned Location',
      type: 'text' as const
    },
    {
      name: 'join_date',
      label: 'Join Date',
      type: 'date' as const,
      required: true
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select' as const,
      required: true,
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
        { value: 'on_leave', label: 'On Leave' }
      ]
    },
    {
      name: 'notes',
      label: 'Notes',
      type: 'textarea' as const
    }
  ]

  const handleSubmit = async (data: any) => {
    try {
      await tradeMarketingService.updatePromoter(id!, data)
      navigate(`/trade-marketing/promoters/${id}`)
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update promoter')
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

  return (
    <TransactionForm
      title={`Edit Promoter: ${promoter.first_name} ${promoter.last_name}`}
      fields={fields}
      initialData={promoter}
      onSubmit={handleSubmit}
      onCancel={() => navigate(`/trade-marketing/promoters/${id}`)}
      submitLabel="Update Promoter"
    />
  )
}
