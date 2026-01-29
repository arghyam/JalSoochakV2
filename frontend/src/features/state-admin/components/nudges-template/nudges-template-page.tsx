import { useState, useEffect } from 'react'
import { Box, Text, Button, Flex, VStack, Textarea, Tag } from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { getMockNudgeTemplates, updateMockNudgeTemplate } from '../../services/mock-data'
import type { NudgeTemplate } from '../../types/nudges'
import { useToast } from '@/shared/hooks/use-toast'
import { ToastContainer, SearchableSelect } from '@/shared/components/common'

interface LanguageOption {
  value: string
  label: string
}

const LANGUAGE_OPTIONS: LanguageOption[] = [
  { value: 'english', label: 'English' },
  { value: 'telugu', label: 'Telugu' },
]

interface TemplateState {
  selectedLanguage: string
  message: string
  originalMessage: string
}

export function NudgesTemplatePage() {
  const [templates, setTemplates] = useState<NudgeTemplate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [savingTemplateId, setSavingTemplateId] = useState<string | null>(null)
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('')
  const [templateStates, setTemplateStates] = useState<Record<string, TemplateState>>({})

  const toast = useToast()

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    setIsLoading(true)
    try {
      const data = await getMockNudgeTemplates()
      setTemplates(data)
      if (data.length > 0) {
        setSelectedTemplateId(data[0].id)
      }

      // Initialize state for each template with first available language
      const initialStates: Record<string, TemplateState> = {}
      data.forEach((template) => {
        const firstMessage = template.messages[0]
        if (firstMessage) {
          initialStates[template.id] = {
            selectedLanguage: firstMessage.language,
            message: firstMessage.message,
            originalMessage: firstMessage.message,
          }
        }
      })
      setTemplateStates(initialStates)
    } catch (error) {
      console.error('Failed to fetch nudge templates:', error)
      toast.addToast('Failed to load templates', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLanguageChange = (templateId: string, language: string) => {
    const template = templates.find((t) => t.id === templateId)
    if (!template) return

    setSelectedTemplateId(templateId)

    const messageForLanguage = template.messages.find((m) => m.language === language)
    if (messageForLanguage) {
      setTemplateStates((prev) => ({
        ...prev,
        [templateId]: {
          selectedLanguage: language,
          message: messageForLanguage.message,
          originalMessage: messageForLanguage.message,
        },
      }))
    }
  }

  const handleMessageChange = (templateId: string, message: string) => {
    setSelectedTemplateId(templateId)
    setTemplateStates((prev) => ({
      ...prev,
      [templateId]: {
        ...prev[templateId],
        message,
      },
    }))
  }

  const handleSave = async (templateId: string) => {
    const state = templateStates[templateId]
    if (!state?.message) {
      toast.addToast('Please enter a message', 'error')
      return
    }

    setSavingTemplateId(templateId)
    try {
      const updatedTemplate = await updateMockNudgeTemplate(templateId, {
        language: state.selectedLanguage,
        message: state.message,
      })

      // Update templates list
      setTemplates((prev) => prev.map((t) => (t.id === templateId ? updatedTemplate : t)))

      // Update template state with new original message
      setTemplateStates((prev) => ({
        ...prev,
        [templateId]: {
          ...prev[templateId],
          originalMessage: state.message,
        },
      }))

      toast.addToast('Changes saved successfully', 'success')
    } catch (error) {
      console.error('Failed to save nudge template:', error)
      toast.addToast('Failed to save changes', 'error')
    } finally {
      setSavingTemplateId(null)
    }
  }

  const handleTestSend = (templateId: string) => {
    const state = templateStates[templateId]
    if (!state) return
    // TODO: Implement actual test-send functionality when api is ready
    toast.addToast('Test message sent successfully', 'success')
  }

  const hasChanges = (templateId: string): boolean => {
    const state = templateStates[templateId]
    return state ? state.message !== state.originalMessage : false
  }

  const getAvailableLanguages = (template: NudgeTemplate): LanguageOption[] => {
    return LANGUAGE_OPTIONS.filter((opt) => template.messages.some((m) => m.language === opt.value))
  }

  if (isLoading) {
    return (
      <Box w="full">
        <Text textStyle="h5">Nudges Template</Text>
        <Text color="neutral.600">Loading...</Text>
      </Box>
    )
  }

  return (
    <Box w="full">
      {/* Page Header */}
      <Box mb={5}>
        <Text textStyle="h5">Nudges Template</Text>
      </Box>

      {/* Templates Container */}
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
        <VStack align="stretch" spacing={7}>
          {templates.map((template) => {
            const state = templateStates[template.id]
            const availableLanguages = getAvailableLanguages(template)
            const isSaving = savingTemplateId === template.id

            return (
              <Box key={template.id}>
                <Flex direction="column" gap={4}>
                  {/* Template Header */}
                  <Text textStyle="h8" color="neutral.950">
                    {template.name}
                  </Text>

                  {/* Content Section */}
                  <Flex gap={6} justify="space-between">
                    {/* Left Side - Language Select and Variables */}
                    <Box flex="0 0 auto" w="486px">
                      {/* Language Select */}
                      <Box mb={3}>
                        <Text textStyle="h10" mb={1}>
                          Language
                          <Text as="span" color="error.500">
                            *
                          </Text>
                        </Text>
                        <SearchableSelect
                          options={availableLanguages}
                          value={state?.selectedLanguage || ''}
                          onChange={(value) => handleLanguageChange(template.id, value)}
                          placeholder="Select language"
                          width="486px"
                          textStyle="h10"
                          borderColor="neutral.300"
                          borderRadius="4px"
                        />
                      </Box>

                      {/* Available Variables */}
                      <Box>
                        <Text textStyle="h10" mb={1}>
                          Available Variables
                        </Text>
                        <Flex gap={2} wrap="wrap">
                          {template.availableVariables.map((variable) => (
                            <Tag
                              key={variable}
                              size="md"
                              borderRadius="16px"
                              bg="primary.50"
                              color="primary.500"
                              fontSize="12px"
                              fontWeight="400"
                              px={2}
                              py={1}
                            >
                              {variable}
                            </Tag>
                          ))}
                        </Flex>
                      </Box>
                    </Box>

                    {/* Right Side - Message */}
                    <Box width="486px">
                      <Text textStyle="h10" mb={1}>
                        Message
                      </Text>
                      <Box position="relative" width="486px">
                        <Textarea
                          value={state?.message || ''}
                          onChange={(e) => handleMessageChange(template.id, e.target.value)}
                          onFocus={() => setSelectedTemplateId(template.id)}
                          placeholder="Enter message template"
                          fontSize="14px"
                          fontWeight="400"
                          width="486px"
                          height="124px"
                          borderColor="neutral.300"
                          borderRadius="6px"
                          resize="none"
                          pr={8}
                          _hover={{ borderColor: 'neutral.400' }}
                          _focus={{ borderColor: 'primary.500', boxShadow: 'none' }}
                          sx={{
                            '&::-webkit-scrollbar': {
                              display: 'none',
                            },
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none',
                          }}
                        />
                        <ChevronDownIcon
                          position="absolute"
                          right={3}
                          top="50%"
                          transform="translateY(-50%)"
                          boxSize={5}
                          color="neutral.400"
                          pointerEvents="none"
                        />
                      </Box>

                      {/* Action Buttons - Only show for selected template */}
                      {selectedTemplateId === template.id && (
                        <Flex justify="flex-end" gap={3} mt={2}>
                          <Button
                            variant="outline"
                            size="md"
                            width="174px"
                            onClick={() => handleTestSend(template.id)}
                            borderColor="primary.500"
                            color="primary.500"
                            _hover={{ bg: 'primary.50' }}
                          >
                            Test-Send
                          </Button>
                          <Button
                            variant="primary"
                            size="md"
                            width="174px"
                            onClick={() => handleSave(template.id)}
                            isLoading={isSaving}
                            isDisabled={!state?.message || !hasChanges(template.id)}
                          >
                            Save
                          </Button>
                        </Flex>
                      )}
                    </Box>
                  </Flex>
                </Flex>
              </Box>
            )
          })}
        </VStack>
      </Box>

      {/* Toast Container */}
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />
    </Box>
  )
}
