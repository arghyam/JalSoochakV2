import { useState } from 'react'
import {
  VStack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Select,
  Text,
  Button,
  Flex,
} from '@chakra-ui/react'
import { Dialog } from '@/shared/components/common'
import { MultiSelect } from '@/shared/components/common/multi-select'
import { INDIAN_LANGUAGES, COUNTRIES } from '@/shared/constants/languages'
import type { Tenant, TenantFormData } from '../types/tenant'

interface TenantFormDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: TenantFormData) => void
  tenant?: Tenant | null
  isLoading?: boolean
}

function getInitialFormData(tenant: Tenant | null | undefined): TenantFormData {
  if (tenant) {
    return {
      name: tenant.name,
      code: tenant.code,
      status: tenant.status,
      country: tenant.country,
      defaultLanguages: tenant.defaultLanguages,
      defaultWaterNorm: tenant.defaultConfig.defaultWaterNorm,
    }
  }
  return {
    name: '',
    code: '',
    status: 'active',
    country: 'IN',
    defaultLanguages: ['English'],
    defaultWaterNorm: 60,
  }
}

export function TenantFormDialog({
  open,
  onClose,
  onSubmit,
  tenant,
  isLoading = false,
}: TenantFormDialogProps) {
  const [formData, setFormData] = useState<TenantFormData>(() => getInitialFormData(tenant))
  const [errors, setErrors] = useState<Partial<Record<keyof TenantFormData, string>>>({})

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof TenantFormData, string>> = {}

    if (!formData.name.trim()) newErrors.name = 'Tenant name is required'

    if (!formData.code.trim()) newErrors.code = 'Tenant code is required'
    else if (!/^[A-Z]{2,3}$/.test(formData.code))
      newErrors.code = 'Code must be 2-3 uppercase letters'

    if (!formData.country) newErrors.country = 'Country is required'

    if (formData.defaultLanguages.length === 0)
      newErrors.defaultLanguages = 'At least one language is required'

    if (!formData.defaultWaterNorm || formData.defaultWaterNorm <= 0)
      newErrors.defaultWaterNorm = 'Default water norm must be greater than 0'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) onSubmit(formData)
  }

  const handleChange = (field: keyof TenantFormData, value: string | string[] | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  return (
    <Dialog open={open} onClose={onClose} title={tenant ? 'Edit Tenant' : 'Add New Tenant'}>
      <VStack as="form" onSubmit={handleSubmit} spacing={4} align="stretch">
        <FormControl isInvalid={!!errors.name}>
          <FormLabel>
            Tenant Name{' '}
            <Text as="span" color="red.500">
              *
            </Text>
          </FormLabel>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="e.g., Maharashtra"
            isDisabled={isLoading}
          />
          {errors.name && <FormErrorMessage>{errors.name}</FormErrorMessage>}
        </FormControl>

        <FormControl isInvalid={!!errors.code}>
          <FormLabel>
            Tenant Code{' '}
            <Text as="span" color="red.500">
              *
            </Text>
          </FormLabel>
          <Input
            id="code"
            value={formData.code}
            onChange={(e) => handleChange('code', e.target.value.toUpperCase())}
            placeholder="e.g., MH"
            maxLength={3}
            isDisabled={isLoading}
          />
          {errors.code && <FormErrorMessage>{errors.code}</FormErrorMessage>}
        </FormControl>

        <FormControl>
          <FormLabel>
            Status{' '}
            <Text as="span" color="red.500">
              *
            </Text>
          </FormLabel>
          <Select
            id="status"
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value as 'active' | 'inactive')}
            isDisabled={isLoading}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </Select>
        </FormControl>

        <FormControl isInvalid={!!errors.country}>
          <FormLabel>
            Country{' '}
            <Text as="span" color="red.500">
              *
            </Text>
          </FormLabel>
          <Select
            id="country"
            value={formData.country}
            onChange={(e) => handleChange('country', e.target.value)}
            isDisabled={isLoading}
          >
            {COUNTRIES.map((country) => (
              <option key={country.code} value={country.code}>
                {country.name}
              </option>
            ))}
          </Select>
          {errors.country && <FormErrorMessage>{errors.country}</FormErrorMessage>}
        </FormControl>

        <FormControl isInvalid={!!errors.defaultLanguages}>
          <FormLabel>
            Default Languages{' '}
            <Text as="span" color="red.500">
              *
            </Text>
          </FormLabel>

          <MultiSelect
            options={[...INDIAN_LANGUAGES]}
            value={formData.defaultLanguages}
            onChange={(value) => handleChange('defaultLanguages', value)}
            placeholder="Select languages..."
          />

          {errors.defaultLanguages && (
            <FormErrorMessage>{errors.defaultLanguages}</FormErrorMessage>
          )}
        </FormControl>

        <FormControl isInvalid={!!errors.defaultWaterNorm}>
          <FormLabel>
            Default Water Norm (litres per capita per day){' '}
            <Text as="span" color="red.500">
              *
            </Text>
          </FormLabel>

          <Input
            id="defaultWaterNorm"
            type="number"
            value={formData.defaultWaterNorm}
            onChange={(e) => handleChange('defaultWaterNorm', Number(e.target.value))}
            placeholder="e.g., 60"
            min={1}
            step={1}
            isDisabled={isLoading}
          />

          {errors.defaultWaterNorm && (
            <FormErrorMessage>{errors.defaultWaterNorm}</FormErrorMessage>
          )}
        </FormControl>

        <Flex justify="flex-end" gap={3} pt={4}>
          <Button type="button" variant="outline" onClick={onClose} isDisabled={isLoading}>
            Cancel
          </Button>

          <Button type="submit" colorScheme="blue" isDisabled={isLoading} isLoading={isLoading}>
            {isLoading ? 'Saving...' : tenant ? 'Update' : 'Create'}
          </Button>
        </Flex>
      </VStack>
    </Dialog>
  )
}
