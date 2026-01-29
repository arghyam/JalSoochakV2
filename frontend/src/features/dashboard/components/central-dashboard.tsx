import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Flex, Text, Heading, Grid, Icon, Image, Select } from '@chakra-ui/react'
import { useDashboardData } from '../hooks/use-dashboard-data'
import { KPICard } from './kpi-card'
import {
  IndiaMapChart,
  DemandSupplyChart,
  AllStatesPerformanceChart,
  SupplySubmissionRateChart,
  ImageSubmissionStatusChart,
  WaterSupplyOutagesChart,
} from './charts'
import { AllStatesTable } from './tables'
import { LoadingSpinner, SearchableSelect } from '@/shared/components/common'
import { MdOutlineWaterDrop, MdArrowUpward, MdArrowDownward } from 'react-icons/md'
import { AiOutlineHome, AiOutlineInfoCircle } from 'react-icons/ai'
import waterTapIcon from '@/assets/media/water-tap_1822589 1.svg'
import type { SearchableSelectOption } from '@/shared/components/common'
import { SearchLayout, FilterLayout } from '@/shared/components/layout'
import {
  mockFilterStates,
  mockFilterDistricts,
  mockFilterBlocks,
  mockFilterGramPanchayats,
  mockFilterVillages,
  mockFilterDuration,
  mockFilterSchemes,
} from '../services/mock/dashboard-mock'

