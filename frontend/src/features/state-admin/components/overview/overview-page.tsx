import { useEffect, useState } from 'react'
import { Card, LineChart, AreaChart } from '@tremor/react'
import {
  MdPeople,
  MdCheckCircle,
  MdCloudUpload,
  MdWarning,
  MdIntegrationInstructions,
} from 'react-icons/md'
import { useAuthStore } from '@/app/store'
import { getMockOverviewData } from '../../services/mock-data'
import type { OverviewData } from '../../types/overview'

export function OverviewPage() {
  const user = useAuthStore((state) => state.user)
  const [data, setData] = useState<OverviewData | null>(null)

  useEffect(() => {
    getMockOverviewData().then(setData)
  }, [])

  if (!data) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-text-secondary">Loading...</div>
      </div>
    )
  }

  const statsCards = [
    {
      title: 'Pump Operators Synced',
      value: data.stats.pumpOperatorsSynced.toLocaleString(),
      subtitle: 'Out of 30',
      icon: MdPeople,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Configuration Status',
      value: data.stats.configurationStatus,
      subtitle: 'All modules configured',
      icon: MdCheckCircle,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      title: "Today's API Ingestion",
      value: data.stats.todayApiIngestion,
      subtitle: 'Successfully ingested',
      icon: MdCloudUpload,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Pending Data Sync',
      value: data.stats.pendingDataSync.toLocaleString(),
      subtitle: 'Requires Attention',
      icon: MdWarning,
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
    },
    {
      title: 'Active Integrations',
      value: data.stats.activeIntegrations.toLocaleString(),
      subtitle: 'WhatsApp, Glyphic',
      icon: MdIntegrationInstructions,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
  ]

  return (
    <div className="w-full space-y-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-text-primary">
          Overview of {user?.tenantId || 'State'}
        </h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-5 gap-4">
        {statsCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="border border-border bg-white p-4 shadow-sm">
              <div className="flex flex-col space-y-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.iconBg}`}
                >
                  <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-text-secondary">{stat.title}</p>
                  <p className="text-2xl font-semibold text-text-primary">{stat.value}</p>
                  <p className="text-xs text-text-tertiary">{stat.subtitle}</p>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Demand vs Supply Chart */}
      <Card className="border border-border p-6 shadow-sm">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-text-primary">Demand vs Supply</h2>
          <LineChart
            className="h-72"
            data={data.demandSupplyData}
            index="period"
            categories={['demand', 'supply']}
            colors={['blue', 'red']}
            connectNulls={true}
            yAxisWidth={50}
            showLegend={true}
            showGridLines={true}
            showAnimation={true}
          />
        </div>
      </Card>

      {/* Daily Ingestion Monitor */}
      <Card className="border border-border bg-white p-6 shadow-sm">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-text-primary">Daily Ingestion Monitor</h2>
            <select className="rounded border border-border bg-white px-3 py-1 text-sm text-text-secondary">
              <option>December</option>
            </select>
          </div>
          <AreaChart
            className="h-72"
            data={data.dailyIngestionData}
            index="day"
            categories={['count']}
            colors={['amber']}
            valueFormatter={(value) => value.toLocaleString()}
            yAxisWidth={50}
            showLegend={false}
            showGridLines={true}
            showAnimation={true}
          />
        </div>
      </Card>
    </div>
  )
}
