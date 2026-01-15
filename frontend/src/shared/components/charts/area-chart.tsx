import ReactECharts from 'echarts-for-react'
import { Box } from '@chakra-ui/react'

interface AreaChartProps<T extends object> {
  data: T[]
  xKey: keyof T
  yKey: keyof T
  color?: string
  height?: string
  legendLabel?: string
}

export function AreaChart<T extends object>({
  data,
  xKey,
  yKey,
  color = '#FFA100',
  height = '300px',
  legendLabel,
}: AreaChartProps<T>) {
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
    },
    legend: legendLabel
      ? {
          data: [legendLabel],
          bottom: 0,
          icon: 'square',
          textStyle: {
            fontSize: 12,
            color: '#1C1C1C',
          },
        }
      : undefined,
    grid: {
      left: '3%',
      right: '4%',
      bottom: legendLabel ? '15%' : '3%',
      top: '10%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: data.map((item) => item[xKey]),
      boundaryGap: false,
      axisLine: {
        lineStyle: {
          color: '#E5E7EB',
          width: 1,
        },
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        fontSize: 12,
        color: '#1C1C1C',
      },
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        fontSize: 12,
        color: '#1C1C1C',
      },
    },
    series: [
      {
        name: legendLabel || String(yKey),
        type: 'line',
        data: data.map((item) => item[yKey]),
        smooth: true,
        color: color,
        symbol: 'none',
        showSymbol: false,
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: color + '80',
              },
              {
                offset: 1,
                color: color + '10',
              },
            ],
          },
        },
        lineStyle: {
          width: 2,
        },
      },
    ],
  }

  return (
    <Box height={height} width="100%">
      <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
    </Box>
  )
}
