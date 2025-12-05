import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { escalationRuleMockService } from '../services/mock/escalation-rule-mock'
import type {
  EscalationRulesConfig,
  EscalationRule,
  CreateEscalationRuleRequest,
  UpdateEscalationRuleRequest,
} from '../types/escalation-rule'

const QUERY_KEY = ['escalationRules']

export function useEscalationRules(tenantId: string) {
  return useQuery<EscalationRulesConfig>({
    queryKey: [...QUERY_KEY, tenantId],
    queryFn: () => escalationRuleMockService.getEscalationRules(tenantId),
    enabled: !!tenantId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useCreateEscalationRule() {
  const queryClient = useQueryClient()

  return useMutation<EscalationRule, Error, CreateEscalationRuleRequest>({
    mutationFn: (data) => escalationRuleMockService.createEscalationRule(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEY, variables.tenantId] })
    },
  })
}

export function useUpdateEscalationRule() {
  const queryClient = useQueryClient()

  return useMutation<EscalationRule, Error, UpdateEscalationRuleRequest>({
    mutationFn: (data) => escalationRuleMockService.updateEscalationRule(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEY, variables.tenantId] })
    },
  })
}

export function useDeleteEscalationRule() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, { id: string; tenantId: string }>({
    mutationFn: ({ id }) => escalationRuleMockService.deleteEscalationRule(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEY, variables.tenantId] })
    },
  })
}
