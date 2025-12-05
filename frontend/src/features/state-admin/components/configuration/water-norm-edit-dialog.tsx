import { useState } from 'react'
import { Dialog } from '@/shared/components/common'
import type { WaterNorm } from '../../types/water-norm'
import { WATER_NORM_CATEGORY_LABELS } from '@/shared/constants/state-admin'

interface WaterNormEditDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (norm: WaterNorm) => void
  waterNorm: WaterNorm
  isLoading?: boolean
}

export function WaterNormEditDialog({
  open,
  onClose,
  onSubmit,
  waterNorm,
  isLoading = false,
}: WaterNormEditDialogProps) {
  const [lpcd, setLpcd] = useState(waterNorm.lpcd)
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!lpcd || lpcd <= 0) {
      setError('LPCD must be greater than 0')
      return
    }

    onSubmit({ category: waterNorm.category, lpcd })
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={`Edit ${WATER_NORM_CATEGORY_LABELS[waterNorm.category]} Water Norm`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="lpcd" className="mb-1 block text-sm font-medium text-gray-700">
            LPCD (Litres Per Capita Per Day) <span className="text-red-500">*</span>
          </label>
          <input
            id="lpcd"
            type="number"
            value={lpcd}
            onChange={(e) => {
              setLpcd(Number(e.target.value))
              setError('')
            }}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="e.g., 55"
            min="1"
            step="1"
            disabled={isLoading}
          />
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
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
            {isLoading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </Dialog>
  )
}
