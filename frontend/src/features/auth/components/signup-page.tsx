import { useState } from 'react'
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Text,
} from '@chakra-ui/react'
import { AiOutlineEyeInvisible } from 'react-icons/ai'
import jalsoochakLogo from '@/assets/media/jalsoochak-logo.svg'
import jalImage from '@/assets/media/jal.jpg'

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
        px={{ base: 6, md: 12 }}
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
                <FormLabel textStyle="bodyText6" mb={0} fontSize="16px">
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
                  borderRadius="4px"
                  borderColor="gray.300"
                  fontSize="sm"
                  focusBorderColor="blue.500"
                />
              </FormControl>

              <FormControl mt="1.5rem">
                <FormLabel textStyle="bodyText6" mb={0}>
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
                    borderRadius="4px"
                    borderColor="gray.300"
                    fontSize="sm"
                    focusBorderColor="blue.500"
                    pr="36px"
                  />
                  <InputRightElement h="36px">
                    <Button
                      variant="ghost"
                      size="sm"
                      color="neutral.400"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      <AiOutlineEyeInvisible size={24} />
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <Flex align="center" justify="space-between" mt="2rem">
                <Checkbox
                  size="sm"
                  colorScheme="primary"
                  fontSize="16px"
                  color="neutral.950"
                  sx={{
                    _control: {
                      borderWidth: '1px',
                      _checked: {
                        bg: 'primary.500',
                        borderColor: 'primary.500',
                      },
                    },
                  }}
                >
                  Remember me
                </Checkbox>

                <Link fontSize="sm" color="primary.500">
                  Forgot password
                </Link>
              </Flex>

              <Button
                w="full"
                mt="2rem"
                fontSize="sm"
                fontWeight="medium"
                isDisabled={!userId || !password}
              >
                Log in
              </Button>
            </Box>
          </Flex>
        </Flex>
      </Flex>

      <Box
        w={{ base: '100%', md: '50%' }}
        position="relative"
        overflow="hidden"
        display={{ base: 'none', md: 'block' }}
        borderTopLeftRadius="60px"
        borderBottomLeftRadius="60px"
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
