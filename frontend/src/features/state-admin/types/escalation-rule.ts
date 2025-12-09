import type { ConditionType, NotifyRole } from '@/shared/constants/state-admin'

export interface EscalationCondition {
  type: ConditionType
  durationHours?: number
  threshold?: number
}

export interface EscalationLevel {
  level: number
  notifyRole: NotifyRole
}

export interface EscalationRule {
  id: string
  condition: EscalationCondition
  levels: EscalationLevel[]
  createdAt: string
  updatedAt: string
}

export interface EscalationRulesConfig {
  tenantId: string
  rules: EscalationRule[]
  updatedAt: string
}

export interface CreateEscalationRuleRequest {
  tenantId: string
  condition: EscalationCondition
  levels: EscalationLevel[]
}

export interface UpdateEscalationRuleRequest {
  id: string
  tenantId: string
  condition: EscalationCondition
  levels: EscalationLevel[]
}

export interface EscalationRuleFormData {
  conditionType: ConditionType
  durationHours?: number
  threshold?: number
  levels: EscalationLevel[]
}
