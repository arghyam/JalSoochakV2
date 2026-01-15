import type { OverviewData } from '../types/overview'
import type { ActivityLog } from '../types/activity'
import type { LanguageConfiguration } from '../types/language'
import type { IntegrationConfiguration } from '../types/integration'
import type { WaterNormsConfiguration } from '../types/water-norms'
import type { Escalation } from '../types/escalations'
import type { ThresholdConfiguration } from '../types/thresholds'
import type { NudgeTemplate } from '../types/nudges'

export const mockOverviewData: OverviewData = {
  stats: {
    pumpOperatorsSynced: 2543,
    configurationStatus: 'Completed',
    todayApiIngestion: '98%',
    pendingDataSync: 12,
    activeIntegrations: 8,
  },
  demandSupplyData: [
    { period: 'FY20', demand: 450, supply: 380 },
    { period: 'FY21', demand: 480, supply: 420 },
    { period: 'FY22', demand: 520, supply: 460 },
    { period: 'FY23', demand: 490, supply: 440 },
    { period: 'FY24', demand: 510, supply: 470 },
    { period: 'FY25', demand: 530, supply: 490 },
  ],
  dailyIngestionData: [
    { day: 'Day 1', count: 2100 },
    { day: 'Day 2', count: 2300 },
    { day: 'Day 3', count: 2200 },
    { day: 'Day 4', count: 2500 },
    { day: 'Day 5', count: 2400 },
    { day: 'Day 6', count: 2600 },
    { day: 'Day 7', count: 2700 },
    { day: 'Day 8', count: 2550 },
    { day: 'Day 9', count: 2450 },
    { day: 'Day 10', count: 2650 },
    { day: 'Day 11', count: 2750 },
    { day: 'Day 12', count: 2800 },
  ],
}

export const getMockOverviewData = (): Promise<OverviewData> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockOverviewData)
    }, 300)
  })
}

export const mockActivityData: ActivityLog[] = [
  {
    id: '1',
    timestamp: new Date('2025-09-08T15:00:00'),
    action: 'Reload State Configuration',
    status: 'Success',
  },
  {
    id: '2',
    timestamp: new Date('2025-11-02T09:30:00'),
    action: 'Clear Cache',
    status: 'Failed',
  },
  {
    id: '3',
    timestamp: new Date('2025-08-22T13:30:00'),
    action: 'Test Integrations',
    status: 'Success',
  },
  {
    id: '4',
    timestamp: new Date('2025-02-16T18:00:00'),
    action: 'Reload State Configuration',
    status: 'Success',
  },
  {
    id: '5',
    timestamp: new Date('2025-04-29T11:00:00'),
    action: 'Reload State Configuration',
    status: 'Success',
  },
  {
    id: '6',
    timestamp: new Date('2025-12-04T16:30:00'),
    action: 'Test Integrations',
    status: 'Success',
  },
  {
    id: '7',
    timestamp: new Date('2025-07-19T19:00:00'),
    action: 'Reload State Configuration',
    status: 'Failed',
  },
  {
    id: '8',
    timestamp: new Date('2025-03-06T14:00:00'),
    action: 'Clear Cache',
    status: 'Success',
  },
  {
    id: '9',
    timestamp: new Date('2025-05-14T12:30:00'),
    action: 'Test Integrations',
    status: 'Success',
  },
  {
    id: '10',
    timestamp: new Date('2025-01-15T08:45:00'),
    action: 'Reload State Configuration',
    status: 'Success',
  },
]

export const getMockActivityData = (): Promise<ActivityLog[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockActivityData)
    }, 300)
  })
}

// Language Configuration Mock Data
export const mockLanguageConfiguration: LanguageConfiguration = {
  id: '',
  primaryLanguage: '',
  secondaryLanguage: '',
  isConfigured: false,
}

export const getMockLanguageConfiguration = (): Promise<LanguageConfiguration> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockLanguageConfiguration)
    }, 300)
  })
}

export const saveMockLanguageConfiguration = (
  config: Omit<LanguageConfiguration, 'id'>
): Promise<LanguageConfiguration> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const savedConfig: LanguageConfiguration = {
        id: '1',
        primaryLanguage: config.primaryLanguage as string,
        secondaryLanguage: config.secondaryLanguage as string | undefined,
        isConfigured: true,
      }
      resolve(savedConfig)
    }, 500)
  })
}

// Integration Configuration Mock Data
export const mockIntegrationConfiguration: IntegrationConfiguration = {
  id: '',
  whatsappBusinessAccountName: '',
  senderPhoneNumber: '',
  whatsappBusinessAccountId: '',
  apiAccessToken: '',
  isConfigured: false,
}

