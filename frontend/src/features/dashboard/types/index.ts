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
  nationalCoverage: number // %
  regularity: number // %
  continuity: number // 0-100 index
  averageQuantity: number // LPCD
  totalSchemes: number
  totalHouseholds: number
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

export interface DashboardData {
  level: DashboardLevel
  entityId?: string
  entityName?: string
  kpis: KPIData
  mapData: EntityPerformance[]
  demandSupply: DemandSupplyData[]
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
