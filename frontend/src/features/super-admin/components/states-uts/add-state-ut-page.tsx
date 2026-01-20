import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Text, Flex, Grid, Input, Button, HStack } from '@chakra-ui/react'
import { SearchableSelect, ToastContainer } from '@/shared/components/common'
import { useToast } from '@/shared/hooks/use-toast'
import { createStateUT, getAssignedStateNames } from '../../services/mock-data'
import { INDIAN_STATES_UTS } from '../../types/states-uts'
import { ROUTES } from '@/shared/constants/routes'

export function AddStateUTPage() {
  const navigate = useNavigate()
  const toast = useToast()

  const [isSaving, setIsSaving] = useState(false)
  const [assignedStates, setAssignedStates] = useState<string[]>([])

  // Form state
  const [stateName, setStateName] = useState('')
  const [stateCode, setStateCode] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [secondaryEmail, setSecondaryEmail] = useState('')
  const [contactNumber, setContactNumber] = useState('')

  useEffect(() => {
    // Get list of already assigned states
    const assigned = getAssignedStateNames()
    setAssignedStates(assigned)
  }, [])

  // Filter available states (exclude already assigned)
  const availableStates = useMemo(() => {
    return INDIAN_STATES_UTS.filter((state) => !assignedStates.includes(state.name)).map(
      (state) => ({
        value: state.name,
        label: state.name,
      })
    )
  }, [assignedStates])

  // Auto-fill state code when state is selected
  const handleStateChange = (value: string) => {
    setStateName(value)
    const selectedState = INDIAN_STATES_UTS.find((s) => s.name === value)
    setStateCode(selectedState?.code ?? '')
  }

  // Validation
  const isValidEmail = (emailStr: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(emailStr)
  }

  const isValidPhone = (phoneStr: string): boolean => {
    const phoneRegex = /^\d{10}$/
    return phoneRegex.test(phoneStr)
  }

  const isFormValid = useMemo(() => {
    const requiredFieldsValid =
      stateName !== '' &&
      firstName.trim() !== '' &&
      lastName.trim() !== '' &&
      email.trim() !== '' &&
      phone.trim() !== ''

    const emailValid = isValidEmail(email)
    const phoneValid = isValidPhone(phone)

    // Optional fields validation (if provided)
    const secondaryEmailValid = secondaryEmail === '' || isValidEmail(secondaryEmail)
    const contactNumberValid = contactNumber === '' || isValidPhone(contactNumber)

    return (
      requiredFieldsValid && emailValid && phoneValid && secondaryEmailValid && contactNumberValid
    )
  }, [stateName, firstName, lastName, email, phone, secondaryEmail, contactNumber])

  const handleCancel = () => {
    navigate(ROUTES.SUPER_ADMIN_STATES_UTS)
  }

  const handleSubmit = async () => {
    if (!isFormValid) {
      toast.addToast('Please fill all required fields correctly', 'error')
      return
    }

    setIsSaving(true)
    try {
      const newState = await createStateUT({
        name: stateName,
        code: stateCode,
        admin: {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          secondaryEmail: secondaryEmail.trim() || undefined,
          contactNumber: contactNumber.trim() || undefined,
        },
      })
      toast.addToast('State/UT added successfully', 'success')
      // Navigate to view page after short delay to show toast
      setTimeout(() => {
        navigate(ROUTES.SUPER_ADMIN_STATES_UTS_VIEW.replace(':id', newState.id))
      }, 500)
    } catch (error) {
      console.error('Failed to create state:', error)
      toast.addToast('Failed to add State/UT', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Box w="full">
      {/* Page Header with Breadcrumb */}
      <Box mb={5}>
        <Text textStyle="h5">Add State/UT</Text>
        <Flex gap={2} mt={1}>
          <Text
            fontSize="14px"
            color="primary.500"
            cursor="pointer"
            _hover={{ textDecoration: 'underline' }}
            onClick={() => navigate(ROUTES.SUPER_ADMIN_STATES_UTS)}
          >
            Manages States/UTs
          </Text>
          <Text fontSize="14px" color="neutral.400">
            /
          </Text>
          <Text fontSize="14px" color="neutral.600">
            Add New State/UT
          </Text>
        </Flex>
      </Box>

      {/* Form Card */}
      <Box
        bg="white"
        borderWidth="0.5px"
        borderColor="neutral.200"
        borderRadius="12px"
        w="full"
        minH="calc(100vh - 180px)"
        py={6}
        px={4}
      >
        <Flex direction="column" h="full" justify="space-between" minH="calc(100vh - 232px)">
          <Box>
            {/* State/UT Details Section */}
            <Text textStyle="h8" mb={4}>
              State/UT Details
            </Text>
            <Grid templateColumns="repeat(2, 1fr)" gap={6} mb={8}>
              <Box>
                <Text fontSize="14px" fontWeight="500" mb={2}>
                  State/UT name
                  <Text as="span" color="error.500">
                    *
                  </Text>
                </Text>
                <SearchableSelect
                  options={availableStates}
                  value={stateName}
                  onChange={handleStateChange}
                  placeholder="Select"
                  width="100%"
                />
              </Box>
              <Box>
                <Text fontSize="14px" fontWeight="500" mb={2}>
                  State/UT code
                </Text>
                <Input
                  value={stateCode}
                  isReadOnly
                  bg="neutral.50"
                  borderColor="neutral.200"
                  _placeholder={{ color: 'neutral.400' }}
                />
              </Box>
            </Grid>

            {/* State Admin Details Section */}
            <Text textStyle="h8" mb={4}>
              State Admin Details
            </Text>
            <Grid templateColumns="repeat(2, 1fr)" gap={6}>
              <Box>
                <Text fontSize="14px" fontWeight="500" mb={2}>
                  First name
                  <Text as="span" color="error.500">
                    *
                  </Text>
                </Text>
                <Input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter"
                  borderColor="neutral.200"
                  _placeholder={{ color: 'neutral.400' }}
                />
              </Box>
              <Box>
                <Text fontSize="14px" fontWeight="500" mb={2}>
                  Last name
                  <Text as="span" color="error.500">
                    *
                  </Text>
                </Text>
                <Input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Enter"
                  borderColor="neutral.200"
                  _placeholder={{ color: 'neutral.400' }}
                />
              </Box>
              <Box>
                <Text fontSize="14px" fontWeight="500" mb={2}>
                  Email address
                  <Text as="span" color="error.500">
                    *
                  </Text>
                </Text>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter"
                  borderColor="neutral.200"
                  _placeholder={{ color: 'neutral.400' }}
                />
              </Box>
              <Box>
                <Text fontSize="14px" fontWeight="500" mb={2}>
                  Phone number
                  <Text as="span" color="error.500">
                    *
                  </Text>
                </Text>
                <Input
                  value={phone}
                  onChange={(e) => {
                    // Only allow digits
                    const value = e.target.value.replace(/\D/g, '')
                    if (value.length <= 10) {
                      setPhone(value)
                    }
                  }}
                  placeholder="+91"
                  borderColor="neutral.200"
                  _placeholder={{ color: 'neutral.400' }}
                />
              </Box>
              <Box>
                <Text fontSize="14px" fontWeight="500" mb={2}>
                  Secondary email address (optional)
                </Text>
                <Input
                  type="email"
                  value={secondaryEmail}
                  onChange={(e) => setSecondaryEmail(e.target.value)}
                  placeholder="Enter"
                  borderColor="neutral.200"
                  _placeholder={{ color: 'neutral.400' }}
                />
              </Box>
              <Box>
                <Text fontSize="14px" fontWeight="500" mb={2}>
                  Contact number (optional)
                </Text>
                <Input
                  value={contactNumber}
                  onChange={(e) => {
                    // Only allow digits
                    const value = e.target.value.replace(/\D/g, '')
                    if (value.length <= 10) {
                      setContactNumber(value)
                    }
                  }}
                  placeholder="Enter"
                  borderColor="neutral.200"
                  _placeholder={{ color: 'neutral.400' }}
                />
              </Box>
            </Grid>
          </Box>

          {/* Action Buttons */}
          <HStack spacing={3} justify="flex-end" mt={6}>
            <Button
              variant="secondary"
              size="md"
              width="174px"
              onClick={handleCancel}
              isDisabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleSubmit}
              isLoading={isSaving}
              isDisabled={!isFormValid}
            >
              Add State & Send Link via Email
            </Button>
          </HStack>
        </Flex>
      </Box>

      {/* Toast Container */}
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />
    </Box>
  )
}
