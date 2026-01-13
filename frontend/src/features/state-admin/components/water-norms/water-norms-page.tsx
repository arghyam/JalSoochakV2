import { useState, useEffect } from 'react'
import { Box, Text, Button, Flex, HStack, Input, IconButton } from '@chakra-ui/react'
import { EditIcon, DeleteIcon } from '@chakra-ui/icons'
import {
  getMockWaterNormsConfiguration,
  saveMockWaterNormsConfiguration,
} from '../../services/mock-data'
import type { WaterNormsConfiguration, DistrictOverride } from '../../types/water-norms'
import { AVAILABLE_DISTRICTS } from '../../types/water-norms'
import { useToast } from '@/shared/hooks/use-toast'
import { ToastContainer, SearchableSelect } from '@/shared/components/common'

export function WaterNormsPage() {
  const [config, setConfig] = useState<WaterNormsConfiguration | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [stateQuantity, setStateQuantity] = useState('')
  const [districtOverrides, setDistrictOverrides] = useState<DistrictOverride[]>([])
  const toast = useToast()

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const data = await getMockWaterNormsConfiguration()
        setConfig(data)
        setStateQuantity(data.stateQuantity ? String(data.stateQuantity) : '')
        setDistrictOverrides(data.districtOverrides || [])
        setIsEditing(!data.isConfigured)
      } catch (error) {
        console.error('Failed to fetch water norms configuration:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchConfig()
  }, [])

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    if (config) {
      setStateQuantity(config.stateQuantity ? String(config.stateQuantity) : '')
      setDistrictOverrides(config.districtOverrides || [])
      setIsEditing(false)
    }
  }

  const handleSave = async () => {
    if (!stateQuantity) {
      toast.addToast('State quantity is required', 'error')
      return
    }

    const quantity = Number(stateQuantity)
    if (isNaN(quantity) || quantity <= 0) {
      toast.addToast('Please enter a valid quantity', 'error')
      return
    }

    // Validate district overrides
    for (const override of districtOverrides) {
      if (!override.districtName || override.quantity <= 0) {
        toast.addToast('All district overrides must have valid values', 'error')
        return
      }
    }

    setIsSaving(true)
    try {
      const savedConfig = await saveMockWaterNormsConfiguration({
        stateQuantity: quantity,
        districtOverrides,
        isConfigured: true,
      })
      setConfig(savedConfig)
      setIsEditing(false)
      toast.addToast('Changes saved successfully', 'success')
    } catch (error) {
      console.error('Failed to save water norms configuration:', error)
      toast.addToast('Failed to save changes', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddDistrict = () => {
    const newOverride: DistrictOverride = {
      id: `district-${Date.now()}`,
      districtName: '',
      quantity: 0,
    }
    setDistrictOverrides([...districtOverrides, newOverride])
  }

  const handleRemoveDistrict = (id: string) => {
    setDistrictOverrides(districtOverrides.filter((d) => d.id !== id))
  }

  const handleDistrictChange = (
    id: string,
    field: keyof DistrictOverride,
    value: string | number
  ) => {
    setDistrictOverrides(districtOverrides.map((d) => (d.id === id ? { ...d, [field]: value } : d)))
  }

  const getDistrictLabel = (value: string) => {
    const district = AVAILABLE_DISTRICTS.find((d) => d.value === value)
    return district ? district.label : value
  }

  const getAvailableDistricts = () => {
    const usedDistricts = new Set(districtOverrides.map((d) => d.districtName))
    return AVAILABLE_DISTRICTS.filter((d) => !usedDistricts.has(d.value))
  }

  if (isLoading) {
    return (
      <Box w="full">
        <Text textStyle="h5">Water Norms</Text>
        <Text color="neutral.600">Loading...</Text>
      </Box>
    )
  }

  return (
    <Box w="full">
      {/* Page Header */}
      <Box mb={6}>
        <Text textStyle="h5">Water Norms</Text>
      </Box>

      {/* Water Norms Configuration Card */}
      <Box
        bg="white"
        borderWidth="0.5px"
        borderColor="neutral.100"
        borderRadius="12px"
        w="full"
        h="600px"
        pt="24px"
        pr="24px"
        pb="24px"
        pl="24px"
      >
        <Flex direction="column" w="full" h="full" justify="space-between">
          {/* Card Header */}
          <Flex justify="space-between" align="center" mb={6}>
            <Text textStyle="h8">State/UT Water Norms</Text>
            {config?.isConfigured && !isEditing && (
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<EditIcon />}
                onClick={handleEdit}
                color="neutral.500"
                _hover={{ bg: 'primary.50', color: 'primary.500' }}
              />
            )}
          </Flex>

          {/* View Mode */}
          {!isEditing && config?.isConfigured ? (
            <Box w="full" h="full">
              {/* State Quantity */}
              <Box mb={6} gap={1}>
                <Text fontSize="sm" fontWeight="medium" color="neutral.700">
                  Current quantity (LPCD)*
                </Text>
                <Text fontSize="md" color="neutral.950">
                  {config.stateQuantity}
                </Text>
              </Box>

              {/* District-Level Overrides */}
              {districtOverrides.length > 0 && (
                <Box mt={8}>
                  <Text textStyle="h8" mb={4}>
                    District-Level Overrides
                  </Text>
                  {districtOverrides.map((override) => (
                    <Flex key={override.id} gap={6} mb={4} align="center">
                      <Box w="486px" gap={1}>
                        <Text fontSize="sm" fontWeight="medium" color="neutral.700">
                          District Name
                        </Text>
                        <Text fontSize="md" color="neutral.950">
                          {getDistrictLabel(override.districtName)}
                        </Text>
                      </Box>
                      <Box w="486px" gap={1}>
                        <Text fontSize="sm" fontWeight="medium" color="neutral.700">
                          Quantity (LPCD)
                        </Text>
                        <Text fontSize="md" color="neutral.950">
                          {override.quantity}
                        </Text>
                      </Box>
                    </Flex>
                  ))}
                </Box>
              )}
            </Box>
          ) : (
            /* Edit Mode */
            <Flex direction="column" w="full" h="full" justify="space-between">
              <Box>
                {/* State Quantity Input */}
                <Box mb={6} gap={1}>
                  <Text fontSize="sm" fontWeight="medium" color="neutral.950">
                    Current quantity (LPCD)*
                  </Text>
                  <Input
                    placeholder="Enter"
                    value={stateQuantity}
                    onChange={(e) => setStateQuantity(e.target.value)}
                    type="number"
                    w="486px"
                    h="36px"
                    borderColor="neutral.300"
                    borderRadius="6px"
                    _hover={{ borderColor: 'neutral.400' }}
                    _focus={{ borderColor: 'primary.500', boxShadow: 'none' }}
                  />
                </Box>

                {/* District-Level Overrides */}
                <Box mt={6}>
                  <Text textStyle="h8" mb={4}>
                    District-Level Overrides
                  </Text>

                  {districtOverrides.map((override) => (
                    <Flex key={override.id} gap={6} mb={4} align="flex-end">
                      <Box w="486px" gap={1}>
                        <Text fontSize="sm" fontWeight="medium" color="neutral.950">
                          District Name
                        </Text>
                        <SearchableSelect
                          options={[
                            ...getAvailableDistricts(),
                            ...(override.districtName
                              ? [
                                  {
                                    value: override.districtName,
                                    label: getDistrictLabel(override.districtName),
                                  },
                                ]
                              : []),
                          ]}
                          value={override.districtName}
                          onChange={(value) =>
                            handleDistrictChange(override.id, 'districtName', value)
                          }
                          placeholder="Select"
                          width="486px"
                        />
                      </Box>
                      <Box w="486px" gap={1}>
                        <Text fontSize="sm" fontWeight="medium" color="neutral.950">
                          Quantity (LPCD)
                        </Text>
                        <Input
                          placeholder="Enter"
                          value={override.quantity || ''}
                          onChange={(e) =>
                            handleDistrictChange(override.id, 'quantity', Number(e.target.value))
                          }
                          type="number"
                          w="486px"
                          h="36px"
                          borderColor="neutral.300"
                          borderRadius="6px"
                          _hover={{ borderColor: 'neutral.400' }}
                          _focus={{ borderColor: 'primary.500', boxShadow: 'none' }}
                        />
                      </Box>
                      <IconButton
                        aria-label="Delete district"
                        icon={<DeleteIcon />}
                        variant="ghost"
                        size="sm"
                        color="neutral.500"
                        onClick={() => handleRemoveDistrict(override.id)}
                        h="36px"
                        _hover={{ bg: 'error.50', color: 'error.500' }}
                      />
                    </Flex>
                  ))}

                  <Button variant="secondary" size="sm" onClick={handleAddDistrict}>
                    + Add New District
                  </Button>
                </Box>
              </Box>

              {/* Action Buttons */}
              <HStack spacing={3} justify="flex-end">
                {config?.isConfigured && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleCancel}
                    isDisabled={isSaving}
                  >
                    Cancel
                  </Button>
                )}
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSave}
                  isLoading={isSaving}
                  isDisabled={!stateQuantity}
                >
                  {config?.isConfigured ? 'Save Changes' : 'Save'}
                </Button>
              </HStack>
            </Flex>
          )}
        </Flex>
      </Box>

      {/* Toast Container */}
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />
    </Box>
  )
}
