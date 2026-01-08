import { type FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Flex, Text, Button, Input, FormControl, FormLabel } from '@chakra-ui/react'
import { useAuthStore } from '@/app/store'

export function LoginPage() {
  const navigate = useNavigate()
  const { login, loading, error } = useAuthStore()
  const [phoneNumber, setPhoneNumber] = useState('')
  const [password, setPassword] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)

  const validatePhoneNumber = (phone: string): boolean => {
    return /^\d{10}$/.test(phone)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLocalError(null)

    if (!validatePhoneNumber(phoneNumber)) {
      setLocalError('Phone number must be 10 digits')
      return
    }

    try {
      const redirectPath = await login({ phoneNumber, password })
      navigate(redirectPath, { replace: true })
    } catch (err) {
      console.error(err)
      setLocalError('Unable to login. Please try again.')
    }
  }

  return (
    <Flex minH="100vh" align="center" justify="center" bg="gray.50">
      <Box w="full" maxW="md" borderRadius="lg" borderWidth="1px" bg="white" p={8} boxShadow="sm">
        <Text fontSize="2xl" fontWeight="bold">
          Login
        </Text>

        <Box as="form" onSubmit={handleSubmit} mt={6}>
          <Flex direction="column" gap={4}>
            <FormControl>
              <FormLabel fontSize="sm" fontWeight="medium" color="gray.700">
                Phone Number
              </FormLabel>
              <Input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                placeholder="9876543210"
                maxLength={10}
                required
                mt={1}
                fontSize="sm"
                focusBorderColor="blue.500"
              />
            </FormControl>

            <FormControl>
              <FormLabel fontSize="sm" fontWeight="medium" color="gray.700">
                Password
              </FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                mt={1}
                fontSize="sm"
                focusBorderColor="blue.500"
              />
            </FormControl>

            {(localError || error) && (
              <Text fontSize="sm" color="red.600">
                {localError || error}
              </Text>
            )}

            <Button
              type="submit"
              isLoading={loading}
              loadingText="Signing in..."
              colorScheme="blue"
              mt={2}
              w="full"
              fontSize="sm"
              fontWeight="medium"
            >
              Sign in
            </Button>
          </Flex>
        </Box>
      </Box>
    </Flex>
  )
}
