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
import { useAuthStore } from '@/app/store'
import { ToastContainer, ConfirmationDialog } from '@/shared/components/common'
import { useToast } from '@/shared/hooks/use-toast'
import { useWaterNorms, useUpdateWaterNorms } from '../../hooks/use-water-norms'
import {
  useEscalationRules,
  useCreateEscalationRule,
  useUpdateEscalationRule,
  useDeleteEscalationRule,
} from '../../hooks/use-escalation-rules'
import {
  useNudgeMessages,
  useCreateNudgeMessage,
  useUpdateNudgeMessage,
  useToggleNudgeMessageStatus,
  useDeleteNudgeMessage,
} from '../../hooks/use-nudge-messages'
import {
  WATER_NORM_CATEGORY_LABELS,
  CONDITION_TYPE_LABELS,
  MESSAGE_FREQUENCY_LABELS,
  NOTIFY_ROLE_LABELS,
} from '@/shared/constants/state-admin'
import type { WaterNorm } from '../../types/water-norm'
import type { EscalationRule, EscalationRuleFormData } from '../../types/escalation-rule'
import type { NudgeMessage, NudgeMessageFormData } from '../../types/nudge-message'
import { WaterNormEditDialog } from './water-norm-edit-dialog'
import { EscalationRuleFormDialog } from './escalation-rule-form-dialog'
import { NudgeMessageFormDialog } from './nudge-message-form-dialog'

