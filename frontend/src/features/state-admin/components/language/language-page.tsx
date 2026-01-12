import { useState, useEffect } from 'react'
import { Box, Text, Button, Flex, HStack } from '@chakra-ui/react'
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
      toast.addToast('Changes saved', 'success')
    } catch (error) {
      console.error('Failed to save language configuration:', error)
      toast.addToast('Failed to save changes', 'error')
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
          Language
        </Text>
        <Text color="neutral.600">Loading...</Text>
      </Box>
    )
  }

  return (
    <Box w="full">
      {/* Page Header */}
      <Box mb={6}>
        <Text fontSize="2xl" fontWeight="semibold" color="neutral.950">
          Language
        </Text>
      </Box>

      {/* Language Configuration Card */}
      <Box
        bg="white"
        borderWidth="0.5px"
        borderColor="neutral.100"
        borderRadius="12px"
        w="full"
        h="600px"
        pt="24px"
        pr="24px"
        pb="24px"
        pl="24px"
      >
        {/* Card Header */}
        <Flex justify="space-between" align="center" mb={6}>
          <Text fontSize="lg" color="neutral.950">
            Language Configuration
          </Text>
          {config?.isConfigured && !isEditing && (
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<EditIcon />}
              onClick={handleEdit}
              color="primary.500"
              _hover={{ bg: 'primary.50' }}
            />
          )}
        </Flex>

        {/* View Mode */}
        {!isEditing && config?.isConfigured ? (
          <Box w="full" h="full">
            <Flex gap={6} mb={4} justify="space-between">
              <Box w="486px" h="36px">
                <Text fontSize="sm" fontWeight="medium" color="neutral.700" mb={2}>
                  Primary Language
                </Text>
                <Text fontSize="md" color="neutral.950">
                  {getPrimaryLanguageLabel()}
                </Text>
              </Box>
              <Box w="486px" h="36px">
                <Text fontSize="sm" fontWeight="medium" color="neutral.700" mb={2}>
                  Secondary Language (optional)
                </Text>
                <Text fontSize="md" color="neutral.950">
                  {getSecondaryLanguageLabel() || '-'}
                </Text>
              </Box>
            </Flex>
          </Box>
        ) : (
          /* Edit Mode */
          <Flex direction="column" w="full" h="full" justify="space-between">
            <Flex gap={6} justify="space-between">
              <Box>
                <Text fontSize="sm" fontWeight="medium" color="neutral.950" mb={2}>
                  Primary Language*
                </Text>
                <SearchableSelect
                  options={AVAILABLE_LANGUAGES}
                  value={primaryLanguage}
                  onChange={setPrimaryLanguage}
                  placeholder="Select"
                  width="486px"
                />
              </Box>
              <Box>
                <Text fontSize="sm" fontWeight="medium" color="neutral.950" mb={2}>
                  Secondary Language (optional)
                </Text>
                <SearchableSelect
                  options={AVAILABLE_LANGUAGES}
                  value={secondaryLanguage}
                  onChange={setSecondaryLanguage}
                  placeholder="Select"
                  width="486px"
                />
              </Box>
            </Flex>

            {/* Action Buttons*/}
            <HStack spacing={3} justify="flex-end">
              {config?.isConfigured && (
                <Button variant="secondary" size="sm" onClick={handleCancel} isDisabled={isSaving}>
                  Cancel
                </Button>
              )}
              <Button
                variant="primary"
                size="sm"
                onClick={handleSave}
                isLoading={isSaving}
                isDisabled={!primaryLanguage}
              >
                {config?.isConfigured ? 'Save Changes' : 'Save'}
              </Button>
            </HStack>
          </Flex>
        )}
      </Box>

      {/* Toast Container */}
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />
    </Box>
  )
}
