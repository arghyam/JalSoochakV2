import { useState, useEffect, useMemo, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Box, Text, Flex, Grid, Input, Button, HStack, Icon } from '@chakra-ui/react'
import { EditIcon } from '@chakra-ui/icons'
import { Toggle, ToastContainer } from '@/shared/components/common'
import { useToast } from '@/shared/hooks/use-toast'
import { getStateUTById, updateStateUT, updateStateUTStatus } from '../../services/mock-data'
import type { StateUT } from '../../types/states-uts'
import { ROUTES } from '@/shared/constants/routes'

export function EditStateUTPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const toast = useToast()

  const [originalState, setOriginalState] = useState<StateUT | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)

  // Form state
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [secondaryEmail, setSecondaryEmail] = useState('')
  const [contactNumber, setContactNumber] = useState('')
  const [status, setStatus] = useState<'active' | 'inactive'>('active')

  const fetchState = useCallback(async (stateId: string) => {
    setIsLoading(true)
    try {
      const data = await getStateUTById(stateId)
      if (data) {
        setOriginalState(data)
        setFirstName(data.admin.firstName)
        setLastName(data.admin.lastName)
        setPhone(data.admin.phone)
        setSecondaryEmail(data.admin.secondaryEmail ?? '')
        setContactNumber(data.admin.contactNumber ?? '')
        setStatus(data.status)
      }
    } catch (error) {
      console.error('Failed to fetch state:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (id) {
      fetchState(id)
    }
  }, [id, fetchState])

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
      firstName.trim() !== '' && lastName.trim() !== '' && phone.trim() !== ''

    const phoneValid = isValidPhone(phone)

    // Optional fields validation (if provided)
    const secondaryEmailValid = secondaryEmail === '' || isValidEmail(secondaryEmail)
    const contactNumberValid = contactNumber === '' || isValidPhone(contactNumber)

    return requiredFieldsValid && phoneValid && secondaryEmailValid && contactNumberValid
  }, [firstName, lastName, phone, secondaryEmail, contactNumber])

  const hasChanges = useMemo(() => {
    if (!originalState) return false

    return (
      firstName !== originalState.admin.firstName ||
      lastName !== originalState.admin.lastName ||
      phone !== originalState.admin.phone ||
      secondaryEmail !== (originalState.admin.secondaryEmail ?? '') ||
      contactNumber !== (originalState.admin.contactNumber ?? '')
    )
  }, [originalState, firstName, lastName, phone, secondaryEmail, contactNumber])

  const handleStatusToggle = async () => {
    if (!originalState || isUpdatingStatus) return

    const newStatus = status === 'active' ? 'inactive' : 'active'
    setIsUpdatingStatus(true)

    try {
      const updated = await updateStateUTStatus(originalState.id, newStatus)
      if (updated) {
        setStatus(newStatus)
        setOriginalState(updated)
        toast.addToast(
          `State/UT ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`,
          'success'
        )
      }
    } catch (error) {
      console.error('Failed to update status:', error)
      toast.addToast('Failed to update status', 'error')
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  const handleCancel = () => {
    if (id) {
      navigate(ROUTES.SUPER_ADMIN_STATES_UTS_VIEW.replace(':id', id))
    } else {
      navigate(ROUTES.SUPER_ADMIN_STATES_UTS)
    }
  }

  const handleSave = async () => {
    if (!isFormValid || !hasChanges || !id) {
      return
    }

    setIsSaving(true)
    try {
      const updated = await updateStateUT(id, {
        admin: {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          phone: phone.trim(),
          secondaryEmail: secondaryEmail.trim() || undefined,
          contactNumber: contactNumber.trim() || undefined,
        },
      })
      if (updated) {
        toast.addToast('Changes saved successfully', 'success')
        setTimeout(() => {
          navigate(ROUTES.SUPER_ADMIN_STATES_UTS_VIEW.replace(':id', id))
        }, 500)
      }
    } catch (error) {
      console.error('Failed to update state:', error)
      toast.addToast('Failed to save changes', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <Box w="full">
        <Text textStyle="h5">Edit State/UT</Text>
        <Text color="neutral.600" mt={4}>
          Loading...
        </Text>
      </Box>
    )
  }

  if (!originalState) {
    return (
      <Box w="full">
        <Text textStyle="h5">Edit State/UT</Text>
        <Text color="neutral.600" mt={4}>
          State/UT not found
        </Text>
      </Box>
    )
  }

  return (
    <Box w="full">
      {/* Page Header with Breadcrumb */}
      <Box mb={5}>
        <Text textStyle="h5" mb={2}>
          Edit State/UT
        </Text>
        <Flex gap={2}>
          <Text
            fontSize="14px"
            color="neutral.500"
            cursor="pointer"
            _hover={{ textDecoration: 'underline' }}
            onClick={() => navigate(ROUTES.SUPER_ADMIN_STATES_UTS)}
          >
            Manage States/UTs
          </Text>
          <Text fontSize="14px" color="neutral.500">
            /
          </Text>
          <Text fontSize="14px" color="#26272B">
            Edit State/UT
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
            <Flex justify="space-between" align="flex-start" mb={4}>
              <Text textStyle="h8">State/UT Details</Text>
              <Icon as={EditIcon} boxSize={5} cursor="not-allowed" h={5} w={5} />
            </Flex>
            <Grid templateColumns="repeat(2, 1fr)" gap={6} mb={7}>
              <Box>
                <Text fontSize="14px" color="neutral.400" mb={1}>
                  State/UT name
                </Text>
                <Input
                  value={originalState.name}
                  isReadOnly
                  isDisabled
                  bg="neutral.50"
                  borderColor="neutral.200"
                  color="neutral.400"
                  h={9}
                  maxW="486px"
                />
              </Box>
              <Box>
                <Text fontSize="14px" color="neutral.400" mb={1}>
                  State/UT code
                </Text>
                <Input
                  value={originalState.code}
                  isReadOnly
                  isDisabled
                  bg="neutral.50"
                  borderColor="neutral.200"
                  color="neutral.400"
                  h={9}
                  maxW="486px"
                />
              </Box>
            </Grid>

            {/* State Admin Details Section */}
            <Text textStyle="h8" mb={4}>
              State Admin Details
            </Text>
            <Grid templateColumns="repeat(2, 1fr)" gap={6} mb={7}>
              <Box>
                <Text fontSize="14px" fontWeight="500" mb={1}>
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
                  h={9}
                  maxW="486px"
                  _placeholder={{ color: 'neutral.400' }}
                />
              </Box>
              <Box>
                <Text fontSize="14px" fontWeight="500" mb={1}>
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
                  h={9}
                  maxW="486px"
                  _placeholder={{ color: 'neutral.400' }}
                />
              </Box>
              <Box>
                <Text fontSize="14px" color="neutral.400" mb={1}>
                  Email address
                </Text>
                <Input
                  value={originalState.admin.email}
                  isReadOnly
                  isDisabled
                  bg="neutral.50"
                  h={9}
                  maxW="486px"
                  borderColor="neutral.200"
                  color="neutral.400"
                />
              </Box>
              <Box>
                <Text fontSize="14px" fontWeight="500" mb={1}>
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
                  h={9}
                  maxW="486px"
                  _placeholder={{ color: 'neutral.400' }}
                />
              </Box>
              <Box>
                <Text fontSize="14px" fontWeight="500" mb={1}>
                  Secondary email address (optional)
                </Text>
                <Input
                  type="email"
                  value={secondaryEmail}
                  onChange={(e) => setSecondaryEmail(e.target.value)}
                  placeholder="Enter"
                  borderColor="neutral.200"
                  h={9}
                  maxW="486px"
                  _placeholder={{ color: 'neutral.400' }}
                />
              </Box>
              <Box>
                <Text fontSize="14px" fontWeight="500" mb={1}>
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
                  h={9}
                  maxW="486px"
                  _placeholder={{ color: 'neutral.400' }}
                />
              </Box>
            </Grid>

            {/* Status Section */}
            <Text textStyle="h8" mb={4}>
              Status
            </Text>
            <Flex align="center" gap={2} h={6}>
              <Text fontSize="14px" fontWeight="500">
                Activated
              </Text>
              <Toggle
                isChecked={status === 'active'}
                onChange={handleStatusToggle}
                isDisabled={isUpdatingStatus}
              />
            </Flex>
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
              width="174px"
              onClick={handleSave}
              isLoading={isSaving}
              isDisabled={!isFormValid || !hasChanges}
            >
              Save Changes
            </Button>
          </HStack>
        </Flex>
      </Box>

      {/* Toast Container */}
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />
    </Box>
  )
}
