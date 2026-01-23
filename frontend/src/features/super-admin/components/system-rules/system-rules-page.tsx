import { useState, useEffect } from 'react'
import { Box, Text, Button, Flex, HStack, Grid } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import {
  getMockSystemRulesConfiguration,
  saveMockSystemRulesConfiguration,
} from '../../services/mock-data'
import type { SystemRulesConfiguration } from '../../types/system-rules'
import {
  COVERAGE_OPTIONS,
  CONTINUITY_OPTIONS,
  QUANTITY_OPTIONS,
  REGULARITY_OPTIONS,
} from '../../types/system-rules'
import { useToast } from '@/shared/hooks/use-toast'
import { ToastContainer, SearchableSelect } from '@/shared/components/common'

export function SystemRulesPage() {
  const { t } = useTranslation(['super-admin', 'common'])
  const [config, setConfig] = useState<SystemRulesConfiguration | null>(null)
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
      const data = await getMockSystemRulesConfiguration()
      setConfig(data)
      setCoverage(data.coverage)
      setContinuity(data.continuity)
      setQuantity(data.quantity)
      setRegularity(data.regularity)
    } catch (error) {
      console.error('Failed to fetch system rules configuration:', error)
      toast.addToast(t('common:toast.failedToLoad'), 'error')
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
      toast.addToast(t('common:toast.fillAllFields'), 'error')
      return
    }

    setIsSaving(true)
    try {
      const savedConfig = await saveMockSystemRulesConfiguration({
        coverage,
        continuity,
        quantity,
        regularity,
        isConfigured: true,
      })
      setConfig(savedConfig)
      toast.addToast(t('common:toast.changesSaved'), 'success')
    } catch (error) {
      console.error('Failed to save system rules configuration:', error)
      toast.addToast(t('common:toast.failedToSave'), 'error')
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

  const isFormValid = coverage && continuity && quantity && regularity

  if (isLoading) {
    return (
      <Box w="full">
        <Text textStyle="h5">{t('systemRules.title')}</Text>
        <Text color="neutral.600">{t('common:loading')}</Text>
      </Box>
    )
  }

  return (
    <Box w="full">
      {/* Page Header */}
      <Box mb={5}>
        <Text textStyle="h5">{t('systemRules.title')}</Text>
      </Box>

      {/* Configuration Card */}
      <Box
        bg="white"
        borderWidth="0.5px"
        borderColor="neutral.200"
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
            <Text textStyle="h8">{t('systemRules.configurationSettings')}</Text>

            {/* Form Fields Grid - 2x2 Layout */}
            <Grid templateColumns="repeat(2, 1fr)" gap={7}>
              {/* Coverage */}
              <Box
                borderWidth="0.5px"
                borderColor="neutral.200"
                borderRadius="12px"
                bg="neutral.50"
                py={6}
                px={4}
              >
                <Text textStyle="h8" mb={1}>
                  {t('systemRules.coverage.title')}
                </Text>
                <Text fontSize="14px" mb={4}>
                  {t('systemRules.coverage.description')}
                </Text>
                <SearchableSelect
                  options={COVERAGE_OPTIONS}
                  value={coverage}
                  onChange={setCoverage}
                  placeholder={t('common:select')}
                  width="100%"
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
              >
                <Text textStyle="h8" mb={1}>
                  {t('systemRules.continuity.title')}
                </Text>
                <Text fontSize="14px" mb={4}>
                  {t('systemRules.continuity.description')}
                </Text>
                <SearchableSelect
                  options={CONTINUITY_OPTIONS}
                  value={continuity}
                  onChange={setContinuity}
                  placeholder={t('common:select')}
                  width="100%"
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
              >
                <Text textStyle="h8" mb={1}>
                  {t('systemRules.quantity.title')}
                </Text>
                <Text fontSize="14px" mb={4}>
                  {t('systemRules.quantity.description')}
                </Text>
                <SearchableSelect
                  options={QUANTITY_OPTIONS}
                  value={quantity}
                  onChange={setQuantity}
                  placeholder={t('common:select')}
                  width="100%"
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
              >
                <Text textStyle="h8" mb={1}>
                  {t('systemRules.regularity.title')}
                </Text>
                <Text fontSize="14px" mb={4}>
                  {t('systemRules.regularity.description')}
                </Text>
                <SearchableSelect
                  options={REGULARITY_OPTIONS}
                  value={regularity}
                  onChange={setRegularity}
                  placeholder={t('common:select')}
                  width="100%"
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
              {t('common:button.cancel')}
            </Button>
            <Button
              variant="primary"
              size="md"
              width="174px"
              onClick={handleSave}
              isLoading={isSaving}
              isDisabled={!isFormValid || !hasChanges}
            >
              {t('common:button.save')}
            </Button>
          </HStack>
        </Flex>
      </Box>

      {/* Toast Container */}
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />
    </Box>
  )
}
