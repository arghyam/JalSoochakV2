import { useEffect, useState } from 'react'
import { Box, Text } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { DataTable, type DataTableColumn } from '@/shared/components/common'
import { getMockActivityData } from '../../services/mock-data'
import type { ActivityLog } from '../../types/activity'

export function ActivityPage() {
  const { t } = useTranslation(['state-admin', 'common'])
  const [activities, setActivities] = useState<ActivityLog[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const data = await getMockActivityData()
        setActivities(data)
      } catch (error) {
        console.error('Failed to fetch activities:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchActivities()
  }, [])

  const formatTimestamp = (date: Date): string => {
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const year = String(date.getFullYear()).slice(-2)

    let hours = date.getHours()
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const ampm = hours >= 12 ? 'pm' : 'am'

    hours = hours % 12
    hours = hours ? hours : 12 // Handle midnight (0 hours)

    return `${month}-${day}-${year}, ${hours}:${minutes}${ampm}`
  }

  const columns: DataTableColumn<ActivityLog>[] = [
    {
      key: 'timestamp',
      header: t('activity.table.timestamp'),
      sortable: true,
      render: (row) => (
        <Text textStyle="h10" fontWeight="400">
          {formatTimestamp(row.timestamp)}
        </Text>
      ),
    },
    {
      key: 'action',
      header: t('activity.table.action'),
      sortable: true,
      render: (row) => (
        <Text textStyle="h10" fontWeight="400">
          {row.action}
        </Text>
      ),
    },
    {
      key: 'status',
      header: t('activity.table.status'),
      sortable: true,
      render: (row) => (
        <Box
          as="span"
          display="inline-block"
          px={2}
          py={0.5}
          borderRadius="16px"
          h={6}
          maxW="96px"
          textStyle="h10"
          fontWeight="400"
          bg={row.status === 'Success' ? 'success.50' : 'error.50'}
          color={row.status === 'Success' ? 'success.500' : 'error.500'}
        >
          {row.status === 'Success' ? t('common:status.success') : t('common:status.failed')}
        </Box>
      ),
    },
  ]

  return (
    <Box w="full">
      {/* Page Header */}
      <Box mb={5}>
        <Text textStyle="h5">{t('activity.title')}</Text>
      </Box>

      {/* Activity Table */}
      <DataTable
        columns={columns}
        data={activities}
        getRowKey={(row) => row.id}
        emptyMessage={t('activity.messages.noActivitiesFound')}
        isLoading={isLoading}
      />
    </Box>
  )
}
