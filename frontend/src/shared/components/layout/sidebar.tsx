import { Link as RouterLink, useLocation } from 'react-router-dom'
import { Box, Flex, Stack, Text, Icon, Image } from '@chakra-ui/react'
import { MdDashboard, MdOutlineMoving, MdPeople, MdPersonAdd, MdSettings } from 'react-icons/md'
import { AiOutlineEye, AiOutlineSetting, AiOutlineWarning, AiOutlineApi } from 'react-icons/ai'
import { IoLanguageOutline, IoWaterOutline } from 'react-icons/io5'
import { HiOutlineTemplate } from 'react-icons/hi'
import { BsPerson, BsListUl } from 'react-icons/bs'
import jalsoochakLogo from '@/assets/media/jalsoochak-logo.svg'
import { useAuthStore } from '@/app/store'
import { ROUTES } from '@/shared/constants/routes'
import { AUTH_ROLES } from '@/shared/constants/auth'

interface NavItem {
  path: string
  label: string
  roles: string[]
  icon?: React.ComponentType<{ className?: string }>
}

const NAV_ITEMS: NavItem[] = [
  // Super Admin navigation
  { path: ROUTES.ADMIN, label: 'Dashboard', roles: [AUTH_ROLES.SUPER_ADMIN], icon: MdDashboard },
  {
    path: ROUTES.MANAGE_TENANTS,
    label: 'Manage Tenants',
    roles: [AUTH_ROLES.SUPER_ADMIN],
    icon: MdPeople,
  },
  {
    path: ROUTES.ADD_STATE_ADMIN,
    label: 'Add State Admin',
    roles: [AUTH_ROLES.SUPER_ADMIN],
    icon: MdPersonAdd,
  },
  {
    path: ROUTES.CONFIGURE_SYSTEM,
    label: 'Configure System',
    roles: [AUTH_ROLES.SUPER_ADMIN],
    icon: MdSettings,
  },

  // State Admin navigation
  {
    path: ROUTES.STATE_ADMIN_OVERVIEW,
    label: 'Overview',
    roles: [AUTH_ROLES.STATE_ADMIN],
    icon: AiOutlineEye,
  },
  {
    path: ROUTES.STATE_ADMIN_LANGUAGE,
    label: 'Language',
    roles: [AUTH_ROLES.STATE_ADMIN],
    icon: IoLanguageOutline,
  },
  {
    path: ROUTES.STATE_ADMIN_WATER_NORMS,
    label: 'Water Norms',
    roles: [AUTH_ROLES.STATE_ADMIN],
    icon: IoWaterOutline,
  },
  {
    path: ROUTES.STATE_ADMIN_INTEGRATION,
    label: 'Integration',
    roles: [AUTH_ROLES.STATE_ADMIN],
    icon: AiOutlineSetting,
  },
  {
    path: ROUTES.STATE_ADMIN_ESCALATIONS,
    label: 'Escalations',
    roles: [AUTH_ROLES.STATE_ADMIN],
    icon: MdOutlineMoving,
  },
  {
    path: ROUTES.STATE_ADMIN_THRESHOLDS,
    label: 'Thresholds',
    roles: [AUTH_ROLES.STATE_ADMIN],
    icon: AiOutlineWarning,
  },
  {
    path: ROUTES.STATE_ADMIN_NUDGES,
    label: 'Nudges Template',
    roles: [AUTH_ROLES.STATE_ADMIN],
    icon: HiOutlineTemplate,
  },
  {
    path: ROUTES.STATE_ADMIN_API_INGESTION,
    label: 'API Ingestion',
    roles: [AUTH_ROLES.STATE_ADMIN],
    icon: AiOutlineApi,
  },
  {
    path: ROUTES.STATE_ADMIN_OPERATOR_SYNC,
    label: 'Operator Sync',
    roles: [AUTH_ROLES.STATE_ADMIN],
    icon: BsPerson,
  },
  {
    path: ROUTES.STATE_ADMIN_ACTIVITY,
    label: 'Activity',
    roles: [AUTH_ROLES.STATE_ADMIN],
    icon: BsListUl,
  },
]

export function Sidebar() {
  const user = useAuthStore((state) => state.user)
  const location = useLocation()

  const userRole = user?.role
  const visibleNavItems = NAV_ITEMS.filter((item) => userRole && item.roles.includes(userRole))

  const getInitials = (name: string) => {
    const parts = name.split(' ')
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  return (
    <Box position="fixed" left={0} top={0} zIndex={40} h="100vh" w="224px">
      <Flex
        direction="column"
        h="100vh"
        w="224px"
        bg="white"
        borderRight="1px"
        borderColor="neutral.100"
      >
        {/* Brand Section */}
        <Flex
          h="80px"
          align="center"
          justify="center"
          gap={2}
          borderBottom="1px"
          borderColor="neutral.100"
          px={7}
          pt={2}
        >
          <Image src={jalsoochakLogo} alt="JalSoochak logo" />
        </Flex>

        {/* Menu Section */}
        <Stack flex={1} gap={4} overflowY="auto" px={7} py={4}>
          {visibleNavItems.map((item) => {
            const isActive = location.pathname === item.path
            const ItemIcon = item.icon

            return (
              <RouterLink key={item.path} to={item.path} style={{ textDecoration: 'none' }}>
                <Flex
                  alignItems="center"
                  gap={2}
                  borderRadius="lg"
                  px={3}
                  py={2}
                  fontSize="sm"
                  fontWeight="medium"
                  transition="all 0.2s"
                  bg={isActive ? 'primary.25' : 'transparent'}
                  color={isActive ? 'primary.700' : 'neutral.950'}
                  _hover={{
                    bg: isActive ? 'primary.25' : 'neutral.100',
                  }}
                >
                  {ItemIcon && <Icon as={ItemIcon} boxSize={5} flexShrink={0} />}
                  <Text isTruncated>{item.label}</Text>
                </Flex>
              </RouterLink>
            )
          })}
        </Stack>

        {/* Profile Section */}
        <Flex align="center" gap={3} borderTop="1px" borderColor="neutral.100" px={7} py={4}>
          <Flex
            h="40px"
            w="40px"
            flexShrink={0}
            align="center"
            justify="center"
            borderRadius="full"
            bg="primary.500"
            color="white"
          >
            <Text fontSize="sm" fontWeight="semibold">
              {user ? getInitials(user.name) : 'U'}
            </Text>
          </Flex>
          <Flex direction="column" minW={0}>
            <Text fontSize="sm" fontWeight="medium" color="neutral.950" isTruncated>
              {user?.name || 'User'}
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  )
}
