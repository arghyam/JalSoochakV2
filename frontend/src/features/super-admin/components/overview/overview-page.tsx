import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Flex, Grid, Text, Icon, Stack, Button } from '@chakra-ui/react'
import { getMockSuperAdminOverviewData } from '../../services/mock-data'
import { BarLineChart } from '@/shared/components/charts/bar-line-chart'
import type { SuperAdminOverviewData } from '../../types/overview'
import { MdOutlinePlace } from 'react-icons/md'
import { BsCheck2Circle } from 'react-icons/bs'
import { IoCloseCircleOutline } from 'react-icons/io5'
import { ROUTES } from '@/shared/constants/routes'

export function OverviewPage() {
  const navigate = useNavigate()
  const [data, setData] = useState<SuperAdminOverviewData | null>(null)

  useEffect(() => {
    getMockSuperAdminOverviewData().then(setData)
  }, [])

  const formatTimestamp = (date: Date): string => {
    let hours = date.getHours()
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const ampm = hours >= 12 ? 'pm' : 'am'
    hours = hours % 12
    hours = hours ? hours : 12

    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()

    return `${hours}:${minutes}${ampm} | ${day}-${month}-${year}`
  }

  if (!data) {
    return (
      <Flex h="64" align="center" justify="center">
        <Text color="neutral.600">Loading...</Text>
      </Flex>
    )
  }

  const statsCards = [
    {
      title: 'Total States/UTs Managed',
      value: data.stats.totalStatesManaged,
      icon: MdOutlinePlace,
      iconBg: '#EBF4FA',
      iconColor: '#3291D1',
    },
    {
      title: 'Active States/UTs',
      value: data.stats.activeStates,
      icon: BsCheck2Circle,
      iconBg: '#E1FFEA',
      iconColor: '#079455',
    },
    {
      title: 'Inactive States/UTs',
      value: data.stats.inactiveStates,
      icon: IoCloseCircleOutline,
      iconBg: '#FEE4E2',
      iconColor: '#D92D20',
    },
  ]

  return (
    <Box w="full">
      {/* Page Header with Add Button */}
      <Flex justify="space-between" align="center" mb={5} h={12}>
        <Text textStyle="h5">Overview</Text>
        <Button
          variant="secondary"
          size="sm"
          fontWeight="600"
          onClick={() => navigate(ROUTES.SUPER_ADMIN_STATES_UTS_ADD)}
        >
          + Add New State/UT
        </Button>
      </Flex>

      <Stack gap={6}>
        {/* Stats Cards */}
        <Grid templateColumns="repeat(3, 1fr)" gap={7}>
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
                    <Text color="neutral.600">{stat.title}</Text>
                    <Text textStyle="h9">{stat.value}</Text>
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
        >
          <Text textStyle="h8" mb={4}>
            Ingestion Success Rate Over Time
          </Text>
          <BarLineChart
            data={data.ingestionData}
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

        {/* Notifications Section */}
        <Box
          bg="white"
          borderWidth="0.5px"
          borderColor="neutral.200"
          borderRadius="12px"
          boxShadow="default"
          py={6}
          px={4}
        >
          <Text textStyle="h8" mb={4}>
            Notifications
          </Text>
          <Stack gap={4}>
            {data.notifications.map((notification) => (
              <Flex
                key={notification.id}
                justify="space-between"
                align="center"
                py={2}
                borderBottomWidth="1px"
                borderColor="neutral.100"
                _last={{ borderBottomWidth: 0 }}
              >
                <Text fontSize="14px" color="neutral.950">
                  {notification.message}
                </Text>
                <Text fontSize="14px" color="neutral.600" whiteSpace="nowrap" ml={4}>
                  {formatTimestamp(notification.timestamp)}
                </Text>
              </Flex>
            ))}
          </Stack>
        </Box>
      </Stack>
    </Box>
  )
}
