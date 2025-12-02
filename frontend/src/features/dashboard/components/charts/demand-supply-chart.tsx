import { useMemo } from 'react'
import * as echarts from 'echarts'
import { EChartsWrapper } from './echarts-wrapper'
import type { DemandSupplyData } from '../../types'

interface DemandSupplyChartProps {
  data: DemandSupplyData[]
  className?: string
  height?: string | number
}

export function DemandSupplyChart({ data, className, height = '400px' }: DemandSupplyChartProps) {
  const option = useMemo<echarts.EChartsOption>(() => {
    const periods = data.map((d) => d.period)
    const demand = data.map((d) => d.demand)
    const supply = data.map((d) => d.supply)

    return {
      title: {
        text: 'Water Demand vs Supply',
        left: 'center',
        textStyle: {
          fontSize: 16,
          fontWeight: 'bold',
        },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
        },
      },
      legend: {
        data: ['Demand', 'Supply'],
        bottom: 10,
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: periods,
        axisLabel: {
          rotate: 45,
        },
      },
      yAxis: {
        type: 'value',
        name: 'LPCD',
        nameLocation: 'middle',
        nameGap: 50,
      },
      series: [
        {
          name: 'Demand',
          type: 'line',
          data: demand,
          smooth: true,
          itemStyle: {
            color: '#3b82f6', // blue
          },
          lineStyle: {
            width: 2,
          },
        },
        {
          name: 'Supply',
          type: 'line',
          data: supply,
          smooth: true,
          itemStyle: {
            color: '#22c55e', // green
          },
          lineStyle: {
            width: 2,
          },
        },
      ],
    }
  }, [data])

  return <EChartsWrapper option={option} className={className} height={height} />
}
