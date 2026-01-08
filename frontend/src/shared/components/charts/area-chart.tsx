import ReactECharts from 'echarts-for-react'
import { Box } from '@chakra-ui/react'

interface AreaChartProps<T extends object> {
  data: T[]
  xKey: keyof T
  yKey: keyof T
  color?: string
  height?: string
}

export function AreaChart<T extends object>({
  data,
  xKey,
  yKey,
  color = '#FFA100',
  height = '300px',
}: AreaChartProps<T>) {
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '10%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: data.map((item) => item[xKey]),
      boundaryGap: false,
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: String(yKey),
        type: 'line',
        data: data.map((item) => item[yKey]),
        smooth: true,
        color: color,
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