export const getMockIntegrationConfiguration = (): Promise<IntegrationConfiguration> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockIntegrationConfiguration)
    }, 300)
  })
}

export const saveMockIntegrationConfiguration = (
  config: Omit<IntegrationConfiguration, 'id' | 'isConfigured'>
): Promise<IntegrationConfiguration> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const savedConfig: IntegrationConfiguration = {
        id: '1',
        whatsappBusinessAccountName: config.whatsappBusinessAccountName as string,
        senderPhoneNumber: config.senderPhoneNumber as string,
        whatsappBusinessAccountId: config.whatsappBusinessAccountId as string,
        apiAccessToken: config.apiAccessToken as string,
        isConfigured: true,
      }
      resolve(savedConfig)
    }, 500)
  })
}

// Water Norms Configuration Mock Data
let mockWaterNormsConfiguration: WaterNormsConfiguration = {
  id: '',
  stateQuantity: 0,
  districtOverrides: [],
  isConfigured: false,
}

export const getMockWaterNormsConfiguration = (): Promise<WaterNormsConfiguration> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ ...mockWaterNormsConfiguration })
    }, 300)
  })
}

export const saveMockWaterNormsConfiguration = (
  config: Omit<WaterNormsConfiguration, 'id'>
): Promise<WaterNormsConfiguration> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const savedConfig: WaterNormsConfiguration = {
        id: '1',
        stateQuantity: Number(config.stateQuantity),
        districtOverrides: Array.isArray(config.districtOverrides) ? config.districtOverrides : [],
        isConfigured: true,
      }
      mockWaterNormsConfiguration = savedConfig
      resolve(savedConfig)
    }, 500)
  })
}

// Escalations Mock Data
let mockEscalations: Escalation[] = [
  {
    id: '1',
    name: 'Water Quantity Alert',
    alertType: 'water-quantity-alert',
    levels: [
      {
        id: 'level-1-1',
        levelNumber: 1,
        targetRole: 'operator',
        escalateAfterHours: 12,
      },
      {
        id: 'level-1-2',
        levelNumber: 2,
        targetRole: 'gram-panchayat',
        escalateAfterHours: 20,
      },
    ],
  },
  {
    id: '2',
    name: 'Operator Inactivity Alert',
    alertType: 'operator-inactivity-alert',
    levels: [
      {
        id: 'level-2-1',
        levelNumber: 1,
        targetRole: 'operator',
        escalateAfterHours: 12,
      },
      {
        id: 'level-2-2',
        levelNumber: 2,
        targetRole: 'gram-panchayat',
        escalateAfterHours: 20,
      },
      {
        id: 'level-2-3',
        levelNumber: 3,
        targetRole: 'district',
        escalateAfterHours: 48,
      },
    ],
  },
  {
    id: '3',
    name: 'Repeated Non-Compliance Escalation',
    alertType: 'repeated-non-compliance',
    levels: [
      {
        id: 'level-3-1',
        levelNumber: 1,
        targetRole: 'operator',
        escalateAfterHours: 12,
      },
      {
        id: 'level-3-2',
        levelNumber: 2,
        targetRole: 'gram-panchayat',
        escalateAfterHours: 20,
      },
    ],
  },
  {
    id: '4',
    name: 'Delayed Submission Escalation',
    alertType: 'delayed-submission',
    levels: [
      {
        id: 'level-4-1',
        levelNumber: 1,
        targetRole: 'operator',
        escalateAfterHours: 12,
      },
      {
        id: 'level-4-2',
        levelNumber: 2,
        targetRole: 'gram-panchayat',
        escalateAfterHours: 20,
      },
      {
        id: 'level-4-3',
        levelNumber: 3,
        targetRole: 'district',
        escalateAfterHours: 48,
      },
    ],
  },
]

export const getMockEscalations = (): Promise<Escalation[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockEscalations])
    }, 300)
  })
}

export const getMockEscalationById = (id: string): Promise<Escalation | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const escalation = mockEscalations.find((e) => e.id === id)
      resolve(escalation || null)
    }, 300)
  })
}

export const saveMockEscalation = (
  escalation: Omit<Escalation, 'id' | 'name'>
): Promise<Escalation> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const alertTypeLabels: Record<string, string> = {
        'water-quantity-alert': 'Water Quantity Alert',
        'operator-inactivity-alert': 'Operator Inactivity Alert',
        'repeated-non-compliance': 'Repeated Non-Compliance Escalation',
        'delayed-submission': 'Delayed Submission Escalation',
      }

      const savedEscalation: Escalation = {
        id: `escalation-${Date.now()}`,
        name: alertTypeLabels[escalation.alertType] || escalation.alertType,
        alertType: escalation.alertType,
        levels: escalation.levels.map((level, index) => ({
          ...level,
          id: level.id || `level-${Date.now()}-${index}`,
          levelNumber: index + 1,
        })),
      }
      mockEscalations = [...mockEscalations, savedEscalation]
      resolve(savedEscalation)
    }, 500)
  })
}

