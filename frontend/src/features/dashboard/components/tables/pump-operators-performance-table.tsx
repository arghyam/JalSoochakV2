import { Box, Flex, Icon, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
import { BiSortAlt2 } from 'react-icons/bi'
import type { PumpOperatorPerformanceData } from '../../types'

interface PumpOperatorsPerformanceTableProps {
  data: PumpOperatorPerformanceData[]
  title: string
  maxItems?: number
}

export function PumpOperatorsPerformanceTable({
  data,
  title,
  maxItems,
}: PumpOperatorsPerformanceTableProps) {
  const safeMaxItems =
    typeof maxItems === 'number' && Number.isFinite(maxItems) ? Math.max(0, maxItems) : undefined
  const rows = typeof safeMaxItems === 'number' ? data.slice(0, safeMaxItems) : data

  return (
    <Box borderRadius="lg" overflow="hidden">
      <Box textStyle="bodyText3" fontWeight="400" mb="16px">
        {title}
      </Box>
      <Box>
        <Table size="sm">
          <Thead
            sx={{
              position: 'sticky',
              top: 0,
              zIndex: 1,
              bg: 'white',
              th: {
                textStyle: 'bodyText7',
                textTransform: 'none',
                fontWeight: '500',
                px: 3,
                py: 4,
              },
            }}
          >
            <Tr>
              <Th>Name</Th>
              <Th>Village</Th>
              <Th>
                <Flex align="center">
                  <Box as="span">Reporting Rate (%)</Box>
                  <Icon as={BiSortAlt2} boxSize="16px" color="neutral.500" />
                </Flex>
              </Th>
              <Th>
                <Flex align="center">
                  <Box as="span">Photo Compliance (%)</Box>
                  <Icon as={BiSortAlt2} boxSize="16px" color="neutral.500" />
                </Flex>
              </Th>
              <Th>
                <Flex align="center">
                  <Box as="span">Water Supplied (LPCD)</Box>
                  <Icon as={BiSortAlt2} boxSize="16px" color="neutral.500" />
                </Flex>
              </Th>
            </Tr>
          </Thead>
          <Tbody
            sx={{
              td: {
                textStyle: 'bodyText7',
                fontWeight: '400',
                px: 3,
                py: 0,
                height: '40px',
                lineHeight: '40px',
                whiteSpace: 'nowrap',
              },
            }}
          >
            {rows.map((operator) => (
              <Tr key={operator.id} _odd={{ bg: 'primary.25' }}>
                <Td>{operator.name}</Td>
                <Td>{operator.village}</Td>
                <Td>{operator.reportingRate}</Td>
                <Td>{operator.photoCompliance}</Td>
                <Td>{operator.waterSupplied} LPCD</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  )
}
