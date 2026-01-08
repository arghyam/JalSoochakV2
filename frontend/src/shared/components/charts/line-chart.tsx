import ReactECharts from 'echarts-for-react'
import { Box } from '@chakra-ui/react'

interface LineChartProps<T extends object> {
  data: T[]
  xKey: keyof T
  yKeys: (keyof T)[]
  colors?: string[]
  height?: string
}

export function LineChart<T extends object>({
  data,
  xKey,
  yKeys,
  colors = ['#3291D1', '#D92D20'],
  height = '300px',
}: LineChartProps<T>) {
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
    },
    legend: {
      data: yKeys.map(String),
      bottom: 0,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
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
    series: yKeys.map((key, index) => ({
      name: String(key),
      type: 'line',
      data: data.map((item) => item[key]),
      smooth: true,
      color: colors[index] || '#3291D1',
      lineStyle: {
        width: 2,
      },
    })),
  }

  return (
    <Box height={height} width="100%">
      <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
    </Box>
  )
}
