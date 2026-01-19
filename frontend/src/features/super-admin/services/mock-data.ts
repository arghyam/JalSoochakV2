import type { SuperAdminOverviewData } from '../types/overview'
import type { SystemRulesConfiguration } from '../types/system-rules'
import type { IngestionMonitorData } from '../types/ingestion-monitor'

export const mockSuperAdminOverviewData: SuperAdminOverviewData = {
  stats: {
    totalStatesManaged: 28,
    activeStates: 26,
    inactiveStates: 2,
  },
  ingestionData: [
    { month: 'Jan', successfulIngestions: 520, failedIngestions: 16 },
    { month: 'Feb', successfulIngestions: 680, failedIngestions: 20 },
    { month: 'Mar', successfulIngestions: 850, failedIngestions: 28 },
    { month: 'Apr', successfulIngestions: 320, failedIngestions: 24 },
    { month: 'May', successfulIngestions: 580, failedIngestions: 18 },
    { month: 'Jun', successfulIngestions: 720, failedIngestions: 22 },
    { month: 'Jul', successfulIngestions: 420, failedIngestions: 8 },
    { month: 'Aug', successfulIngestions: 850, failedIngestions: 26 },
    { month: 'Sep', successfulIngestions: 680, failedIngestions: 20 },
    { month: 'Oct', successfulIngestions: 620, failedIngestions: 18 },
    { month: 'Nov', successfulIngestions: 650, failedIngestions: 22 },
    { month: 'Dec', successfulIngestions: 820, failedIngestions: 24 },
  ],
  notifications: [
    {
      id: '1',
      message: 'Data ingestion delay detected for state Telangana (3 hours).',
      timestamp: new Date('2025-11-20T10:30:00'),
    },
    {
      id: '2',
      message: 'API authentication failure for state Haryana.',
      timestamp: new Date('2025-11-20T09:32:00'),
    },
    {
      id: '3',
      message: 'API authentication failure for state Uttar Pradesh.',
      timestamp: new Date('2025-11-20T09:24:00'),
    },
  ],
}

export const getMockSuperAdminOverviewData = (): Promise<SuperAdminOverviewData> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockSuperAdminOverviewData)
    }, 300)
  })
}

// System Rules Configuration Mock Data
let mockSystemRulesConfiguration: SystemRulesConfiguration = {
  id: '',
  coverage: '',
  continuity: '',
  quantity: '',
  regularity: '',
  isConfigured: false,
}

export const getMockSystemRulesConfiguration = (): Promise<SystemRulesConfiguration> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ ...mockSystemRulesConfiguration })
    }, 300)
  })
}

export const saveMockSystemRulesConfiguration = (
  config: Omit<SystemRulesConfiguration, 'id'>
): Promise<SystemRulesConfiguration> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const savedConfig: SystemRulesConfiguration = {
        id: '1',
        coverage: config.coverage,
        continuity: config.continuity,
        quantity: config.quantity,
        regularity: config.regularity,
        isConfigured: true,
      }
      mockSystemRulesConfiguration = savedConfig
      resolve(savedConfig)
    }, 500)
  })
}

// Ingestion Monitor Mock Data
export const mockIngestionMonitorData: IngestionMonitorData = {
  stats: {
    totalIngestions: 5234,
    successfulIngestions: 4890,
    failedIngestions: 344,
    currentWarnings: 12,
    successRate: 93.4,
    failureRate: 6.6,
  },
  chartData: [
    { month: 'Jan', successfulIngestions: 520, failedIngestions: 16 },
    { month: 'Feb', successfulIngestions: 680, failedIngestions: 20 },
    { month: 'Mar', successfulIngestions: 850, failedIngestions: 28 },
    { month: 'Apr', successfulIngestions: 320, failedIngestions: 24 },
    { month: 'May', successfulIngestions: 580, failedIngestions: 18 },
    { month: 'Jun', successfulIngestions: 720, failedIngestions: 22 },
    { month: 'Jul', successfulIngestions: 420, failedIngestions: 8 },
    { month: 'Aug', successfulIngestions: 850, failedIngestions: 26 },
    { month: 'Sep', successfulIngestions: 680, failedIngestions: 20 },
    { month: 'Oct', successfulIngestions: 620, failedIngestions: 18 },
    { month: 'Nov', successfulIngestions: 650, failedIngestions: 22 },
    { month: 'Dec', successfulIngestions: 820, failedIngestions: 24 },
  ],
  logs: [
    {
      id: '1',
      title: "District data package 'CAL-D001' ingested successfully.",
      description: 'Records processed: 12,345',
      batchId: '5f7c3d1e-8a9b-4c0d-9e2f',
      sourceSystem: 'State Data Hub',
      processingTime: '150ms',
      recordsProcessed: 12345,
      status: 'successful',
      timestamp: new Date('2025-11-20T10:30:00'),
    },
    {
      id: '2',
      title: "Partial ingestion for 'FL-D010'. 5% of records malformed.",
      description:
        "Issue: Data validation for 50 out of 1000 records due to missing 'district_id'. Review schema compliance for future submissions.",
      batchId: '5f7c3d1e-8a9b-4c0d-9e2f',
      sourceSystem: 'State Data Hub',
      processingTime: '150ms',
      status: 'warning',
      timestamp: new Date('2025-11-20T10:30:00'),
      issueDetails:
        "Data validation for 50 out of 1000 records due to missing 'district_id'. Review schema compliance for future submissions.",
    },
    {
      id: '3',
      title: "Database connection lost during 'CAL-D002' ingestion. Reconnection attempt failed.",
      description:
        'Error: DB_CONNECT_TIMEOUT Service Status: Database service appears offline. Data ingestion from this district is paused.',
      batchId: '5f7c3d1e-8a9b-4c0d-9e2f',
      sourceSystem: 'State Data Hub',
      processingTime: '150ms',
      status: 'failed',
      timestamp: new Date('2025-11-20T10:30:00'),
      errorDetails:
        'DB_CONNECT_TIMEOUT Service Status: Database service appears offline. Data ingestion from this district is paused.',
    },
  ],
}

export const getMockIngestionMonitorData = (): Promise<IngestionMonitorData> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockIngestionMonitorData)
    }, 300)
  })
}
