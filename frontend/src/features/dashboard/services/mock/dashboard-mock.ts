// Mock data service for dashboard

import type {
  DashboardData,
  DashboardLevel,
  EntityPerformance,
  DemandSupplyData,
  KPIData,
} from '../../types'
import type { SearchableSelectOption } from '@/shared/components/common'

type FilterOptionsByKey = Record<string, SearchableSelectOption[]>

// Mock data for filters in dashboard
export const mockFilterStates = [{ value: 'telangana', label: 'Telangana' }]

export const mockFilterDistricts: FilterOptionsByKey = {
  telangana: [
    { value: 'sangareddy', label: 'Sangareddy' },
    { value: 'rangareddy', label: 'Ranga Reddy' },
  ],
}

export const mockFilterBlocks: FilterOptionsByKey = {
  sangareddy: [
    { value: 'patancheru', label: 'Patancheru' },
    { value: 'zaheerabad', label: 'Zaheerabad' },
  ],
  rangareddy: [
    { value: 'shamshabad', label: 'Shamshabad' },
    { value: 'chevella', label: 'Chevella' },
  ],
}

export const mockFilterGramPanchayats: FilterOptionsByKey = {
  patancheru: [
    { value: 'isnapur', label: 'Isnapur' },
    { value: 'rudraram', label: 'Rudraram' },
  ],
  zaheerabad: [
    { value: 'machanpalli', label: 'Machanpalli' },
    { value: 'nagur', label: 'Nagur' },
  ],
  shamshabad: [
    { value: 'sathamrai', label: 'Sathamrai' },
    { value: 'gollapalli', label: 'Gollapalli' },
  ],
  chevella: [
    { value: 'ankireddypalli', label: 'Ankireddypalli' },
    { value: 'devuni-erravalli', label: 'Devuni Erravalli' },
  ],
}

export const mockFilterVillages: FilterOptionsByKey = {
  isnapur: [
    { value: 'kistareddypet', label: 'Kistareddypet' },
    { value: 'industrial-area', label: 'Industrial Area' },
  ],
  rudraram: [
    { value: 'iit-hyderabad-area', label: 'IIT Hyderabad Area' },
    { value: 'bandalguda', label: 'Bandalguda' },
  ],
  machanpalli: [
    { value: 'machanpalli-village', label: 'Machanpalli Village' },
    { value: 'thimmapur', label: 'Thimmapur' },
  ],
  nagur: [
    { value: 'nagur-village', label: 'Nagur Village' },
    { value: 'khanapur', label: 'Khanapur' },
  ],
  sathamrai: [
    { value: 'sathamrai-village', label: 'Sathamrai Village' },
    { value: 'malkapur', label: 'Malkapur' },
  ],
  gollapalli: [
    { value: 'gollapalli-village', label: 'Gollapalli Village' },
    { value: 'ramanujapur', label: 'Ramanujapur' },
  ],
  ankireddypalli: [
    { value: 'ankireddypalli-village', label: 'Ankireddypalli Village' },
    { value: 'mallapur', label: 'Mallapur' },
  ],
  'devuni-erravalli': [
    { value: 'erravalli-village', label: 'Erravalli Village' },
    { value: 'thangedpalli', label: 'Thangedpalli' },
  ],
}

export const mockFilterDuration = [
  { value: 'last_7_days', label: 'Last 7 Days' },
  { value: 'last_30_days', label: 'Last 30 Days' },
]

export const mockFilterSchemes = [
  { value: 'jal-jeevan-mission', label: 'Jal Jeevan Mission' },
  { value: 'swachh-bharat-mission', label: 'Swachh Bharat Mission' },
]

