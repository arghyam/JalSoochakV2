import { useState } from 'react'
import { ToastContainer } from '@/shared/components/common'
import { useToast } from '@/shared/hooks/use-toast'
import { useTenants } from '../hooks/use-tenants'
import { useCreateStateAdmin } from '../hooks/use-state-admins'
import type { StateAdminFormData } from '../types/state-admin'

export function StateAdminManagement() {
  const { data: tenants = [], isLoading: tenantsLoading } = useTenants()
  const createStateAdmin = useCreateStateAdmin()
  const toast = useToast()

  const [formData, setFormData] = useState<StateAdminFormData>({
    name: '',
    email: '',
    phone: '',
    tenantId: '',
    password: '',
    confirmPassword: '',
  })

  const [errors, setErrors] = useState<Partial<Record<keyof StateAdminFormData, string>>>({})

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof StateAdminFormData, string>> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^\+91\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone must be in format +91XXXXXXXXXX (10 digits)'
    }

    if (!formData.tenantId) {
      newErrors.tenantId = 'Please select a state/UT'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (field: keyof StateAdminFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    try {
      await createStateAdmin.mutateAsync({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        tenantId: formData.tenantId,
        password: formData.password,
      })

      toast.success('State admin account created successfully')

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        tenantId: '',
        password: '',
        confirmPassword: '',
      })
      setErrors({})
    } catch {
      toast.error('Failed to create state admin account')
    }
  }

  // Filter only active tenants for selection
  const activeTenants = tenants.filter((tenant) => tenant.status === 'active')

  if (tenantsLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />

      <div>
        <h1 className="text-3xl font-bold">State Admin Management</h1>
        <p className="mt-1 text-gray-600">Create a new state system administrator account</p>
      </div>

      <div className="max-w-2xl rounded-lg bg-white p-6 shadow">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter full name"
              disabled={createStateAdmin.isPending}
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="admin@example.gov.in"
              disabled={createStateAdmin.isPending}
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="phone" className="mb-1 block text-sm font-medium text-gray-700">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="+919876543210"
              disabled={createStateAdmin.isPending}
            />
            {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
            <p className="mt-1 text-xs text-gray-500">Format: +91 followed by 10 digits</p>
          </div>

          <div>
            <label htmlFor="tenantId" className="mb-1 block text-sm font-medium text-gray-700">
              State/Union Territory <span className="text-red-500">*</span>
            </label>
            <select
              id="tenantId"
              value={formData.tenantId}
              onChange={(e) => handleChange('tenantId', e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              disabled={createStateAdmin.isPending}
            >
              <option value="">Select a state/UT</option>
              {activeTenants.map((tenant) => (
                <option key={tenant.id} value={tenant.id}>
                  {tenant.name} ({tenant.code})
                </option>
              ))}
            </select>
            {errors.tenantId && <p className="mt-1 text-sm text-red-600">{errors.tenantId}</p>}
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter password"
              disabled={createStateAdmin.isPending}
            />
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            <p className="mt-1 text-xs text-gray-500">Minimum 6 characters</p>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Re-enter password"
              disabled={createStateAdmin.isPending}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
            )}
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={createStateAdmin.isPending}
              className="rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {createStateAdmin.isPending ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
