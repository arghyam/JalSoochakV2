import { useMemo } from 'react'
import * as echarts from 'echarts'
import { EChartsWrapper } from './echarts-wrapper'
import type { ImageSubmissionStatusData } from '../../types'

interface ImageSubmissionStatusChartProps {
  data: ImageSubmissionStatusData[]
  className?: string
  height?: string | number
}

const defaultColors = ['#3291D1', '#ADD3ED']

export function ImageSubmissionStatusChart({
  data,
  className,
  height = '406px',
}: ImageSubmissionStatusChartProps) {
  const option = useMemo<echarts.EChartsOption>(() => {
    return {
      tooltip: {
        show: false,
      },
      legend: {
        bottom: 0,
        left: 'center',
        icon: 'rect',
        itemWidth: 10,
        itemHeight: 10,
        itemGap: 16,
        textStyle: {
          fontSize: 12,
          fontWeight: 400,
          color: '#1C1C1C',
        },
      },
      series: [
        {
          type: 'pie',
          radius: ['0%', '68%'],
          center: ['50%', '45%'],
          avoidLabelOverlap: true,
          label: {
            show: false,
          },
          labelLine: {
            show: false,
          },
          data: data.map((entry, index) => ({
            name: entry.label,
            value: entry.value,
            itemStyle: {
              color: defaultColors[index % defaultColors.length],
            },
          })),
        },
      ],
    }
  }, [data])

  return <EChartsWrapper option={option} className={className} height={height} />
}
