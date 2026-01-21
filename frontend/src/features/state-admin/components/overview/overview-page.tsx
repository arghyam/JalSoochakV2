import { useEffect, useState } from 'react'
import { Box, Flex, Grid, Text, Icon, Stack, Select } from '@chakra-ui/react'
import { useAuthStore } from '@/app/store'
import { getMockOverviewData } from '../../services/mock-data'
import { LineChart } from '@/shared/components/charts/line-chart'
import { AreaChart } from '@/shared/components/charts/area-chart'
import type { OverviewData } from '../../types/overview'
import { BsCheck2Circle, BsPerson } from 'react-icons/bs'
import { AiOutlineApi, AiOutlineWarning } from 'react-icons/ai'
import { BiMessageDetail } from 'react-icons/bi'

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
      subtitle: 'Out of 3000',
      icon: BsPerson,
      iconBg: '#F1EEFF',
      iconColor: '#584C93',
    },
    {
      title: 'Configuration Status',
      value: data.stats.configurationStatus,
      subtitle: 'All modules configured',
      icon: BsCheck2Circle,
      iconBg: '#E1FFEA',
      iconColor: '#079455',
    },
    {
      title: "Today's API Ingestion",
      value: data.stats.todayApiIngestion,
      subtitle: 'Successfully ingested',
      icon: AiOutlineApi,
      iconBg: '#EBF4FA',
      iconColor: '#3291D1',
    },
    {
      title: 'Pending Data Sync',
      value: data.stats.pendingDataSync.toLocaleString(),
      subtitle: 'Requires Attention',
      icon: AiOutlineWarning,
      iconBg: '#FFFBD7',
      iconColor: '#CA8A04',
    },
    {
      title: 'Active Integrations',
      value: data.stats.activeIntegrations.toLocaleString(),
      subtitle: 'WhatsApp, Glyphic',
      icon: BiMessageDetail,
      iconBg: '#FBEAFF',
      iconColor: '#DC72F2',
    },
  ]

  return (
    <Box w="full">
      {/* Page Header */}
      <Box mb={5}>
        <Text textStyle="h5">Overview of {user?.tenantId || 'State'}</Text>
      </Box>

      <Stack gap={6}>
        {/* Stats Cards */}
        <Grid templateColumns="repeat(5, 1fr)" gap={7}>
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
                  <Flex direction="column" gap={1}>
                    <Text color="neutral.600">{stat.title}</Text>
                    <Text textStyle="h9">{stat.value}</Text>
                    <Text color="neutral.600">{stat.subtitle}</Text>
                  </Flex>
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
          py={6}
          px={4}
        >
          <Text textStyle="h8" mb={4}>
            Demand vs Supply
          </Text>
          <LineChart
            data={data.demandSupplyData}
            xKey="period"
            yKeys={['demand', 'supply']}
            colors={['#3291D1', '#ADD3EB']}
            height="440px"
            xAxisLabel="Year"
            yAxisLabel="Quantity (units)"
          />
        </Box>

        {/* Daily Ingestion Monitor */}
        <Box
          bg="white"
          borderWidth="1px"
          borderColor="neutral.100"
          borderRadius="lg"
          boxShadow="default"
          py={6}
          px={4}
        >
          <Flex align="center" justify="space-between" mb={4}>
            <Text textStyle="h8">Daily Ingestion Monitor</Text>
            <Select
              h="32px"
              maxW="162px"
              fontSize="14px"
              fontWeight="600"
              borderRadius="4px"
              borderColor="primary.500"
              borderWidth="1px"
              bg="white"
              color="primary.500"
              appearance="none"
              _focus={{
                borderColor: 'primary.500',
                boxShadow: 'none',
              }}
            >
              <option value="december">December</option>
            </Select>
          </Flex>
          <AreaChart
            data={data.dailyIngestionData}
            xKey="day"
            yKey="count"
            color="#FFA100"
            height="326px"
            legendLabel="Success Rate"
          />
        </Box>
      </Stack>
    </Box>
  )
}
