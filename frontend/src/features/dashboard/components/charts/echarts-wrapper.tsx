import { useRef, useEffect } from 'react'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'

interface EChartsWrapperProps {
  option: EChartsOption
  className?: string
  height?: string | number
  onChartReady?: (chart: echarts.ECharts) => void
}

export function EChartsWrapper({
  option,
  className,
  height = '400px',
  onChartReady,
}: EChartsWrapperProps) {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstanceRef = useRef<echarts.ECharts | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    // Initialize chart
    if (!chartInstanceRef.current) {
      chartInstanceRef.current = echarts.init(chartRef.current)
      onChartReady?.(chartInstanceRef.current)
    }

    const chart = chartInstanceRef.current

    // Set option
    chart.setOption(option, true)

    // Handle resize
    const handleResize = () => {
      chart.resize()
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      chart.dispose()
      chartInstanceRef.current = null
    }
  }, [option, onChartReady])

  return (
    <div
      ref={chartRef}
      className={className}
      style={{ height: typeof height === 'number' ? `${height}px` : height }}
    />
  )
}
