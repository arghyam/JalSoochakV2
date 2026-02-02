export type DashboardLevel =
  | 'central'
  | 'state'
  | 'district'
  | 'block'
  | 'gram-panchayat'
  | 'village'
  | 'zone'
  | 'circle'
  | 'division'
  | 'sub-division'

export type EntityStatus = 'good' | 'needs-attention' | 'critical'

export interface KPIData {
  totalSchemes: number
  totalRuralHouseholds: number
  functionalTapConnections: number
}

export interface EntityPerformance {
  id: string
  name: string
  coverage: number
  regularity: number
  continuity: number
  quantity: number
  compositeScore: number
  status: EntityStatus
}

export interface DemandSupplyData {
  period: string
  demand: number
  supply: number
}

export interface ImageSubmissionStatusData {
  label: string
  value: number
}

export interface PumpOperatorsData {
  label: string
  value: number
}

export interface WaterSupplyOutageData {
  district: string
  electricityFailure: number
  pipelineLeak: number
  pumpFailure: number
  valveIssue: number
  sourceDrying: number
}

export interface DashboardData {
  level: DashboardLevel
  entityId?: string
  entityName?: string
  kpis: KPIData
  mapData: EntityPerformance[]
  demandSupply: DemandSupplyData[]
  imageSubmissionStatus: ImageSubmissionStatusData[]
  pumpOperators: PumpOperatorsData[]
  waterSupplyOutages: WaterSupplyOutageData[]
  topPerformers: EntityPerformance[]
  worstPerformers: EntityPerformance[]
  regularityData: EntityPerformance[]
  continuityData: EntityPerformance[]
}

// For map hover/click interactions
export interface MapInteraction {
  entityId: string
  entityName: string
  metrics: {
    coverage: number
    regularity: number
    continuity: number
    quantity: number
  }
}
