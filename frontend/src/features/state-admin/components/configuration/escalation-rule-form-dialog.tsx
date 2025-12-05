import { useState } from 'react'
import { Dialog } from '@/shared/components/common'
import type { EscalationRule, EscalationRuleFormData } from '../../types/escalation-rule'
import {
  CONDITION_TYPES,
  CONDITION_TYPE_LABELS,
  NOTIFY_ROLES,
  NOTIFY_ROLE_LABELS,
  type ConditionType,
  type NotifyRole,
} from '@/shared/constants/state-admin'

interface EscalationRuleFormDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: EscalationRuleFormData) => void
  rule?: EscalationRule | null
  isLoading?: boolean
}

function getInitialFormData(rule: EscalationRule | null | undefined): EscalationRuleFormData {
  if (rule) {
    return {
      conditionType: rule.condition.type,
      durationHours: rule.condition.durationHours,
      threshold: rule.condition.threshold,
      levels: rule.levels,
    }
  }
  return {
    conditionType: CONDITION_TYPES.NO_SUBMISSION,
    durationHours: 24,
    levels: [{ level: 1, notifyRole: NOTIFY_ROLES.SECTION_OFFICER }],
  }
}

export function EscalationRuleFormDialog({
  open,
  onClose,
  onSubmit,
  rule,
  isLoading = false,
}: EscalationRuleFormDialogProps) {
  const [formData, setFormData] = useState<EscalationRuleFormData>(() => getInitialFormData(rule))
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({})

  const handleConditionTypeChange = (type: ConditionType) => {
    setFormData((prev) => ({
      ...prev,
      conditionType: type,
      durationHours: type === CONDITION_TYPES.NO_SUBMISSION ? 24 : undefined,
      threshold: type === CONDITION_TYPES.THRESHOLD_BREACH ? 80 : undefined,
    }))
    setErrors({})
  }

  const handleAddLevel = () => {
    const newLevel = formData.levels.length + 1
    setFormData((prev) => ({
      ...prev,
      levels: [...prev.levels, { level: newLevel, notifyRole: NOTIFY_ROLES.SECTION_OFFICER }],
    }))
  }

  const handleRemoveLevel = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      levels: prev.levels
        .filter((_, i) => i !== index)
        .map((level, idx) => ({ ...level, level: idx + 1 })),
    }))
  }

  const handleLevelRoleChange = (index: number, role: NotifyRole) => {
    setFormData((prev) => ({
      ...prev,
      levels: prev.levels.map((level, i) => (i === index ? { ...level, notifyRole: role } : level)),
    }))
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (formData.conditionType === CONDITION_TYPES.NO_SUBMISSION && !formData.durationHours) {
      newErrors.durationHours = 'Duration is required for no submission condition'
    }

    if (formData.conditionType === CONDITION_TYPES.THRESHOLD_BREACH && !formData.threshold) {
      newErrors.threshold = 'Threshold is required for threshold breach condition'
    }

    if (formData.levels.length === 0) {
      newErrors.levels = 'At least one escalation level is required'
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

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={rule ? 'Edit Escalation Rule' : 'Add Escalation Rule'}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Condition Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-900">Condition</h3>

          <div>
            <label htmlFor="conditionType" className="mb-1 block text-sm font-medium text-gray-700">
              Condition Type <span className="text-red-500">*</span>
            </label>
            <select
              id="conditionType"
              value={formData.conditionType}
              onChange={(e) => handleConditionTypeChange(e.target.value as ConditionType)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              disabled={isLoading}
            >
              {Object.values(CONDITION_TYPES).map((type) => (
                <option key={type} value={type}>
                  {CONDITION_TYPE_LABELS[type]}
                </option>
              ))}
            </select>
          </div>

          {formData.conditionType === CONDITION_TYPES.NO_SUBMISSION && (
            <div>
              <label
                htmlFor="durationHours"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Duration (Hours) <span className="text-red-500">*</span>
              </label>
              <input
                id="durationHours"
                type="number"
                value={formData.durationHours || ''}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, durationHours: Number(e.target.value) }))
                  setErrors((prev) => ({ ...prev, durationHours: undefined }))
                }}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="e.g., 24"
                min="1"
                disabled={isLoading}
              />
              {errors.durationHours && (
                <p className="mt-1 text-sm text-red-600">{errors.durationHours}</p>
              )}
            </div>
          )}

          {formData.conditionType === CONDITION_TYPES.THRESHOLD_BREACH && (
            <div>
              <label htmlFor="threshold" className="mb-1 block text-sm font-medium text-gray-700">
                Threshold (%) <span className="text-red-500">*</span>
              </label>
              <input
                id="threshold"
                type="number"
                value={formData.threshold || ''}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, threshold: Number(e.target.value) }))
                  setErrors((prev) => ({ ...prev, threshold: undefined }))
                }}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="e.g., 80"
                min="1"
                max="100"
                disabled={isLoading}
              />
              {errors.threshold && <p className="mt-1 text-sm text-red-600">{errors.threshold}</p>}
            </div>
          )}
        </div>

        {/* Escalation Levels Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">Escalation Levels</h3>
            <button
              type="button"
              onClick={handleAddLevel}
              disabled={isLoading}
              className="text-sm font-medium text-blue-600 hover:text-blue-700 disabled:opacity-50"
            >
              + Add Level
            </button>
          </div>

          <div className="space-y-3">
            {formData.levels.map((level, index) => (
              <div
                key={index}
                className="flex items-center gap-3 rounded-md border border-gray-200 p-3"
              >
                <div className="flex-1">
                  <label className="mb-1 block text-xs font-medium text-gray-700">
                    Level {level.level} - Notify Role
                  </label>
                  <select
                    value={level.notifyRole}
                    onChange={(e) => handleLevelRoleChange(index, e.target.value as NotifyRole)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    disabled={isLoading}
                  >
                    {Object.values(NOTIFY_ROLES).map((role) => (
                      <option key={role} value={role}>
                        {NOTIFY_ROLE_LABELS[role]}
                      </option>
                    ))}
                  </select>
                </div>
                {formData.levels.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveLevel(index)}
                    disabled={isLoading}
                    className="rounded p-2 text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
                    title="Remove level"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
          {errors.levels && <p className="text-sm text-red-600">{errors.levels}</p>}
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
            {isLoading ? 'Saving...' : rule ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </Dialog>
  )
}
