import { useMemo } from 'react'
import * as echarts from 'echarts'
import { EChartsWrapper } from './echarts-wrapper'
import type { WaterSupplyOutageData } from '../../types'

interface WaterSupplyOutagesChartProps {
  data: WaterSupplyOutageData[]
  className?: string
  height?: string | number
}

const outageColors = {
  electricityFailure: '#D6E9F6',
  pipelineLeak: '#ADD3ED',
  pumpFailure: '#84BDE3',
  valveIssue: '#3291D1',
  sourceDrying: '#1E577D',
}

export function WaterSupplyOutagesChart({
  data,
  className,
  height = '300px',
}: WaterSupplyOutagesChartProps) {
  const option = useMemo<echarts.EChartsOption>(() => {
    const districts = data.map((entry) => entry.district)

    return {
      tooltip: {
        show: false,
      },
      legend: {
        data: [
          'Electricity failure',
          'Pipeline leak',
          'Pump failure',
          'Valve issue',
          'Source drying',
        ],
        bottom: 0,
        left: 'center',
        icon: 'rect',
        itemWidth: 10,
        itemHeight: 10,
      },
      grid: {
        left: '8%',
        right: '4%',
        top: '12%',
        bottom: '18%',
        height: 300,
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: districts,
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
        name: 'Districts',
        nameLocation: 'middle',
        nameGap: 64,
        nameTextStyle: {
          fontSize: 12,
          lineHeight: 16,
          fontWeight: 400,
          color: '#1C1C1C',
        },
      },
      yAxis: {
        type: 'value',
        name: 'No. of Outages',
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
          name: 'Source drying',
          type: 'bar',
          stack: 'outages',
          data: data.map((entry) => entry.sourceDrying),
          barWidth: 66,
          itemStyle: {
            color: outageColors.sourceDrying,
            borderRadius: [0, 0, 12, 12],
          },
        },
        {
          name: 'Valve issue',
          type: 'bar',
          stack: 'outages',
          data: data.map((entry) => entry.valveIssue),
          barWidth: 66,
          itemStyle: {
            color: outageColors.valveIssue,
          },
        },
        {
          name: 'Pump failure',
          type: 'bar',
          stack: 'outages',
          data: data.map((entry) => entry.pumpFailure),
          barWidth: 66,
          itemStyle: {
            color: outageColors.pumpFailure,
          },
        },
        {
          name: 'Pipeline leak',
          type: 'bar',
          stack: 'outages',
          data: data.map((entry) => entry.pipelineLeak),
          barWidth: 66,
          itemStyle: {
            color: outageColors.pipelineLeak,
          },
        },
        {
          name: 'Electricity failure',
          type: 'bar',
          stack: 'outages',
          data: data.map((entry) => entry.electricityFailure),
          barWidth: 66,
          itemStyle: {
            color: outageColors.electricityFailure,
            borderRadius: [12, 12, 0, 0],
          },
        },
      ],
    }
  }, [data])

  return <EChartsWrapper option={option} className={className} height={height} />
}
