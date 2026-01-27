import { useMemo } from 'react'
import * as echarts from 'echarts'
import { EChartsWrapper } from './echarts-wrapper'
import type { EntityPerformance } from '../../types'

interface SupplySubmissionRateChartProps {
  data: EntityPerformance[]
  className?: string
  height?: string | number
  maxItems?: number
}

export function SupplySubmissionRateChart({
  data,
  className,
  height = '400px',
  maxItems = 5,
}: SupplySubmissionRateChartProps) {
  const option = useMemo<echarts.EChartsOption>(() => {
    const chartData = data.slice(0, maxItems)
    const entities = chartData.map((d) => d.name)
    const rates = chartData.map((d) => d.regularity)

    return {
      tooltip: {
        show: false,
      },
      grid: {
        left: '8%',
        right: '4%',
        top: '10%',
        bottom: '26%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: entities,
        name: 'States/UTs',
        nameLocation: 'middle',
        nameGap: 36,
        axisTick: {
          show: false,
        },
        axisLabel: {
          rotate: 45,
          interval: 0,
        },
      },
      yAxis: {
        type: 'value',
        name: 'Percentage',
        nameLocation: 'middle',
        nameGap: 40,
        max: 100,
        interval: 25,
        splitLine: {
          lineStyle: {
            color: '#E5E7EB',
          },
        },
      },
      series: [
        {
          name: 'Submission Rate',
          type: 'bar',
          data: rates,
          barWidth: 66,
          itemStyle: {
            color: '#3291D1',
            borderRadius: [4, 4, 0, 0],
          },
          emphasis: {
            disabled: true,
          },
        },
      ],
    }
  }, [data, maxItems])

  return <EChartsWrapper option={option} className={className} height={height} />
}
