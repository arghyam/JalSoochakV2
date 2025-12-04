import { useState } from 'react'
import { Dialog } from '@/shared/components/common'
import type { Tenant, TenantFormData } from '../types/tenant'

interface TenantFormDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: TenantFormData) => void
  tenant?: Tenant | null
  isLoading?: boolean
}

function getInitialFormData(tenant: Tenant | null | undefined): TenantFormData {
  if (tenant) {
    return {
      name: tenant.name,
      code: tenant.code,
      status: tenant.status,
    }
  }
  return {
    name: '',
    code: '',
    status: 'active',
  }
}

export function TenantFormDialog({
  open,
  onClose,
  onSubmit,
  tenant,
  isLoading = false,
}: TenantFormDialogProps) {
  const [formData, setFormData] = useState<TenantFormData>(() => getInitialFormData(tenant))
  const [errors, setErrors] = useState<Partial<Record<keyof TenantFormData, string>>>({})

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof TenantFormData, string>> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Tenant name is required'
    }

    if (!formData.code.trim()) {
      newErrors.code = 'Tenant code is required'
    } else if (!/^[A-Z]{2,3}$/.test(formData.code)) {
      newErrors.code = 'Code must be 2-3 uppercase letters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      onSubmit(formData)
    }
  }

  const handleChange = (field: keyof TenantFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <Dialog open={open} onClose={onClose} title={tenant ? 'Edit Tenant' : 'Add New Tenant'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">
            Tenant Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="e.g., Maharashtra"
            disabled={isLoading}
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="code" className="mb-1 block text-sm font-medium text-gray-700">
            Tenant Code <span className="text-red-500">*</span>
          </label>
          <input
            id="code"
            type="text"
            value={formData.code}
            onChange={(e) => handleChange('code', e.target.value.toUpperCase())}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="e.g., MH"
            maxLength={3}
            disabled={isLoading}
          />
          {errors.code && <p className="mt-1 text-sm text-red-600">{errors.code}</p>}
        </div>

        <div>
          <label htmlFor="status" className="mb-1 block text-sm font-medium text-gray-700">
            Status <span className="text-red-500">*</span>
          </label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value as 'active' | 'inactive')}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            disabled={isLoading}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : tenant ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </Dialog>
  )
}
