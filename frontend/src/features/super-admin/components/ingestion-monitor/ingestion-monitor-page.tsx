import { useEffect, useState } from 'react'
import { Box, Flex, Grid, Text, Icon, Stack, Button, HStack, Badge } from '@chakra-ui/react'
import { getMockIngestionMonitorData } from '../../services/mock-data'
import { BarLineChart } from '@/shared/components/charts/bar-line-chart'
import { SearchableSelect } from '@/shared/components/common'
import type { IngestionMonitorData, IngestionLogEntry } from '../../types/ingestion-monitor'
import {
  STATE_FILTER_OPTIONS,
  TIME_FILTER_OPTIONS,
  STATUS_FILTER_OPTIONS,
} from '../../types/ingestion-monitor'
import { BiFilterAlt } from 'react-icons/bi'
import { FiDownload } from 'react-icons/fi'
import { IoCloudOutline, IoCloseCircleOutline, IoWarningOutline } from 'react-icons/io5'
import { BsCheck2Circle } from 'react-icons/bs'

export function IngestionMonitorPage() {
  const [data, setData] = useState<IngestionMonitorData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stateFilter, setStateFilter] = useState('all')
  const [timeFilter, setTimeFilter] = useState('7')
  const [statusFilter, setStatusFilter] = useState('all')
  const [retryKey, setRetryKey] = useState(0)

  useEffect(() => {
    let isMounted = true

    const fetchData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        // When switching to real API, filters will be passed here:
        const result = await getMockIngestionMonitorData()
        if (isMounted) {
          setData(result)
        }
      } catch (err) {
        if (isMounted) {
          console.error('Failed to fetch ingestion monitor data:', err)
          setError('Failed to load ingestion data. Please try again.')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      isMounted = false
    }
    // Re-fetch when filters change
  }, [stateFilter, timeFilter, retryKey])

  const formatTimestamp = (date: Date): string => {
    let hours = date.getHours()
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const ampm = hours >= 12 ? 'pm' : 'am'
    hours = hours % 12 || 12

    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()

    return `${hours}:${minutes}${ampm} | ${day}-${month}-${year}`
  }

  const getStatusBadge = (status: IngestionLogEntry['status']) => {
    const statusConfig = {
      successful: {
        bg: '#E1FFEA',
        color: '#079455',
        label: 'Successful',
      },
      warning: {
        bg: '#FFF3CD',
        color: '#CC8800',
        label: 'Warning',
      },
      failed: {
        bg: '#FEE4E2',
        color: '#D92D20',
        label: 'Failed',
      },
    }

    const config = statusConfig[status]
    return (
      <Badge
        bg={config.bg}
        color={config.color}
        px={2}
        py={0.5}
        borderRadius="16px"
        fontSize="12px"
        fontWeight="500"
        textTransform="capitalize"
        height="24px"
      >
        {config.label}
      </Badge>
    )
  }

  const filteredLogs =
    data?.logs.filter((log) => {
      if (statusFilter !== 'all' && log.status !== statusFilter) {
        return false
      }
      return true
    }) || []

  if (isLoading) {
    return (
      <Flex h="64" align="center" justify="center">
        <Text color="neutral.600">Loading...</Text>
      </Flex>
    )
  }

  if (error) {
    return (
      <Flex h="64" align="center" justify="center" direction="column" gap={4}>
        <Text color="red.500">{error}</Text>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            setStateFilter('all')
            setTimeFilter('7')
            setRetryKey((prev) => prev + 1)
          }}
        >
          Retry
        </Button>
      </Flex>
    )
  }

  if (!data) {
    return (
      <Flex h="64" align="center" justify="center">
        <Text color="neutral.600">No data available</Text>
      </Flex>
    )
  }

  const statsCards = [
    {
      title: 'Total Ingestions',
      value: data.stats.totalIngestions.toLocaleString(),
      subtitle: 'Across all States/UTs',
      icon: IoCloudOutline,
      iconBg: '#EBF4FA',
      iconColor: '#3291D1',
    },
    {
      title: 'Successful Ingestions',
      value: data.stats.successfulIngestions.toLocaleString(),
      subtitle: `${data.stats.successRate}% success rate`,
      subtitleColor: '#079455',
      icon: BsCheck2Circle,
      iconBg: '#E1FFEA',
      iconColor: '#079455',
    },
    {
      title: 'Failed Ingestions',
      value: data.stats.failedIngestions.toLocaleString(),
      subtitle: `${data.stats.failureRate}% failure rate`,
      subtitleColor: '#D92D20',
      icon: IoCloseCircleOutline,
      iconBg: '#FEE4E2',
      iconColor: '#D92D20',
    },
    {
      title: 'Current Warnings',
      value: data.stats.currentWarnings.toLocaleString(),
      subtitle: 'Issues requiring attention',
      icon: IoWarningOutline,
      iconBg: '#FFF3CD',
      iconColor: '#CC8800',
    },
  ]

  return (
    <Box w="full">
      {/* Page Header */}
      <Flex justify="space-between" align="center" mb={5} h={12}>
        <Text textStyle="h5">Ingestion Monitor</Text>
      </Flex>

      <Stack gap={6}>
        {/* Filters Row */}
        <Flex
          justify="space-between"
          align="center"
          bg="white"
          py={4}
          px={6}
          border="0.5px"
          borderColor="neutral.200"
          borderRadius="12px"
          h={16}
        >
          <HStack spacing={2} h={8}>
            <HStack spacing={2}>
              <Icon as={BiFilterAlt} boxSize={5} />
              <Text fontSize="14px" fontWeight="500">
                Filters
              </Text>
            </HStack>
            <SearchableSelect
              options={STATE_FILTER_OPTIONS}
              value={stateFilter}
              onChange={setStateFilter}
              placeholder="All States/UTs"
              width="160px"
              fontSize="14px"
              textColor="neutral.400"
              height="32px"
            />
            <SearchableSelect
              options={TIME_FILTER_OPTIONS}
              value={timeFilter}
              onChange={setTimeFilter}
              placeholder="Last 7 Days"
              width="140px"
              fontSize="14px"
              textColor="neutral.400"
              height="32px"
            />
          </HStack>
          <Button variant="primary" size="sm" leftIcon={<Icon as={FiDownload} boxSize={4} />}>
            Export Data
          </Button>
        </Flex>

        {/* Stats Cards */}
        <Grid templateColumns="repeat(4, 1fr)" gap={7} h="200px" mb={1}>
          {statsCards.map((stat) => {
            const StatIcon = stat.icon
            return (
              <Box
                key={stat.title}
                bg="white"
                borderWidth="0.5px"
                borderColor="neutral.200"
                borderRadius="12px"
                boxShadow="default"
                px={4}
                py={6}
              >
                <Flex direction="column" gap={3}>
                  <Flex
                    h="40px"
                    w="40px"
                    align="center"
                    justify="center"
                    borderRadius="full"
                    bg={stat.iconBg}
                  >
                    <Icon as={StatIcon} boxSize={5} color={stat.iconColor} />
                  </Flex>
                  <Flex direction="column" gap={1}>
                    <Text color="neutral.600" fontSize="14px">
                      {stat.title}
                    </Text>
                    <Text textStyle="h9">{stat.value}</Text>
                    <Text fontSize="14px" color={stat.subtitleColor || 'neutral.600'}>
                      {stat.subtitle}
                    </Text>
                  </Flex>
                </Flex>
              </Box>
            )
          })}
        </Grid>

        {/* Ingestion Success Rate Chart */}
        <Box
          bg="white"
          borderWidth="0.5px"
          borderColor="neutral.200"
          borderRadius="16px"
          boxShadow="default"
          py={6}
          px={4}
          mb={1}
        >
          <Text textStyle="h8" mb={4}>
            Ingestion Success Rate Over Time
          </Text>
          <BarLineChart
            data={data.chartData}
            xKey="month"
            barKey="successfulIngestions"
            lineKey="failedIngestions"
            barColor="#3291D1"
            lineColor="#FFA100"
            height="400px"
            barLegendLabel="Successful Ingestions"
            lineLegendLabel="Failed Ingestions"
          />
        </Box>

        {/* Detailed Ingestion Logs */}
        <Box
          bg="white"
          borderWidth="0.5px"
          borderColor="neutral.200"
          borderRadius="12px"
          boxShadow="default"
          py={4}
          px={4}
        >
          <Flex justify="space-between" align="center" mb={3}>
            <Text fontSize="14px" fontWeight="500" color="neutral.700">
              Detailed Ingestion Logs
            </Text>
            <SearchableSelect
              options={STATUS_FILTER_OPTIONS}
              value={statusFilter}
              onChange={setStatusFilter}
              placeholder="Status"
              width="120px"
              fontSize="13px"
              height="32px"
            />
          </Flex>

          <Stack gap={0}>
            {filteredLogs.map((log, index) => (
              <Box
                key={log.id}
                py={3}
                borderTopWidth={index > 0 ? '1px' : '0'}
                borderColor="neutral.100"
              >
                <Flex justify="space-between" align="center" gap={4}>
                  <Box minW={0} width="600px">
                    <Text fontSize="13px" fontWeight="600" color="neutral.950" mb={0.5}>
                      {log.title}
                      {log.status === 'successful' && log.recordsProcessed && (
                        <Text as="span" fontWeight="400">
                          {' '}
                          Records Processed: {log.recordsProcessed.toLocaleString()}
                        </Text>
                      )}
                    </Text>

                    <Text fontSize="12px" color="neutral.600" mb={0.5}>
                      Batch ID: {log.batchId} Source System: {log.sourceSystem} Processing Time:{' '}
                      {log.processingTime}
                    </Text>

                    {log.status === 'successful' && (
                      <Text fontSize="12px" color="neutral.600">
                        No anomalies detected during ingestion.
                      </Text>
                    )}
                    {log.status === 'warning' && log.issueDetails && (
                      <Text fontSize="12px" color="neutral.600">
                        Issue: {log.issueDetails}
                      </Text>
                    )}
                    {log.status === 'failed' && log.errorDetails && (
                      <Text fontSize="12px" color="neutral.600">
                        Error: {log.errorDetails}
                      </Text>
                    )}
                  </Box>
                  {getStatusBadge(log.status)}
                  <Text fontSize="12px" color="neutral.600" whiteSpace="nowrap">
                    {formatTimestamp(log.timestamp)}
                  </Text>
                </Flex>
              </Box>
            ))}
          </Stack>
        </Box>
      </Stack>
    </Box>
  )
}
