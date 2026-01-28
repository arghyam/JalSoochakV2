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
  height = '500px',
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
        bottom: '5%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: entities,
        name: '',
        axisTick: {
          show: false,
        },
        axisLabel: {
          rotate: 45,
          interval: 0,
          margin: 8,
          fontSize: 12,
          lineHeight: 16,
          fontWeight: 400,
          color: '#1C1C1C',
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
            borderRadius: [12, 12, 12, 12],
          },
          emphasis: {
            disabled: true,
          },
        },
      ],
      graphic: [
        {
          type: 'text',
          left: 'center',
          bottom: 2,
          style: {
            text: 'States/UTs',
            fill: '#1C1C1C',
            fontSize: 12,
            fontWeight: 400,
            lineHeight: 16,
          },
        },
      ],
    }
  }, [data, maxItems])

  return <EChartsWrapper option={option} className={className} height={height} />
}
