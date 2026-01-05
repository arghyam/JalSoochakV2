import {
  Table,
  TableHead,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  Badge,
} from '@tremor/react'
import type { EntityPerformance } from '../../types'
import { cn } from '@/shared/utils/cn'

interface PerformanceTableProps {
  data: EntityPerformance[]
  title: string
  isBest?: boolean
  className?: string
}

export function PerformanceTable({ data, title, className }: PerformanceTableProps) {
  const getStatusConfig = (status: EntityPerformance['status']) => {
    const statusConfig = {
      good: { label: 'Good', color: 'green' as const },
      'needs-attention': { label: 'Needs Attention', color: 'orange' as const },
      critical: { label: 'Critical', color: 'red' as const },
    }
    return statusConfig[status]
  }

  return (
    <div className={cn('space-y-4', className)}>
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="rounded-lg border">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Entity</TableHeaderCell>
              <TableHeaderCell>Coverage %</TableHeaderCell>
              <TableHeaderCell>Regularity %</TableHeaderCell>
              <TableHeaderCell>Continuity</TableHeaderCell>
              <TableHeaderCell>Quantity (LPCD)</TableHeaderCell>
              <TableHeaderCell>Composite Score</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((entity) => {
              const statusConfig = getStatusConfig(entity.status)
              return (
                <TableRow key={entity.name}>
                  <TableCell>
                    <span className="font-medium">{entity.name}</span>
                  </TableCell>
                  <TableCell>{entity.coverage.toFixed(1)}%</TableCell>
                  <TableCell>{entity.regularity.toFixed(1)}%</TableCell>
                  <TableCell>{entity.continuity.toFixed(1)}</TableCell>
                  <TableCell>{entity.quantity}</TableCell>
                  <TableCell>
                    <span className="font-semibold">{entity.compositeScore.toFixed(2)}</span>
                  </TableCell>
                  <TableCell>
                    <Badge color={statusConfig.color}>{statusConfig.label}</Badge>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
