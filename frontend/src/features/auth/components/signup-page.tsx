import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Image,
  Input,
  Link,
  Text,
  VStack,
} from '@chakra-ui/react'
import jalsoochakLogo from '@/assets/media/jalsoochak-logo.svg'
import jalImage from '@/assets/media/jal.jpg'

export function SignupPage() {
  return (
    <Flex minH="100vh" w="full" direction={{ base: 'column', md: 'row' }}>
      <Flex
        w={{ base: '100%', md: '50%' }}
        align="stretch"
        justify="flex-start"
        bg="white"
        px={{ base: 6, md: 12 }}
        py={{ base: 10, md: 8 }}
      >
        <Flex w="full" direction="column">
          <Box w="full" maxW="420px">
            <Image src={jalsoochakLogo} alt="JalSoochak logo" h="50px" mb={{ base: 10, md: 12 }} />
          </Box>

          <Flex flex="1" align="center" justify="center">
            <Box w="full" maxW="420px">
              <Heading size="md" mb={2}>
                Welcome
              </Heading>
              <Text color="gray.500" fontSize="sm" mb={8}>
                Please enter your details.
              </Text>

              <VStack spacing={4} align="stretch">
                <FormControl>
                  <FormLabel fontSize="sm">User ID</FormLabel>
                  <Input placeholder="Enter your user ID" />
                </FormControl>

                <FormControl>
                  <FormLabel fontSize="sm">Password sent via email</FormLabel>
                  <Input type="password" placeholder="Enter your password" />
                </FormControl>

                <Flex align="center" justify="space-between">
                  <Checkbox size="sm">Remember me</Checkbox>
                  <Link fontSize="sm" color="blue.500">
                    Forgot password
                  </Link>
                </Flex>

                <Button colorScheme="blue" w="full">
                  Log in
                </Button>
              </VStack>
            </Box>
          </Flex>
        </Flex>
      </Flex>

      <Box
        w={{ base: '100%', md: '50%' }}
        position="relative"
        overflow="hidden"
        display={{ base: 'none', md: 'block' }}
        borderTopLeftRadius={{ md: '80px' }}
        borderBottomLeftRadius={{ md: '80px' }}
      >
        <Image
          src={jalImage}
          alt="Water tap"
          w="full"
          h={{ base: '260px', md: '100vh' }}
          objectFit="cover"
        />
      </Box>
    </Flex>
  )
}
