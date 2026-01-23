import { useMemo } from 'react'
import { useTheme, useToken } from '@chakra-ui/react'
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
  const theme = useTheme()
  const bodyText7 = theme.textStyles?.bodyText7 as
    | {
        fontSize?: string | number
        lineHeight?: string | number
        fontWeight?: string | number
        color?: string
      }
    | undefined
  const bodyTextColorToken =
    bodyText7?.color && bodyText7.color.includes('.') ? bodyText7.color : 'neutral.500'
  const [quantityColor, regularityColor] = useToken('colors', ['primary.500', 'primary.200'])
  const [bodyTextColor] = useToken('colors', [bodyTextColorToken])
  const labelColor =
    bodyText7?.color && !bodyText7.color.includes('.') ? bodyText7.color : bodyTextColor
  const labelFontSize =
    typeof bodyText7?.fontSize === 'string'
      ? Number.parseInt(bodyText7.fontSize, 10)
      : bodyText7?.fontSize
  const labelLineHeight =
    typeof bodyText7?.lineHeight === 'string'
      ? Number.parseInt(bodyText7.lineHeight, 10)
      : bodyText7?.lineHeight
  const labelFontWeight = bodyText7?.fontWeight ?? 400
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
            fill: labelColor,
            fontSize: labelFontSize,
            fontWeight: labelFontWeight,
            fontFamily: theme.fonts?.body,
            lineHeight: labelLineHeight,
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
            color: quantityColor,
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
            color: regularityColor,
            borderRadius: [4, 4, 0, 0],
          },
        },
      ],
    }
  }, [
    data,
    maxItems,
    quantityColor,
    regularityColor,
    labelColor,
    labelFontSize,
    labelFontWeight,
    labelLineHeight,
    theme.fonts?.body,
  ])

  return <EChartsWrapper option={option} className={className} height={height} />
}
