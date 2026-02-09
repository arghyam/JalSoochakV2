import { useMemo } from 'react'
import { useTheme } from '@chakra-ui/react'
import * as echarts from 'echarts'
import { EChartsWrapper } from './echarts-wrapper'
import { getBodyText7Style } from './chart-text-style'
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
  const theme = useTheme()
  const bodyText7 = getBodyText7Style(theme)

  const option = useMemo<echarts.EChartsOption>(() => {
    const districts = data.map((entry) => entry.district)

    return {
      tooltip: {
        show: false,
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
          fontSize: bodyText7.fontSize,
          lineHeight: bodyText7.lineHeight,
          fontWeight: 400,
          color: bodyText7.color,
        },
        name: 'Districts',
        nameLocation: 'middle',
        nameGap: 64,
        nameTextStyle: {
          fontSize: bodyText7.fontSize,
          lineHeight: bodyText7.lineHeight,
          fontWeight: 400,
          color: bodyText7.color,
        },
      },
      yAxis: {
        type: 'value',
        name: 'No. of days',
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
  }, [data, bodyText7])

  const containerHeight = typeof height === 'number' ? `${height}px` : height
  const legendItems = [
    { label: 'Electricity failure', color: outageColors.electricityFailure },
    { label: 'Pipeline leak', color: outageColors.pipelineLeak },
    { label: 'Pump failure', color: outageColors.pumpFailure },
    { label: 'Valve issue', color: outageColors.valveIssue },
    { label: 'Source drying', color: outageColors.sourceDrying },
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
          flexWrap: 'wrap',
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
