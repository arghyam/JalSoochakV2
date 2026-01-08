import { useState } from 'react'
import {
  Box,
  Flex,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  IconButton,
} from '@chakra-ui/react'
import { EditIcon, DeleteIcon } from '@chakra-ui/icons'
import { ConfirmationDialog, ToastContainer } from '@/shared/components/common'
import { useToast } from '@/shared/hooks/use-toast'
import {
  useTenants,
  useCreateTenant,
  useUpdateTenant,
  useToggleTenantStatus,
  useDeleteTenant,
} from '../hooks/use-tenants'
import type { Tenant, TenantFormData } from '../types/tenant'
import { TenantFormDialog } from './tenant-form-dialog'

export function ManageTenants() {
  const { data: tenants = [], isLoading } = useTenants()
  const createTenant = useCreateTenant()
  const updateTenant = useUpdateTenant()
  const toggleStatus = useToggleTenantStatus()
  const deleteTenant = useDeleteTenant()
  const toast = useToast()

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null)
  const [deletingTenant, setDeletingTenant] = useState<Tenant | null>(null)

  const handleCreate = () => {
    setEditingTenant(null)
    setIsFormOpen(true)
  }

  const handleEdit = (tenant: Tenant) => {
    setEditingTenant(tenant)
    setIsFormOpen(true)
  }

  const handleFormSubmit = async (data: TenantFormData) => {
    try {
      if (editingTenant) {
        await updateTenant.mutateAsync({
          id: editingTenant.id,
          name: data.name,
          code: data.code,
          status: data.status,
          country: data.country,
          defaultLanguages: data.defaultLanguages,
          defaultConfig: {
            defaultWaterNorm: data.defaultWaterNorm,
          },
        })
        toast.success('Tenant updated successfully')
      } else {
        await createTenant.mutateAsync({
          name: data.name,
          code: data.code,
          status: data.status,
          country: data.country,
          defaultLanguages: data.defaultLanguages,
          defaultConfig: {
            defaultWaterNorm: data.defaultWaterNorm,
          },
        })
        toast.success('Tenant created successfully')
      }
      setIsFormOpen(false)
      setEditingTenant(null)
    } catch {
      toast.error('An error occurred. Please try again.')
    }
  }

  const handleToggleStatus = async (tenant: Tenant) => {
    try {
      const newStatus = tenant.status === 'active' ? 'inactive' : 'active'
      await toggleStatus.mutateAsync({ id: tenant.id, status: newStatus })
      toast.success(`Tenant ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`)
    } catch {
      toast.error('Failed to update tenant status')
    }
  }

  const handleDelete = async () => {
    if (!deletingTenant) return
    try {
      await deleteTenant.mutateAsync(deletingTenant.id)
      toast.success('Tenant deleted successfully')
      setDeletingTenant(null)
    } catch {
      toast.error('Failed to delete tenant')
    }
  }

  if (isLoading) {
    return (
      <Flex h="64" align="center" justify="center">
        <Text color="gray.600">Loading tenants...</Text>
      </Flex>
    )
  }

  return (
    <Box>
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />

      <Flex align="center" justify="space-between" mb={6}>
        <Box>
          <Text fontSize="3xl" fontWeight="bold">
            Manage Tenants
          </Text>
          <Text mt={1} color="gray.600">
            Manage all state and union territory tenants
          </Text>
        </Box>
        <Button onClick={handleCreate} colorScheme="blue" size="sm">
          + Add Tenant
        </Button>
      </Flex>

      <Box overflow="hidden" borderRadius="lg" bg="white" boxShadow="sm">
        {tenants.length === 0 ? (
          <Flex py={12} justify="center">
            <Text color="gray.500">No tenants found. Click "Add Tenant" to create one.</Text>
          </Flex>
        ) : (
          <Table size="sm">
            <Thead>
              <Tr>
                <Th>Tenant Name</Th>
                <Th>Code</Th>
                <Th>Status</Th>
                <Th>State Admin</Th>
                <Th>Admin Count</Th>
                <Th>Water Norm (LPCD)</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {tenants.map((tenant) => (
                <Tr key={tenant.id}>
                  <Td>
                    <Text fontWeight="medium">{tenant.name}</Text>
                  </Td>
                  <Td>
                    <Box
                      as="span"
                      px={2}
                      py={1}
                      borderRadius="md"
                      fontSize="xs"
                      fontWeight="medium"
                      bg="gray.100"
                      color="gray.700"
                    >
                      {tenant.code}
                    </Box>
                  </Td>
                  <Td>
                    <Box
                      as="span"
                      px={2}
                      py={1}
                      borderRadius="md"
                      fontSize="xs"
                      fontWeight="medium"
                      bg={tenant.status === 'active' ? 'success.50' : 'gray.100'}
                      color={tenant.status === 'active' ? 'success.600' : 'gray.700'}
                    >
                      {tenant.status === 'active' ? 'Active' : 'Inactive'}
                    </Box>
                  </Td>
                  <Td>
                    <Text color="gray.700">{tenant.stateAdminName || '-'}</Text>
                  </Td>
                  <Td>
                    <Text color="gray.700">{tenant.adminCount}</Text>
                  </Td>
                  <Td>
                    <Text color="gray.700">{tenant.defaultConfig.defaultWaterNorm}</Text>
                  </Td>
                  <Td>
                    <Flex align="center" gap={2}>
                      <Button
                        onClick={() => handleToggleStatus(tenant)}
                        size="xs"
                        colorScheme={tenant.status === 'active' ? 'blue' : 'gray'}
                        title={tenant.status === 'active' ? 'Deactivate' : 'Activate'}
                      >
                        {tenant.status === 'active' ? 'Active' : 'Inactive'}
                      </Button>
                      <IconButton
                        aria-label="Edit tenant"
                        size="sm"
                        variant="ghost"
                        colorScheme="blue"
                        onClick={() => handleEdit(tenant)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        aria-label="Delete tenant"
                        size="sm"
                        variant="ghost"
                        colorScheme="red"
                        onClick={() => setDeletingTenant(tenant)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Flex>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Box>

      <TenantFormDialog
        key={editingTenant?.id || 'new'}
        open={isFormOpen}
        onClose={() => {
          setIsFormOpen(false)
          setEditingTenant(null)
        }}
        onSubmit={handleFormSubmit}
        tenant={editingTenant}
        isLoading={createTenant.isPending || updateTenant.isPending}
      />

      <ConfirmationDialog
        open={!!deletingTenant}
        onClose={() => setDeletingTenant(null)}
        onConfirm={handleDelete}
        title="Delete Tenant"
        message={`Are you sure you want to delete "${deletingTenant?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        isLoading={deleteTenant.isPending}
      />
    </Box>
  )
}
