export interface EscalationLevel {
  id: string
  levelNumber: number
  targetRole: string
  escalateAfterHours: number
}

export interface Escalation {
  id: string
  name: string
  alertType: string
  levels: EscalationLevel[]
}

export interface EscalationFormData {
  alertType: string
  levels: EscalationLevel[]
}

export interface RoleOption {
  value: string
  label: string
}

export const AVAILABLE_ROLES: RoleOption[] = [
  { value: 'operator', label: 'Operator' },
  { value: 'pump-operator', label: 'Pump Operator' },
  { value: 'gram-panchayat', label: 'Gram Panchayat' },
  { value: 'district', label: 'District' },
]

export interface HoursOption {
  value: string
  label: string
}

export const AVAILABLE_HOURS: HoursOption[] = [
  { value: '12', label: '12' },
  { value: '20', label: '20' },
  { value: '32', label: '32' },
  { value: '48', label: '48' },
]

export interface AlertTypeOption {
  value: string
  label: string
}

export const AVAILABLE_ALERT_TYPES: AlertTypeOption[] = [
  { value: 'water-quantity-alert', label: 'Water Quantity Alert' },
  { value: 'operator-inactivity-alert', label: 'Operator Inactivity Alert' },
  { value: 'repeated-non-compliance', label: 'Repeated Non-Compliance Escalation' },
  { value: 'delayed-submission', label: 'Delayed Submission Escalation' },
]
