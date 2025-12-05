import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { waterNormMockService } from '../services/mock/water-norm-mock'
import type { WaterNormsConfig, UpdateWaterNormsRequest } from '../types/water-norm'

const QUERY_KEY = ['waterNorms']

export function useWaterNorms(tenantId: string) {
  return useQuery<WaterNormsConfig>({
    queryKey: [...QUERY_KEY, tenantId],
    queryFn: () => waterNormMockService.getWaterNorms(tenantId),
    enabled: !!tenantId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useUpdateWaterNorms() {
  const queryClient = useQueryClient()

  return useMutation<WaterNormsConfig, Error, UpdateWaterNormsRequest>({
    mutationFn: (data) => waterNormMockService.updateWaterNorms(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEY, variables.tenantId] })
    },
  })
}
