import { useState } from 'react'
import { Box, Table, Thead, Tbody, Tr, Th, Td, Text, Flex } from '@chakra-ui/react'
import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons'

export interface DataTableColumn<T> {
  key: string
  header: string
  sortable?: boolean
  render?: (row: T) => React.ReactNode
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[]
  data: T[]
  getRowKey: (row: T) => string | number
  emptyMessage?: string
  isLoading?: boolean
}

type SortDirection = 'asc' | 'desc' | null

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  getRowKey,
  emptyMessage = 'No data available',
  isLoading = false,
}: DataTableProps<T>) {
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)

  const handleSort = (columnKey: string, sortable?: boolean) => {
    if (!sortable) return

    if (sortColumn === columnKey) {
      // Cycle through: asc -> desc -> null
      if (sortDirection === 'asc') {
        setSortDirection('desc')
      } else if (sortDirection === 'desc') {
        setSortColumn(null)
        setSortDirection(null)
      }
    } else {
      setSortColumn(columnKey)
      setSortDirection('asc')
    }
  }

  const getSortedData = () => {
    if (!sortColumn || !sortDirection) return data

    return [...data].sort((a, b) => {
      const aValue = a[sortColumn]
      const bValue = b[sortColumn]

      // Handle different data types
      if (aValue instanceof Date && bValue instanceof Date) {
        return sortDirection === 'asc'
          ? aValue.getTime() - bValue.getTime()
          : bValue.getTime() - aValue.getTime()
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue
      }

      // Fallback to string comparison
      return sortDirection === 'asc'
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue))
    })
  }

  const sortedData = getSortedData()

  if (isLoading) {
    return (
      <Box
        bg="white"
        borderWidth="0.5px"
        borderColor="neutral.100"
        borderRadius="12px"
        w="full"
        pt="24px"
        pr="16px"
        pb="24px"
        pl="16px"
        textAlign="center"
      >
        <Text color="neutral.600">Loading...</Text>
      </Box>
    )
  }

  if (data.length === 0) {
    return (
      <Box
        bg="white"
        borderWidth="0.5px"
        borderColor="neutral.100"
        borderRadius="12px"
        w="full"
        pt="24px"
        pr="16px"
        pb="24px"
        pl="16px"
        textAlign="center"
      >
        <Text color="neutral.600">{emptyMessage}</Text>
      </Box>
    )
  }

  return (
    <Box
      bg="white"
      borderWidth="0.5px"
      borderColor="neutral.100"
      borderRadius="12px"
      w="full"
      overflow="hidden"
      pt="24px"
      pr="16px"
      pb="24px"
      pl="16px"
    >
      <Table size="sm" variant="simple">
        <Thead>
          <Tr>
            {columns.map((column) => (
              <Th
                key={column.key}
                cursor={column.sortable ? 'pointer' : 'default'}
                onClick={() => handleSort(column.key, column.sortable)}
                userSelect="none"
                _hover={column.sortable ? { bg: 'neutral.50' } : undefined}
                bg="transparent"
                h={10}
                textTransform="none"
              >
                <Flex align="center" gap={2} textStyle="h10" px={5} py={3}>
                  <Text>{column.header}</Text>
                  {column.sortable && (
                    <Box>
                      {sortColumn === column.key ? (
                        sortDirection === 'asc' ? (
                          <ChevronUpIcon boxSize={4} />
                        ) : (
                          <ChevronDownIcon boxSize={4} />
                        )
                      ) : (
                        <Box opacity={0.3}>
                          <ChevronUpIcon boxSize={4} />
                        </Box>
                      )}
                    </Box>
                  )}
                </Flex>
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {sortedData.map((row) => (
            <Tr key={getRowKey(row)} _hover={{ bg: 'neutral.25' }}>
              {columns.map((column) => (
                <Td
                  key={column.key}
                  borderTop="1px"
                  borderBottom="none"
                  borderColor="neutral.200"
                  px={5}
                  py={3}
                  h={12}
                >
                  {column.render ? column.render(row) : String(row[column.key as keyof T] ?? '')}
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  )
}
