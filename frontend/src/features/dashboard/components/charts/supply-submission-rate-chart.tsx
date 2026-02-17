import { useMemo } from 'react'
import { Box, useBreakpointValue, useTheme } from '@chakra-ui/react'
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
  const barWidth = useBreakpointValue({ base: 28, sm: 28, md: 42, lg: 66 }) ?? 66
  const barRadius = useBreakpointValue({ base: 8, sm: 10, md: 12 }) ?? 12

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
        axisLine: {
          lineStyle: {
            color: '#E4E4E7',
          },
        },
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
            color: '#E4E4E7',
          },
        },
      },
      series: [
        {
          name: 'Submission Rate',
          type: 'bar',
          data: rates,
          barWidth,
          itemStyle: {
            color: '#3291D1',
            borderRadius: [barRadius, barRadius, barRadius, barRadius],
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
  }, [data, entityLabel, maxItems, theme, barWidth, barRadius])

  return (
    <Box width="100%" maxW={{ base: '280px', sm: '100%' }} mx={{ base: 'auto', sm: '0' }}>
      <EChartsWrapper option={option} className={className} height={height} />
    </Box>
  )
}
