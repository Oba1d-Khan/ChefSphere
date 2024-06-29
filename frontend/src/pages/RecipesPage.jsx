import {
    Box,
    Container,
    Flex,
    Heading,
    Grid,
    GridItem,
    Input,
    InputGroup,
    InputRightElement,
    Select,
    Spinner,
    Text,
    Button,
    Skeleton
} from "@chakra-ui/react";
import { useEffect, useState, useCallback } from "react";
import { useRecoilState } from "recoil";
import { SearchX } from "lucide-react";
import { motion } from "framer-motion";
import useShowToast from "../hooks/useShowToast";
import postsAtom from "../atoms/postsAtom";
import RecipeCard from "../components/RecipeCard";

const MotionGrid = motion(Grid);

const RecipePage = () => {
    const [posts, setPosts] = useRecoilState(postsAtom);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchedPosts, setSearchedPosts] = useState([]);
    const [searchClicked, setSearchClicked] = useState(false);
    const showToast = useShowToast();

    const [filters, setFilters] = useState({
        rating: "",
        cookingTime: "",
        servings: "",
        origin: "",
    });

    const fetchPosts = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/posts/feed");
            const data = await res.json();
            if (data.error) {
                showToast("Error", data.error, "error");
                return;
            }
            setPosts(data);
        } catch (error) {
            showToast("Error", error.message, "error");
        } finally {
            setLoading(false);
        }
    }, [showToast, setPosts]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    const handleSearch = useCallback(async () => {
        setLoading(true);
        try {
            const query = new URLSearchParams({
                q: searchQuery,
                rating: filters.rating,
                cookingTime: filters.cookingTime,
                servings: filters.servings,
                origin: filters.origin
            }).toString();

            const res = await fetch(`/api/posts/search?${query}`);
            const searchData = await res.json();
            if (searchData.error) {
                showToast("Error", searchData.error, "error");
                return;
            }
            setSearchedPosts(searchData);
            setSearchClicked(true);
        } catch (error) {
            showToast("Error", error.message, "error");
        } finally {
            setLoading(false);
        }
    }, [searchQuery, filters, showToast]);

    useEffect(() => {
        if (searchClicked) {
            handleSearch();
        }
    }, [filters]);

    const clearSearch = () => {
        setSearchQuery("");
        setSearchedPosts([]);
        setSearchClicked(false);
    };

    const resetFilters = () => {
        setFilters({
            rating: "",
            cookingTime: "",
            servings: "",
            origin: "",
        });
        setSearchedPosts([]);
        setSearchClicked(false);
    };

    return (
        <Box>
            <Container maxW="container.lg" py={8}>
                <Heading as="h1" mb={6} textAlign="center">
                    Find Your Recipe
                </Heading>
                <Flex direction="column" align="center" mb={6}>
                    <InputGroup size="lg" maxW="600px" mb={4}>
                        <Input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search recipes..."
                            rounded="full"
                            bg="white"
                            borderColor="green.300"
                            _focus={{ borderColor: "green.500" }}
                        />
                        <InputRightElement>
                            {searchQuery && (
                                <Button onClick={clearSearch} size="sm" bg="red.200" rounded="full">
                                    <SearchX />
                                </Button>
                            )}
                        </InputRightElement>
                    </InputGroup>
                    <Button onClick={handleSearch} colorScheme="teal" size="lg" rounded="full" bgGradient="linear(to-l, #5ED20A, #9CCC65)"
                            _hover={{ bgGradient: 'linear(to-r, #5ED20A, #9CCC65)', opacity: 0.9 ,transform: "scale(1.05)" }}>
                        Search
                    </Button>
                </Flex>

                {/* Filters Section */}
                <Flex wrap="wrap" justify="center" align="center" mb={6} gap={4}>
                    <Select
                        placeholder="Filter by rating"
                        value={filters.rating}
                        onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
                        maxW="200px"
                    >
                        <option value="1">★ 1 star & above</option>
                        <option value="2">★ 2 stars & above</option>
                        <option value="3">★ 3 stars & above</option>
                        <option value="4">★ 4 stars & above</option>
                        <option value="5">★ 5 stars</option>
                    </Select>
                    <Select
                        placeholder="Filter by servings"
                        value={filters.servings}
                        onChange={(e) => setFilters({ ...filters, servings: e.target.value })}
                        maxW="200px"
                    >
                        <option value="1">1 serving & above</option>
                        <option value="2">2 servings & above</option>
                        <option value="4">4 servings & above</option>
                        <option value="6">6 servings & above</option>
                        <option value="8">8 servings & above</option>
                    </Select>
                    <Select
                        placeholder="Filter by origin"
                        value={filters.origin}
                        onChange={(e) => setFilters({ ...filters, origin: e.target.value })}
                        maxW="200px"
                    >
                        <option value="Italian">Italian</option>
                        <option value="Mexican">Mexican</option>
                        <option value="Indian">Indian</option>
                        <option value="Japanese">Japanese</option>
                        <option value="Thailand">Thailand</option>
                    </Select>
                    <Select
                        placeholder="Filter by cooking time"
                        value={filters.cookingTime}
                        onChange={(e) => setFilters({ ...filters, cookingTime: e.target.value })}
                        maxW="200px"
                    >
                        <option value="30">Less than 30 mins</option>
                        <option value="60">Less than 1 hour</option>
                        <option value="90">Less than 1.5 hour</option>

                    </Select>
                    <Button onClick={resetFilters} colorScheme="red" variant="outline" size="sm">
                        Reset Filters
                    </Button>
                </Flex>

                {loading && (
                    <Flex justify="center" mt={4}>
                        <Spinner size="xl" />
                    </Flex>
                )}

                {!loading && searchClicked && searchedPosts.length === 0 && (
                    <Text textAlign="center" mt={4}>
                        No results found
                    </Text>
                )}

                {!loading && searchedPosts.length > 0 && (
                    <Box mt={8}>
                        <Heading as="h2" size="lg" mb={4} textAlign="center">
                            Search Results
                        </Heading>
                        <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={6}>
                            {searchedPosts.map((post) => (
                                <GridItem key={post._id}>
                                    <RecipeCard post={post} />
                                </GridItem>
                            ))}
                        </Grid>
                    </Box>
                )}

                <Box mt={8}>
                    {!searchClicked && (
                        <Heading as="h1" size="lg" my={4} textAlign="center">
                            Other Related Recipes
                        </Heading>
                    )}
                    {loading && (
                        <MotionGrid
                            templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }}
                            mx={"auto"}
                            gap={4}
                            justifyItems={"between"}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            {[...Array(6)].map((_, i) => (
                                <Skeleton key={i} height="300px" borderRadius="lg" />
                            ))}
                        </MotionGrid>
                    )}

                    {!loading && posts.length === 0 && (
                        <Heading as="h2" size="md" textAlign="center">
                            Follow some users to see the feed
                        </Heading>
                    )}

                    {!loading && posts.length > 0 && !searchClicked && (
                        <MotionGrid
                            templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }}
                            gap={4}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            {posts.map((post) => (
                                <RecipeCard key={post._id} post={post} />
                            ))}
                        </MotionGrid>
                    )}
                </Box>
            </Container>
        </Box>
    );
};

export default RecipePage;