export function StateAdminConfiguration() {
  const user = useAuthStore((state) => state.user)
  const tenantId = user?.tenantId || ''
  const toast = useToast()

  // Water Norms State
  const { data: waterNormsConfig } = useWaterNorms(tenantId)
  const updateWaterNorms = useUpdateWaterNorms()
  const [editingWaterNorm, setEditingWaterNorm] = useState<WaterNorm | null>(null)

  // Escalation Rules State
  const { data: escalationRulesConfig } = useEscalationRules(tenantId)
  const createEscalationRule = useCreateEscalationRule()
  const updateEscalationRule = useUpdateEscalationRule()
  const deleteEscalationRule = useDeleteEscalationRule()
  const [escalationSorting, setEscalationSorting] = useState<SortingState>([])
  const [isEscalationFormOpen, setIsEscalationFormOpen] = useState(false)
  const [editingEscalationRule, setEditingEscalationRule] = useState<EscalationRule | null>(null)
  const [deletingEscalationRule, setDeletingEscalationRule] = useState<EscalationRule | null>(null)

  // Nudge Messages State
  const { data: nudgeMessages = [] } = useNudgeMessages(tenantId)
  const createNudgeMessage = useCreateNudgeMessage()
  const updateNudgeMessage = useUpdateNudgeMessage()
  const toggleNudgeMessageStatus = useToggleNudgeMessageStatus()
  const deleteNudgeMessage = useDeleteNudgeMessage()
  const [nudgeSorting, setNudgeSorting] = useState<SortingState>([])
  const [isNudgeFormOpen, setIsNudgeFormOpen] = useState(false)
  const [editingNudgeMessage, setEditingNudgeMessage] = useState<NudgeMessage | null>(null)
  const [deletingNudgeMessage, setDeletingNudgeMessage] = useState<NudgeMessage | null>(null)

  // Water Norms Handlers
  const handleWaterNormEdit = (norm: WaterNorm) => {
    setEditingWaterNorm(norm)
  }

  const handleWaterNormSubmit = async (norm: WaterNorm) => {
    try {
      const updatedNorms = waterNormsConfig?.norms.map((n) =>
        n.category === norm.category ? norm : n
      ) || [norm]

      await updateWaterNorms.mutateAsync({
        tenantId,
        norms: updatedNorms,
      })
      toast.success('Water norm updated successfully')
      setEditingWaterNorm(null)
    } catch {
      toast.error('Failed to update water norm')
    }
  }

  // Escalation Rules Handlers
  const handleCreateEscalationRule = () => {
    setEditingEscalationRule(null)
    setIsEscalationFormOpen(true)
  }

  const handleEditEscalationRule = (rule: EscalationRule) => {
    setEditingEscalationRule(rule)
    setIsEscalationFormOpen(true)
  }

  const handleEscalationRuleSubmit = async (data: EscalationRuleFormData) => {
    try {
      if (editingEscalationRule) {
        await updateEscalationRule.mutateAsync({
          id: editingEscalationRule.id,
          tenantId,
          condition: {
            type: data.conditionType,
            durationHours: data.durationHours,
            threshold: data.threshold,
          },
          levels: data.levels,
        })
        toast.success('Escalation rule updated successfully')
      } else {
        await createEscalationRule.mutateAsync({
          tenantId,
          condition: {
            type: data.conditionType,
            durationHours: data.durationHours,
            threshold: data.threshold,
          },
          levels: data.levels,
        })
        toast.success('Escalation rule created successfully')
      }
      setIsEscalationFormOpen(false)
      setEditingEscalationRule(null)
    } catch {
      toast.error('An error occurred. Please try again.')
    }
  }

  const handleDeleteEscalationRule = async () => {
    if (!deletingEscalationRule) return
    try {
      await deleteEscalationRule.mutateAsync({ id: deletingEscalationRule.id, tenantId })
      toast.success('Escalation rule deleted successfully')
      setDeletingEscalationRule(null)
    } catch {
      toast.error('Failed to delete escalation rule')
    }
  }

  // Nudge Messages Handlers
  const handleCreateNudgeMessage = () => {
    setEditingNudgeMessage(null)
    setIsNudgeFormOpen(true)
  }

  const handleEditNudgeMessage = (message: NudgeMessage) => {
    setEditingNudgeMessage(message)
    setIsNudgeFormOpen(true)
  }

  const handleNudgeMessageSubmit = async (data: NudgeMessageFormData) => {
    try {
      if (editingNudgeMessage) {
        await updateNudgeMessage.mutateAsync({
          id: editingNudgeMessage.id,
          tenantId,
          ...data,
        })
        toast.success('Nudge message updated successfully')
      } else {
        await createNudgeMessage.mutateAsync({
          tenantId,
          ...data,
        })
        toast.success('Nudge message created successfully')
      }
      setIsNudgeFormOpen(false)
      setEditingNudgeMessage(null)
    } catch {
      toast.error('An error occurred. Please try again.')
    }
  }

  const handleToggleNudgeStatus = async (message: NudgeMessage) => {
    try {
      await toggleNudgeMessageStatus.mutateAsync({
        id: message.id,
        isActive: !message.isActive,
        tenantId,
      })
      toast.success(`Nudge message ${!message.isActive ? 'activated' : 'deactivated'} successfully`)
    } catch {
      toast.error('Failed to update nudge message status')
    }
  }

  const handleDeleteNudgeMessage = async () => {
    if (!deletingNudgeMessage) return
    try {
      await deleteNudgeMessage.mutateAsync({ id: deletingNudgeMessage.id, tenantId })
      toast.success('Nudge message deleted successfully')
      setDeletingNudgeMessage(null)
    } catch {
      toast.error('Failed to delete nudge message')
    }
  }

  // Escalation Rules Table Columns
  const escalationColumns = useMemo<ColumnDef<EscalationRule>[]>(
    () => [
      {
        accessorKey: 'condition.type',
        header: 'Condition Type',
        cell: (info) => {
          const rule = info.row.original
          return <span className="font-medium">{CONDITION_TYPE_LABELS[rule.condition.type]}</span>
        },
      },
      {
        id: 'conditionValue',
        header: 'Condition Value',
        cell: (info) => {
          const rule = info.row.original
          if (rule.condition.durationHours) {
            return <span>{rule.condition.durationHours} hours</span>
          }
          if (rule.condition.threshold) {
            return <span>{rule.condition.threshold}%</span>
          }
          return <span className="text-gray-400">-</span>
        },
      },
      {
        accessorKey: 'levels',
        header: 'Escalation Levels',
        cell: (info) => {
          const rule = info.row.original
          return (
            <div className="space-y-1">
              {rule.levels.map((level) => (
                <div key={level.level} className="text-sm">
                  <span className="font-medium">L{level.level}:</span>{' '}
                  {NOTIFY_ROLE_LABELS[level.notifyRole]}
                </div>
              ))}
            </div>
          )
        },
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: (info) => {
          const rule = info.row.original
          return (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleEditEscalationRule(rule)}
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
                onClick={() => setDeletingEscalationRule(rule)}
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

  const escalationTable = useReactTable({
    data: escalationRulesConfig?.rules || [],
    columns: escalationColumns,
    state: {
      sorting: escalationSorting,
    },
    onSortingChange: setEscalationSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  })

  // Nudge Messages Table Columns
  const nudgeColumns = useMemo<ColumnDef<NudgeMessage>[]>(
    () => [
      {
        accessorKey: 'title',
        header: 'Title',
        cell: (info) => <span className="font-medium">{info.getValue() as string}</span>,
      },
      {
        accessorKey: 'message',
        header: 'Message',
        cell: (info) => {
          const message = info.getValue() as string
          return (
            <span className="line-clamp-2 text-sm text-gray-600">
              {message.length > 60 ? `${message.slice(0, 60)}...` : message}
            </span>
          )
        },
      },
      {
        accessorKey: 'targetRole',
        header: 'Target Role',
        cell: (info) => {
          const role = info.getValue() as string
          return (
            <span className="text-sm">
              {role === 'all'
                ? 'All Roles'
                : NOTIFY_ROLE_LABELS[role as keyof typeof NOTIFY_ROLE_LABELS]}
            </span>
          )
        },
      },
      {
        accessorKey: 'frequency',
        header: 'Frequency',
        cell: (info) => {
          const freq = info.getValue() as keyof typeof MESSAGE_FREQUENCY_LABELS
          return <span className="text-sm">{MESSAGE_FREQUENCY_LABELS[freq]}</span>
        },
      },
      {
        accessorKey: 'isActive',
        header: 'Status',
        cell: (info) => {
          const message = info.row.original
          return (
            <button
              onClick={() => handleToggleNudgeStatus(message)}
              className={`rounded px-2 py-1 text-xs font-semibold ${
                message.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}
            >
              {message.isActive ? 'Active' : 'Inactive'}
            </button>
          )
        },
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: (info) => {
          const message = info.row.original
          return (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleEditNudgeMessage(message)}
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
                onClick={() => setDeletingNudgeMessage(message)}
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

  const nudgeTable = useReactTable({
    data: nudgeMessages,
    columns: nudgeColumns,
    state: {
      sorting: nudgeSorting,
    },
    onSortingChange: setNudgeSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  })

  return (
    <div className="space-y-8">
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />

      <div>
        <h1 className="text-3xl font-bold">Configuration</h1>
        <p className="mt-1 text-gray-600">
          Configure water norms, escalation rules, and nudge messages
        </p>
      </div>

      {/* Water Norms Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Water Norms</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {waterNormsConfig?.norms.map((norm) => (
            <div
              key={norm.category}
              className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {WATER_NORM_CATEGORY_LABELS[norm.category]}
                  </h3>
                  <p className="mt-2 text-3xl font-bold text-blue-600">{norm.lpcd} LPCD</p>
                  <p className="mt-1 text-sm text-gray-500">Litres Per Capita Per Day</p>
                </div>
                <button
                  onClick={() => handleWaterNormEdit(norm)}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Escalation Rules Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Escalation Rules</h2>
          <button
            onClick={handleCreateEscalationRule}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            + Add Rule
          </button>
        </div>

        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                {escalationTable.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {escalationTable.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="transition-colors hover:bg-gray-50">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-6 py-4 text-sm">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Nudge Messages Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Nudge Messages</h2>
          <button
            onClick={handleCreateNudgeMessage}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            + Add Message
          </button>
        </div>

        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                {nudgeTable.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {nudgeTable.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="transition-colors hover:bg-gray-50">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-6 py-4 text-sm">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Dialogs */}
      {editingWaterNorm && (
        <WaterNormEditDialog
          open={!!editingWaterNorm}
          onClose={() => setEditingWaterNorm(null)}
          onSubmit={handleWaterNormSubmit}
          waterNorm={editingWaterNorm}
          isLoading={updateWaterNorms.isPending}
        />
      )}

      <EscalationRuleFormDialog
        key={editingEscalationRule?.id || 'new-escalation-rule'}
        open={isEscalationFormOpen}
        onClose={() => {
          setIsEscalationFormOpen(false)
          setEditingEscalationRule(null)
        }}
        onSubmit={handleEscalationRuleSubmit}
        rule={editingEscalationRule}
        isLoading={createEscalationRule.isPending || updateEscalationRule.isPending}
      />

      <ConfirmationDialog
        open={!!deletingEscalationRule}
        onClose={() => setDeletingEscalationRule(null)}
        onConfirm={handleDeleteEscalationRule}
        title="Delete Escalation Rule"
        message={`Are you sure you want to delete this escalation rule? This action cannot be undone.`}
        confirmLabel="Delete"
        isLoading={deleteEscalationRule.isPending}
      />

      <NudgeMessageFormDialog
        key={editingNudgeMessage?.id || 'new-nudge-message'}
        open={isNudgeFormOpen}
        onClose={() => {
          setIsNudgeFormOpen(false)
          setEditingNudgeMessage(null)
        }}
        onSubmit={handleNudgeMessageSubmit}
        message={editingNudgeMessage}
        isLoading={createNudgeMessage.isPending || updateNudgeMessage.isPending}
      />

      <ConfirmationDialog
        open={!!deletingNudgeMessage}
        onClose={() => setDeletingNudgeMessage(null)}
        onConfirm={handleDeleteNudgeMessage}
        title="Delete Nudge Message"
        message={`Are you sure you want to delete "${deletingNudgeMessage?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        isLoading={deleteNudgeMessage.isPending}
      />
    </div>
  )
}
