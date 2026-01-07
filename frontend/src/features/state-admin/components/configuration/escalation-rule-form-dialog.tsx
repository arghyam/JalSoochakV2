import { useState } from 'react'
import {
  Box,
  VStack,
  HStack,
  Text,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  FormErrorMessage,
  IconButton,
} from '@chakra-ui/react'
import { DeleteIcon } from '@chakra-ui/icons'
import { Dialog } from '@/shared/components/common'
import type { EscalationRule, EscalationRuleFormData } from '../../types/escalation-rule'
import {
  CONDITION_TYPES,
  CONDITION_TYPE_LABELS,
  NOTIFY_ROLES,
  NOTIFY_ROLE_LABELS,
  type ConditionType,
  type NotifyRole,
} from '@/shared/constants/state-admin'

interface EscalationRuleFormDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: EscalationRuleFormData) => void
  rule?: EscalationRule | null
  isLoading?: boolean
}

function getInitialFormData(rule: EscalationRule | null | undefined): EscalationRuleFormData {
  if (rule) {
    return {
      conditionType: rule.condition.type,
      durationHours: rule.condition.durationHours,
      threshold: rule.condition.threshold,
      levels: rule.levels,
    }
  }
  return {
    conditionType: CONDITION_TYPES.NO_SUBMISSION,
    durationHours: 24,
    levels: [{ level: 1, notifyRole: NOTIFY_ROLES.SECTION_OFFICER }],
  }
}

