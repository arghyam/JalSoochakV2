import { useState } from 'react'
import { VStack, FormControl, FormLabel, Input, Text, Button, HStack } from '@chakra-ui/react'
import { Dialog } from '@/shared/components/common'
import type { WaterNorm } from '../../types/water-norm'
import { WATER_NORM_CATEGORY_LABELS } from '@/shared/constants/state-admin'

interface WaterNormEditDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (norm: WaterNorm) => void
  waterNorm: WaterNorm
  isLoading?: boolean
}

export function WaterNormEditDialog({
  open,
  onClose,
  onSubmit,
  waterNorm,
  isLoading = false,
}: WaterNormEditDialogProps) {
  const [lpcd, setLpcd] = useState(waterNorm.lpcd)
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!lpcd || lpcd <= 0) {
      setError('LPCD must be greater than 0')
      return
    }

    onSubmit({ category: waterNorm.category, lpcd })
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={`Edit ${WATER_NORM_CATEGORY_LABELS[waterNorm.category]} Water Norm`}
    >
      <VStack as="form" spacing={4} align="stretch" onSubmit={handleSubmit}>
        <FormControl>
          <FormLabel>
            LPCD (Litres Per Capita Per Day){' '}
            <Text as="span" color="red.500">
              *
            </Text>
          </FormLabel>

          <Input
            id="lpcd"
            type="number"
            value={lpcd}
            onChange={(e) => {
              setLpcd(Number(e.target.value))
              setError('')
            }}
            placeholder="e.g., 55"
            min={1}
            step={1}
            isDisabled={isLoading}
          />

          {error && (
            <Text mt={1} fontSize="sm" color="red.600">
              {error}
            </Text>
          )}
        </FormControl>

        <HStack justify="flex-end" spacing={3} pt={4}>
          <Button variant="outline" onClick={onClose} isDisabled={isLoading}>
            Cancel
          </Button>

          <Button type="submit" colorScheme="blue" isDisabled={isLoading} isLoading={isLoading}>
            {isLoading ? 'Saving...' : 'Save'}
          </Button>
        </HStack>
      </VStack>
    </Dialog>
  )
}
