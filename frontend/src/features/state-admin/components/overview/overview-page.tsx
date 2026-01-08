import { useEffect, useState } from 'react'
import { Box, Flex, Grid, Text, Icon } from '@chakra-ui/react'
import {
  CheckCircleIcon,
  WarningIcon,
  InfoIcon,
  AttachmentIcon,
  SettingsIcon,
} from '@chakra-ui/icons'
import { useAuthStore } from '@/app/store'
import { getMockOverviewData } from '../../services/mock-data'
import { LineChart } from '@/shared/components/charts/line-chart'
import { AreaChart } from '@/shared/components/charts/area-chart'
import type { OverviewData } from '../../types/overview'

export function OverviewPage() {
  const user = useAuthStore((state) => state.user)
  const [data, setData] = useState<OverviewData | null>(null)

  useEffect(() => {
    getMockOverviewData().then(setData)
  }, [])

  if (!data) {
    return (
      <Flex h="64" align="center" justify="center">
        <Text color="neutral.600">Loading...</Text>
      </Flex>
    )
  }

  const statsCards = [
    {
      title: 'Pump Operators Synced',
      value: data.stats.pumpOperatorsSynced.toLocaleString(),
      subtitle: 'Out of 30',
      icon: InfoIcon,
      iconBg: 'blue.100',
      iconColor: 'blue.600',
    },
    {
      title: 'Configuration Status',
      value: data.stats.configurationStatus,
      subtitle: 'All modules configured',
      icon: CheckCircleIcon,
      iconBg: 'green.100',
      iconColor: 'green.600',
    },
    {
      title: "Today's API Ingestion",
      value: data.stats.todayApiIngestion,
      subtitle: 'Successfully ingested',
      icon: AttachmentIcon,
      iconBg: 'blue.100',
      iconColor: 'blue.600',
    },
    {
      title: 'Pending Data Sync',
      value: data.stats.pendingDataSync.toLocaleString(),
      subtitle: 'Requires Attention',
      icon: WarningIcon,
      iconBg: 'red.100',
      iconColor: 'red.600',
    },
    {
      title: 'Active Integrations',
      value: data.stats.activeIntegrations.toLocaleString(),
      subtitle: 'WhatsApp, Glyphic',
      icon: SettingsIcon,
      iconBg: 'purple.100',
      iconColor: 'purple.600',
    },
  ]

  return (
    <Box w="full">
      {/* Page Header */}
      <Box mb={6}>
        <Text fontSize="2xl" fontWeight="semibold" color="neutral.800">
          Overview of {user?.tenantId || 'State'}
        </Text>
      </Box>

      {/* Stats Cards */}
      <Grid templateColumns="repeat(5, 1fr)" gap={4} mb={6}>
        {statsCards.map((stat) => {
          const StatIcon = stat.icon
          return (
            <Box
              key={stat.title}
              bg="white"
              borderWidth="1px"
              borderColor="neutral.100"
              borderRadius="lg"
              boxShadow="default"
              p={4}
            >
              <Flex direction="column" gap={3}>
                <Flex
                  h="40px"
                  w="40px"
                  align="center"
                  justify="center"
                  borderRadius="lg"
                  bg={stat.iconBg}
                >
                  <Icon as={StatIcon} boxSize={5} color={stat.iconColor} />
                </Flex>
                <Box>
                  <Text fontSize="xs" color="neutral.600" mb={1}>
                    {stat.title}
                  </Text>
                  <Text fontSize="2xl" fontWeight="semibold" color="neutral.800" mb={0.5}>
                    {stat.value}
                  </Text>
                  <Text fontSize="xs" color="neutral.500">
                    {stat.subtitle}
                  </Text>
                </Box>
              </Flex>
            </Box>
          )
        })}
      </Grid>

      {/* Demand vs Supply Chart */}
      <Box
        bg="white"
        borderWidth="1px"
        borderColor="neutral.100"
        borderRadius="lg"
        boxShadow="default"
        mb={6}
        p={6}
      >
        <Text fontSize="lg" fontWeight="semibold" color="neutral.800" mb={4}>
          Demand vs Supply
        </Text>
        <LineChart
          data={data.demandSupplyData}
          xKey="period"
          yKeys={['demand', 'supply']}
          colors={['#3291D1', '#D92D20']}
          height="288px"
        />
      </Box>

      {/* Daily Ingestion Monitor */}
      <Box
        bg="white"
        borderWidth="1px"
        borderColor="neutral.100"
        borderRadius="lg"
        boxShadow="default"
        p={6}
      >
        <Flex align="center" justify="space-between" mb={4}>
          <Text fontSize="lg" fontWeight="semibold" color="neutral.800">
            Daily Ingestion Monitor
          </Text>
          <Box
            as="select"
            w="auto"
            fontSize="sm"
            borderRadius="md"
            borderWidth="1px"
            borderColor="neutral.100"
            bg="white"
            px={3}
            py={1}
            color="neutral.600"
          >
            <option>December</option>
          </Box>
        </Flex>
        <AreaChart
          data={data.dailyIngestionData}
          xKey="day"
          yKey="count"
          color="#FFA100"
          height="288px"
        />
      </Box>
    </Box>
  )
}
