import { CONDITION_TYPES, NOTIFY_ROLES } from '@/shared/constants/state-admin'
import type {
  EscalationRule,
  EscalationRulesConfig,
  CreateEscalationRuleRequest,
  UpdateEscalationRuleRequest,
} from '../../types/escalation-rule'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Mock escalation rules
const mockEscalationRules: EscalationRule[] = [
  {
    id: '1',
    condition: {
      type: CONDITION_TYPES.NO_SUBMISSION,
      durationHours: 24,
    },
    levels: [
      { level: 1, notifyRole: NOTIFY_ROLES.SECTION_OFFICER },
      { level: 2, notifyRole: NOTIFY_ROLES.ASSISTANT_EXECUTIVE_ENGINEER },
    ],
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: '2',
    condition: {
      type: CONDITION_TYPES.THRESHOLD_BREACH,
      threshold: 80,
    },
    levels: [
      { level: 1, notifyRole: NOTIFY_ROLES.ASSISTANT_EXECUTIVE_ENGINEER },
      { level: 2, notifyRole: NOTIFY_ROLES.EXECUTIVE_ENGINEER },
    ],
    createdAt: '2024-01-16T00:00:00Z',
    updatedAt: '2024-01-16T00:00:00Z',
  },
  {
    id: '3',
    condition: {
      type: CONDITION_TYPES.ANOMALY_DETECTED,
    },
    levels: [
      { level: 1, notifyRole: NOTIFY_ROLES.SECTION_OFFICER },
      { level: 2, notifyRole: NOTIFY_ROLES.ASSISTANT_EXECUTIVE_ENGINEER },
      { level: 3, notifyRole: NOTIFY_ROLES.EXECUTIVE_ENGINEER },
    ],
    createdAt: '2024-01-17T00:00:00Z',
    updatedAt: '2024-01-17T00:00:00Z',
  },
]

let rules = [...mockEscalationRules]

export const escalationRuleMockService = {
  getEscalationRules: async (tenantId: string): Promise<EscalationRulesConfig> => {
    await delay(500)
    return {
      tenantId,
      rules,
      updatedAt: new Date().toISOString(),
    }
  },

  createEscalationRule: async (data: CreateEscalationRuleRequest): Promise<EscalationRule> => {
    await delay(500)
    const newRule: EscalationRule = {
      id: (rules.length + 1).toString(),
      condition: data.condition,
      levels: data.levels,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    rules.push(newRule)
    return newRule
  },

  updateEscalationRule: async (data: UpdateEscalationRuleRequest): Promise<EscalationRule> => {
    await delay(500)
    const index = rules.findIndex((r) => r.id === data.id)
    if (index === -1) {
      throw new Error('Escalation rule not found')
    }
    const updatedRule: EscalationRule = {
      ...rules[index],
      condition: data.condition,
      levels: data.levels,
      updatedAt: new Date().toISOString(),
    }
    rules[index] = updatedRule
    return updatedRule
  },

  deleteEscalationRule: async (id: string): Promise<void> => {
    await delay(500)
    rules = rules.filter((r) => r.id !== id)
  },
}
