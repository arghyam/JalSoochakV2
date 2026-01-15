import { useState, useEffect } from 'react'
import { Box, Text, Button, Flex, HStack, Grid } from '@chakra-ui/react'
import {
  getMockThresholdConfiguration,
  saveMockThresholdConfiguration,
} from '../../services/mock-data'
import type { ThresholdConfiguration } from '../../types/thresholds'
import {
  COVERAGE_OPTIONS,
  CONTINUITY_OPTIONS,
  QUANTITY_OPTIONS,
  REGULARITY_OPTIONS,
} from '../../types/thresholds'
import { useToast } from '@/shared/hooks/use-toast'
import { ToastContainer, SearchableSelect } from '@/shared/components/common'

export function ThresholdsPage() {
  const [config, setConfig] = useState<ThresholdConfiguration | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Form state
  const [coverage, setCoverage] = useState('')
  const [continuity, setContinuity] = useState('')
  const [quantity, setQuantity] = useState('')
  const [regularity, setRegularity] = useState('')

  const toast = useToast()

  useEffect(() => {
    fetchConfiguration()
  }, [])

  const fetchConfiguration = async () => {
    setIsLoading(true)
    try {
      const data = await getMockThresholdConfiguration()
      setConfig(data)
      setCoverage(data.coverage)
      setContinuity(data.continuity)
      setQuantity(data.quantity)
      setRegularity(data.regularity)
    } catch (error) {
      console.error('Failed to fetch threshold configuration:', error)
      toast.addToast('Failed to load configuration', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    if (config) {
      setCoverage(config.coverage)
      setContinuity(config.continuity)
      setQuantity(config.quantity)
      setRegularity(config.regularity)
    }
  }

  const handleSave = async () => {
    if (!coverage || !continuity || !quantity || !regularity) {
      toast.addToast('Please fill all required fields', 'error')
      return
    }

    setIsSaving(true)
    try {
      const savedConfig = await saveMockThresholdConfiguration({
        coverage,
        continuity,
        quantity,
        regularity,
        isConfigured: true,
      })
      setConfig(savedConfig)
      toast.addToast('Changes saved successfully', 'success')
    } catch (error) {
      console.error('Failed to save threshold configuration:', error)
      toast.addToast('Failed to save changes', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  const hasChanges =
    config &&
    (coverage !== config.coverage ||
      continuity !== config.continuity ||
      quantity !== config.quantity ||
      regularity !== config.regularity)

  if (isLoading) {
    return (
      <Box w="full">
        <Text textStyle="h5">Alert Thresholds</Text>
        <Text color="neutral.600">Loading...</Text>
      </Box>
    )
  }

  return (
    <Box w="full">
      {/* Page Header */}
      <Box mb={5}>
        <Text textStyle="h5">Alert Thresholds</Text>
      </Box>

      {/* Configuration Card */}
      <Box
        bg="white"
        borderWidth="0.5px"
        borderColor="neutral.100"
        borderRadius="12px"
        w="full"
        minH="calc(100vh - 148px)"
        py={6}
        px={4}
      >
        <Flex
          direction="column"
          w="full"
          h="full"
          justify="space-between"
          minH="calc(100vh - 200px)"
        >
          <Flex direction="column" gap={4}>
            {/* Card Header */}
            <Text textStyle="h8">Configuration Settings</Text>

            {/* Form Fields Grid - 2x2 Layout */}
            <Grid templateColumns="repeat(2, 1fr)" gap={7} maxW="1200px">
              {/* Coverage */}
              <Box
                borderWidth="0.5px"
                borderColor="neutral.200"
                borderRadius="12px"
                bg="neutral.50"
                py={6}
                px={4}
                h="174px"
              >
                <Text textStyle="h8" mb={1}>
                  Coverage
                </Text>
                <Text fontSize="14px" mb={4}>
                  Minimum percentage of households that must have Functional Household Tap
                  Connections (FHTC) to avoid a coverage alert.
                </Text>
                <SearchableSelect
                  options={COVERAGE_OPTIONS}
                  value={coverage}
                  onChange={setCoverage}
                  placeholder="Select"
                  width="486px"
                />
              </Box>

              {/* Continuity */}
              <Box
                borderWidth="0.5px"
                borderColor="neutral.200"
                borderRadius="12px"
                bg="neutral.50"
                py={6}
                px={4}
                h="174px"
              >
                <Text textStyle="h8" mb={1}>
                  Continuity
                </Text>
                <Text fontSize="14px" mb={4}>
                  Maximum number of consecutive days with no data before triggering alert.
                </Text>
                <SearchableSelect
                  options={CONTINUITY_OPTIONS}
                  value={continuity}
                  onChange={setContinuity}
                  placeholder="Select"
                  width="486px"
                />
              </Box>

              {/* Quantity (per capita) */}
              <Box
                borderWidth="0.5px"
                borderColor="neutral.200"
                borderRadius="12px"
                bg="neutral.50"
                py={6}
                px={4}
                h="174px"
              >
                <Text textStyle="h8" mb={1}>
                  Quantity (per capita)
                </Text>
                <Text fontSize="14px" mb={4}>
                  Minimum water supply to avoid an alert.
                </Text>
                <SearchableSelect
                  options={QUANTITY_OPTIONS}
                  value={quantity}
                  onChange={setQuantity}
                  placeholder="Select"
                  width="486px"
                />
              </Box>

              {/* Regularity Threshold */}
              <Box
                borderWidth="0.5px"
                borderColor="neutral.200"
                borderRadius="12px"
                bg="neutral.50"
                py={6}
                px={4}
                h="174px"
              >
                <Text textStyle="h8" mb={1}>
                  Regularity Threshold
                </Text>
                <Text fontSize="14px" mb={4}>
                  Minimum percentage of expected data points per day to avoid an alert.
                </Text>
                <SearchableSelect
                  options={REGULARITY_OPTIONS}
                  value={regularity}
                  onChange={setRegularity}
                  placeholder="Select"
                  width="486px"
                />
              </Box>
            </Grid>
          </Flex>

          {/* Action Buttons */}
          <HStack spacing={3} justify="flex-end" mt={6}>
            <Button
              variant="secondary"
              size="md"
              width="174px"
              onClick={handleCancel}
              isDisabled={isSaving || !hasChanges}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              width="174px"
              onClick={handleSave}
              isLoading={isSaving}
              isDisabled={!coverage || !continuity || !quantity || !regularity || !hasChanges}
            >
              Save
            </Button>
          </HStack>
        </Flex>
      </Box>

      {/* Toast Container */}
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />
    </Box>
  )
}
