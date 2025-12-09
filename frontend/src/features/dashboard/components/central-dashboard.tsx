import { useNavigate } from 'react-router-dom'
import { useDashboardData } from '../hooks/use-dashboard-data'
import { KPICard } from './kpi-card'
import { IndiaMapChart, DemandSupplyChart, BarChart } from './charts'
import { PerformanceTable } from './tables'
import { LoadingSpinner } from '@/shared/components/common'

export function CentralDashboard() {
  const navigate = useNavigate()
  const { data, isLoading, error } = useDashboardData('central')

  const handleStateClick = (stateId: string, _stateName: string) => {
    navigate(`/states/${stateId}`)
  }

  const handleStateHover = (_stateId: string, _stateName: string, _metrics: unknown) => {
    // Hover tooltip is handled by ECharts
    // This callback can be used for additional hover actions if needed
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Error loading dashboard</h2>
          <p className="mt-2 text-gray-600">
            {error instanceof Error ? error.message : 'Unknown error'}
          </p>
        </div>
      </div>
    )
  }

  if (!data) {
    return null
  }

  // Guard against incomplete data structure
  if (
    !data.kpis ||
    !data.mapData ||
    !data.demandSupply ||
    !data.topPerformers ||
    !data.worstPerformers ||
    !data.regularityData ||
    !data.continuityData
  ) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Invalid data structure</h2>
          <p className="mt-2 text-gray-600">Dashboard data is incomplete</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Central Dashboard</h1>
        <p className="text-muted-foreground">National-level water supply scheme monitoring</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <KPICard
          title="National Coverage %"
          value={data.kpis.nationalCoverage}
          unit="%"
          description="Households with functional tap connections"
        />
        <KPICard
          title="Regularity %"
          value={data.kpis.regularity}
          unit="%"
          description="Based on time period"
        />
        <KPICard
          title="Continuity Index"
          value={data.kpis.continuity}
          unit="/100"
          description="Uninterrupted supply periods"
        />
        <KPICard
          title="Average Quantity"
          value={data.kpis.averageQuantity}
          unit="LPCD"
          description="Litres per capita per day"
        />
        <KPICard
          title="Total Schemes"
          value={data.kpis.totalSchemes}
          description="Active water supply schemes"
        />
        <KPICard
          title="Total Households"
          value={data.kpis.totalHouseholds}
          description="Households covered"
        />
      </div>

      {/* India Map */}
      <div className="bg-card rounded-lg border p-4">
        <IndiaMapChart
          data={data.mapData}
          onStateClick={handleStateClick}
          onStateHover={handleStateHover}
          height="600px"
        />
      </div>

      {/* Demand vs Supply Chart */}
      <div className="bg-card rounded-lg border p-4">
        <DemandSupplyChart data={data.demandSupply} height="400px" />
      </div>

      {/* Performance Tables */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-card rounded-lg border p-4">
          <PerformanceTable
            data={data.topPerformers}
            title="Top 5 Best Performing States"
            isBest={true}
          />
        </div>
        <div className="bg-card rounded-lg border p-4">
          <PerformanceTable
            data={data.worstPerformers}
            title="Top 5 Worst Performing States"
            isBest={false}
          />
        </div>
      </div>

      {/* Bar Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-card rounded-lg border p-4">
          <BarChart
            data={data.regularityData}
            metric="regularity"
            title="Regularity by State"
            height="400px"
          />
        </div>
        <div className="bg-card rounded-lg border p-4">
          <BarChart
            data={data.continuityData}
            metric="continuity"
            title="Continuity by State"
            height="400px"
          />
        </div>
      </div>
    </div>
  )
}
