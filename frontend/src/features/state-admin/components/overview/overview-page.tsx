import { useEffect, useState } from 'react'
import {
  Box,
  Flex,
  Grid,
  Text,
  Icon,
  Stack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
} from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/app/store'
import { getMockOverviewData } from '../../services/mock-data'
import { LineChart } from '@/shared/components/charts/line-chart'
import { AreaChart } from '@/shared/components/charts/area-chart'
import type { OverviewData } from '../../types/overview'
import { BsCheck2Circle, BsPerson } from 'react-icons/bs'
import { AiOutlineApi, AiOutlineWarning } from 'react-icons/ai'
import { BiMessageDetail } from 'react-icons/bi'

export function OverviewPage() {
  const { t } = useTranslation(['state-admin', 'common'])
  const user = useAuthStore((state) => state.user)
  const [data, setData] = useState<OverviewData | null>(null)
  const [value, setValue] = useState('December')

  useEffect(() => {
    getMockOverviewData().then(setData)
  }, [])

  if (!data) {
    return (
      <Flex h="64" align="center" justify="center">
        <Text color="neutral.600">{t('common:loading')}</Text>
      </Flex>
    )
  }

  const statsCards = [
    {
      title: t('overview.stats.pumpOperatorsSynced'),
      value: data.stats.pumpOperatorsSynced.toLocaleString(),
      subtitle: t('overview.stats.outOf', { total: '3000' }),
      icon: BsPerson,
      iconBg: '#F1EEFF',
      iconColor: '#584C93',
    },
    {
      title: t('overview.stats.configurationStatus'),
      value: data.stats.configurationStatus,
      subtitle: t('overview.stats.allModulesConfigured'),
      icon: BsCheck2Circle,
      iconBg: '#E1FFEA',
      iconColor: '#079455',
    },
    {
      title: t('overview.stats.todayApiIngestion'),
      value: data.stats.todayApiIngestion,
      subtitle: t('overview.stats.successfullyIngested'),
      icon: AiOutlineApi,
      iconBg: '#EBF4FA',
      iconColor: '#3291D1',
    },
    {
      title: t('overview.stats.pendingDataSync'),
      value: data.stats.pendingDataSync.toLocaleString(),
      subtitle: t('overview.stats.requiresAttention'),
      icon: AiOutlineWarning,
      iconBg: '#FFFBD7',
      iconColor: '#CA8A04',
    },
    {
      title: t('overview.stats.activeIntegrations'),
      value: data.stats.activeIntegrations.toLocaleString(),
      subtitle: t('overview.stats.integrationNames'),
      icon: BiMessageDetail,
      iconBg: '#FBEAFF',
      iconColor: '#DC72F2',
    },
  ]

  const options = ['December', 'November']

  return (
    <Box w="full">
      {/* Page Header */}
      <Box mb={5}>
        <Text textStyle="h5">
          {user?.tenantId
            ? t('overview.title', { state: user.tenantId })
            : t('overview.titleFallback')}
        </Text>
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
                height={{ base: 'auto', md: '200px' }}
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
                    borderRadius="100px"
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
          height={{ base: 'auto', md: '534px' }}
          py={6}
          px={4}
        >
          <Text textStyle="h8" mb={4}>
            {t('overview.charts.demandVsSupply')}
          </Text>
          <LineChart
            data={data.demandSupplyData}
            xKey="period"
            yKeys={['Demand', 'Supply']}
            colors={['#3291D1', '#ADD3EB']}
            height="416px"
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
          height={{ base: 'auto', md: '454px' }}
          boxShadow="default"
          py={6}
          px={4}
        >
          <Flex align="center" justify="space-between" mb={4}>
            <Text textStyle="h8">{t('overview.charts.dailyIngestionMonitor')}</Text>
            <Menu matchWidth>
              <MenuButton
                as={Button}
                h="32px"
                w="162px"
                px="12px"
                fontSize="14px"
                fontWeight="600"
                borderRadius="4px"
                borderColor="primary.500"
                borderWidth="1px"
                bg="white"
                color="primary.500"
                variant="outline"
                rightIcon={<ChevronDownIcon w={5} h={5} />}
                _hover={{ bg: 'neutral.50' }}
                _active={{ bg: 'neutral.100' }}
                _focus={{ boxShadow: 'none' }}
                sx={{
                  '& svg': {
                    color: 'primary.500',
                  },
                }}
              >
                {value}
              </MenuButton>
              <MenuList p={0} minW="162px" borderRadius="4px" borderColor="primary.500">
                {options.map((option) => {
                  const isSelected = option === value

                  return (
                    <MenuItem
                      key={option}
                      h="32px"
                      px="12px"
                      fontSize="14px"
                      fontWeight={isSelected ? '600' : '400'}
                      color="neutral.950"
                      bg={isSelected ? 'primary.50' : 'white'}
                      _hover={{
                        bg: 'primary.50',
                      }}
                      _focus={{
                        bg: 'primary.50',
                      }}
                      onClick={() => setValue(option)}
                    >
                      {option}
                    </MenuItem>
                  )
                })}
              </MenuList>
            </Menu>
          </Flex>
          <AreaChart
            data={data.dailyIngestionData}
            xKey="day"
            yKey="count"
            color="#FFA100"
            height="326px"
            legendLabel={t('overview.charts.successRate')}
          />
        </Box>
      </Stack>
    </Box>
  )
}
