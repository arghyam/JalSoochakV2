import { useEffect, useState } from 'react'
import {
  Box,
  Flex,
  Grid,
  Text,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Badge,
} from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'
import { BiKey } from 'react-icons/bi'
import { getMockApiCredentialsData, generateApiKey, sendApiKey } from '../../services/mock-data'
import { SearchableSelect } from '@/shared/components/common'
import type { ApiCredentialsData, ApiCredential } from '../../types/api-credentials'
import { STATUS_FILTER_OPTIONS } from '../../types/api-credentials'

export function ApiCredentialsPage() {
  const [data, setData] = useState<ApiCredentialsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [generatingKeyFor, setGeneratingKeyFor] = useState<string | null>(null)
  const [sendingKeyFor, setSendingKeyFor] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const fetchData = async () => {
      setIsLoading(true)
      try {
        const result = await getMockApiCredentialsData()
        if (isMounted) {
          setData(result)
        }
      } catch (err) {
        console.error('Failed to fetch API credentials data:', err)
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      isMounted = false
    }
  }, [])

  const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = String(date.getFullYear()).slice(-2)
    return `${day}-${month}-${year}`
  }

  const formatLastUsed = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = String(date.getFullYear()).slice(-2)
    let hours = date.getHours()
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const ampm = hours >= 12 ? 'pm' : 'am'
    hours = hours % 12 || 12
    return `${day}-${month}-${year}, ${hours}:${minutes}${ampm}`
  }

  const handleGenerateKey = async (credentialId: string) => {
    setGeneratingKeyFor(credentialId)
    try {
      const newKey = await generateApiKey(credentialId)
      setData((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          credentials: prev.credentials.map((cred) =>
            cred.id === credentialId ? { ...cred, apiKey: newKey } : cred
          ),
        }
      })
    } catch (err) {
      console.error('Failed to generate API key:', err)
    } finally {
      setGeneratingKeyFor(null)
    }
  }

  const handleSendKey = async (credentialId: string) => {
    setSendingKeyFor(credentialId)
    try {
      await sendApiKey(credentialId)
    } catch (err) {
      console.error('Failed to send API key:', err)
    } finally {
      setSendingKeyFor(null)
    }
  }

  const getStatusBadge = (status: ApiCredential['status']) => {
    const statusConfig = {
      active: {
        bg: '#E1FFEA',
        color: '#079455',
        label: 'Active',
      },
      inactive: {
        bg: '#FEE4E2',
        color: '#D92D20',
        label: 'Inactive',
      },
    }

    const config = statusConfig[status]
    return (
      <Badge
        bg={config.bg}
        color={config.color}
        px={2}
        py={0.5}
        borderRadius="16px"
        fontSize="12px"
        fontWeight="500"
        textTransform="capitalize"
        height="24px"
      >
        {config.label}
      </Badge>
    )
  }

  const filteredCredentials =
    data?.credentials.filter((cred) => {
      if (statusFilter !== 'all' && cred.status !== statusFilter) {
        return false
      }
      if (searchQuery && !cred.stateUtName.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }
      return true
    }) || []

  if (isLoading) {
    return (
      <Flex h="64" align="center" justify="center">
        <Text color="neutral.600">Loading...</Text>
      </Flex>
    )
  }

  if (!data) {
    return (
      <Flex h="64" align="center" justify="center">
        <Text color="neutral.600">No data available</Text>
      </Flex>
    )
  }

  return (
    <Box w="full">
      {/* Page Header */}
      <Flex justify="space-between" align="center" mb={5} h={12}>
        <Text textStyle="h5">API Credentials</Text>
      </Flex>

      {/* Search and Filter Row */}
      <Flex
        justify="space-between"
        align="center"
        mb={6}
        h={16}
        bg="white"
        py={4}
        px={6}
        borderRadius={3}
        border="0.5px"
        borderColor="neutral.200"
      >
        <InputGroup w="300px">
          <InputLeftElement
            pointerEvents="none"
            display="flex"
            alignItems="center"
            justifyContent="center"
            h="32px"
          >
            <SearchIcon color="neutral.400" boxSize={4} />
          </InputLeftElement>
          <Input
            placeholder="Search by State/UT name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            borderColor="neutral.300"
            borderRadius="8px"
            fontSize="14px"
            h="32px"
            _hover={{ borderColor: 'neutral.400' }}
            _focus={{ borderColor: 'primary.500', boxShadow: 'none' }}
            _placeholder={{ color: 'neutral.400' }}
          />
        </InputGroup>
        <SearchableSelect
          options={STATUS_FILTER_OPTIONS}
          value={statusFilter}
          onChange={setStatusFilter}
          placeholder="Status"
          width="140px"
          fontSize="14px"
          textColor="neutral.400"
          height="32px"
        />
      </Flex>

      {/* Credentials Grid */}
      <Grid templateColumns="repeat(2, 1fr)" gap={6}>
        {filteredCredentials.map((credential) => (
          <Box
            key={credential.id}
            bg="white"
            borderWidth="0.5px"
            borderColor="neutral.200"
            borderRadius="12px"
            boxShadow="default"
            py={6}
            px={4}
          >
            <Text textStyle="h8" mb={4}>
              {credential.stateUtName}
            </Text>

            <Flex align="center" gap={1} mb={3}>
              <BiKey />
              <Text fontSize="13px">{credential.apiKey}</Text>
            </Flex>

            {/* Details Grid */}
            <Grid templateColumns="1fr 1fr" gap={3} mb={3}>
              <Box>
                <Text fontSize="14px" mb={1}>
                  Last used:
                </Text>
                <Text fontSize="14px">{formatLastUsed(credential.lastUsed)}</Text>
              </Box>
              <Box>
                <Text fontSize="14px" mb={1}>
                  Created on:
                </Text>
                <Text fontSize="14px">{formatDate(credential.createdOn)}</Text>
              </Box>
              <Box>
                <Text fontSize="14px" mb={1}>
                  Next rotation:
                </Text>
                <Text fontSize="14px">{formatDate(credential.nextRotation)}</Text>
              </Box>
              <Box>
                <Text fontSize="14px" mb={1}>
                  State/UT Status:
                </Text>
                {getStatusBadge(credential.status)}
              </Box>
            </Grid>

            {/* Action Buttons */}
            <Flex gap={3}>
              <Button
                variant="secondary"
                size="md"
                flex={1}
                isLoading={generatingKeyFor === credential.id}
                onClick={() => handleGenerateKey(credential.id)}
              >
                Generate Key
              </Button>
              <Button
                variant="primary"
                size="md"
                flex={1}
                isLoading={sendingKeyFor === credential.id}
                onClick={() => handleSendKey(credential.id)}
              >
                Send Key
              </Button>
            </Flex>
          </Box>
        ))}
      </Grid>

      {/* Empty State */}
      {filteredCredentials.length === 0 && (
        <Flex
          h="200px"
          align="center"
          justify="center"
          bg="white"
          borderWidth="0.5px"
          borderColor="neutral.200"
          borderRadius="12px"
        >
          <Text color="neutral.600">No credentials found matching your filters</Text>
        </Flex>
      )}
    </Box>
  )
}
