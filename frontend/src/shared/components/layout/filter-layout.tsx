import type { ReactNode } from 'react'
import { Flex, Tabs, TabList, Tab, Text, Button } from '@chakra-ui/react'
import { FiFilter } from 'react-icons/fi'

interface FilterLayoutProps {
  tabs?: string[]
  activeTab?: number
  onTabChange?: (index: number) => void
  onClear?: () => void
  filtersIcon?: ReactNode
  rightSlot?: ReactNode
  children?: ReactNode
}

export function FilterLayout({
  tabs = ['Administrative', 'Departmental'],
  activeTab,
  onTabChange,
  onClear,
  filtersIcon,
  rightSlot,
  children,
}: FilterLayoutProps) {
  return (
    <Flex
      as="section"
      w="full"
      direction="column"
      gap={3}
      mt="24px"
      mb="24px"
      p="16px"
      bg="neutral.25"
      borderRadius="12px"
      borderWidth="0.5px"
      borderColor="neutral.200"
    >
      <Flex w="full" align="center" justify="space-between">
        <Tabs index={activeTab} onChange={onTabChange}>
          <TabList>
            {tabs.map((tab) => (
              <Tab
                key={tab}
                color="neutral.400"
                borderBottomWidth="2px"
                width="128px"
                height="30px"
                borderColor="transparent"
                _selected={{ color: 'primary.500', borderColor: 'primary.500' }}
              >
                <Text textStyle="h10" color="inherit">
                  {tab}
                </Text>
              </Tab>
            ))}
          </TabList>
        </Tabs>
        {rightSlot ?? (
          <Button
            variant="link"
            size="sm"
            onClick={onClear}
            _hover={{ textDecoration: 'underline', textDecorationColor: 'neutral.300' }}
          >
            <Text textStyle="h10" fontWeight="600" color="neutral.300">
              clear all filters
            </Text>
          </Button>
        )}
      </Flex>

      <Flex w="full" align="center" gap={3} wrap="wrap">
        <Flex align="center" gap="8px" wrap="wrap">
          <div style={{ display: 'flex', gap: '4px' }}>
            {filtersIcon ?? <FiFilter size="16px" />}
            <Text textStyle="bodyText6">Filters</Text>
          </div>
          {children}
        </Flex>
      </Flex>
    </Flex>
  )
}
