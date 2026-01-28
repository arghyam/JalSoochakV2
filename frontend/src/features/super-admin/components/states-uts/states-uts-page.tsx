import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Heading,
  Text,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Button,
  IconButton,
  useBreakpointValue,
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { SearchIcon, EditIcon } from '@chakra-ui/icons'
import { FiEye } from 'react-icons/fi'
import { IoAddOutline } from 'react-icons/io5'
import { DataTable, type DataTableColumn } from '@/shared/components/common'
import { getMockStatesUTsData } from '../../services/mock-data'
import type { StateUT } from '../../types/states-uts'
import { ROUTES } from '@/shared/constants/routes'

export function StatesUTsPage() {
  const { t, i18n } = useTranslation(['super-admin', 'common'])
  const navigate = useNavigate()
  const [states, setStates] = useState<StateUT[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  // Responsive values
  const searchInputWidth = useBreakpointValue({ base: 'full', md: '320px' }) ?? '320px'
  const showAddButtonText = useBreakpointValue({ base: false, sm: true }) ?? true

  useEffect(() => {
    document.title = `${t('statesUts.title')} | JalSoochak`
  }, [t])

  useEffect(() => {
    fetchStates()
  }, [])

  const fetchStates = async () => {
    setIsLoading(true)
    try {
      const data = await getMockStatesUTsData()
      setStates(data)
    } catch (error) {
      console.error('Failed to fetch states:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatTimestamp = (date: Date): string => {
    const dateFormatter = new Intl.DateTimeFormat(i18n.language, {
      month: '2-digit',
      day: '2-digit',
      year: '2-digit',
    })
    const timeFormatter = new Intl.DateTimeFormat(i18n.language, {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })

    return `${dateFormatter.format(date)}, ${timeFormatter.format(date)}`
  }

  const filteredStates = states.filter((state) =>
    state.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddNew = () => {
    navigate(ROUTES.SUPER_ADMIN_STATES_UTS_ADD)
  }

  const handleView = (id: string) => {
    navigate(ROUTES.SUPER_ADMIN_STATES_UTS_VIEW.replace(':id', id))
  }

  const handleEdit = (id: string) => {
    navigate(ROUTES.SUPER_ADMIN_STATES_UTS_EDIT.replace(':id', id))
  }

  const columns: DataTableColumn<StateUT>[] = [
    {
      key: 'name',
      header: t('statesUts.table.stateUt'),
      sortable: true,
      render: (row) => (
        <Text textStyle="h10" fontWeight="400">
          {row.name}
        </Text>
      ),
    },
    {
      key: 'status',
      header: t('statesUts.table.status'),
      sortable: true,
      render: (row) => (
        <Box
          as="span"
          display="inline-block"
          px={2}
          py={0.5}
          borderRadius="16px"
          h={6}
          textStyle="h10"
          fontWeight="400"
          bg={row.status === 'active' ? 'success.50' : 'error.50'}
          color={row.status === 'active' ? 'success.500' : 'error.500'}
        >
          {row.status === 'active' ? t('common:status.active') : t('common:status.inactive')}
        </Box>
      ),
    },
    {
      key: 'lastSyncDate',
      header: t('statesUts.table.lastSyncDate'),
      sortable: true,
      render: (row) => (
        <Text textStyle="h10" fontWeight="400">
          {formatTimestamp(row.lastSyncDate)}
        </Text>
      ),
    },
    {
      key: 'totalDistricts',
      header: t('statesUts.table.totalDistricts'),
      sortable: true,
      render: (row) => (
        <Text textStyle="h10" fontWeight="400">
          {row.totalDistricts}
        </Text>
      ),
    },
    {
      key: 'actions',
      header: t('statesUts.table.actions'),
      render: (row) => (
        <Flex gap={1}>
          <IconButton
            aria-label={`${t('statesUts.aria.viewStateUt')} ${row.name}`}
            icon={<FiEye />}
            variant="ghost"
            w={5}
            h={5}
            size="sm"
            onClick={() => handleView(row.id)}
            _hover={{ color: 'primary.500', bg: 'transparent' }}
          />
          <IconButton
            aria-label={`${t('statesUts.aria.editStateUt')} ${row.name}`}
            icon={<EditIcon />}
            variant="ghost"
            w={5}
            h={5}
            size="sm"
            onClick={() => handleEdit(row.id)}
            _hover={{ color: 'primary.500', bg: 'transparent' }}
          />
        </Flex>
      ),
    },
  ]

  return (
    <Box w="full">
      {/* Page Header */}
      <Box mb={5}>
        <Heading as="h1" size={{ base: 'h2', md: 'h1' }}>
          {t('statesUts.title')}
        </Heading>
      </Box>

      {/* Search and Add Button */}
      <Flex
        justify="space-between"
        align="center"
        mb={6}
        h={{ base: 'auto', md: 16 }}
        py={4}
        px={{ base: 3, md: 6 }}
        gap={{ base: 3, md: 4 }}
        flexDirection={{ base: 'column', md: 'row' }}
        border="0.5px"
        borderColor="neutral.200"
        borderRadius="12px"
        bg="white"
      >
        <InputGroup maxW={searchInputWidth} w="full">
          <InputLeftElement pointerEvents="none" h={8}>
            <SearchIcon color="neutral.300" aria-hidden="true" />
          </InputLeftElement>
          <Input
            placeholder={t('common:search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label={t('apiCredentials.searchPlaceholder')}
            bg="white"
            h={8}
            border="1px"
            borderRadius="4px"
            borderColor="neutral.300"
            _placeholder={{ color: 'neutral.300' }}
          />
        </InputGroup>
        <Button
          variant="secondary"
          size="sm"
          fontWeight="600"
          onClick={handleAddNew}
          gap={1}
          w={{ base: 'full', md: '178px' }}
          aria-label={t('statesUts.addNewStateUt')}
        >
          <IoAddOutline size={24} aria-hidden="true" />
          {showAddButtonText && t('statesUts.addNewStateUt')}
        </Button>
      </Flex>

      {/* Data Table */}
      <Box overflowX="auto">
        <DataTable<StateUT>
          columns={columns}
          data={filteredStates}
          getRowKey={(row) => row.id}
          emptyMessage={t('statesUts.messages.noStatesFound')}
          isLoading={isLoading}
          pagination={{
            enabled: true,
            pageSize: 10,
            pageSizeOptions: [10, 25, 50],
          }}
        />
      </Box>
    </Box>
  )
}
