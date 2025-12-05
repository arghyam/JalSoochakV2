import type { WaterNormCategory } from '@/shared/constants/state-admin'

export interface WaterNorm {
  category: WaterNormCategory
  lpcd: number
}

export interface WaterNormsConfig {
  tenantId: string
  norms: WaterNorm[]
  updatedAt: string
}

export interface UpdateWaterNormsRequest {
  tenantId: string
  norms: WaterNorm[]
}

export interface WaterNormFormData {
  category: WaterNormCategory
  lpcd: number
}
