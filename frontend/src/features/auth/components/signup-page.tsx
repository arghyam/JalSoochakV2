import { useState } from 'react'
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Text,
} from '@chakra-ui/react'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import jalsoochakLogo from '@/assets/media/jalsoochak-logo.svg'
import jalImage from '@/assets/media/jalmain.jpg'

export function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')

  return (
    <Flex minH="100vh" w="full" direction={{ base: 'column', md: 'row' }}>
      <Flex
        w={{ base: '100%', md: '50%' }}
        align="stretch"
        justify="flex-start"
        bg="white"
        px={{ base: 10, md: 8 }}
        py={{ base: 10, md: 8 }}
      >
        <Flex w="full" direction="column">
          <Box w="full" maxW="420px">
            <Image src={jalsoochakLogo} alt="JalSoochak logo" h="50px" mb={{ base: 10, md: 12 }} />
          </Box>

          <Flex flex="1" align="center" justify="center">
            <Box w="360px" h="360px">
              <Text textStyle="h5" mb={3}>
                Welcome
              </Text>
              <Text textStyle="bodyText5" mb="3rem">
                Please enter your details.
              </Text>

              <FormControl>
                <FormLabel textStyle="bodyText6" mb="4px" fontSize="16px">
                  User ID{' '}
                  <Text as="span" color="red.500">
                    *
                  </Text>
                </FormLabel>
                <Input
                  placeholder="Enter your user ID"
                  autoComplete="off"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  h="36px"
                  px="12px"
                  py="8px"
                  borderRadius="4px"
                  borderColor="neutral.300"
                  _placeholder={{ color: 'neutral.300' }}
                  fontSize="sm"
                  focusBorderColor="primary.500"
                />
              </FormControl>

              <FormControl mt="1.5rem">
                <FormLabel textStyle="bodyText6" mb="4px">
                  Password sent via email{' '}
                  <Text as="span" color="red.500">
                    *
                  </Text>
                </FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    h="36px"
                    px="12px"
                    py="8px"
                    borderRadius="4px"
                    borderColor="neutral.300"
                    fontSize="sm"
                    _placeholder={{ color: 'neutral.300' }}
                    focusBorderColor="primary.500"
                    pr="36px"
                  />
                  <InputRightElement h="36px">
                    <Button
                      variant="unstyled"
                      size="sm"
                      color="neutral.400"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      _hover={{ bg: 'transparent' }}
                      _active={{ bg: 'transparent' }}
                    >
                      {showPassword ? (
                        <AiOutlineEye size="16px" />
                      ) : (
                        <AiOutlineEyeInvisible size="16px" />
                      )}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <Button
                w="full"
                mt="2rem"
                fontSize="16px"
                fontWeight="600"
                isDisabled={!userId || !password}
              >
                Sign up
              </Button>
            </Box>
          </Flex>
        </Flex>
      </Flex>

      <Box
        w={{ base: '100%', md: '50%' }}
        h={{ base: '260px', md: '100vh' }}
        position="relative"
        overflow="hidden"
        display={{ base: 'none', md: 'block' }}
        borderTopLeftRadius="60px"
        borderBottomLeftRadius="60px"
      >
        <Image
          src={jalImage}
          alt="Water tap"
          w="100%"
          h="100%"
          objectFit="cover"
          objectPosition="center right"
        />
      </Box>
    </Flex>
  )
}
