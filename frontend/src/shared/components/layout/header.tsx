import { Flex, Text, Image } from '@chakra-ui/react'
import jalsoochakLogo from '@/assets/media/jalsoochak-logo.svg'

export function Header() {
  return (
    <Flex as="header" borderBottomWidth="1px" bg="white" boxShadow="sm">
      <Flex w="full" maxW="100%" align="center" px="80px" py="12px" height="92.55px">
        <Flex align="center" flexShrink={0}>
          <Image src={jalsoochakLogo} alt="JalSoochak logo" w="117.61px" h="68.55px" />
        </Flex>

        <Flex flex="1" justify="center">
          <Text textStyle="h6" color="primary.500">
            JalSoochak Dashboard
          </Text>
        </Flex>
      </Flex>
    </Flex>
  )
}
