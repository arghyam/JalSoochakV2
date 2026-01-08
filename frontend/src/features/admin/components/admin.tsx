import { VStack, Heading, Text } from '@chakra-ui/react'

export function Admin() {
  return (
    <VStack spacing={6} align="start">
      <Heading fontSize="3xl" fontWeight="bold">
        Super System Admin
      </Heading>

      <Text color="gray.600">Super admin features will be implemented here.</Text>
    </VStack>
  )
}
