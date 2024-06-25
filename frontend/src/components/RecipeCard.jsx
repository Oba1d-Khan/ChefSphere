import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    Box,
    Image,
    Text,
    Flex,
    Icon,
    useColorModeValue,
    useToast,
} from "@chakra-ui/react";
import { Timer, Utensils, Bookmark, BookmarkPlus } from "lucide-react";
import axios from "axios";
import useShowToast from "../hooks/useShowToast";
import postsAtom from "../atoms/postsAtom";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import Rating from "../components/Rating";

const RecipeCard = ({ post, handleRemoveFromFavorites }) => {
    const [user, setUser] = useState(null);
    const showToast = useShowToast();
    const [posts, setPosts] = useRecoilState(postsAtom);
    const [isFavorite, setIsFavorite] = useState(false);
    const currentUser = useRecoilValue(userAtom);
    const toast = useToast();

    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await fetch(`/api/users/profile/${post.postedBy}`);
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

        const checkFavoriteStatus = async () => {
            try {
                const res = await axios.get(`/api/users/favorites`);
                const favoritePostIds = res.data.favorites.map(fav => fav._id);
                setIsFavorite(favoritePostIds.includes(post._id));
            } catch (error) {
                console.error("Error checking favorite status:", error.message);
            }
        };

        getUser();
        checkFavoriteStatus();
    }, [post.postedBy, post._id, showToast]);

    const handleAddToFavorites = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`/api/users/favorites/${post._id}`);
            showToast("Success", "Added to Favorites", "success");
            setIsFavorite(true);
        } catch (error) {
            showToast("Error", error.message, "error");
        }
    };

    const handleRemove = async (e) => {
        e.preventDefault();
        try {
            await axios.delete(`/api/users/favorites/${post._id}`);
            showToast("Success", "Removed from Favorites", "success");
            setIsFavorite(false);
            if (handleRemoveFromFavorites) {
                handleRemoveFromFavorites(post._id);
            }
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
                gap={1}
                shadow={"lg"}
                rounded={"lg"}
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
                            loading="lazy" // Lazy loading images
                        />
                    </Box>
                )}
                <Box px={4} pt={2} pb={6}>
                    <Text
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
                    <Flex justifyContent="space-between" alignItems="center" mt={3} gap={3}>
                        <Rating postId={post._id} initialRating={post.averageRating} initialReviewsCount={post.ratings.length} />
                        <Flex>
                            {isFavorite ? (
                                <Icon
                                    as={Bookmark}
                                    w={6}
                                    h={6}
                                    color="teal.500"
                                    fill="teal.400"
                                    stroke={"teal.500"}
                                    _hover={{ transform: "scale(1.05)" }}
                                    onClick={handleRemove}
                                    cursor="pointer"
                                />
                            ) : (
                                <Icon
                                    as={BookmarkPlus}
                                    w={6}
                                    h={6}
                                    transition="transform 0.3s"
                                    _hover={{ transform: "scale(1.05)", color: "teal.500" }}
                                    color="gray"
                                    onClick={handleAddToFavorites}
                                    cursor="pointer"
                                />
                            )}
                        </Flex>
                    </Flex>
                </Box>
            </Flex>
        </Link>
    );
};

export default RecipeCard;
