import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { tenantMockService } from '../services/mock/tenant-mock'
import type {
  Tenant,
  CreateTenantRequest,
  UpdateTenantRequest,
  ToggleTenantStatusRequest,
} from '../types/tenant'

const QUERY_KEY = ['tenants']

export function useTenants() {
  return useQuery<Tenant[]>({
    queryKey: QUERY_KEY,
    queryFn: () => tenantMockService.getTenants(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useTenantById(id: string) {
  return useQuery<Tenant | null>({
    queryKey: [...QUERY_KEY, id],
    queryFn: () => tenantMockService.getTenantById(id),
    enabled: !!id,
  })
}

export function useCreateTenant() {
  const queryClient = useQueryClient()

  return useMutation<Tenant, Error, CreateTenantRequest>({
    mutationFn: (data) => tenantMockService.createTenant(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
  })
}

export function useUpdateTenant() {
  const queryClient = useQueryClient()

  return useMutation<Tenant, Error, UpdateTenantRequest>({
    mutationFn: (data) => tenantMockService.updateTenant(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
  })
}

export function useToggleTenantStatus() {
  const queryClient = useQueryClient()

  return useMutation<Tenant, Error, ToggleTenantStatusRequest>({
    mutationFn: (data) => tenantMockService.toggleTenantStatus(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
  })
}

export function useDeleteTenant() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, string>({
    mutationFn: (id) => tenantMockService.deleteTenant(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
  })
}
