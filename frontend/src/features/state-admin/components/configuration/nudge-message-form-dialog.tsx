import { useState } from 'react'
import { Dialog } from '@/shared/components/common'
import type { NudgeMessage, NudgeMessageFormData } from '../../types/nudge-message'
import {
  MESSAGE_FREQUENCIES,
  MESSAGE_FREQUENCY_LABELS,
  NOTIFY_ROLES,
  NOTIFY_ROLE_LABELS,
  type MessageFrequency,
  type NotifyRole,
} from '@/shared/constants/state-admin'

interface NudgeMessageFormDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: NudgeMessageFormData) => void
  message?: NudgeMessage | null
  isLoading?: boolean
}

function getInitialFormData(message: NudgeMessage | null | undefined): NudgeMessageFormData {
  if (message) {
    return {
      title: message.title,
      message: message.message,
      targetRole: message.targetRole,
      frequency: message.frequency,
      isActive: message.isActive,
    }
  }
  return {
    title: '',
    message: '',
    targetRole: 'all',
    frequency: MESSAGE_FREQUENCIES.DAILY,
    isActive: true,
  }
}

export function NudgeMessageFormDialog({
  open,
  onClose,
  onSubmit,
  message,
  isLoading = false,
}: NudgeMessageFormDialogProps) {
  const [formData, setFormData] = useState<NudgeMessageFormData>(() => getInitialFormData(message))
  const [errors, setErrors] = useState<Partial<Record<keyof NudgeMessageFormData, string>>>({})

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof NudgeMessageFormData, string>> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
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

  const handleChange = (field: keyof NudgeMessageFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={message ? 'Edit Nudge Message' : 'Add Nudge Message'}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="mb-1 block text-sm font-medium text-gray-700">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="e.g., Daily Water Quality Report"
            disabled={isLoading}
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
        </div>

        <div>
          <label htmlFor="message" className="mb-1 block text-sm font-medium text-gray-700">
            Message <span className="text-red-500">*</span>
          </label>
          <textarea
            id="message"
            value={formData.message}
            onChange={(e) => handleChange('message', e.target.value)}
            rows={4}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Enter the nudge message content..."
            disabled={isLoading}
          />
          {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message}</p>}
        </div>

        <div>
          <label htmlFor="targetRole" className="mb-1 block text-sm font-medium text-gray-700">
            Target Role
          </label>
          <select
            id="targetRole"
            value={formData.targetRole || 'all'}
            onChange={(e) => handleChange('targetRole', e.target.value as NotifyRole | 'all')}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            disabled={isLoading}
          >
            <option value="all">All Roles</option>
            {Object.values(NOTIFY_ROLES).map((role) => (
              <option key={role} value={role}>
                {NOTIFY_ROLE_LABELS[role]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="frequency" className="mb-1 block text-sm font-medium text-gray-700">
            Frequency <span className="text-red-500">*</span>
          </label>
          <select
            id="frequency"
            value={formData.frequency}
            onChange={(e) => handleChange('frequency', e.target.value as MessageFrequency)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            disabled={isLoading}
          >
            {Object.values(MESSAGE_FREQUENCIES).map((freq) => (
              <option key={freq} value={freq}>
                {MESSAGE_FREQUENCY_LABELS[freq]}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center">
          <input
            id="isActive"
            type="checkbox"
            checked={formData.isActive}
            onChange={(e) => handleChange('isActive', e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            disabled={isLoading}
          />
          <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
            Active
          </label>
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
            {isLoading ? 'Saving...' : message ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </Dialog>
  )
}
