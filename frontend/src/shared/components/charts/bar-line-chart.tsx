import ReactECharts from 'echarts-for-react'
import { Box } from '@chakra-ui/react'

interface BarLineChartProps<T extends object> {
  data: T[]
  xKey: keyof T
  barKey: keyof T
  lineKey: keyof T
  barColor?: string
  lineColor?: string
  height?: string
  barLegendLabel?: string
  lineLegendLabel?: string
}

export function BarLineChart<T extends object>({
  data,
  xKey,
  barKey,
  lineKey,
  barColor = '#3291D1',
  lineColor = '#FFA100',
  height = '400px',
  barLegendLabel,
  lineLegendLabel,
}: BarLineChartProps<T>) {
  const legendData = [barLegendLabel || String(barKey), lineLegendLabel || String(lineKey)]

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
    },
    legend: {
      data: legendData,
      bottom: 0,
      icon: 'square',
      textStyle: {
        fontSize: 12,
        color: '#1C1C1C',
      },
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
    yAxis: [
      {
        type: 'value',
        position: 'left',
        axisLabel: {
          fontSize: 12,
          color: '#1C1C1C',
        },
        splitLine: {
          lineStyle: {
            color: '#E5E7EB',
            type: 'dashed',
          },
        },
      },
      {
        type: 'value',
        position: 'right',
        axisLabel: {
          fontSize: 12,
          color: '#1C1C1C',
        },
        splitLine: {
          show: false,
        },
      },
    ],
    series: [
      {
        name: lineLegendLabel || String(lineKey),
        type: 'line',
        yAxisIndex: 1,
        z: 1,
        data: data.map((item) => item[lineKey]),
        smooth: true,
        symbol: 'none',
        showSymbol: false,
        lineStyle: {
          width: 2,
          color: lineColor,
        },
        itemStyle: {
          color: lineColor,
        },
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
                color: lineColor + '40',
              },
              {
                offset: 1,
                color: lineColor + '10',
              },
            ],
          },
        },
      },
      {
        name: barLegendLabel || String(barKey),
        type: 'bar',
        z: 2,
        data: data.map((item) => item[barKey]),
        itemStyle: {
          color: barColor,
          borderRadius: [4, 4, 0, 0],
        },
        barCategoryGap: '40%',
      },
    ],
  }

  return (
    <Box height={height} width="100%">
      <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
    </Box>
  )
}
