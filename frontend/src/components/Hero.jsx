import {
    chakra,
    Container,
    Stack,
    HStack,
    Text,
    useColorModeValue,
    Image,
    Skeleton,
    Box,
    Link,
    Icon
} from '@chakra-ui/react';
import { Clock, NotebookPen, Utensils } from 'lucide-react';

const HeroSection = () => {
    return (
        <Container maxW="6xl" px={{ base: 6, md: 3 }} py={20}>
            <Stack direction={{ base: 'column', md: 'row' }} justifyContent="center">
                <Stack direction="column" spacing={6} justifyContent="center" maxW="480px">
                    <HStack
                        as={Link}
                        p={1}
                        rounded="full"
                        fontSize="sm"
                        w="max-content"
                        bg={useColorModeValue('blackAlpha.100', 'gray.400')}
                    >
                        <HStack spacing={1} alignItems="center" justifyContent="center">
                            <Icon as={NotebookPen} w={5} h={5} color={"blackAlpha.900"} fill={'blackAlpha.200'} />
                        </HStack>
                        <Box
                            py={1}
                            px={2}
                            lineHeight={1}
                            rounded="full"
                            color="black"
                            bgColor="white"
                        >
                            Hot Recipes
                        </Box>
                    </HStack>
                    <chakra.h1 fontSize={{ base: "3xl", md: "5xl" }} lineHeight={1} fontWeight="bold" textAlign="left">
                        Spicy Delicious <br />
                        <chakra.span color="blackAlpha.700">Chicken Wings</chakra.span>
                    </chakra.h1>
                    <Text
                        fontSize={{ base: "sm", md: "1.2rem" }}
                        textAlign="left"
                        lineHeight={{ base: "1.25", md: "1.375" }}
                        fontWeight="400"
                        color="gray.500"
                    >
                        A whisper of smoke, a tingle on your lips, a secret dance of spice and sweet. Our wings are an adventure for your palate.
                    </Text>
                    <HStack
                        spacing={{ base: 0, sm: 2 }}
                        mb={{ base: '3rem !important', sm: 0 }}
                        flexWrap="wrap"
                    >
                        <Box
                            d="flex"
                            alignItems="center"
                            w={{ base: '100%', sm: 'auto' }}
                            py={3}
                            px={4}
                            color="white"
                            size="lg"
                            rounded="full"
                            mb={{ base: 2, sm: 0 }}
                            zIndex={5}
                            bgGradient="linear(to-l, #5ED20A, #9CCC65)"
                            _hover={{ bgGradient: 'linear(to-r, #5ED20A, #9CCC65)', opacity: 0.9 }}
                        >
                            <chakra.span> 30 Minutes</chakra.span>
                            <Icon as={Clock} h={4} w={4} ml={1} />
                        </Box>
                        <Box
                            d="flex"
                            justifyContent="center"
                            bg={useColorModeValue('white', 'gray.800')}
                            w={{ base: '100%', sm: 'auto' }}
                            border="1px solid"
                            borderColor="green.200"
                            py={3}
                            px={4}
                            lineHeight={1.18}
                            rounded="full"
                            boxShadow="md"
                            zIndex={55555555}
                        >
                            <Icon as={Utensils} h={4} w={4} mr={2} />
                            Chicken
                        </Box>
                    </HStack>
                </Stack>
                <Box ml={{ base: 0, md: 5 }} pos="relative">
                    <DottedBox />
                    <Image
                        w="100%"
                        h="80%"
                        minW={{ base: 'auto', md: '30rem' }}
                        objectFit="cover"
                        src="/public/chicken tikka.png"
                        rounded="xl"
                        fallback={<Skeleton />}
                    />
                </Box>
            </Stack>
        </Container>
    );
};

function DottedBox() {
    return (
        <Box position="absolute" left="-45px" top="-30px" height="full" maxW="700px" zIndex={-1}>
            <svg
                color={useColorModeValue('rgba(55,65,81, 0.1)', 'rgba(55,65,81, 0.7)')}
                width="350"
                height="420"
                fill="none"
            >
                <defs>
                    <pattern
                        id="5d0dd344-b041-4d26-bec4-8d33ea57ec9b"
                        x="0"
                        y="0"
                        width="20"
                        height="20"
                        patternUnits="userSpaceOnUse"
                    >
                        <rect x="0" y="0" width="4" height="4" fill="currentColor"></rect>
                    </pattern>
                </defs>
                <rect width="404" height="404" fill="url(#5d0dd344-b041-4d26-bec4-8d33ea57ec9b)"></rect>
            </svg>
        </Box>
    );
}

export default HeroSection;
