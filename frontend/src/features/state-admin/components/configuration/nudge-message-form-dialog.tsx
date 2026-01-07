import { useState } from 'react'
import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Checkbox,
  Text,
  Button,
  FormErrorMessage,
  HStack,
} from '@chakra-ui/react'
import { Dialog } from '@/shared/components/common'
import type { NudgeMessage, NudgeMessageFormData } from '../../types/nudge-message'
import {
  MESSAGE_FREQUENCIES,
  MESSAGE_FREQUENCY_LABELS,
  NOTIFY_ROLES,
  NOTIFY_ROLE_LABELS,
  type MessageFrequency,
  type NotifyRole,
} from '@/shared/constants/state-admin'

interface NudgeMessageFormDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: NudgeMessageFormData) => void
  message?: NudgeMessage | null
  isLoading?: boolean
}

function getInitialFormData(message: NudgeMessage | null | undefined): NudgeMessageFormData {
  if (message) {
    return {
      title: message.title,
      message: message.message,
      targetRole: message.targetRole,
      frequency: message.frequency,
      isActive: message.isActive,
    }
  }
  return {
    title: '',
    message: '',
    targetRole: 'all',
    frequency: MESSAGE_FREQUENCIES.DAILY,
    isActive: true,
  }
}

export function NudgeMessageFormDialog({
  open,
  onClose,
  message,
  isLoading = false,
}: NudgeMessageFormDialogProps) {
  const [formData, setFormData] = useState<NudgeMessageFormData>(() => getInitialFormData(message))
  const [errors, setErrors] = useState<Partial<Record<keyof NudgeMessageFormData, string>>>({})

  const handleChange = (field: keyof NudgeMessageFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={message ? 'Edit Nudge Message' : 'Add Nudge Message'}
      maxWidth="lg"
    >
      <VStack as="form" spacing={4} align="stretch">
        <FormControl isInvalid={!!errors.title}>
          <FormLabel>
            Title{' '}
            <Text as="span" color="red.500">
              *
            </Text>
          </FormLabel>

          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="e.g., Daily Water Quality Report"
            isDisabled={isLoading}
          />

          {errors.title && <FormErrorMessage>{errors.title}</FormErrorMessage>}
        </FormControl>

        <FormControl isInvalid={!!errors.message}>
          <FormLabel>
            Message{' '}
            <Text as="span" color="red.500">
              *
            </Text>
          </FormLabel>

          <Textarea
            id="message"
            value={formData.message}
            onChange={(e) => handleChange('message', e.target.value)}
            rows={4}
            placeholder="Enter the nudge message content..."
            isDisabled={isLoading}
          />

          {errors.message && <FormErrorMessage>{errors.message}</FormErrorMessage>}
        </FormControl>

        <FormControl>
          <FormLabel>Target Role</FormLabel>

          <Select
            id="targetRole"
            value={formData.targetRole || 'all'}
            onChange={(e) => handleChange('targetRole', e.target.value as NotifyRole | 'all')}
            isDisabled={isLoading}
          >
            <option value="all">All Roles</option>

            {Object.values(NOTIFY_ROLES).map((role) => (
              <option key={role} value={role}>
                {NOTIFY_ROLE_LABELS[role]}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel>
            Frequency{' '}
            <Text as="span" color="red.500">
              *
            </Text>
          </FormLabel>

          <Select
            id="frequency"
            value={formData.frequency}
            onChange={(e) => handleChange('frequency', e.target.value as MessageFrequency)}
            isDisabled={isLoading}
          >
            {Object.values(MESSAGE_FREQUENCIES).map((freq) => (
              <option key={freq} value={freq}>
                {MESSAGE_FREQUENCY_LABELS[freq]}
              </option>
            ))}
          </Select>
        </FormControl>

        <HStack align="center">
          <Checkbox
            id="isActive"
            isChecked={formData.isActive}
            onChange={(e) => handleChange('isActive', e.target.checked)}
            isDisabled={isLoading}
          >
            Active
          </Checkbox>
        </HStack>

        <HStack justify="flex-end" spacing={3} pt={4}>
          <Button variant="outline" onClick={onClose} isDisabled={isLoading}>
            Cancel
          </Button>

          <Button type="submit" colorScheme="blue" isDisabled={isLoading} isLoading={isLoading}>
            {isLoading ? 'Saving...' : message ? 'Update' : 'Create'}
          </Button>
        </HStack>
      </VStack>
    </Dialog>
  )
}
