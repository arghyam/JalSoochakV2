import { useState, useMemo } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table'
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

  const [sorting, setSorting] = useState<SortingState>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null)
  const [deletingTenant, setDeletingTenant] = useState<Tenant | null>(null)

  const columns = useMemo<ColumnDef<Tenant>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Tenant Name',
        cell: (info) => <span className="font-medium">{info.getValue() as string}</span>,
      },
      {
        accessorKey: 'code',
        header: 'Code',
        cell: (info) => (
          <span className="rounded bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-800">
            {info.getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: (info) => {
          const status = info.getValue() as string
          return (
            <span
              className={`rounded px-2 py-1 text-xs font-semibold ${
                status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}
            >
              {status === 'active' ? 'Active' : 'Inactive'}
            </span>
          )
        },
      },
      {
        accessorKey: 'stateAdminName',
        header: 'State Admin',
        cell: (info) => {
          const value = info.getValue() as string | undefined
          return <span className="text-gray-700">{value || '-'}</span>
        },
      },
      {
        accessorKey: 'adminCount',
        header: 'Admin Count',
        cell: (info) => <span className="text-gray-700">{info.getValue() as number}</span>,
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: (info) => {
          const tenant = info.row.original
          return (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleToggleStatus(tenant)}
                className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
                  tenant.status === 'active'
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                }`}
                title={tenant.status === 'active' ? 'Deactivate' : 'Activate'}
              >
                {tenant.status === 'active' ? 'Active' : 'Inactive'}
              </button>
              <button
                onClick={() => handleEdit(tenant)}
                className="rounded p-2 text-blue-600 transition-colors hover:bg-blue-50"
                title="Edit"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={() => setDeletingTenant(tenant)}
                className="rounded p-2 text-red-600 transition-colors hover:bg-red-50"
                title="Delete"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          )
        },
      },
    ],
    []
  )

  const table = useReactTable({
    data: tenants,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

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
        await updateTenant.mutateAsync({ ...data, id: editingTenant.id })
        toast.success('Tenant updated successfully')
      } else {
        await createTenant.mutateAsync(data)
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
      <div className="flex h-64 items-center justify-center">
        <div className="text-gray-600">Loading tenants...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manage Tenants</h1>
          <p className="mt-1 text-gray-600">Manage all state and union territory tenants</p>
        </div>
        <button
          onClick={handleCreate}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          + Add Tenant
        </button>
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="cursor-pointer px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase select-none"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center gap-2">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getIsSorted() && (
                          <span>{header.column.getIsSorted() === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="transition-colors hover:bg-gray-50">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4 text-sm whitespace-nowrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-6 py-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className="rounded border px-3 py-1 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              First
            </button>
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="rounded border px-3 py-1 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="rounded border px-3 py-1 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
            <button
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              className="rounded border px-3 py-1 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Last
            </button>
          </div>
          <span className="text-sm text-gray-700">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()} | Total:{' '}
            {tenants.length} tenants
          </span>
        </div>
      </div>

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
    </div>
  )
}
