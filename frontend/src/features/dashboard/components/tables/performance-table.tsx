import { useMemo } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
} from '@tanstack/react-table'
import type { EntityPerformance } from '../../types'
import { cn } from '@/shared/utils/cn'

interface PerformanceTableProps {
  data: EntityPerformance[]
  title: string
  isBest?: boolean
  className?: string
}

export function PerformanceTable({ data, title, isBest = true, className }: PerformanceTableProps) {
  const columns = useMemo<ColumnDef<EntityPerformance>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Entity',
        cell: (info) => <span className="font-medium">{info.getValue() as string}</span>,
      },
      {
        accessorKey: 'coverage',
        header: 'Coverage %',
        cell: (info) => `${(info.getValue() as number).toFixed(1)}%`,
      },
      {
        accessorKey: 'regularity',
        header: 'Regularity %',
        cell: (info) => `${(info.getValue() as number).toFixed(1)}%`,
      },
      {
        accessorKey: 'continuity',
        header: 'Continuity',
        cell: (info) => (info.getValue() as number).toFixed(1),
      },
      {
        accessorKey: 'quantity',
        header: 'Quantity (LPCD)',
        cell: (info) => `${info.getValue() as number}`,
      },
      {
        accessorKey: 'compositeScore',
        header: 'Composite Score',
        cell: (info) => (
          <span className="font-semibold">{(info.getValue() as number).toFixed(2)}</span>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: (info) => {
          const status = info.getValue() as EntityPerformance['status']
          const statusConfig = {
            good: { label: 'Good', className: 'bg-green-100 text-green-800' },
            'needs-attention': {
              label: 'Needs Attention',
              className: 'bg-orange-100 text-orange-800',
            },
            critical: {
              label: 'Critical',
              className: 'bg-red-100 text-red-800',
            },
          }
          const config = statusConfig[status]
          return (
            <span
              className={cn(
                'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                config.className
              )}
            >
              {config.label}
            </span>
          )
        },
      },
    ],
    []
  )

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      sorting: [
        {
          id: 'compositeScore',
          desc: isBest,
        },
      ],
    },
  })

  return (
    <div className={cn('space-y-4', className)}>
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="bg-muted/50 border-b">
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="px-4 py-3 text-left text-sm font-medium">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-muted/50 border-b transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 text-sm">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
