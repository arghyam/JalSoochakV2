import { Box, Text } from '@chakra-ui/react'

export function ApiCredentialsPage() {
  return (
    <Box w="full">
      {/* Page Header */}
      <Box mb={5}>
        <Text textStyle="h5">API Credentials</Text>
      </Box>

      {/* Content Placeholder */}
      <Box
        bg="white"
        borderWidth="1px"
        borderColor="neutral.100"
        borderRadius="lg"
        boxShadow="default"
        p={6}
        minH="calc(100vh - 200px)"
      >
        <Text color="neutral.600">Coming soon...</Text>
      </Box>
    </Box>
  )
}
