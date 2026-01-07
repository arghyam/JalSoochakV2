import { Box, Flex, Text } from '@chakra-ui/react'

interface KPICardProps {
  title: string
  value: string | number
  unit?: string
  description?: string
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
}

export function KPICard({ title, value, unit, description, trend }: KPICardProps) {
  return (
    <Box
      bg="white"
      borderRadius="lg"
      borderWidth="1px"
      borderColor="neutral.100"
      p={6}
      boxShadow="sm"
      transition="box-shadow 0.2s"
      _hover={{ boxShadow: 'md' }}
    >
      <Flex direction="column" gap={2}>
        <Text fontSize="sm" fontWeight="medium" color="gray.600">
          {title}
        </Text>
        <Flex align="baseline" gap={2}>
          <Text fontSize="3xl" fontWeight="bold" color="neutral.800">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </Text>
          {unit && (
            <Text fontSize="lg" fontWeight="medium" color="gray.600">
              {unit}
            </Text>
          )}
        </Flex>
        {description && (
          <Text fontSize="xs" color="gray.600">
            {description}
          </Text>
        )}
        {trend && (
          <Flex align="center" gap={1} fontSize="sm">
            <Text fontWeight="medium" color={trend.isPositive ? 'green.600' : 'red.600'}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </Text>
            <Text color="gray.600">vs last period</Text>
          </Flex>
        )}
      </Flex>
    </Box>
  )
}
