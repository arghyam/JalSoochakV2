import { useState, useEffect, useRef } from 'react'
import { Box, Text, Button, Flex, Grid, IconButton, HStack, VStack } from '@chakra-ui/react'
import { EditIcon, DeleteIcon } from '@chakra-ui/icons'
import {
  getMockEscalations,
  getMockEscalationById,
  saveMockEscalation,
  updateMockEscalation,
  deleteMockEscalation,
} from '../../services/mock-data'
import type { Escalation, EscalationLevel } from '../../types/escalations'
import { AVAILABLE_ALERT_TYPES, AVAILABLE_ROLES, AVAILABLE_HOURS } from '../../types/escalations'
import { useToast } from '@/shared/hooks/use-toast'
import { ToastContainer, SearchableSelect } from '@/shared/components/common'

type ViewMode = 'list' | 'add' | 'edit'

export function EscalationsPage() {
  const levelIdCounterRef = useRef(0)
  const generateLevelId = () => `level-${Date.now()}-${++levelIdCounterRef.current}`
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [escalations, setEscalations] = useState<Escalation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  // Form state
  const [alertType, setAlertType] = useState('')
  const [levels, setLevels] = useState<EscalationLevel[]>([
    {
      id: `level-${Date.now()}`,
      levelNumber: 1,
      targetRole: '',
      escalateAfterHours: 0,
    },
  ])

  const toast = useToast()

  useEffect(() => {
    fetchEscalations()
  }, [])

  const fetchEscalations = async () => {
    setIsLoading(true)
    try {
      const data = await getMockEscalations()
      setEscalations(data)
    } catch (error) {
      console.error('Failed to fetch escalations:', error)
      toast.addToast('Failed to load escalations', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddNewClick = () => {
    setViewMode('add')
    setAlertType('')
    setLevels([
      {
        id: `level-${Date.now()}`,
        levelNumber: 1,
        targetRole: '',
        escalateAfterHours: 0,
      },
    ])
  }

  const handleEditClick = async (id: string) => {
    try {
      const escalation = await getMockEscalationById(id)
      if (escalation) {
        setEditingId(id)
        setAlertType(escalation.alertType)
        setLevels(escalation.levels)
        setViewMode('edit')
      } else {
        toast.addToast('Escalation not found', 'error')
      }
    } catch (error) {
      console.error('Failed to fetch escalation:', error)
      toast.addToast('Failed to load escalation', 'error')
    }
  }

  const handleDeleteClick = async (id: string) => {
    if (confirm('Are you sure you want to delete this escalation?')) {
      try {
        await deleteMockEscalation(id)
        await fetchEscalations()
        toast.addToast('Escalation deleted successfully', 'success')
      } catch (error) {
        console.error('Failed to delete escalation:', error)
        toast.addToast('Failed to delete escalation', 'error')
      }
    }
  }

  const handleCancel = () => {
    setViewMode('list')
    setEditingId(null)
    setAlertType('')
    setLevels([
      {
        id: `level-${Date.now()}`,
        levelNumber: 1,
        targetRole: '',
        escalateAfterHours: 0,
      },
    ])
  }

  const handleSave = async () => {
    if (!alertType) {
      toast.addToast('Please select an alert type', 'error')
      return
    }

    // Validate levels
    for (const level of levels) {
      if (!level.targetRole || level.escalateAfterHours <= 0) {
        toast.addToast('All levels must have valid role and hours', 'error')
        return
      }
    }

    setIsSaving(true)
    try {
      if (viewMode === 'add') {
        await saveMockEscalation({ alertType, levels })
        toast.addToast('Escalation added successfully', 'success')
      } else if (viewMode === 'edit' && editingId) {
        await updateMockEscalation(editingId, { alertType, levels })
        toast.addToast('Changes saved successfully', 'success')
      }
      await fetchEscalations()
      setViewMode('list')
      setEditingId(null)
    } catch (error) {
      console.error('Failed to save escalation:', error)
      toast.addToast('Failed to save escalation', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddLevel = () => {
    const newLevel: EscalationLevel = {
      id: generateLevelId(),
      levelNumber: levels.length + 1,
      targetRole: '',
      escalateAfterHours: 0,
    }
    setLevels([...levels, newLevel])
  }

  const handleLevelChange = (id: string, field: keyof EscalationLevel, value: string | number) => {
    setLevels(levels.map((level) => (level.id === id ? { ...level, [field]: value } : level)))
  }

  const getRoleLabel = (value: string) => {
    const role = AVAILABLE_ROLES.find((r) => r.value === value)
    return role ? role.label : value
  }

  if (isLoading) {
    return (
      <Box w="full">
        <Text textStyle="h5">Escalations</Text>
        <Text color="neutral.600">Loading...</Text>
      </Box>
    )
  }

  // List View
  if (viewMode === 'list') {
    return (
      <Box w="full">
        {/* Page Header */}
        <Flex justify="space-between" align="center" mb={5}>
          <Text textStyle="h5">Escalations</Text>
        </Flex>

        {/* All Escalations Section */}
        <Box
          bg="neutral.25"
          borderWidth="0.5px"
          borderColor="neutral.100"
          borderRadius="12px"
          w="full"
          minH="calc(100vh - 148px)"
          py="24px"
          px="16px"
        >
          <Flex justify="space-between" align="center" mb={4}>
            <Text textStyle="h8">All Escalations</Text>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleAddNewClick}
              fontSize="14px"
              fontWeight="600"
              h="32px"
              px="12px"
              py="8px"
            >
              + Add New Escalation Type
            </Button>
          </Flex>

          {/* Escalation Cards Grid */}
          <Grid templateColumns="repeat(2, 1fr)" gap={4} w="full" maxW="1200px">
            {escalations.map((escalation) => (
              <Box
                key={escalation.id}
                borderWidth="0.5px"
                borderColor="neutral.200"
                borderRadius="12px"
                bg="neutral.50"
                py={6}
                px={4}
                position="relative"
              >
                {/* Card Header with Actions */}
                <Flex justify="space-between" align="flex-start" mb={4}>
                  <Text textStyle="h8" color="neutral.950">
                    {escalation.name}
                  </Text>
                  <HStack spacing={1}>
                    <IconButton
                      aria-label="Edit escalation"
                      icon={<EditIcon h={5} w={5} />}
                      variant="ghost"
                      size="sm"
                      color="neutral.400"
                      _hover={{ bg: 'primary.50', color: 'primary.500' }}
                      onClick={() => handleEditClick(escalation.id)}
                      h={6}
                      w={6}
                      minW={6}
                    />
                    <IconButton
                      aria-label="Delete escalation"
                      icon={<DeleteIcon h={5} w={5} />}
                      variant="ghost"
                      size="sm"
                      color="neutral.400"
                      _hover={{ bg: 'error.50', color: 'error.500' }}
                      onClick={() => handleDeleteClick(escalation.id)}
                      h={6}
                      w={6}
                      minW={6}
                    />
                  </HStack>
                </Flex>

                {/* Escalation Levels */}
                <VStack align="stretch" spacing={3}>
                  {escalation.levels.map((level) => (
                    <Flex key={level.id} justify="space-between" align="center">
                      <Text fontSize="14px">
                        Level {level.levelNumber}: {getRoleLabel(level.targetRole)}
                      </Text>
                      <Text fontSize="14px">Escalate after {level.escalateAfterHours} hours</Text>
                    </Flex>
                  ))}
                </VStack>
              </Box>
            ))}
          </Grid>
        </Box>

        {/* Toast Container */}
        <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />
      </Box>
    )
  }

  // Add/Edit Form View
  return (
    <Box w="full">
      {/* Page Header */}
      <Box mb={5}>
        <Text textStyle="h5">Escalations</Text>
      </Box>

      {/* Form Card */}
      <Box
        bg="white"
        borderWidth="0.5px"
        borderColor="neutral.100"
        borderRadius="12px"
        w="full"
        minH="calc(100vh - 148px)"
        py={6}
        px={4}
      >
        <Flex
          direction="column"
          w="full"
          h="full"
          justify="space-between"
          minH="calc(100vh - 196px)"
        >
          <Flex direction="column" gap={3}>
            {/* Card Header with Edit Icon */}
            <Flex justify="space-between" align="center" mb={1}>
              <Text textStyle="h8">Escalations Rules</Text>
              {viewMode === 'edit' && (
                <IconButton
                  aria-label="Edit mode"
                  icon={<EditIcon h={5} w={5} />}
                  variant="ghost"
                  size="sm"
                  color="neutral.950"
                  h={6}
                  w={6}
                  minW={6}
                  cursor="default"
                  _hover={{ bg: 'transparent' }}
                />
              )}
            </Flex>

            {/* Alert Type Selection */}
            <Box>
              <Text fontSize="sm" fontWeight="medium" color="neutral.950" mb={1}>
                Type of Alert*
              </Text>
              <SearchableSelect
                options={AVAILABLE_ALERT_TYPES}
                value={alertType}
                onChange={setAlertType}
                placeholder="Select"
                width="486px"
              />
            </Box>

            {/* Escalation Levels */}
            <Box>
              <Text fontSize="sm" fontWeight="medium" color="neutral.950" mb={1}>
                Level of Escalation*
              </Text>

              <VStack align="stretch">
                {levels.map((level, index) => (
                  <Flex key={level.id} w="full" justify="space-between">
                    <Box>
                      <Text fontSize="sm" fontWeight="medium" color="neutral.950" mb={1}>
                        Level {index + 1}
                      </Text>
                      <SearchableSelect
                        options={AVAILABLE_ROLES}
                        value={level.targetRole}
                        onChange={(value) => handleLevelChange(level.id, 'targetRole', value)}
                        placeholder="Select"
                        width="486px"
                      />
                    </Box>

                    <Box>
                      <Text fontSize="sm" fontWeight="medium" color="neutral.950" mb={1}>
                        Escalate after (hours)*
                      </Text>
                      <SearchableSelect
                        options={AVAILABLE_HOURS}
                        value={String(level.escalateAfterHours)}
                        onChange={(value) =>
                          handleLevelChange(level.id, 'escalateAfterHours', Number(value))
                        }
                        placeholder="Select"
                        width="486px"
                      />
                    </Box>
                  </Flex>
                ))}

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleAddLevel}
                  w="152px"
                  fontSize="14px"
                  fontWeight="400"
                  h="32px"
                  mt={1}
                >
                  + Add New Level
                </Button>
              </VStack>
            </Box>
          </Flex>

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
              isDisabled={
                !alertType || levels.some((l) => !l.targetRole || l.escalateAfterHours <= 0)
              }
            >
              {viewMode === 'add' ? 'Add Escalation' : 'Save Changes'}
            </Button>
          </HStack>
        </Flex>
      </Box>

      {/* Toast Container */}
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />
    </Box>
  )
}
