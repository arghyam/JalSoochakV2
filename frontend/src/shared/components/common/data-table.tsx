import { useState } from 'react'
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Flex,
  HStack,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react'
import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'

export interface DataTableColumn<T> {
  key: string
  header: string
  sortable?: boolean
  render?: (row: T) => React.ReactNode
}

export interface PaginationConfig {
  enabled: boolean
  pageSize?: number
  pageSizeOptions?: number[]
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[]
  data: T[]
  getRowKey: (row: T) => string | number
  emptyMessage?: string
  isLoading?: boolean
  pagination?: PaginationConfig
}

type SortDirection = 'asc' | 'desc' | null

export function DataTable<T extends object>({
  columns,
  data,
  getRowKey,
  emptyMessage = 'No data available',
  isLoading = false,
  pagination,
}: DataTableProps<T>) {
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(pagination?.pageSize ?? 10)

  const pageSizeOptions = pagination?.pageSizeOptions ?? [10, 25, 50]

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
      const aValue = (a as Record<string, unknown>)[sortColumn]
      const bValue = (b as Record<string, unknown>)[sortColumn]

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

  // Pagination logic
  const totalPages = pagination?.enabled ? Math.ceil(sortedData.length / itemsPerPage) : 1
  const paginatedData = pagination?.enabled
    ? sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : sortedData

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const handleItemsPerPageChange = (size: number) => {
    setItemsPerPage(size)
    setCurrentPage(1) // Reset to first page when changing page size
  }

  // Generate page numbers to display
  const getPageNumbers = (): (number | 'ellipsis')[] => {
    const pages: (number | 'ellipsis')[] = []
    const maxVisiblePages = 3

    if (totalPages <= maxVisiblePages + 2) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)

      if (currentPage > 3) {
        pages.push('ellipsis')
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i)
        }
      }

      if (currentPage < totalPages - 2) {
        pages.push('ellipsis')
      }

      // Always show last page
      if (!pages.includes(totalPages)) {
        pages.push(totalPages)
      }
    }

    return pages
  }

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
                px={5}
                py={3}
                textTransform="none"
              >
                <Flex align="center" gap={2} textStyle="h10">
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
          {paginatedData.map((row) => (
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
                  {column.render
                    ? column.render(row)
                    : String((row as Record<string, unknown>)[column.key] ?? '')}
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>

      {/* Pagination Controls */}
      {pagination?.enabled && totalPages > 0 && (
        <Flex justify="space-between" align="center" mt={6} px={4} h="42px">
          {/* Items per page selector */}
          <HStack spacing="10px">
            <Text>Items per Page</Text>
            <Menu>
              <MenuButton
                as={Button}
                variant="outline"
                size="sm"
                rightIcon={<ChevronDownIcon />}
                fontWeight="400"
                borderColor="#E9EAEB"
                borderRadius="8px"
                border="0.5px"
                py={2}
                px="15px"
                maxW="72px"
                bg="neutral.100"
                _hover={{ bg: 'neutral.50' }}
                _active={{ bg: 'neutral.100' }}
              >
                {itemsPerPage}
              </MenuButton>
              <MenuList minW="80px">
                {pageSizeOptions.map((size) => (
                  <MenuItem
                    key={size}
                    onClick={() => handleItemsPerPageChange(size)}
                    fontWeight={itemsPerPage === size ? '600' : '400'}
                  >
                    {size}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </HStack>

          {/* Page navigation */}
          <HStack spacing={2} h={8}>
            {/* Previous button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              isDisabled={currentPage === 1}
              leftIcon={<FaArrowLeft />}
              fontWeight="400"
              color="neutral.600"
              _hover={{ bg: 'neutral.50' }}
            >
              Previous
            </Button>

            {/* Page numbers */}
            <HStack spacing={2}>
              {getPageNumbers().map((page, index) =>
                page === 'ellipsis' ? (
                  <Text key={`ellipsis-${index}`} px={2} color="neutral.400">
                    ...
                  </Text>
                ) : (
                  <Button
                    key={page}
                    size="sm"
                    variant={currentPage === page ? 'solid' : 'ghost'}
                    onClick={() => handlePageChange(page)}
                    w="32px"
                    h="32px"
                    px={3}
                    py={2}
                    borderRadius="8px"
                    fontWeight={currentPage === page ? '600' : '400'}
                    bg={currentPage === page ? 'primary.500' : 'transparent'}
                    color={currentPage === page ? 'white' : 'neutral.600'}
                    _hover={{
                      bg: currentPage === page ? 'primary.600' : 'neutral.50',
                    }}
                  >
                    {page}
                  </Button>
                )
              )}
            </HStack>

            {/* Next button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              isDisabled={currentPage === totalPages}
              rightIcon={<FaArrowRight />}
              fontWeight="400"
              color="neutral.600"
              _hover={{ bg: 'neutral.50' }}
            >
              Next
            </Button>
          </HStack>
        </Flex>
      )}
    </Box>
  )
}
