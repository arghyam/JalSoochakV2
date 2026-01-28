import { useState, useEffect } from 'react'
import { Box, Heading, Text, Button, Flex, HStack, SimpleGrid } from '@chakra-ui/react'
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

  useEffect(() => {
    document.title = `${t('systemRules.title')} | JalSoochak`
  }, [t])
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
        <Heading as="h1" size={{ base: 'h2', md: 'h1' }} mb={5}>
          {t('systemRules.title')}
        </Heading>
        <Flex role="status" aria-live="polite" align="center" justify="center" minH="200px">
          <Text color="neutral.600">{t('common:loading')}</Text>
        </Flex>
      </Box>
    )
  }

  return (
    <Box w="full">
      {/* Page Header */}
      <Box mb={5}>
        <Heading as="h1" size={{ base: 'h2', md: 'h1' }}>
          {t('systemRules.title')}
        </Heading>
      </Box>

      {/* Configuration Card */}
      <Box
        as="form"
        role="form"
        aria-label={t('systemRules.configurationSettings')}
        bg="white"
        borderWidth="0.5px"
        borderColor="neutral.200"
        borderRadius="12px"
        w="full"
        minH={{ base: 'auto', lg: 'calc(100vh - 148px)' }}
        py={6}
        px={{ base: 3, md: 4 }}
      >
        <Flex
          direction="column"
          w="full"
          h="full"
          justify="space-between"
          minH={{ base: 'auto', lg: 'calc(100vh - 200px)' }}
        >
          <Flex direction="column" gap={4}>
            {/* Card Header */}
            <Heading as="h2" size="h3" fontWeight="400">
              {t('systemRules.configurationSettings')}
            </Heading>

            {/* Form Fields Grid - Responsive Layout */}
            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={7}>
              {/* Coverage */}
              <Box
                as="fieldset"
                borderWidth="0.5px"
                borderColor="neutral.200"
                borderRadius="12px"
                bg="neutral.50"
                py={6}
                px={4}
              >
                <Heading as="h2" size="h3" fontWeight="400" mb={1}>
                  {t('systemRules.coverage.title')}
                </Heading>
                <Text fontSize="14px" mb={4} id="coverage-description">
                  {t('systemRules.coverage.description')}
                </Text>
                <SearchableSelect
                  options={COVERAGE_OPTIONS}
                  value={coverage}
                  onChange={setCoverage}
                  placeholder={t('common:select')}
                  width="100%"
                  aria-describedby="coverage-description"
                />
              </Box>

              {/* Continuity */}
              <Box
                as="fieldset"
                borderWidth="0.5px"
                borderColor="neutral.200"
                borderRadius="12px"
                bg="neutral.50"
                py={6}
                px={4}
              >
                <Heading as="h2" size="h3" fontWeight="400" mb={1}>
                  {t('systemRules.continuity.title')}
                </Heading>
                <Text fontSize="14px" mb={4} id="continuity-description">
                  {t('systemRules.continuity.description')}
                </Text>
                <SearchableSelect
                  options={CONTINUITY_OPTIONS}
                  value={continuity}
                  onChange={setContinuity}
                  placeholder={t('common:select')}
                  width="100%"
                  aria-describedby="continuity-description"
                />
              </Box>

              {/* Quantity (per capita) */}
              <Box
                as="fieldset"
                borderWidth="0.5px"
                borderColor="neutral.200"
                borderRadius="12px"
                bg="neutral.50"
                py={6}
                px={4}
              >
                <Heading as="h2" size="h3" fontWeight="400" mb={1}>
                  {t('systemRules.quantity.title')}
                </Heading>
                <Text fontSize="14px" mb={4} id="quantity-description">
                  {t('systemRules.quantity.description')}
                </Text>
                <SearchableSelect
                  options={QUANTITY_OPTIONS}
                  value={quantity}
                  onChange={setQuantity}
                  placeholder={t('common:select')}
                  width="100%"
                  aria-describedby="quantity-description"
                />
              </Box>

              {/* Regularity Threshold */}
              <Box
                as="fieldset"
                borderWidth="0.5px"
                borderColor="neutral.200"
                borderRadius="12px"
                bg="neutral.50"
                py={6}
                px={4}
              >
                <Heading as="h2" size="h3" fontWeight="400" mb={1}>
                  {t('systemRules.regularity.title')}
                </Heading>
                <Text fontSize="14px" mb={4} id="regularity-description">
                  {t('systemRules.regularity.description')}
                </Text>
                <SearchableSelect
                  options={REGULARITY_OPTIONS}
                  value={regularity}
                  onChange={setRegularity}
                  placeholder={t('common:select')}
                  width="100%"
                  aria-describedby="regularity-description"
                />
              </Box>
            </SimpleGrid>
          </Flex>

          {/* Action Buttons */}
          <HStack
            spacing={3}
            justify={{ base: 'stretch', sm: 'flex-end' }}
            mt={6}
            flexDirection={{ base: 'column', sm: 'row' }}
          >
            <Button
              variant="secondary"
              size="md"
              width={{ base: 'full', sm: '174px' }}
              onClick={handleCancel}
              isDisabled={isSaving || !hasChanges}
            >
              {t('common:button.cancel')}
            </Button>
            <Button
              variant="primary"
              size="md"
              width={{ base: 'full', sm: '174px' }}
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
