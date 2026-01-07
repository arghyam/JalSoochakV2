import { useAuthStore } from '@/app/store'
import { Box, VStack, Heading, Text, Button, Grid, Flex } from '@chakra-ui/react'
import { useWaterNorms } from '../hooks/use-water-norms'
import { useEscalationRules } from '../hooks/use-escalation-rules'
import { useNudgeMessages } from '../hooks/use-nudge-messages'

export function StateAdminDashboard() {
  const user = useAuthStore((state) => state.user)
  const tenantId = user?.tenantId || ''

  const { data: waterNorms } = useWaterNorms(tenantId)
  const { data: escalationRules } = useEscalationRules(tenantId)
  const { data: nudgeMessages } = useNudgeMessages(tenantId)

  const handleSyncStaffUsers = () => {
    console.log('Sync Staff Users clicked')
  }

  return (
    <VStack spacing={6} align="stretch">
      <Box>
        <Heading fontSize="3xl" fontWeight="bold">
          Dashboard
        </Heading>
        <Text mt={1} color="gray.600">
          Welcome to {tenantId} State Admin Dashboard
        </Text>
      </Box>

      {/* Sync Button */}
      <Box bg="white" p={6} borderRadius="lg" boxShadow="sm">
        <Heading fontSize="lg" fontWeight="semibold" color="gray.900">
          Staff Management
        </Heading>

        <Text mt={1} fontSize="sm" color="gray.600">
          Synchronize staff users with the central database
        </Text>

        <Button mt={4} colorScheme="blue" size="sm" onClick={handleSyncStaffUsers}>
          Sync Staff Users
        </Button>
      </Box>

      {/* Quick Stats */}
      <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6}>
        {/* Water Norms */}
        <Box bg="white" p={6} borderRadius="lg" boxShadow="sm">
          <Flex align="center">
            <Box bg="blue.100" p={3} borderRadius="md" flexShrink={0}>
              <svg
                width="24"
                height="24"
                className="chakra-icon"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="#2563eb"
              >
                <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </Box>

            <Box ml={5} flex="1">
              <Text fontSize="sm" color="gray.500" isTruncated>
                Water Norms
              </Text>
              <Text fontSize="lg" fontWeight="semibold" color="gray.900">
                {waterNorms?.norms?.length ?? 0} Categories
              </Text>
            </Box>
          </Flex>
        </Box>

        {/* Escalation Rules */}
        <Box bg="white" p={6} borderRadius="lg" boxShadow="sm">
          <Flex align="center">
            <Box bg="yellow.100" p={3} borderRadius="md" flexShrink={0}>
              <svg
                width="24"
                height="24"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="#ca8a04"
              >
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </Box>

            <Box ml={5} flex="1">
              <Text fontSize="sm" color="gray.500" isTruncated>
                Escalation Rules
              </Text>
              <Text fontSize="lg" fontWeight="semibold" color="gray.900">
                {escalationRules?.rules?.length ?? 0} Rules
              </Text>
            </Box>
          </Flex>
        </Box>

        {/* Nudge Messages */}
        <Box bg="white" p={6} borderRadius="lg" boxShadow="sm">
          <Flex align="center">
            <Box bg="green.100" p={3} borderRadius="md" flexShrink={0}>
              <svg
                width="24"
                height="24"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="#16a34a"
              >
                <path d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </Box>

            <Box ml={5} flex="1">
              <Text fontSize="sm" color="gray.500" isTruncated>
                Nudge Messages
              </Text>
              <Text fontSize="lg" fontWeight="semibold" color="gray.900">
                {nudgeMessages?.filter((m) => m.isActive).length || 0} Active
              </Text>
            </Box>
          </Flex>
        </Box>
      </Grid>
    </VStack>
  )
}
