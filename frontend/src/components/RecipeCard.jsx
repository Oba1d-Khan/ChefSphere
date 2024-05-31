import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Box, Image, Text, Flex, Icon, useColorModeValue, Button, color } from '@chakra-ui/react';
import { Timer, Utensils, Heart, HeartOff, BookmarkPlus, BookmarkCheck } from 'lucide-react';
import axios from 'axios';
import useShowToast from '../hooks/useShowToast';
import postsAtom from '../atoms/postsAtom';
import { useRecoilState } from 'recoil';

const RecipeCard = ({ post, postedBy }) => {
    const [user, setUser] = useState(null);
    const showToast = useShowToast();
    const [posts, setPosts] = useRecoilState(postsAtom);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        // Get the user who posted the recipe
        const getUser = async () => {
            try {
                const res = await fetch(`/api/users/profile/${postedBy}`);
                const data = await res.json();
                if (data.error) {
                    showToast("Error", data.error, "error");
                    return;
                }
                setUser(data);
            } catch (error) {
                showToast("Error", error.message, "error");
                setUser(null);
            }
        };

        // Check if the recipe is already in the favorites
        const checkFavoriteStatus = async () => {
            try {
                const res = await axios.get(`/api/users/favorites/${post._id}`);
                setIsFavorite(res.data.isFavorite);
            } catch (error) {
                console.error('Error checking favorite status:', error.message);
            }
        };

        getUser();
        checkFavoriteStatus();
    }, [postedBy, post._id, showToast]);

    const handleAddToFavorites = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`/api/users/favorites/${post._id}`);
            showToast("Success", "Recipe added to favorites", "success");
            setIsFavorite(true);
        } catch (error) {
            showToast("Error", error.message, "error");
        }
    };

    const handleRemoveFromFavorites = async (e) => {
        e.preventDefault();
        try {
            await axios.delete(`/api/users/favorites/${post._id}`);
            showToast("Success", "Recipe removed from favorites", "success");
            setIsFavorite(false);
        } catch (error) {
            showToast("Error", error.message, "error");
        }
    };


    if (!user) return null;

    return (
        <Link to={`/${user.username}/post/${post._id}`}>
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
                <Flex justifyContent="flex-end" mt={3} gap={3}>
                    {isFavorite ? (
                        <Icon as={BookmarkCheck} w={6} h={6} color="green" onClick={handleRemoveFromFavorites} cursor="pointer" />
                    ) : (
                        <Icon as={BookmarkPlus} w={6} h={6} transition="transform 0.3s"
                            _hover={{ transform: "scale(1.05)", color: "green.500" }} color="gray" onClick={handleAddToFavorites} cursor="pointer" />
                    )}
                </Flex>

            </Flex>
        </Link>
    );
};

export default RecipeCard;
