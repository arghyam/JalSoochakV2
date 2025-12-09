import { useMutation, useQueryClient } from '@tanstack/react-query'
import { stateAdminMockService } from '../services/mock/state-admin-mock'
import type { StateAdmin, CreateStateAdminRequest } from '../types/state-admin'

const QUERY_KEY = ['stateAdmins']

export function useCreateStateAdmin() {
  const queryClient = useQueryClient()

  return useMutation<StateAdmin, Error, CreateStateAdminRequest>({
    mutationFn: (data) => stateAdminMockService.createStateAdmin(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
  })
}
