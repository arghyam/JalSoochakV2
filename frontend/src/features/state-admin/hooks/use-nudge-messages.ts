import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { nudgeMessageMockService } from '../services/mock/nudge-message-mock'
import type {
  NudgeMessage,
  CreateNudgeMessageRequest,
  UpdateNudgeMessageRequest,
} from '../types/nudge-message'

const QUERY_KEY = ['nudgeMessages']

export function useNudgeMessages(tenantId: string) {
  return useQuery<NudgeMessage[]>({
    queryKey: [...QUERY_KEY, tenantId],
    queryFn: () => nudgeMessageMockService.getNudgeMessages(tenantId),
    enabled: !!tenantId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useCreateNudgeMessage() {
  const queryClient = useQueryClient()

  return useMutation<NudgeMessage, Error, CreateNudgeMessageRequest>({
    mutationFn: (data) => nudgeMessageMockService.createNudgeMessage(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEY, variables.tenantId] })
    },
  })
}

export function useUpdateNudgeMessage() {
  const queryClient = useQueryClient()

  return useMutation<NudgeMessage, Error, UpdateNudgeMessageRequest>({
    mutationFn: (data) => nudgeMessageMockService.updateNudgeMessage(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEY, variables.tenantId] })
    },
  })
}

export function useToggleNudgeMessageStatus() {
  const queryClient = useQueryClient()

  return useMutation<NudgeMessage, Error, { id: string; isActive: boolean; tenantId: string }>({
    mutationFn: ({ id, isActive }) =>
      nudgeMessageMockService.toggleNudgeMessageStatus(id, isActive),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEY, variables.tenantId] })
    },
  })
}

export function useDeleteNudgeMessage() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, { id: string; tenantId: string }>({
    mutationFn: ({ id }) => nudgeMessageMockService.deleteNudgeMessage(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEY, variables.tenantId] })
    },
  })
}
