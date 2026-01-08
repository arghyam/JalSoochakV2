import { useEffect } from 'react'
import { Box, Flex, Text, IconButton } from '@chakra-ui/react'
import { CheckIcon, CloseIcon, InfoIcon, WarningIcon } from '@chakra-ui/icons'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

interface ToastProps {
  id: string
  message: string
  type: ToastType
  onClose: (id: string) => void
  duration?: number
}

export function Toast({ id, message, type, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id)
    }, duration)

    return () => clearTimeout(timer)
  }, [id, onClose, duration])

  const typeStyles = {
    success: { bg: 'success.500', color: 'white' },
    error: { bg: 'error.500', color: 'white' },
    info: { bg: 'blue.500', color: 'white' },
    warning: { bg: 'warning.500', color: 'white' },
  }

  const icons = {
    success: CheckIcon,
    error: CloseIcon,
    info: InfoIcon,
    warning: WarningIcon,
  }

  const IconComponent = icons[type]
  const styles = typeStyles[type]

  return (
    <Flex
      align="center"
      gap={3}
      maxW="500px"
      minW="300px"
      bg={styles.bg}
      color={styles.color}
      borderRadius="lg"
      px={4}
      py={3}
      boxShadow="lg"
    >
      <Box flexShrink={0}>
        <IconComponent />
      </Box>
      <Text flex={1} fontSize="sm" fontWeight="medium">
        {message}
      </Text>
      <IconButton
        aria-label="Close toast"
        size="xs"
        variant="ghost"
        color={styles.color}
        onClick={() => onClose(id)}
        _hover={{ opacity: 0.75 }}
      >
        <CloseIcon boxSize={3} />
      </IconButton>
    </Flex>
  )
}
