import { useNavigate } from 'react-router-dom'
import TransactionForm from '../../../components/transactions/TransactionForm'
import { tradeMarketingService } from '../../../services/tradeMarketing.service'

export default function PromoterCreate() {
  const navigate = useNavigate()

  const fields = [
    {
      name: 'first_name',
      label: 'First Name',
      type: 'text' as const,
      required: true,
      placeholder: 'e.g., John'
    },
    {
      name: 'last_name',
      label: 'Last Name',
      type: 'text' as const,
      required: true,
      placeholder: 'e.g., Smith'
    },
    {
      name: 'email',
      label: 'Email',
      type: 'text' as const,
      required: true,
      placeholder: 'e.g., john@example.com'
    },
    {
      name: 'phone',
      label: 'Phone',
      type: 'text' as const,
      placeholder: 'e.g., +27 82 123 4567'
    },
    {
      name: 'brand_name',
      label: 'Brand',
      type: 'text' as const,
      required: true,
      placeholder: 'e.g., Goldrush'
    },
    {
      name: 'assigned_location',
      label: 'Assigned Location',
      type: 'text' as const,
      placeholder: 'e.g., Johannesburg CBD'
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
      type: 'textarea' as const,
      placeholder: 'Add any notes about the promoter...'
    }
  ]

  const handleSubmit = async (data: any) => {
    try {
      await tradeMarketingService.createPromoter(data)
      navigate('/trade-marketing/promoters')
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create promoter')
    }
  }

  return (
    <TransactionForm
      title="Add Promoter"
      fields={fields}
      onSubmit={handleSubmit}
      onCancel={() => navigate('/trade-marketing/promoters')}
      submitLabel="Add Promoter"
    />
  )
}
