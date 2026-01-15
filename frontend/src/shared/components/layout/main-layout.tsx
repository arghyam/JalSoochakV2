import type { ReactNode } from 'react'
import { Outlet } from 'react-router-dom'
import { Box, Flex } from '@chakra-ui/react'
import { Sidebar } from './sidebar'

interface MainLayoutProps {
  children?: ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <Flex h="100vh" w="full" overflow="hidden" bg="neutral.50">
      <Sidebar />
      <Box as="main" ml="224px" flex={1} overflowY="auto" px={8} py={10}>
        {children || <Outlet />}
      </Box>
    </Flex>
  )
}