export function CentralDashboard() {
  const navigate = useNavigate()
  const { data, isLoading, error } = useDashboardData('central')
  const [selectedState, setSelectedState] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState('')
  const [selectedBlock, setSelectedBlock] = useState('')
  const [selectedGramPanchayat, setSelectedGramPanchayat] = useState('')
  const [selectedVillage, setSelectedVillage] = useState('')
  const [selectedDuration, setSelectedDuration] = useState('')
  const [selectedScheme, setSelectedScheme] = useState('')
  const [performanceState, setPerformanceState] = useState('')
  const [filterTabIndex, setFilterTabIndex] = useState(0)
  const isStateSelected = Boolean(selectedState)

  const emptyOptions: SearchableSelectOption[] = []
  const isAdvancedEnabled = Boolean(selectedState && selectedDistrict)
  const districtOptions = selectedState ? (mockFilterDistricts[selectedState] ?? []) : emptyOptions
  const blockOptions = selectedDistrict ? (mockFilterBlocks[selectedDistrict] ?? []) : emptyOptions
  const gramPanchayatOptions = selectedBlock
    ? (mockFilterGramPanchayats[selectedBlock] ?? [])
    : emptyOptions
  const villageOptions = selectedGramPanchayat
    ? (mockFilterVillages[selectedGramPanchayat] ?? [])
    : emptyOptions
  const handleClearFilters = () => {
    setSelectedState('')
    setSelectedDistrict('')
    setSelectedBlock('')
    setSelectedGramPanchayat('')
    setSelectedVillage('')
    setSelectedDuration('')
    setSelectedScheme('')
  }

  const handleStateClick = (stateId: string, _stateName: string) => {
    navigate(`/states/${stateId}`)
  }

  const handleStateHover = (_stateId: string, _stateName: string, _metrics: unknown) => {
    // Hover tooltip is handled by ECharts
  }

  if (isLoading) {
    return (
      <Flex h="100vh" align="center" justify="center">
        <LoadingSpinner />
      </Flex>
    )
  }

  if (error) {
    return (
      <Flex h="100vh" align="center" justify="center">
        <Box textAlign="center">
          <Heading fontSize="2xl" fontWeight="bold" color="red.600">
            Error loading dashboard
          </Heading>
          <Text mt={2} color="gray.600">
            {error instanceof Error ? error.message : 'Unknown error'}
          </Text>
        </Box>
      </Flex>
    )
  }

  if (!data) return null

  if (
    !data.kpis ||
    !data.mapData ||
    !data.demandSupply ||
    !data.imageSubmissionStatus ||
    !data.waterSupplyOutages ||
    !data.topPerformers ||
    !data.worstPerformers ||
    !data.regularityData ||
    !data.continuityData
  ) {
    return (
      <Flex h="100vh" align="center" justify="center">
        <Box textAlign="center">
          <Heading fontSize="2xl" fontWeight="bold" color="red.600">
            Invalid data structure
          </Heading>
          <Text mt={2} color="gray.600">
            Dashboard data is incomplete
          </Text>
        </Box>
      </Flex>
    )
  }

  const coreMetrics = [
    {
      label: 'Coverage',
      value: '78.4%',
      trend: { direction: 'up', text: '+0.5% vs last month' },
    },
    {
      label: 'Continuity',
      value: '94',
      trend: { direction: 'down', text: '-1 vs last month' },
    },
    {
      label: 'Quantity',
      value: '78.4%',
      trend: { direction: 'up', text: '+2 LPCD vs last month' },
    },
    {
      label: 'Regularity',
      value: '78.4%',
      trend: { direction: 'down', text: '-3% vs last month' },
    },
  ] as const

  return (
    <Box>
      <SearchLayout />
      <FilterLayout
        onClear={handleClearFilters}
        activeTab={filterTabIndex}
        onTabChange={setFilterTabIndex}
      >
        {filterTabIndex === 0 ? (
          <>
            <SearchableSelect
              options={mockFilterStates}
              value={selectedState}
              onChange={setSelectedState}
              placeholder="States/UTs"
              required
              width={{
                base: '100%',
                sm: 'calc(50% - 12px)',
                md: 'calc(33.333% - 12px)',
                lg: 'calc(25% - 12px)',
                xl: '162px',
              }}
              height="32px"
              borderRadius="4px"
              fontSize="sm"
              textColor="neutral.400"
              borderColor="neutral.400"
              isFilter={true}
            />
            <SearchableSelect
              options={districtOptions}
              value={selectedDistrict}
              onChange={setSelectedDistrict}
              placeholder="District"
              required
              width={{
                base: '100%',
                sm: 'calc(50% - 12px)',
                md: 'calc(33.333% - 12px)',
                lg: 'calc(25% - 12px)',
                xl: '162px',
              }}
              height="32px"
              borderRadius="4px"
              fontSize="sm"
              textColor="neutral.400"
              borderColor="neutral.400"
              isFilter={true}
            />
            <SearchableSelect
              options={blockOptions}
              value={selectedBlock}
              onChange={setSelectedBlock}
              placeholder="Block"
              width={{
                base: '100%',
                sm: 'calc(50% - 12px)',
                md: 'calc(33.333% - 12px)',
                lg: 'calc(25% - 12px)',
                xl: '162px',
              }}
              height="32px"
              borderRadius="4px"
              fontSize="sm"
              textColor={isAdvancedEnabled ? 'neutral.400' : 'neutral.300'}
              borderColor={isAdvancedEnabled ? 'neutral.400' : 'neutral.300'}
              disabled={!isAdvancedEnabled}
              isFilter={true}
            />
            <SearchableSelect
              options={gramPanchayatOptions}
              value={selectedGramPanchayat}
              onChange={setSelectedGramPanchayat}
              placeholder="Gram Panchayat"
              width={{
                base: '100%',
                sm: 'calc(50% - 12px)',
                md: 'calc(33.333% - 12px)',
                lg: 'calc(25% - 12px)',
                xl: '162px',
              }}
              height="32px"
              borderRadius="4px"
              fontSize="sm"
              textColor={isAdvancedEnabled ? 'neutral.400' : 'neutral.300'}
              borderColor={isAdvancedEnabled ? 'neutral.400' : 'neutral.300'}
              disabled={!isAdvancedEnabled}
              isFilter={true}
            />
            <SearchableSelect
              options={villageOptions}
              value={selectedVillage}
              onChange={setSelectedVillage}
              placeholder="Village"
              width={{
                base: '100%',
                sm: 'calc(50% - 12px)',
                md: 'calc(33.333% - 12px)',
                lg: 'calc(25% - 12px)',
                xl: '162px',
              }}
              height="32px"
              borderRadius="4px"
              fontSize="sm"
              textColor={isAdvancedEnabled ? 'neutral.400' : 'neutral.300'}
              borderColor={isAdvancedEnabled ? 'neutral.400' : 'neutral.300'}
              disabled={!isAdvancedEnabled}
              isFilter={true}
            />
            <SearchableSelect
              options={mockFilterDuration}
              value={selectedDuration}
              onChange={setSelectedDuration}
              placeholder="Duration"
              width={{
                base: '100%',
                sm: 'calc(50% - 12px)',
                md: 'calc(33.333% - 12px)',
                lg: 'calc(25% - 12px)',
                xl: '162px',
              }}
              height="32px"
              borderRadius="4px"
              fontSize="sm"
              textColor={isAdvancedEnabled ? 'neutral.400' : 'neutral.300'}
              borderColor={isAdvancedEnabled ? 'neutral.400' : 'neutral.300'}
              disabled={!isAdvancedEnabled}
              isFilter={true}
            />
            <SearchableSelect
              options={mockFilterSchemes}
              value={selectedScheme}
              onChange={setSelectedScheme}
              placeholder="Scheme"
              width={{
                base: '100%',
                sm: 'calc(50% - 12px)',
                md: 'calc(33.333% - 12px)',
                lg: 'calc(25% - 12px)',
                xl: '162px',
              }}
              height="32px"
              borderRadius="4px"
              fontSize="sm"
              textColor={isAdvancedEnabled ? 'neutral.400' : 'neutral.300'}
              borderColor={isAdvancedEnabled ? 'neutral.400' : 'neutral.300'}
              disabled={!isAdvancedEnabled}
              isFilter={true}
            />
          </>
        ) : (
          <>
            <SearchableSelect
              options={emptyOptions}
              value=""
              onChange={() => {}}
              placeholder="Zone"
              width={{
                base: '100%',
                sm: 'calc(50% - 12px)',
                md: 'calc(33.333% - 12px)',
                lg: 'calc(25% - 12px)',
                xl: '162px',
              }}
              height="32px"
              borderRadius="4px"
              fontSize="sm"
              textColor="neutral.300"
              borderColor="neutral.300"
              disabled
              isFilter={true}
            />
            <SearchableSelect
              options={emptyOptions}
              value=""
              onChange={() => {}}
              placeholder="Circle"
              width={{
                base: '100%',
                sm: 'calc(50% - 12px)',
                md: 'calc(33.333% - 12px)',
                lg: 'calc(25% - 12px)',
                xl: '162px',
              }}
              height="32px"
              borderRadius="4px"
              fontSize="sm"
              textColor="neutral.300"
              borderColor="neutral.300"
              disabled
              isFilter={true}
            />
            <SearchableSelect
              options={emptyOptions}
              value=""
              onChange={() => {}}
              placeholder="Division"
              width={{
                base: '100%',
                sm: 'calc(50% - 12px)',
                md: 'calc(33.333% - 12px)',
                lg: 'calc(25% - 12px)',
                xl: '162px',
              }}
              height="32px"
              borderRadius="4px"
              fontSize="sm"
              textColor="neutral.300"
              borderColor="neutral.300"
              disabled
              isFilter={true}
            />
            <SearchableSelect
              options={emptyOptions}
              value=""
              onChange={() => {}}
              placeholder="Subdivision"
              width={{
                base: '100%',
                sm: 'calc(50% - 12px)',
                md: 'calc(33.333% - 12px)',
                lg: 'calc(25% - 12px)',
                xl: '162px',
              }}
              height="32px"
              borderRadius="4px"
              fontSize="sm"
              textColor="neutral.300"
              borderColor="neutral.300"
              disabled
              isFilter={true}
            />
            <SearchableSelect
              options={emptyOptions}
              value=""
              onChange={() => {}}
              placeholder="Village"
              width={{
                base: '100%',
                sm: 'calc(50% - 12px)',
                md: 'calc(33.333% - 12px)',
                lg: 'calc(25% - 12px)',
                xl: '162px',
              }}
              height="32px"
              borderRadius="4px"
              fontSize="sm"
              textColor="neutral.300"
              borderColor="neutral.300"
              disabled
              isFilter={true}
            />
          </>
        )}
      </FilterLayout>

      {/* KPI Cards */}
      <Grid templateColumns={{ base: '1fr', lg: 'repeat(3, 1fr)' }} gap={4} mb={6}>
        <KPICard
          title="Number of schemes"
          value={data.kpis.totalSchemes}
          icon={
            <Flex
              w="48px"
              h="48px"
              borderRadius="100px"
              bg="primary.25"
              align="center"
              justify="center"
            >
              <Icon as={MdOutlineWaterDrop} boxSize="28px" color="primary.500" />
            </Flex>
          }
        />
        <KPICard
          title="Total Number of Rural Households"
          value={data.kpis.totalRuralHouseholds}
          icon={
            <Flex
              w="48px"
              h="48px"
              borderRadius="100px"
              bg="#FFFBD7"
              align="center"
              justify="center"
            >
              <Icon as={AiOutlineHome} boxSize="28px" color="#CA8A04" />
            </Flex>
          }
        />
        <KPICard
          title="Functional Household Tap Connection"
          value={data.kpis.functionalTapConnections}
          icon={
            <Flex
              w="48px"
              h="48px"
              borderRadius="100px"
              bg="#E1FFEA"
              align="center"
              justify="center"
            >
              <Image src={waterTapIcon} alt="" boxSize="24px" />
            </Flex>
          }
        />
      </Grid>

      {/* Map and Core Metrics */}
      <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, minmax(0, 1fr))' }} gap={6} mb={6}>
        <Box
          bg="white"
          borderWidth="0.5px"
          borderRadius="12px"
          borderColor="#E4E4E7"
          pt="24px"
          pb="24px"
          pl="16px"
          pr="16px"
          w="full"
          h="731px"
        >
          <IndiaMapChart
            data={data.mapData}
            onStateClick={handleStateClick}
            onStateHover={handleStateHover}
            height="100%"
          />
        </Box>
        <Box
          bg="white"
          borderWidth="0.5px"
          borderRadius="12px"
          borderColor="#E4E4E7"
          pt="24px"
          pb="24px"
          pl="16px"
          pr="16px"
          w="full"
          h="731px"
        >
          <Text textStyle="bodyText3" fontWeight="400" mb={4}>
            Core Metrics
          </Text>
          <Flex direction="column" gap="16px">
            {coreMetrics.map((metric) => {
              const isPositive = metric.trend.direction === 'up'
              const TrendIcon = isPositive ? MdArrowUpward : MdArrowDownward
              const trendColor = isPositive ? '#079455' : '#D92D20'

              return (
                <Box key={metric.label} bg="#FAFAFA" borderRadius="8px" px="16px" py="24px">
                  <Flex direction="column" align="center" gap={2} h="100%" w="full">
                    <Flex align="center" justify="center" w="full" position="relative">
                      <Text textStyle="bodyText4" fontWeight="400" color="neutral.600">
                        {metric.label}
                      </Text>
                      <Icon
                        as={AiOutlineInfoCircle}
                        boxSize="16px"
                        color="neutral.400"
                        position="absolute"
                        right="0"
                      />
                    </Flex>
                    <Text textStyle="bodyText2" fontWeight="400" color="neutral.900">
                      {metric.value}
                    </Text>
                    <Flex align="center" gap={1}>
                      <Icon as={TrendIcon} boxSize="16px" color={trendColor} />
                      <Text textStyle="bodyText4" fontWeight="400" color={trendColor}>
                        {metric.trend.text}
                      </Text>
                    </Flex>
                  </Flex>
                </Box>
              )
            })}
          </Flex>
        </Box>
      </Grid>

      {/* Submission + Outages Charts */}
      {isStateSelected ? (
        <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, minmax(0, 1fr))' }} gap={6} mb={6}>
          <Box
            bg="white"
            borderWidth="0.5px"
            borderRadius="12px"
            borderColor="#E4E4E7"
            pt="24px"
            pb="24px"
            pl="16px"
            pr="16px"
            h="523px"
          >
            <Text textStyle="bodyText3" fontWeight="400" mb="0px">
              Image Submission Status
            </Text>
            <ImageSubmissionStatusChart data={data.imageSubmissionStatus} height="406px" />
          </Box>
          <Box
            bg="white"
            borderWidth="0.5px"
            borderRadius="12px"
            borderColor="#E4E4E7"
            pt="24px"
            pb="24px"
            pl="16px"
            pr="16px"
            h="523px"
          >
            <Text textStyle="bodyText3" fontWeight="400" mb={2}>
              Water Supply Outages
            </Text>
            <WaterSupplyOutagesChart data={data.waterSupplyOutages} height="400px" />
          </Box>
        </Grid>
      ) : null}

      {/* Performance + Demand vs Supply Charts */}
      <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, minmax(0, 1fr))' }} gap={6} mb={6}>
        <Box bg="white" borderWidth="1px" borderRadius="lg" p={4} h="536px">
          <Flex align="center" justify="space-between">
            <Text textStyle="bodyText3" fontWeight="400">
              All States/UTs Performance
            </Text>
            <Select
              h="32px"
              maxW="120px"
              fontSize="14px"
              fontWeight="600"
              borderRadius="4px"
              borderColor="neutral.400"
              borderWidth="1px"
              bg="white"
              color="neutral.400"
              placeholder="Select"
              appearance="none"
              value={performanceState}
              onChange={(event) => setPerformanceState(event.target.value)}
              _focus={{
                borderColor: 'primary.500',
                boxShadow: 'none',
              }}
            >
              <option value="Punjab">Punjab</option>
            </Select>
          </Flex>
          <AllStatesPerformanceChart
            data={
              performanceState
                ? data.mapData.filter((state) => state.name === performanceState).slice(0, 1)
                : data.mapData
            }
            height="416px"
          />
        </Box>
        <Box bg="white" borderWidth="1px" borderRadius="lg" p={4} h="536px">
          <Text textStyle="bodyText3" fontWeight="400" mb={2}>
            Demand vs Supply
          </Text>
          <DemandSupplyChart data={data.demandSupply} height="418px" />
        </Box>
      </Grid>

      {/* All States + Submission Rate */}
      <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={6} mb={6}>
        <Box bg="white" borderWidth="1px" borderRadius="lg" px={4} py={6} h="510px">
          <Text textStyle="bodyText3" fontWeight="400" mb="16px">
            All States/UTs
          </Text>
          <AllStatesTable data={data.mapData} />
        </Box>
        <Box bg="white" borderWidth="1px" borderRadius="lg" px={4} py={6} h="510px">
          <Text textStyle="bodyText3" fontWeight="400" mb={2}>
            Supply Data Submission Rate
          </Text>
          <SupplySubmissionRateChart data={data.mapData} height="383px" />
        </Box>
      </Grid>
    </Box>
  )
}
