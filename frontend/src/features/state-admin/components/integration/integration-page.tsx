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
  }, [])

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
      <Box mb={5}>
        <Text textStyle="h5">Integrations</Text>
      </Box>

      {/* Integration Configuration Card */}
      <Box
        bg="white"
        borderWidth="0.5px"
        borderColor="neutral.100"
        borderRadius="12px"
        w="full"
        h="600px"
        py={6}
        px={4}
      >
        <Flex direction="column" w="full" h="full" justify="space-between">
          <Flex direction="column" gap={4}>
            <Text textStyle="h8">Whatsapp Details</Text>
            {/* Form Fields */}
            <VStack align="stretch" spacing={3} flex={1}>
              <FormControl isRequired gap={1}>
                <FormLabel textStyle="h10" mb={0}>
                  Whatsapp Business Account Name
                </FormLabel>
                <Input
                  placeholder="Example: State Water Authority"
                  fontSize="14px"
                  fontWeight="400"
                  value={whatsappBusinessAccountName}
                  onChange={(e) => setWhatsappBusinessAccountName(e.target.value)}
                  size="md"
                  h="36px"
                  maxW="486px"
                  px={3}
                  py={2}
                  borderColor="neutral.300"
                  borderRadius="4px"
                  _hover={{ borderColor: 'neutral.400' }}
                  _focus={{ borderColor: 'primary.500', boxShadow: 'none' }}
                />
              </FormControl>

              <FormControl isRequired gap={1}>
                <FormLabel textStyle="h10" mb={0}>
                  Sender Phone Number
                </FormLabel>
                <Input
                  placeholder="+91"
                  fontSize="14px"
                  fontWeight="400"
                  value={senderPhoneNumber}
                  onChange={(e) => setSenderPhoneNumber(e.target.value)}
                  size="md"
                  h="36px"
                  maxW="486px"
                  px={3}
                  py={2}
                  borderColor="neutral.300"
                  borderRadius="4px"
                  _hover={{ borderColor: 'neutral.400' }}
                  _focus={{ borderColor: 'primary.500', boxShadow: 'none' }}
                />
              </FormControl>

              <FormControl isRequired gap={1}>
                <FormLabel textStyle="h10" mb={0}>
                  Whatsapp Business Account ID
                </FormLabel>
                <Input
                  placeholder="Enter"
                  fontSize="14px"
                  fontWeight="400"
                  value={whatsappBusinessAccountId}
                  onChange={(e) => setWhatsappBusinessAccountId(e.target.value)}
                  size="md"
                  h="36px"
                  maxW="486px"
                  px={3}
                  py={2}
                  borderColor="neutral.300"
                  borderRadius="4px"
                  _hover={{ borderColor: 'neutral.400' }}
                  _focus={{ borderColor: 'primary.500', boxShadow: 'none' }}
                />
              </FormControl>

              <FormControl isRequired gap={1}>
                <FormLabel textStyle="h10" mb={0}>
                  API Access Token/ API Key
                </FormLabel>
                <Input
                  placeholder="Enter"
                  fontSize="14px"
                  fontWeight="400"
                  type="password"
                  value={apiAccessToken}
                  onChange={(e) => setApiAccessToken(e.target.value)}
                  size="md"
                  h="36px"
                  maxW="486px"
                  px={3}
                  py={2}
                  borderColor="neutral.300"
                  borderRadius="4px"
                  _hover={{ borderColor: 'neutral.400' }}
                  _focus={{ borderColor: 'primary.500', boxShadow: 'none' }}
                />
              </FormControl>
            </VStack>
          </Flex>

          {/* Action Buttons */}
          <HStack spacing={3} justify="flex-end" mt={4}>
            <Button
              variant="secondary"
              size="md"
              width="174px"
              onClick={handleCancel}
              isDisabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              width="174px"
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
