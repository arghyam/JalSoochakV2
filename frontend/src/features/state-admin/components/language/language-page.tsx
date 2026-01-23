import { useState, useEffect } from 'react'
import { Box, Text, Button, Flex, HStack } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { EditIcon } from '@chakra-ui/icons'
import {
  getMockLanguageConfiguration,
  saveMockLanguageConfiguration,
} from '../../services/mock-data'
import type { LanguageConfiguration } from '../../types/language'
import { AVAILABLE_LANGUAGES } from '../../types/language'
import { useToast } from '@/shared/hooks/use-toast'
import { ToastContainer, SearchableSelect } from '@/shared/components/common'

export function LanguagePage() {
  const { t } = useTranslation(['state-admin', 'common'])
  const [config, setConfig] = useState<LanguageConfiguration | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [primaryLanguage, setPrimaryLanguage] = useState('')
  const [secondaryLanguage, setSecondaryLanguage] = useState('')
  const toast = useToast()

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const data = await getMockLanguageConfiguration()
        setConfig(data)
        setPrimaryLanguage(data.primaryLanguage)
        setSecondaryLanguage(data.secondaryLanguage || '')
        setIsEditing(!data.isConfigured)
      } catch (error) {
        console.error('Failed to fetch language configuration:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchConfig()
  }, [])

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    if (config) {
      setPrimaryLanguage(config.primaryLanguage)
      setSecondaryLanguage(config.secondaryLanguage || '')
      setIsEditing(false)
    }
  }

  const handleSave = async () => {
    if (!primaryLanguage) {
      return
    }

    setIsSaving(true)
    try {
      const savedConfig = await saveMockLanguageConfiguration({
        primaryLanguage,
        secondaryLanguage: secondaryLanguage || undefined,
        isConfigured: true,
      })
      setConfig(savedConfig)
      setIsEditing(false)
      toast.addToast(t('common:toast.changesSavedShort'), 'success')
    } catch (error) {
      console.error('Failed to save language configuration:', error)
      toast.addToast(t('common:toast.failedToSave'), 'error')
    } finally {
      setIsSaving(false)
    }
  }

  const getPrimaryLanguageLabel = () => {
    const lang = AVAILABLE_LANGUAGES.find((l) => l.value === primaryLanguage)
    return lang ? lang.label : primaryLanguage
  }

  const getSecondaryLanguageLabel = () => {
    if (!secondaryLanguage) return ''
    const lang = AVAILABLE_LANGUAGES.find((l) => l.value === secondaryLanguage)
    return lang ? lang.label : secondaryLanguage
  }

  if (isLoading) {
    return (
      <Box w="full">
        <Text fontSize="2xl" fontWeight="semibold" color="neutral.950" mb={6}>
          {t('language.title')}
        </Text>
        <Text color="neutral.600">{t('common:loading')}</Text>
      </Box>
    )
  }

  return (
    <Box w="full">
      {/* Page Header */}
      <Box mb={5}>
        <Text textStyle="h5">{t('language.title')}</Text>
      </Box>

      {/* Language Configuration Card */}
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
        <Flex direction="column" w="full" h="full" justify="space-between">
          {/* Card Header */}
          <Flex justify="space-between" align="center" mb={4}>
            <Text textStyle="h8">{t('language.configuration')}</Text>
            {config?.isConfigured && !isEditing && (
              <Button
                variant="ghost"
                h={6}
                w={6}
                minW={6}
                pl="2px"
                pr="2px"
                onClick={handleEdit}
                color="neutral.950"
                _hover={{ bg: 'primary.50', color: 'primary.500' }}
                aria-label={t('language.aria.editConfiguration')}
              >
                <EditIcon h={5} w={5} />
              </Button>
            )}
          </Flex>

          {/* View Mode */}
          {!isEditing && config?.isConfigured ? (
            <Box w="full" h="full" minH="calc(100vh - 250px)">
              <Flex gap={6} mb={4} justify="space-between">
                <Box w="486px" h="36px">
                  <Text fontSize="sm" fontWeight="medium" color="neutral.700" mb={1}>
                    {t('language.primaryLanguage')}
                  </Text>
                  <Text fontSize="md" color="neutral.950">
                    {getPrimaryLanguageLabel()}
                  </Text>
                </Box>
                <Box w="486px" h="36px">
                  <Text fontSize="sm" fontWeight="medium" color="neutral.700" mb={1}>
                    {t('language.secondaryLanguage')}
                  </Text>
                  <Text fontSize="md" color="neutral.950">
                    {getSecondaryLanguageLabel() || '-'}
                  </Text>
                </Box>
              </Flex>
            </Box>
          ) : (
            /* Edit Mode */
            <Flex
              direction="column"
              w="full"
              h="full"
              justify="space-between"
              minH="calc(100vh - 250px)"
            >
              <Flex gap={6} justify="space-between">
                <Box w="486px">
                  <Text fontSize="sm" fontWeight="medium" color="neutral.950" mb={1}>
                    {t('language.primaryLanguage')}*
                  </Text>
                  <SearchableSelect
                    options={AVAILABLE_LANGUAGES}
                    value={primaryLanguage}
                    onChange={setPrimaryLanguage}
                    placeholder={t('common:select')}
                    width="486px"
                  />
                </Box>
                <Box w="486px">
                  <Text fontSize="sm" fontWeight="medium" color="neutral.950" mb={1}>
                    {t('language.secondaryLanguage')}
                  </Text>
                  <SearchableSelect
                    options={AVAILABLE_LANGUAGES}
                    value={secondaryLanguage}
                    onChange={setSecondaryLanguage}
                    placeholder={t('common:select')}
                    width="486px"
                  />
                </Box>
              </Flex>

              {/* Action Buttons*/}
              <HStack spacing={3} justify="flex-end">
                {config?.isConfigured && (
                  <Button
                    variant="secondary"
                    size="md"
                    width="174px"
                    onClick={handleCancel}
                    isDisabled={isSaving}
                  >
                    {t('common:button.cancel')}
                  </Button>
                )}
                <Button
                  variant="primary"
                  size="md"
                  width="174px"
                  onClick={handleSave}
                  isLoading={isSaving}
                  isDisabled={!primaryLanguage}
                >
                  {config?.isConfigured ? t('common:button.saveChanges') : t('common:button.save')}
                </Button>
              </HStack>
            </Flex>
          )}
        </Flex>
      </Box>

      {/* Toast Container */}
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />
    </Box>
  )
}
