import { Box, Flex, Icon, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
import { BiSortAlt2 } from 'react-icons/bi'
import type { EntityPerformance } from '../../types'

interface AllStatesTableProps {
  data: EntityPerformance[]
  maxItems?: number
}

export function AllStatesTable({ data, maxItems = 8 }: AllStatesTableProps) {
  const rows = data.slice(0, maxItems)

  return (
    <Box borderRadius="lg" overflow="hidden">
      <Table size="sm">
        <Thead
          sx={{
            th: { textStyle: 'bodyText7', textTransform: 'none', fontWeight: '500', px: 3, py: 5 },
          }}
        >
          <Tr>
            <Th>State/UT</Th>
            <Th>
              <Flex align="center">
                <Box as="span">Coverage (%)</Box>
                <Icon as={BiSortAlt2} boxSize="16px" color="neutral.500" />
              </Flex>
            </Th>
            <Th>
              <Flex align="center">
                <Box as="span">Quantity (LPCD)</Box>
                <Icon as={BiSortAlt2} boxSize="16px" color="neutral.500" />
              </Flex>
            </Th>
            <Th>
              <Flex align="center">
                <Box as="span">Regularity (%)</Box>
                <Icon as={BiSortAlt2} boxSize="16px" color="neutral.500" />
              </Flex>
            </Th>
            <Th>
              <Flex align="center">
                <Box as="span">Average (%)</Box>
                <Icon as={BiSortAlt2} boxSize="16px" color="neutral.500" />
              </Flex>
            </Th>
          </Tr>
        </Thead>
        <Tbody sx={{ td: { textStyle: 'bodyText7', fontWeight: '400', px: 3, py: 5 } }}>
          {rows.map((state) => (
            <Tr key={state.id} _odd={{ bg: 'primary.25' }}>
              <Td>{state.name}</Td>
              <Td>{state.coverage.toFixed(0)}%</Td>
              <Td>{state.quantity}</Td>
              <Td>{state.regularity.toFixed(0)}%</Td>
              <Td>{state.compositeScore.toFixed(0)}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  )
}
