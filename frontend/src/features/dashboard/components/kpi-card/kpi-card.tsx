import { cn } from '@/shared/utils/cn'

interface KPICardProps {
  title: string
  value: string | number
  unit?: string
  description?: string
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
}

export function KPICard({ title, value, unit, description, trend, className }: KPICardProps) {
  return (
    <div
      className={cn(
        'bg-card rounded-lg border p-6 shadow-sm transition-shadow hover:shadow-md',
        className
      )}
    >
      <div className="space-y-2">
        <p className="text-muted-foreground text-sm font-medium">{title}</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-3xl font-bold">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </h3>
          {unit && <span className="text-muted-foreground text-lg font-medium">{unit}</span>}
        </div>
        {description && <p className="text-muted-foreground text-xs">{description}</p>}
        {trend && (
          <div className="flex items-center gap-1 text-sm">
            <span
              className={cn('font-medium', trend.isPositive ? 'text-green-600' : 'text-red-600')}
            >
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </span>
            <span className="text-muted-foreground">vs last period</span>
          </div>
        )}
      </div>
    </div>
  )
}
