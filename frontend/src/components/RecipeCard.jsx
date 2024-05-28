// src/components/RecipeCard.jsx
import { Link } from 'react-router-dom';
import { Box, Image, Text, Flex, Icon, useColorModeValue } from '@chakra-ui/react';
import { Timer, Utensils } from 'lucide-react';

const RecipeCard = ({ post, postedBy }) => {
    return (
        <Link to={`/${postedBy.username}/post/${post._id}`}>
            <Flex
                flex={1}
                flexDirection={"column"}
                gap={4}
                shadow={"lg"}
                rounded={"lg"}
                p={6}
                _hover={{ shadow: "xl" }}
                transition="all 0.3s"
                bg="white"
            >
                {post.img && (
                    <Box w="full" h={{ base: 48, md: 64 }} overflow="hidden" rounded="lg">
                        <Image
                            src={post.img}
                            w="full"
                            h="full"
                            objectFit="cover"
                            transition="transform 0.3s"
                            _hover={{ transform: "scale(1.05)" }}
                        />
                    </Box>
                )}
                <Text
                    my={3}
                    fontSize={{ base: "xl", md: "2xl" }}
                    fontWeight="bold"
                    color={useColorModeValue("black", "white")}
                >
                    {post.recipeTitle}
                </Text>
                <Flex
                    gap={3}
                    my={3}
                    alignItems="center"
                    flexWrap="wrap"
                    color={useColorModeValue("gray.600", "gray.300")}
                >
                    <Flex alignItems="center">
                        <Icon as={Utensils} w={5} h={5} mr={1} />
                        <Text fontSize="md">{post.recipeOrigin}</Text>
                    </Flex>
                    <Flex alignItems="center">
                        <Icon as={Timer} w={5} h={5} mr={1} />
                        <Text fontSize="md">{post.cookingTime}</Text>
                    </Flex>
                </Flex>
            </Flex>
        </Link>
    );
};

export default RecipeCard;
