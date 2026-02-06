import { useMemo } from 'react'
import { useTheme } from '@chakra-ui/react'
import * as echarts from 'echarts'
import { EChartsWrapper } from './echarts-wrapper'
import { getBodyText7Style } from './chart-text-style'
import type { EntityPerformance } from '../../types'

interface SupplySubmissionRateChartProps {
  data: EntityPerformance[]
  className?: string
  height?: string | number
  maxItems?: number
  entityLabel?: string
}

export function SupplySubmissionRateChart({
  data,
  className,
  height = '500px',
  maxItems = 5,
  entityLabel = 'States/UTs',
}: SupplySubmissionRateChartProps) {
  const theme = useTheme()

  const option = useMemo<echarts.EChartsOption>(() => {
    const chartData = data.slice(0, maxItems)
    const entities = chartData.map((d) => d.name)
    const rates = chartData.map((d) => d.regularity)
    const bodyText7 = getBodyText7Style(theme)

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
          fontSize: bodyText7.fontSize,
          lineHeight: bodyText7.lineHeight,
          fontWeight: 400,
          color: bodyText7.color,
        },
      },
      yAxis: {
        type: 'value',
        name: 'Percentage',
        nameLocation: 'middle',
        nameGap: 40,
        nameTextStyle: {
          fontSize: bodyText7.fontSize,
          lineHeight: bodyText7.lineHeight,
          fontWeight: 400,
          color: bodyText7.color,
        },
        axisLabel: {
          fontSize: bodyText7.fontSize,
          lineHeight: bodyText7.lineHeight,
          fontWeight: 400,
          color: bodyText7.color,
        },
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
            text: entityLabel,
            fill: bodyText7.color,
            fontSize: bodyText7.fontSize,
            fontWeight: 400,
            lineHeight: bodyText7.lineHeight,
          },
        },
      ],
    }
  }, [data, entityLabel, maxItems, theme])

  return <EChartsWrapper option={option} className={className} height={height} />
}