export function EscalationRuleFormDialog({
  open,
  onClose,
  onSubmit,
  rule,
  isLoading = false,
}: EscalationRuleFormDialogProps) {
  const [formData, setFormData] = useState<EscalationRuleFormData>(() => getInitialFormData(rule))
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({})

  const handleConditionTypeChange = (type: ConditionType) => {
    setFormData((prev) => ({
      ...prev,
      conditionType: type,
      durationHours: type === CONDITION_TYPES.NO_SUBMISSION ? 24 : undefined,
      threshold: type === CONDITION_TYPES.THRESHOLD_BREACH ? 80 : undefined,
    }))
    setErrors({})
  }

  const handleAddLevel = () => {
    const newLevel = formData.levels.length + 1
    setFormData((prev) => ({
      ...prev,
      levels: [...prev.levels, { level: newLevel, notifyRole: NOTIFY_ROLES.SECTION_OFFICER }],
    }))
  }

  const handleRemoveLevel = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      levels: prev.levels
        .filter((_, i) => i !== index)
        .map((level, idx) => ({ ...level, level: idx + 1 })),
    }))
  }

  const handleLevelRoleChange = (index: number, role: NotifyRole) => {
    setFormData((prev) => ({
      ...prev,
      levels: prev.levels.map((level, i) => (i === index ? { ...level, notifyRole: role } : level)),
    }))
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (formData.conditionType === CONDITION_TYPES.NO_SUBMISSION && !formData.durationHours) {
      newErrors.durationHours = 'Duration is required for no submission condition'
    }

    if (formData.conditionType === CONDITION_TYPES.THRESHOLD_BREACH && !formData.threshold) {
      newErrors.threshold = 'Threshold is required for threshold breach condition'
    }

    if (formData.levels.length === 0) {
      newErrors.levels = 'At least one escalation level is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) onSubmit(formData)
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={rule ? 'Edit Escalation Rule' : 'Add Escalation Rule'}
      maxWidth="lg"
    >
      <VStack as="form" spacing={6} align="stretch" onSubmit={handleSubmit}>
        {/* Condition Section */}
        <VStack spacing={4} align="stretch">
          <Text fontSize="sm" fontWeight="semibold" color="gray.900">
            Condition
          </Text>

          <FormControl>
            <FormLabel>
              Condition Type{' '}
              <Text as="span" color="red.500">
                *
              </Text>
            </FormLabel>

            <Select
              value={formData.conditionType}
              onChange={(e) => handleConditionTypeChange(e.target.value as ConditionType)}
              isDisabled={isLoading}
            >
              {Object.values(CONDITION_TYPES).map((type) => (
                <option key={type} value={type}>
                  {CONDITION_TYPE_LABELS[type]}
                </option>
              ))}
            </Select>
          </FormControl>

          {formData.conditionType === CONDITION_TYPES.NO_SUBMISSION && (
            <FormControl isInvalid={!!errors.durationHours}>
              <FormLabel>
                Duration (Hours){' '}
                <Text as="span" color="red.500">
                  *
                </Text>
              </FormLabel>

              <Input
                type="number"
                value={formData.durationHours || ''}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, durationHours: Number(e.target.value) }))
                  setErrors((prev) => ({ ...prev, durationHours: undefined }))
                }}
                placeholder="e.g., 24"
                min={1}
                isDisabled={isLoading}
              />

              {errors.durationHours && <FormErrorMessage>{errors.durationHours}</FormErrorMessage>}
            </FormControl>
          )}

          {formData.conditionType === CONDITION_TYPES.THRESHOLD_BREACH && (
            <FormControl isInvalid={!!errors.threshold}>
              <FormLabel>
                Threshold (%){' '}
                <Text as="span" color="red.500">
                  *
                </Text>
              </FormLabel>

              <Input
                type="number"
                value={formData.threshold || ''}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, threshold: Number(e.target.value) }))
                  setErrors((prev) => ({ ...prev, threshold: undefined }))
                }}
                placeholder="e.g., 80"
                min={1}
                max={100}
                isDisabled={isLoading}
              />

              {errors.threshold && <FormErrorMessage>{errors.threshold}</FormErrorMessage>}
            </FormControl>
          )}
        </VStack>

        {/* Escalation Levels Section */}
        <VStack spacing={4} align="stretch">
          <HStack justify="space-between">
            <Text fontSize="sm" fontWeight="semibold" color="gray.900">
              Escalation Levels
            </Text>

            <Button
              variant="link"
              colorScheme="blue"
              onClick={handleAddLevel}
              isDisabled={isLoading}
            >
              + Add Level
            </Button>
          </HStack>

          <VStack spacing={3} align="stretch">
            {formData.levels.map((level, index) => (
              <HStack
                key={index}
                borderWidth="1px"
                borderRadius="md"
                p={3}
                align="center"
                spacing={3}
              >
                <Box flex="1">
                  <FormLabel fontSize="xs">Level {level.level} - Notify Role</FormLabel>

                  <Select
                    value={level.notifyRole}
                    onChange={(e) => handleLevelRoleChange(index, e.target.value as NotifyRole)}
                    isDisabled={isLoading}
                  >
                    {Object.values(NOTIFY_ROLES).map((role) => (
                      <option key={role} value={role}>
                        {NOTIFY_ROLE_LABELS[role]}
                      </option>
                    ))}
                  </Select>
                </Box>

                {formData.levels.length > 1 && (
                  <IconButton
                    aria-label="Remove level"
                    icon={<DeleteIcon />}
                    colorScheme="red"
                    variant="ghost"
                    onClick={() => handleRemoveLevel(index)}
                    isDisabled={isLoading}
                  />
                )}
              </HStack>
            ))}
          </VStack>

          {errors.levels && (
            <Text fontSize="sm" color="red.600">
              {errors.levels}
            </Text>
          )}
        </VStack>

        {/* Actions */}
        <HStack justify="flex-end" spacing={3} pt={4}>
          <Button variant="outline" onClick={onClose} isDisabled={isLoading}>
            Cancel
          </Button>

          <Button type="submit" colorScheme="blue" isDisabled={isLoading} isLoading={isLoading}>
            {isLoading ? 'Saving...' : rule ? 'Update' : 'Create'}
          </Button>
        </HStack>
      </VStack>
    </Dialog>
  )
}
