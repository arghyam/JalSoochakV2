import { useState } from 'react'
import {
  Box,
  Flex,
  Text,
  Heading,
  VStack,
  Grid,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Select,
  Button,
} from '@chakra-ui/react'
import { ToastContainer } from '@/shared/components/common'
import { useToast } from '@/shared/hooks/use-toast'
import { useTenants } from '../hooks/use-tenants'
import { useCreateStateAdmin } from '../hooks/use-state-admins'
import type { StateAdminFormData } from '../types/state-admin'

export function StateAdminManagement() {
  const { data: tenants = [], isLoading: tenantsLoading } = useTenants()
  const createStateAdmin = useCreateStateAdmin()
  const toast = useToast()

  const [formData, setFormData] = useState<StateAdminFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    tenantId: '',
    password: '',
    confirmPassword: '',
  })

  const [errors, setErrors] = useState<Partial<Record<keyof StateAdminFormData, string>>>({})

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof StateAdminFormData, string>> = {}

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'

    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = 'Please enter a valid email address'

    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
    else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Phone must be 10 digits'

    if (!formData.tenantId) newErrors.tenantId = 'Please select a state/UT'

    if (!formData.password) newErrors.password = 'Password is required'
    else if (formData.password.length < 6)
      newErrors.password = 'Password must be at least 6 characters'

    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password'
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (field: keyof StateAdminFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    try {
      await createStateAdmin.mutateAsync({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        tenantId: formData.tenantId,
        password: formData.password,
      })

      toast.success('State admin account created successfully')

      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        tenantId: '',
        password: '',
        confirmPassword: '',
      })
      setErrors({})
    } catch {
      toast.error('Failed to create state admin account')
    }
  }

  const activeTenants = tenants.filter((t) => t.status === 'active')

  if (tenantsLoading) {
    return (
      <Flex h="64" align="center" justify="center">
        <Text color="gray.600">Loading...</Text>
      </Flex>
    )
  }

  return (
    <VStack spacing={6} align="stretch">
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />

      <Box>
        <Heading fontSize="3xl" fontWeight="bold">
          State Admin Management
        </Heading>
        <Text mt={1} color="gray.600">
          Create a new state system administrator account
        </Text>
      </Box>

      <Box maxW="2xl" rounded="lg" bg="white" p={6} boxShadow="sm">
        <VStack as="form" onSubmit={handleSubmit} spacing={5} align="stretch">
          <Grid templateColumns="repeat(2, 1fr)" gap={4}>
            <FormControl isInvalid={!!errors.firstName}>
              <FormLabel>
                First Name{' '}
                <Text as="span" color="red.500">
                  *
                </Text>
              </FormLabel>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                placeholder="Enter first name"
                isDisabled={createStateAdmin.isPending}
              />
              {errors.firstName && <FormErrorMessage>{errors.firstName}</FormErrorMessage>}
            </FormControl>

            <FormControl isInvalid={!!errors.lastName}>
              <FormLabel>
                Last Name{' '}
                <Text as="span" color="red.500">
                  *
                </Text>
              </FormLabel>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                placeholder="Enter last name"
                isDisabled={createStateAdmin.isPending}
              />
              {errors.lastName && <FormErrorMessage>{errors.lastName}</FormErrorMessage>}
            </FormControl>
          </Grid>

          <FormControl isInvalid={!!errors.email}>
            <FormLabel>
              Email{' '}
              <Text as="span" color="red.500">
                *
              </Text>
            </FormLabel>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="admin@example.gov.in"
              isDisabled={createStateAdmin.isPending}
            />
            {errors.email && <FormErrorMessage>{errors.email}</FormErrorMessage>}
          </FormControl>

          <FormControl isInvalid={!!errors.phone}>
            <FormLabel>
              Phone Number{' '}
              <Text as="span" color="red.500">
                *
              </Text>
            </FormLabel>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              maxLength={10}
              onChange={(e) => handleChange('phone', e.target.value.replace(/\D/g, ''))}
              placeholder="9876543210"
              isDisabled={createStateAdmin.isPending}
            />
            {errors.phone && <FormErrorMessage>{errors.phone}</FormErrorMessage>}
            <Text mt={1} fontSize="xs" color="gray.500">
              Enter 10-digit phone number
            </Text>
          </FormControl>

          <FormControl isInvalid={!!errors.tenantId}>
            <FormLabel>
              State/Union Territory{' '}
              <Text as="span" color="red.500">
                *
              </Text>
            </FormLabel>
            <Select
              id="tenantId"
              value={formData.tenantId}
              onChange={(e) => handleChange('tenantId', e.target.value)}
              isDisabled={createStateAdmin.isPending}
            >
              <option value="">Select a state/UT</option>
              {activeTenants.map((tenant) => (
                <option key={tenant.id} value={tenant.name}>
                  {tenant.name} ({tenant.code})
                </option>
              ))}
            </Select>
            {errors.tenantId && <FormErrorMessage>{errors.tenantId}</FormErrorMessage>}
          </FormControl>

          <FormControl isInvalid={!!errors.password}>
            <FormLabel>
              Password{' '}
              <Text as="span" color="red.500">
                *
              </Text>
            </FormLabel>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              placeholder="Enter password"
              isDisabled={createStateAdmin.isPending}
            />
            {errors.password && <FormErrorMessage>{errors.password}</FormErrorMessage>}
            <Text mt={1} fontSize="xs" color="gray.500">
              Minimum 6 characters
            </Text>
          </FormControl>

          <FormControl isInvalid={!!errors.confirmPassword}>
            <FormLabel>
              Confirm Password{' '}
              <Text as="span" color="red.500">
                *
              </Text>
            </FormLabel>
            <Input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              placeholder="Re-enter password"
              isDisabled={createStateAdmin.isPending}
            />
            {errors.confirmPassword && (
              <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
            )}
          </FormControl>

          <Flex justify="flex-end" pt={4}>
            <Button
              type="submit"
              colorScheme="blue"
              px={6}
              isDisabled={createStateAdmin.isPending}
              isLoading={createStateAdmin.isPending}
            >
              {createStateAdmin.isPending ? 'Creating Account...' : 'Create Account'}
            </Button>
          </Flex>
        </VStack>
      </Box>
    </VStack>
  )
}