// Mock state data for India map
const mockStates: EntityPerformance[] = [
  {
    id: 'RJ',
    name: 'Rajasthan',
    coverage: 45.2,
    regularity: 62.5,
    continuity: 58.3,
    quantity: 45,
    compositeScore: 52.75,
    status: 'critical',
  },
  {
    id: 'UP',
    name: 'Uttar Pradesh',
    coverage: 38.7,
    regularity: 55.2,
    continuity: 52.1,
    quantity: 42,
    compositeScore: 47.0,
    status: 'critical',
  },
  {
    id: 'MH',
    name: 'Maharashtra',
    coverage: 52.3,
    regularity: 68.4,
    continuity: 65.2,
    quantity: 55,
    compositeScore: 60.25,
    status: 'needs-attention',
  },
  {
    id: 'KL',
    name: 'Kerala',
    coverage: 85.6,
    regularity: 92.3,
    continuity: 88.7,
    quantity: 75,
    compositeScore: 85.65,
    status: 'good',
  },
  {
    id: 'TN',
    name: 'Tamil Nadu',
    coverage: 78.4,
    regularity: 85.2,
    continuity: 82.1,
    quantity: 68,
    compositeScore: 78.45,
    status: 'good',
  },
  {
    id: 'KA',
    name: 'Karnataka',
    coverage: 72.1,
    regularity: 78.5,
    continuity: 75.3,
    quantity: 62,
    compositeScore: 72.0,
    status: 'good',
  },
  {
    id: 'AP',
    name: 'Andhra Pradesh',
    coverage: 68.9,
    regularity: 75.2,
    continuity: 72.4,
    quantity: 58,
    compositeScore: 68.625,
    status: 'good',
  },
  {
    id: 'TG',
    name: 'Telangana',
    coverage: 65.3,
    regularity: 72.1,
    continuity: 69.8,
    quantity: 55,
    compositeScore: 65.55,
    status: 'good',
  },
  {
    id: 'GJ',
    name: 'Gujarat',
    coverage: 58.7,
    regularity: 65.4,
    continuity: 62.1,
    quantity: 52,
    compositeScore: 59.55,
    status: 'needs-attention',
  },
  {
    id: 'MP',
    name: 'Madhya Pradesh',
    coverage: 42.1,
    regularity: 58.3,
    continuity: 55.7,
    quantity: 48,
    compositeScore: 51.025,
    status: 'critical',
  },
  {
    id: 'WB',
    name: 'West Bengal',
    coverage: 48.5,
    regularity: 62.1,
    continuity: 59.4,
    quantity: 50,
    compositeScore: 55.0,
    status: 'needs-attention',
  },
  {
    id: 'BR',
    name: 'Bihar',
    coverage: 35.2,
    regularity: 48.7,
    continuity: 45.3,
    quantity: 40,
    compositeScore: 42.3,
    status: 'critical',
  },
  {
    id: 'OR',
    name: 'Odisha',
    coverage: 55.8,
    regularity: 68.2,
    continuity: 64.5,
    quantity: 54,
    compositeScore: 60.125,
    status: 'needs-attention',
  },
  {
    id: 'HR',
    name: 'Haryana',
    coverage: 72.5,
    regularity: 80.1,
    continuity: 77.8,
    quantity: 65,
    compositeScore: 73.85,
    status: 'good',
  },
  {
    id: 'PB',
    name: 'Punjab',
    coverage: 75.2,
    regularity: 82.4,
    continuity: 79.6,
    quantity: 68,
    compositeScore: 76.3,
    status: 'good',
  },
  {
    id: 'JK',
    name: 'Jammu and Kashmir',
    coverage: 62.1,
    regularity: 70.5,
    continuity: 67.2,
    quantity: 56,
    compositeScore: 64.0,
    status: 'needs-attention',
  },
  {
    id: 'HP',
    name: 'Himachal Pradesh',
    coverage: 68.4,
    regularity: 75.8,
    continuity: 72.1,
    quantity: 60,
    compositeScore: 69.075,
    status: 'good',
  },
  {
    id: 'UK',
    name: 'Uttarakhand',
    coverage: 65.7,
    regularity: 73.2,
    continuity: 70.5,
    quantity: 58,
    compositeScore: 66.85,
    status: 'good',
  },
  {
    id: 'AS',
    name: 'Assam',
    coverage: 58.2,
    regularity: 66.8,
    continuity: 63.4,
    quantity: 53,
    compositeScore: 60.1,
    status: 'needs-attention',
  },
  {
    id: 'JH',
    name: 'Jharkhand',
    coverage: 40.3,
    regularity: 55.1,
    continuity: 52.8,
    quantity: 45,
    compositeScore: 48.05,
    status: 'critical',
  },
  {
    id: 'CT',
    name: 'Chhattisgarh',
    coverage: 44.8,
    regularity: 60.2,
    continuity: 57.5,
    quantity: 48,
    compositeScore: 52.625,
    status: 'critical',
  },
]

// Mock demand-supply data for financial year
const mockDemandSupply: DemandSupplyData[] = [
  { period: 'FY20', demand: 67, supply: 60 },
  { period: 'FY21', demand: 75, supply: 82 },
  { period: 'FY22', demand: 110, supply: 99 },
  { period: 'FY23', demand: 80, supply: 65 },
  { period: 'FY24', demand: 23, supply: 15 },
  { period: 'FY25', demand: 75, supply: 73 },
]

// Mock KPI data for central dashboard
const mockCentralKPIs: KPIData = {
  totalSchemes: 650000,
  totalRuralHouseholds: 193620012,
  functionalTapConnections: 93620012,
}

export const dashboardMockService = {
  /**
   * Get mock dashboard data
   * replace this with API call
   */
  getDashboardData: async (level: DashboardLevel, entityId?: string): Promise<DashboardData> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    if (level === 'central') {
      // Sort states by composite score for top/worst performers
      const sortedStates = [...mockStates].sort((a, b) => b.compositeScore - a.compositeScore)

      return {
        level: 'central',
        kpis: mockCentralKPIs,
        mapData: mockStates,
        demandSupply: mockDemandSupply,
        topPerformers: sortedStates.slice(0, 5),
        worstPerformers: sortedStates.slice(-5).reverse(),
        regularityData: mockStates,
        continuityData: mockStates,
      }
    }

    //
    return {
      level,
      entityId,
      kpis: mockCentralKPIs,
      mapData: [],
      demandSupply: mockDemandSupply,
      topPerformers: [],
      worstPerformers: [],
      regularityData: [],
      continuityData: [],
    }
  },
}
