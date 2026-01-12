import { useState, useEffect } from 'react'
import {
  Box,
  Text,
  Button,
  Flex,
  Input,
  VStack,
  HStack,
  FormControl,
  FormLabel,
} from '@chakra-ui/react'
import {
  getMockIntegrationConfiguration,
  saveMockIntegrationConfiguration,
} from '../../services/mock-data'
import type { IntegrationConfiguration } from '../../types/integration'
import { useToast } from '@/shared/hooks/use-toast'
import { ToastContainer } from '@/shared/components/common'

export function IntegrationPage() {
  const [config, setConfig] = useState<IntegrationConfiguration | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const [whatsappBusinessAccountName, setWhatsappBusinessAccountName] = useState('')
  const [senderPhoneNumber, setSenderPhoneNumber] = useState('')
  const [whatsappBusinessAccountId, setWhatsappBusinessAccountId] = useState('')
  const [apiAccessToken, setApiAccessToken] = useState('')

  const toast = useToast()

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const data = await getMockIntegrationConfiguration()
        setConfig(data)
        setWhatsappBusinessAccountName(data.whatsappBusinessAccountName)
        setSenderPhoneNumber(data.senderPhoneNumber)
        setWhatsappBusinessAccountId(data.whatsappBusinessAccountId)
        setApiAccessToken(data.apiAccessToken)
      } catch (error) {
        console.error('Failed to fetch integration configuration:', error)
        toast.addToast('Failed to load configuration', 'error')
      } finally {
        setIsLoading(false)
      }
    }

    fetchConfig()
  }, [toast])

  const handleCancel = () => {
    if (config) {
      setWhatsappBusinessAccountName(config.whatsappBusinessAccountName)
      setSenderPhoneNumber(config.senderPhoneNumber)
      setWhatsappBusinessAccountId(config.whatsappBusinessAccountId)
      setApiAccessToken(config.apiAccessToken)
    }
  }

  const handleSave = async () => {
    if (
      !whatsappBusinessAccountName ||
      !senderPhoneNumber ||
      !whatsappBusinessAccountId ||
      !apiAccessToken
    ) {
      toast.addToast('Please fill all required fields', 'error')
      return
    }

    setIsSaving(true)
    try {
      const savedConfig = await saveMockIntegrationConfiguration({
        whatsappBusinessAccountName,
        senderPhoneNumber,
        whatsappBusinessAccountId,
        apiAccessToken,
      })
      setConfig(savedConfig)
      toast.addToast('Changes saved', 'success')
    } catch (error) {
      console.error('Failed to save integration configuration:', error)
      toast.addToast('Failed to save changes', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  const hasChanges =
    config &&
    (whatsappBusinessAccountName !== config.whatsappBusinessAccountName ||
      senderPhoneNumber !== config.senderPhoneNumber ||
      whatsappBusinessAccountId !== config.whatsappBusinessAccountId ||
      apiAccessToken !== config.apiAccessToken)

  if (isLoading) {
    return (
      <Box w="full">
        <Text fontSize="2xl" fontWeight="semibold" color="neutral.950" mb={6}>
          Integration
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
          Integrations
        </Text>
      </Box>

      {/* Integration Configuration Card */}
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
        <Flex direction="column" w="full" h="full" justify="space-between">
          {/* Form Fields */}
          <VStack align="stretch" spacing={4} flex={1}>
            <FormControl isRequired>
              <FormLabel fontSize="sm" fontWeight="medium" color="neutral.950" mb={2}>
                Whatsapp Business Account Name
              </FormLabel>
              <Input
                placeholder="Example: State Water Authority"
                value={whatsappBusinessAccountName}
                onChange={(e) => setWhatsappBusinessAccountName(e.target.value)}
                size="md"
                h="36px"
                borderColor="neutral.300"
                borderRadius="6px"
                _hover={{ borderColor: 'neutral.400' }}
                _focus={{ borderColor: 'primary.500', boxShadow: 'none' }}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel fontSize="sm" fontWeight="medium" color="neutral.950" mb={2}>
                Sender Phone Number
              </FormLabel>
              <Input
                placeholder="+91"
                value={senderPhoneNumber}
                onChange={(e) => setSenderPhoneNumber(e.target.value)}
                size="md"
                h="36px"
                borderColor="neutral.300"
                borderRadius="6px"
                _hover={{ borderColor: 'neutral.400' }}
                _focus={{ borderColor: 'primary.500', boxShadow: 'none' }}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel fontSize="sm" fontWeight="medium" color="neutral.950" mb={2}>
                Whatsapp Business Account ID
              </FormLabel>
              <Input
                placeholder="Enter"
                value={whatsappBusinessAccountId}
                onChange={(e) => setWhatsappBusinessAccountId(e.target.value)}
                size="md"
                h="36px"
                borderColor="neutral.300"
                borderRadius="6px"
                _hover={{ borderColor: 'neutral.400' }}
                _focus={{ borderColor: 'primary.500', boxShadow: 'none' }}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel fontSize="sm" fontWeight="medium" color="neutral.950" mb={2}>
                API Access Token/ API Key
              </FormLabel>
              <Input
                placeholder="Enter"
                type="password"
                value={apiAccessToken}
                onChange={(e) => setApiAccessToken(e.target.value)}
                size="md"
                h="36px"
                borderColor="neutral.300"
                borderRadius="6px"
                _hover={{ borderColor: 'neutral.400' }}
                _focus={{ borderColor: 'primary.500', boxShadow: 'none' }}
              />
            </FormControl>
          </VStack>

          {/* Action Buttons */}
          <HStack spacing={3} justify="flex-end" mt={4}>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleCancel}
              isDisabled={isSaving || !hasChanges}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSave}
              isLoading={isSaving}
              isDisabled={
                !whatsappBusinessAccountName ||
                !senderPhoneNumber ||
                !whatsappBusinessAccountId ||
                !apiAccessToken ||
                !hasChanges
              }
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
