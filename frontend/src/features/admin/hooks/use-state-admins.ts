import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authApi } from '@/features/auth/services/auth-api'
import type { CreateStateAdminRequest } from '../types/state-admin'

const QUERY_KEY = ['stateAdmins']

export function useCreateStateAdmin() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, CreateStateAdminRequest>({
    mutationFn: async (data) => {
      await authApi.register({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phone,
        password: data.password,
        personType: 'state_admin',
        tenantId: data.tenantId,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
  })
}
