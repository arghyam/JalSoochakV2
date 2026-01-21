import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Box, Text, Flex, Grid, IconButton } from '@chakra-ui/react'
import { EditIcon } from '@chakra-ui/icons'
import { Toggle, ToastContainer } from '@/shared/components/common'
import { useToast } from '@/shared/hooks/use-toast'
import { getStateUTById, updateStateUTStatus } from '../../services/mock-data'
import type { StateUT } from '../../types/states-uts'
import { ROUTES } from '@/shared/constants/routes'

export function ViewStateUTPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const toast = useToast()

  const [state, setState] = useState<StateUT | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)

  const fetchState = useCallback(async (stateId: string) => {
    setIsLoading(true)
    try {
      const data = await getStateUTById(stateId)
      setState(data)
    } catch (error) {
      console.error('Failed to fetch state:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!id) {
      setState(null)
      setIsLoading(false)
      return
    }
    fetchState(id)
  }, [id, fetchState])

  const handleStatusToggle = async () => {
    if (!state || isUpdatingStatus) return

    const newStatus = state.status === 'active' ? 'inactive' : 'active'
    setIsUpdatingStatus(true)

    try {
      const updated = await updateStateUTStatus(state.id, newStatus)
      if (updated) {
        setState(updated)
        toast.addToast(
          `State/UT ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`,
          'success'
        )
      } else {
        toast.addToast('State/UT not found', 'error')
      }
    } catch (error) {
      console.error('Failed to update status:', error)
      toast.addToast('Failed to update status', 'error')
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  const handleEdit = () => {
    if (id) {
      navigate(ROUTES.SUPER_ADMIN_STATES_UTS_EDIT.replace(':id', id))
    }
  }

  if (isLoading) {
    return (
      <Box w="full">
        <Text textStyle="h5">Manage State/UTs</Text>
        <Text color="neutral.600" mt={4}>
          Loading...
        </Text>
      </Box>
    )
  }

  if (!state) {
    return (
      <Box w="full">
        <Text textStyle="h5">Manage State/UTs</Text>
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
          Manage State/UTs
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
            View State/UT
          </Text>
        </Flex>
      </Box>

      {/* Details Card */}
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
        {/* State/UT Details Section */}
        <Flex justify="space-between" align="flex-start" mb={4}>
          <Text textStyle="h8">State/UT Details</Text>
          <IconButton
            aria-label="Edit State/UT"
            icon={<EditIcon boxSize={5} />}
            variant="ghost"
            size="sm"
            color="neutral.600"
            _hover={{ color: 'primary.500', bg: 'transparent' }}
            onClick={handleEdit}
          />
        </Flex>
        <Grid templateColumns="repeat(2, 1fr)" gap={6} mb={7}>
          <Box>
            <Text fontSize="14px" fontWeight="500" mb={1}>
              State/UT name
            </Text>
            <Text fontSize="14px" fontWeight="400">
              {state.name}
            </Text>
          </Box>
          <Box>
            <Text fontSize="14px" fontWeight="500" mb={1}>
              State/UT code
            </Text>
            <Text fontSize="14px" fontWeight="400">
              {state.code}
            </Text>
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
            </Text>
            <Text fontSize="14px" fontWeight="400">
              {state.admin.firstName}
            </Text>
          </Box>
          <Box>
            <Text fontSize="14px" fontWeight="500" mb={1}>
              Last name
            </Text>
            <Text fontSize="14px" fontWeight="400">
              {state.admin.lastName}
            </Text>
          </Box>
          <Box>
            <Text fontSize="14px" fontWeight="500" mb={1}>
              Email address
            </Text>
            <Text fontSize="14px" fontWeight="400">
              {state.admin.email}
            </Text>
          </Box>
          <Box>
            <Text fontSize="14px" fontWeight="500" mb={1}>
              Phone number
            </Text>
            <Text fontSize="14px" fontWeight="400">
              +91 {state.admin.phone.replace(/(\d{5})(\d{5})/, '$1-$2')}
            </Text>
          </Box>
          <Box>
            <Text fontSize="14px" fontWeight="500" mb={1}>
              Secondary email address (optional)
            </Text>
            <Text fontSize="14px" fontWeight="400">
              {state.admin.secondaryEmail || 'N/A'}
            </Text>
          </Box>
          <Box>
            <Text fontSize="14px" fontWeight="500" mb={1}>
              Contact number (optional)
            </Text>
            <Text fontSize="14px" fontWeight="400">
              {state.admin.contactNumber || 'N/A'}
            </Text>
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
            isChecked={state.status === 'active'}
            onChange={handleStatusToggle}
            isDisabled={isUpdatingStatus}
          />
        </Flex>
      </Box>

      {/* Toast Container */}
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />
    </Box>
  )
}
