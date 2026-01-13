import type { OverviewData } from '../types/overview'
import type { ActivityLog } from '../types/activity'
import type { LanguageConfiguration } from '../types/language'
import type { IntegrationConfiguration } from '../types/integration'
import type { WaterNormsConfiguration } from '../types/water-norms'

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
