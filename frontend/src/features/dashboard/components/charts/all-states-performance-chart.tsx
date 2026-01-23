import { useMemo } from 'react'
import * as echarts from 'echarts'
import { EChartsWrapper } from './echarts-wrapper'
import type { EntityPerformance } from '../../types'

interface AllStatesPerformanceChartProps {
  data: EntityPerformance[]
  className?: string
  height?: string | number
  maxItems?: number
}

export function AllStatesPerformanceChart({
  data,
  className,
  height = '400px',
  maxItems = 5,
}: AllStatesPerformanceChartProps) {
  const option = useMemo<echarts.EChartsOption>(() => {
    const sortedData = [...data].sort((a, b) => b.quantity - a.quantity).slice(0, maxItems)
    const entities = sortedData.map((d) => d.name)
    const quantity = sortedData.map((d) => d.quantity)
    const regularity = sortedData.map((d) => d.regularity)

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      legend: {
        data: ['Quantity', 'Regularity'],
        bottom: 8,
        left: 'center',
        icon: 'rect',
        itemWidth: 10,
        itemHeight: 10,
      },
      grid: {
        left: '10%',
        right: '4%',
        top: '10%',
        bottom: '26%',
        containLabel: true,
      },
      graphic: [
        {
          type: 'text',
          left: 'center',
          bottom: 36,
          style: {
            text: 'States/UTs',
            fill: '#70707B',
            fontSize: 12,
            fontWeight: 400,
            lineHeight: 18,
          },
        },
      ],
      xAxis: {
        type: 'category',
        data: entities,
        axisTick: {
          show: false,
        },
        axisLabel: {
          rotate: 0,
          interval: 0,
          margin: 20,
        },
      },
      yAxis: {
        type: 'value',
        name: 'Quantity & Regularity',
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
          name: 'Quantity',
          type: 'bar',
          data: quantity,
          barWidth: 34,
          itemStyle: {
            color: '#3291D1',
            borderRadius: [4, 4, 0, 0],
          },
        },
        {
          name: 'Regularity',
          type: 'bar',
          data: regularity,
          barWidth: 34,
          barGap: '30%',
          itemStyle: {
            color: '#ADD3ED',
            borderRadius: [4, 4, 0, 0],
          },
        },
      ],
    }
  }, [data, maxItems])

  return <EChartsWrapper option={option} className={className} height={height} />
}
