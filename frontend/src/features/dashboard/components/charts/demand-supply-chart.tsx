import { useMemo } from 'react'
import { useToken } from '@chakra-ui/react'
import * as echarts from 'echarts'
import { EChartsWrapper } from './echarts-wrapper'
import type { DemandSupplyData } from '../../types'

interface DemandSupplyChartProps {
  data: DemandSupplyData[]
  className?: string
  height?: string | number
}

export function DemandSupplyChart({ data, className, height = '400px' }: DemandSupplyChartProps) {
  const [titleColor] = useToken('colors', ['neutral.950'])
  const option = useMemo<echarts.EChartsOption>(() => {
    const periods = data.map((d) => d.period)
    const demand = data.map((d) => d.demand)
    const supply = data.map((d) => d.supply)

    return {
      tooltip: {
        show: false,
      },
      legend: {
        data: ['Demand', 'Supply'],
        bottom: 8,
        left: 'center',
        icon: 'rect',
        itemWidth: 10,
        itemHeight: 10,
      },
      grid: {
        left: '8%',
        right: '4%',
        top: '14%',
        bottom: '26%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: periods,
        name: 'Year',
        nameLocation: 'middle',
        nameGap: 28,
        axisLabel: {
          rotate: 0,
        },
      },
      yAxis: {
        type: 'value',
        name: 'Quantity (units)',
        nameLocation: 'middle',
        nameGap: 40,
        interval: 25,
        max: 125,
      },
      series: [
        {
          name: 'Demand',
          type: 'line',
          data: demand,
          smooth: false,
          symbol: 'none',
          itemStyle: {
            color: '#3291D1',
          },
          lineStyle: {
            width: 2,
          },
        },
        {
          name: 'Supply',
          type: 'line',
          data: supply,
          smooth: false,
          symbol: 'none',
          itemStyle: {
            color: '#ADD3ED', // light blue
          },
          lineStyle: {
            width: 2,
          },
        },
      ],
    }
  }, [data, titleColor])

  return <EChartsWrapper option={option} className={className} height={height} />
}
