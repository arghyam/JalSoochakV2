import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Flex, Text, Heading, Grid, Icon } from '@chakra-ui/react'
import { useDashboardData } from '../hooks/use-dashboard-data'
import { KPICard } from './kpi-card'
import { IndiaMapChart, DemandSupplyChart, BarChart } from './charts'
import { PerformanceTable } from './tables'
import { LoadingSpinner, SearchableSelect } from '@/shared/components/common'
import { MdOutlineWaterDrop } from 'react-icons/md'
import { AiOutlineHome } from 'react-icons/ai'
import { FaFaucet } from 'react-icons/fa'
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
  const [filterTabIndex, setFilterTabIndex] = useState(0)

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
              width="162px"
              height="32px"
              borderRadius="4px"
              fontSize="sm"
              textColor="neutral.400"
              borderColor="neutral.400"
            />
            <SearchableSelect
              options={districtOptions}
              value={selectedDistrict}
              onChange={setSelectedDistrict}
              placeholder="District"
              required
              width="162px"
              height="32px"
              borderRadius="4px"
              fontSize="sm"
              textColor="neutral.400"
              borderColor="neutral.400"
            />
            <SearchableSelect
              options={blockOptions}
              value={selectedBlock}
              onChange={setSelectedBlock}
              placeholder="Block"
              width="162px"
              height="32px"
              borderRadius="4px"
              fontSize="sm"
              textColor={isAdvancedEnabled ? 'neutral.400' : 'neutral.300'}
              borderColor={isAdvancedEnabled ? 'neutral.400' : 'neutral.300'}
              disabled={!isAdvancedEnabled}
            />
            <SearchableSelect
              options={gramPanchayatOptions}
              value={selectedGramPanchayat}
              onChange={setSelectedGramPanchayat}
              placeholder="Gram Panchayat"
              width="162px"
              height="32px"
              borderRadius="4px"
              fontSize="sm"
              textColor={isAdvancedEnabled ? 'neutral.400' : 'neutral.300'}
              borderColor={isAdvancedEnabled ? 'neutral.400' : 'neutral.300'}
              disabled={!isAdvancedEnabled}
            />
            <SearchableSelect
              options={villageOptions}
              value={selectedVillage}
              onChange={setSelectedVillage}
              placeholder="Village"
              width="162px"
              height="32px"
              borderRadius="4px"
              fontSize="sm"
              textColor={isAdvancedEnabled ? 'neutral.400' : 'neutral.300'}
              borderColor={isAdvancedEnabled ? 'neutral.400' : 'neutral.300'}
              disabled={!isAdvancedEnabled}
            />
            <SearchableSelect
              options={mockFilterDuration}
              value={selectedDuration}
              onChange={setSelectedDuration}
              placeholder="Duration"
              width="162px"
              height="32px"
              borderRadius="4px"
              fontSize="sm"
              textColor={isAdvancedEnabled ? 'neutral.400' : 'neutral.300'}
              borderColor={isAdvancedEnabled ? 'neutral.400' : 'neutral.300'}
              disabled={!isAdvancedEnabled}
            />
            <SearchableSelect
              options={mockFilterSchemes}
              value={selectedScheme}
              onChange={setSelectedScheme}
              placeholder="Scheme"
              width="162px"
              height="32px"
              borderRadius="4px"
              fontSize="sm"
              textColor={isAdvancedEnabled ? 'neutral.400' : 'neutral.300'}
              borderColor={isAdvancedEnabled ? 'neutral.400' : 'neutral.300'}
              disabled={!isAdvancedEnabled}
            />
          </>
        ) : (
          <>
            <SearchableSelect
              options={emptyOptions}
              value=""
              onChange={() => {}}
              placeholder="Zone"
              width="162px"
              height="32px"
              borderRadius="4px"
              fontSize="sm"
              textColor="neutral.300"
              borderColor="neutral.300"
              disabled
            />
            <SearchableSelect
              options={emptyOptions}
              value=""
              onChange={() => {}}
              placeholder="Circle"
              width="162px"
              height="32px"
              borderRadius="4px"
              fontSize="sm"
              textColor="neutral.300"
              borderColor="neutral.300"
              disabled
            />
            <SearchableSelect
              options={emptyOptions}
              value=""
              onChange={() => {}}
              placeholder="Division"
              width="162px"
              height="32px"
              borderRadius="4px"
              fontSize="sm"
              textColor="neutral.300"
              borderColor="neutral.300"
              disabled
            />
            <SearchableSelect
              options={emptyOptions}
              value=""
              onChange={() => {}}
              placeholder="Subdivision"
              width="162px"
              height="32px"
              borderRadius="4px"
              fontSize="sm"
              textColor="neutral.300"
              borderColor="neutral.300"
              disabled
            />
            <SearchableSelect
              options={emptyOptions}
              value=""
              onChange={() => {}}
              placeholder="Village"
              width="162px"
              height="32px"
              borderRadius="4px"
              fontSize="sm"
              textColor="neutral.300"
              borderColor="neutral.300"
              disabled
            />
          </>
        )}
      </FilterLayout>

      {/* KPI Cards */}
      <Grid
        templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
        gap={4}
        mb={6}
      >
        <KPICard
          title="Number of schemes"
          value={data.kpis.nationalCoverage}
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
          value={data.kpis.regularity}
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
          value={data.kpis.continuity}
          icon={
            <Flex
              w="48px"
              h="48px"
              borderRadius="100px"
              bg="#E1FFEA"
              align="center"
              justify="center"
            >
              <Icon as={FaFaucet} boxSize="24px" color="#079455" />
            </Flex>
          }
        />
      </Grid>

      {/* India Map */}
      <Box bg="white" borderWidth="1px" borderRadius="lg" p={4} mb={6}>
        <IndiaMapChart
          data={data.mapData}
          onStateClick={handleStateClick}
          onStateHover={handleStateHover}
          height="600px"
        />
      </Box>

      {/* Demand vs Supply Chart */}
      <Box bg="white" borderWidth="1px" borderRadius="lg" p={4} mb={6}>
        <DemandSupplyChart data={data.demandSupply} height="400px" />
      </Box>

      {/* Performance Tables */}
      <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={6} mb={6}>
        <Box bg="white" borderWidth="1px" borderRadius="lg" p={4}>
          <PerformanceTable
            data={data.topPerformers}
            title="Top 5 Best Performing States"
            isBest={true}
          />
        </Box>
        <Box bg="white" borderWidth="1px" borderRadius="lg" p={4}>
          <PerformanceTable
            data={data.worstPerformers}
            title="Top 5 Worst Performing States"
            isBest={false}
          />
        </Box>
      </Grid>

      {/* Bar Charts */}
      <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={6}>
        <Box bg="white" borderWidth="1px" borderRadius="lg" p={4}>
          <BarChart
            data={data.regularityData}
            metric="regularity"
            title="Regularity by State"
            height="400px"
          />
        </Box>
        <Box bg="white" borderWidth="1px" borderRadius="lg" p={4}>
          <BarChart
            data={data.continuityData}
            metric="continuity"
            title="Continuity by State"
            height="400px"
          />
        </Box>
      </Grid>
    </Box>
  )
}
