import { WATER_NORM_CATEGORIES } from '@/shared/constants/state-admin'
import type { WaterNormsConfig, UpdateWaterNormsRequest } from '../../types/water-norm'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Default water norms for a tenant
const mockWaterNormsConfig: WaterNormsConfig = {
  tenantId: 'tenant-1',
  norms: [
    { category: WATER_NORM_CATEGORIES.RURAL, lpcd: 55 },
    { category: WATER_NORM_CATEGORIES.URBAN, lpcd: 70 },
  ],
  updatedAt: new Date().toISOString(),
}

export const waterNormMockService = {
  getWaterNorms: async (tenantId: string): Promise<WaterNormsConfig> => {
    await delay(500)
    return { ...mockWaterNormsConfig, tenantId }
  },

  updateWaterNorms: async (data: UpdateWaterNormsRequest): Promise<WaterNormsConfig> => {
    await delay(500)
    mockWaterNormsConfig.norms = data.norms
    mockWaterNormsConfig.tenantId = data.tenantId
    mockWaterNormsConfig.updatedAt = new Date().toISOString()
    return { ...mockWaterNormsConfig }
  },
}
