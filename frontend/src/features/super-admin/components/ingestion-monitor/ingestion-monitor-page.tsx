import { useEffect, useState } from 'react'
import { Box, Flex, Grid, Text, Icon, Stack, Button, HStack, Badge } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation(['super-admin', 'common'])
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
          setError(t('common:toast.failedToLoad'))
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
  }, [stateFilter, timeFilter, retryKey, t])

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
        label: t('common:status.successful'),
      },
      warning: {
        bg: '#FFF3CD',
        color: '#CC8800',
        label: t('common:status.warning'),
      },
      failed: {
        bg: '#FEE4E2',
        color: '#D92D20',
        label: t('common:status.failed'),
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
        <Text color="neutral.600">{t('common:loading')}</Text>
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
          {t('common:retry')}
        </Button>
      </Flex>
    )
  }

  if (!data) {
    return (
      <Flex h="64" align="center" justify="center">
        <Text color="neutral.600">{t('common:noDataAvailable')}</Text>
      </Flex>
    )
  }

  const statsCards = [
    {
      title: t('ingestionMonitor.stats.totalIngestions'),
      value: data.stats.totalIngestions.toLocaleString(),
      subtitle: t('ingestionMonitor.stats.acrossAllStatesUts'),
      icon: IoCloudOutline,
      iconBg: '#EBF4FA',
      iconColor: '#3291D1',
    },
    {
      title: t('ingestionMonitor.stats.successfulIngestions'),
      value: data.stats.successfulIngestions.toLocaleString(),
      subtitle: t('ingestionMonitor.stats.successRate', { rate: data.stats.successRate }),
      subtitleColor: '#079455',
      icon: BsCheck2Circle,
      iconBg: '#E1FFEA',
      iconColor: '#079455',
    },
    {
      title: t('ingestionMonitor.stats.failedIngestions'),
      value: data.stats.failedIngestions.toLocaleString(),
      subtitle: t('ingestionMonitor.stats.failureRate', { rate: data.stats.failureRate }),
      subtitleColor: '#D92D20',
      icon: IoCloseCircleOutline,
      iconBg: '#FEE4E2',
      iconColor: '#D92D20',
    },
    {
      title: t('ingestionMonitor.stats.currentWarnings'),
      value: data.stats.currentWarnings.toLocaleString(),
      subtitle: t('ingestionMonitor.stats.issuesRequiringAttention'),
      icon: IoWarningOutline,
      iconBg: '#FFF3CD',
      iconColor: '#CC8800',
    },
  ]

  return (
    <Box w="full">
      {/* Page Header */}
      <Flex justify="space-between" align="center" mb={5} h={12}>
        <Text textStyle="h5">{t('ingestionMonitor.title')}</Text>
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
                {t('common:filters')}
              </Text>
            </HStack>
            <SearchableSelect
              options={STATE_FILTER_OPTIONS}
              value={stateFilter}
              onChange={setStateFilter}
              placeholder={t('ingestionMonitor.filters.allStatesUts')}
              width="160px"
              fontSize="14px"
              textColor="neutral.400"
              primaryColor="neutral.400"
              borderRadius="4px"
              height="32px"
            />
            <SearchableSelect
              options={TIME_FILTER_OPTIONS}
              value={timeFilter}
              onChange={setTimeFilter}
              placeholder={t('ingestionMonitor.filters.lastDays', { days: 7 })}
              width="140px"
              fontSize="14px"
              textColor="neutral.400"
              primaryColor="neutral.400"
              borderRadius="4px"
              height="32px"
            />
          </HStack>
          <Button variant="primary" size="sm" leftIcon={<Icon as={FiDownload} boxSize={4} />}>
            {t('common:button.exportData')}
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
            {t('ingestionMonitor.charts.ingestionSuccessRate')}
          </Text>
          <BarLineChart
            data={data.chartData}
            xKey="month"
            barKey="successfulIngestions"
            lineKey="failedIngestions"
            barColor="#3291D1"
            lineColor="#FFA100"
            height="400px"
            barLegendLabel={t('overview.charts.successfulIngestions')}
            lineLegendLabel={t('overview.charts.failedIngestions')}
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
              {t('ingestionMonitor.logs.title')}
            </Text>
            <SearchableSelect
              options={STATUS_FILTER_OPTIONS}
              value={statusFilter}
              onChange={setStatusFilter}
              placeholder={t('common:status')}
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
                          {t('ingestionMonitor.logs.recordsProcessed', {
                            recordCount: log.recordsProcessed.toLocaleString(),
                          })}
                        </Text>
                      )}
                    </Text>

                    <Text fontSize="12px" color="neutral.600" mb={0.5}>
                      {t('ingestionMonitor.logs.batchId')} {log.batchId}{' '}
                      {t('ingestionMonitor.logs.sourceSystem')} {log.sourceSystem}{' '}
                      {t('ingestionMonitor.logs.processingTime')} {log.processingTime}
                    </Text>

                    {log.status === 'successful' && (
                      <Text fontSize="12px" color="neutral.600">
                        {t('ingestionMonitor.logs.noAnomalies')}
                      </Text>
                    )}
                    {log.status === 'warning' && log.issueDetails && (
                      <Text fontSize="12px" color="neutral.600">
                        {t('ingestionMonitor.logs.issue')} {log.issueDetails}
                      </Text>
                    )}
                    {log.status === 'failed' && log.errorDetails && (
                      <Text fontSize="12px" color="neutral.600">
                        {t('ingestionMonitor.logs.error')} {log.errorDetails}
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
