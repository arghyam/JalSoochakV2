import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Flex,
  Button,
  Text,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Image,
} from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { useAuthStore } from '@/app/store'
import jalsoochakLogo from '@/assets/media/jalsoochak-logo.svg'

export function Header() {
  const { user, isAuthenticated, logout } = useAuthStore()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const getInitials = (name: string) => {
    const parts = name.split(' ')
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch {
      // ignore
    }
    navigate('/login', { replace: true })
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    if (isMenuOpen) document.addEventListener('mousedown', handleClickOutside)

    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isMenuOpen])

  return (
    <Flex as="header" borderBottomWidth="1px" bg="white" boxShadow="sm">
      <Flex
        w="full"
        maxW="100%"
        align="center"
        justify="space-between"
        px="80px"
        py="12px"
        height="92.55px"
      >
        <Flex align="center">
          <Image src={jalsoochakLogo} alt="JalSoochak logo" w="117.61px" h="68.55px" />
        </Flex>

        <Text textStyle="h6" color="primary.500">
          JalSoochak Dashboard
        </Text>

        <Flex align="center" gap={4} justify="flex-end">
          {isAuthenticated && user ? (
            <Box ref={menuRef}>
              <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)}>
                <MenuButton
                  as={Button}
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  variant="ghost"
                  px={3}
                  py={2}
                  borderRadius="lg"
                  _hover={{ bg: 'gray.100' }}
                  rightIcon={<ChevronDownIcon />}
                >
                  <Flex align="center" gap={2}>
                    <Avatar size="sm" bg="blue.600" color="white" name={user.name}>
                      {getInitials(user.name)}
                    </Avatar>
                    <Text fontSize="sm" fontWeight="medium">
                      {user.name}
                    </Text>
                  </Flex>
                </MenuButton>

                <MenuList>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </MenuList>
              </Menu>
            </Box>
          ) : null}
        </Flex>
      </Flex>
    </Flex>
  )
}
