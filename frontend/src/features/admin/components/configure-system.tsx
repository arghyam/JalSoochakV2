import { VStack, Heading, Text } from '@chakra-ui/react'

export function ConfigureSystem() {
  return (
    <VStack spacing={6} align="start">
      <Heading fontSize="3xl" fontWeight="bold">
        Configure System
      </Heading>

      <Text color="gray.600">System configuration settings.</Text>
    </VStack>
  )
}
