import { useState, useEffect } from 'react'
import { Box, Text, Button, Flex, VStack, Textarea, Tag } from '@chakra-ui/react'
import { getMockNudgeTemplates, updateMockNudgeTemplate } from '../../services/mock-data'
import type { NudgeTemplate } from '../../types/nudges'
import { useToast } from '@/shared/hooks/use-toast'
import { ToastContainer } from '@/shared/components/common'

export function NudgesTemplatePage() {
  const [templates, setTemplates] = useState<NudgeTemplate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('')
  const [message, setMessage] = useState('')

  const toast = useToast()

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    setIsLoading(true)
    try {
      const data = await getMockNudgeTemplates()
      setTemplates(data)
      // Select first template by default
      if (data.length > 0) {
        setSelectedTemplateId(data[0].id)
        setMessage(data[0].message)
      }
    } catch (error) {
      console.error('Failed to fetch nudge templates:', error)
      toast.addToast('Failed to load templates', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId)
    if (template) {
      setSelectedTemplateId(template.id)
      setMessage(template.message)
    }
  }

  const handleSave = async () => {
    if (!message) {
      toast.addToast('Please enter a message', 'error')
      return
    }

    const currentTemplate = templates.find((t) => t.id === selectedTemplateId)
    if (!currentTemplate) return

    setIsSaving(true)
    try {
      const updatedTemplate = await updateMockNudgeTemplate(selectedTemplateId, {
        language: currentTemplate.language,
        message,
      })

      // Update templates list
      setTemplates(templates.map((t) => (t.id === selectedTemplateId ? updatedTemplate : t)))
      toast.addToast('Changes saved successfully', 'success')
    } catch (error) {
      console.error('Failed to save nudge template:', error)
      toast.addToast('Failed to save changes', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  const handleTestSend = () => {
    // TODO: Implement actual test-send functionality when api is ready
    toast.addToast('Test message sent successfully', 'success')
  }

  const currentTemplate = templates.find((t) => t.id === selectedTemplateId)
  const hasChanges = currentTemplate && message !== currentTemplate.message

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
          {templates.map((template) => (
            <Box key={template.id}>
              <Flex direction="column" gap={4}>
                {/* Template Header */}
                <Text textStyle="h8" color="neutral.950">
                  {template.name}
                </Text>

                {/* Variables and Message Section */}
                <Flex gap={6} align="flex-start">
                  {/* Left Side - Variables */}
                  <Box flex="0 0 auto" w="400px">
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

                  {/* Right Side - Message */}
                  <Box flex="1">
                    <Text textStyle="h10" mb={1}>
                      Message
                    </Text>
                    <Textarea
                      value={selectedTemplateId === template.id ? message : template.message}
                      onChange={(e) => {
                        if (selectedTemplateId === template.id) {
                          setMessage(e.target.value)
                        } else {
                          handleTemplateSelect(template.id)
                          setMessage(e.target.value)
                        }
                      }}
                      onFocus={() => {
                        if (selectedTemplateId !== template.id) {
                          handleTemplateSelect(template.id)
                        }
                      }}
                      placeholder="Enter message template"
                      fontSize="14px"
                      fontWeight="400"
                      width="486px"
                      height="124px"
                      borderColor="neutral.300"
                      borderRadius="6px"
                      _hover={{ borderColor: 'neutral.400' }}
                      _focus={{ borderColor: 'primary.500', boxShadow: 'none' }}
                    />
                  </Box>
                </Flex>

                {/* Action Buttons - Only show for selected template */}
                {selectedTemplateId === template.id && (
                  <Flex justify="flex-end" gap={3} mt={2}>
                    <Button
                      variant="outline"
                      size="md"
                      width="174px"
                      onClick={handleTestSend}
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
                      onClick={handleSave}
                      isLoading={isSaving}
                      isDisabled={!message || !hasChanges}
                    >
                      Save
                    </Button>
                  </Flex>
                )}
              </Flex>
            </Box>
          ))}
        </VStack>
      </Box>

      {/* Toast Container */}
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />
    </Box>
  )
}
