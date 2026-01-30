import { useMemo } from 'react'
import { useTheme } from '@chakra-ui/react'
import * as echarts from 'echarts'
import { EChartsWrapper } from './echarts-wrapper'
import { getBodyText7Style } from './chart-text-style'
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
  const theme = useTheme()

  const option = useMemo<echarts.EChartsOption>(() => {
    const bodyText7 = getBodyText7Style(theme)

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
          fontSize: bodyText7.fontSize,
          fontWeight: 400,
          lineHeight: bodyText7.lineHeight,
          color: bodyText7.color,
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
  }, [data, theme])

  return <EChartsWrapper option={option} className={className} height={height} />
}
