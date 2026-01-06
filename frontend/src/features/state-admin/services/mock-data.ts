import type { OverviewData } from '../types/overview'

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
