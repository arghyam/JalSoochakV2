import { useMemo } from 'react'
import { useBreakpointValue, useTheme } from '@chakra-ui/react'
import * as echarts from 'echarts'
import { EChartsWrapper } from './echarts-wrapper'
import { getBodyText7Style } from './chart-text-style'
import type { EntityPerformance } from '../../types'

interface AllStatesPerformanceChartProps {
  data: EntityPerformance[]
  className?: string
  height?: string | number
  maxItems?: number
  entityLabel?: string
}

export function AllStatesPerformanceChart({
  data,
  className,
  height = '536px',
  maxItems = 5,
  entityLabel = 'States/UTs',
}: AllStatesPerformanceChartProps) {
  const theme = useTheme()
  const bodyText7 = getBodyText7Style(theme)
  const barWidth = useBreakpointValue({ base: 16, sm: 20, md: 34 }) ?? 34

  const option = useMemo<echarts.EChartsOption>(() => {
    const sortedData = [...data].sort((a, b) => b.quantity - a.quantity).slice(0, maxItems)
    const entities = sortedData.map((d) => d.name)
    const quantity = sortedData.map((d) => d.quantity)
    const regularity = sortedData.map((d) => d.regularity)

    return {
      tooltip: {
        show: false,
      },
      grid: {
        left: '10%',
        right: '4%',
        top: '10%',
        bottom: '5%',
        containLabel: true,
      },
      graphic: [
        {
          type: 'text',
          left: 'center',
          bottom: 5,
          style: {
            text: entityLabel,
            fill: bodyText7.color,
            fontSize: bodyText7.fontSize,
            fontWeight: 400,
            lineHeight: bodyText7.lineHeight,
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
          rotate: 45,
          interval: 0,
          margin: 15,
          fontSize: bodyText7.fontSize,
          lineHeight: bodyText7.lineHeight,
          fontWeight: 400,
          color: bodyText7.color,
        },
      },
      yAxis: {
        type: 'value',
        name: 'Quantity & Regularity',
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
          name: 'Quantity',
          type: 'bar',
          data: quantity,
          barWidth,
          itemStyle: {
            color: '#3291D1',
            borderRadius: [4, 4, 0, 0],
          },
        },
        {
          name: 'Regularity',
          type: 'bar',
          data: regularity,
          barWidth,
          barGap: '30%',
          itemStyle: {
            color: '#ADD3ED',
            borderRadius: [4, 4, 0, 0],
          },
        },
      ],
    }
  }, [data, maxItems, bodyText7, entityLabel, barWidth])

  const containerHeight = typeof height === 'number' ? `${height}px` : height
  const legendItems = [
    { label: 'Quantity', color: '#3291D1' },
    { label: 'Regularity', color: '#ADD3ED' },
  ]

  return (
    <div
      className={className}
      style={{
        width: '100%',
        height: containerHeight,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ flex: 1, minHeight: 0 }}>
        <EChartsWrapper option={option} height="100%" />
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          paddingTop: '8px',
        }}
      >
        {legendItems.map((item) => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span
              aria-hidden="true"
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '2px',
                backgroundColor: item.color,
                display: 'inline-block',
              }}
            />
            <span
              style={{
                fontSize: bodyText7.fontSize,
                lineHeight: `${bodyText7.lineHeight}px`,
                fontWeight: 400,
                color: bodyText7.color,
              }}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