export const updateMockEscalation = (
  id: string,
  escalation: Omit<Escalation, 'id' | 'name'>
): Promise<Escalation> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const alertTypeLabels: Record<string, string> = {
        'water-quantity-alert': 'Water Quantity Alert',
        'operator-inactivity-alert': 'Operator Inactivity Alert',
        'repeated-non-compliance': 'Repeated Non-Compliance Escalation',
        'delayed-submission': 'Delayed Submission Escalation',
      }

      const updatedEscalation: Escalation = {
        id,
        name: alertTypeLabels[escalation.alertType] || escalation.alertType,
        alertType: escalation.alertType,
        levels: escalation.levels.map((level, index) => ({
          ...level,
          id: level.id || `level-${Date.now()}-${index}`,
          levelNumber: index + 1,
        })),
      }
      mockEscalations = mockEscalations.map((e) => (e.id === id ? updatedEscalation : e))
      resolve(updatedEscalation)
    }, 500)
  })
}

export const deleteMockEscalation = (id: string): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      mockEscalations = mockEscalations.filter((e) => e.id !== id)
      resolve()
    }, 300)
  })
}

// Thresholds Configuration Mock Data
let mockThresholdConfiguration: ThresholdConfiguration = {
  id: '',
  coverage: '',
  continuity: '',
  quantity: '',
  regularity: '',
  isConfigured: false,
}

export const getMockThresholdConfiguration = (): Promise<ThresholdConfiguration> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ ...mockThresholdConfiguration })
    }, 300)
  })
}

export const saveMockThresholdConfiguration = (
  config: Omit<ThresholdConfiguration, 'id'>
): Promise<ThresholdConfiguration> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const savedConfig: ThresholdConfiguration = {
        id: '1',
        coverage: config.coverage,
        continuity: config.continuity,
        quantity: config.quantity,
        regularity: config.regularity,
        isConfigured: true,
      }
      mockThresholdConfiguration = savedConfig
      resolve(savedConfig)
    }, 500)
  })
}

// Nudges Template Mock Data
let mockNudgeTemplates: NudgeTemplate[] = [
  {
    id: '1',
    name: 'No-Water Alert',
    type: 'no-water-alert',
    language: 'english',
    message:
      'Dear {operator_name},\nThis is an urgent alert regarding the water point in {village_name}. It has been reported no water for {days} consecutive days. Please investigate and fix the issues immediately.\n\nJalSoochak',
    availableVariables: ['{operator_name}', '{village_name}', '{days}'],
  },
  {
    id: '2',
    name: 'Low Quantity Alert',
    type: 'low-quantity-alert',
    language: 'english',
    message:
      'Dear {operator_name},\nWater Quantity at {village_name} is currently {days} LPCD, which is below the threshold. Please check the supply and system functionality.\n\nJalSoochak',
    availableVariables: ['{operator_name}', '{village_name}', '{days}'],
  },
  {
    id: '3',
    name: 'Operator Inactivity',
    type: 'operator-inactivity',
    language: 'english',
    message:
      'Dear {operator_name},\nWe have noticed that data has not been reported for {village_name} for the last {days} days. Please ensure regular updates.\n\nJalSoochak',
    availableVariables: ['{operator_name}', '{village_name}', '{days}', '{last_report_day}'],
  },
]

export const getMockNudgeTemplates = (): Promise<NudgeTemplate[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockNudgeTemplates])
    }, 300)
  })
}

export const getMockNudgeTemplateById = (id: string): Promise<NudgeTemplate | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const template = mockNudgeTemplates.find((t) => t.id === id)
      resolve(template || null)
    }, 300)
  })
}

export const updateMockNudgeTemplate = (
  id: string,
  updates: { language: string; message: string }
): Promise<NudgeTemplate> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const template = mockNudgeTemplates.find((t) => t.id === id)
      if (template) {
        const updatedTemplate = {
          ...template,
          language: updates.language,
          message: updates.message,
        }
        mockNudgeTemplates = mockNudgeTemplates.map((t) => (t.id === id ? updatedTemplate : t))
        resolve(updatedTemplate)
      } else {
        throw new Error('Template not found')
      }
    }, 500)
  })
}
