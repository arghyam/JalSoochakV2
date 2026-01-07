import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Box,
  Flex,
  Heading,
  Button,
  Text,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { useAuthStore } from '@/app/store'

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
    <Flex
      as="header"
      h="16"
      align="center"
      justify="space-between"
      borderBottomWidth="1px"
      bg="white"
      px={6}
      boxShadow="sm"
    >
      <Heading as="h1" fontSize="xl" fontWeight="semibold">
        JalSoochak
      </Heading>

      <Flex align="center" gap={4}>
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
        ) : (
          <Button as={Link} to="/login" colorScheme="blue" size="sm">
            Login
          </Button>
        )}
      </Flex>
    </Flex>
  )
}
