import {
    Box,
    Button,
    Container,
    Flex,
    Input,
    Spinner,
    Text,
    Grid,
    GridItem,
    useColorModeValue,
    Icon,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";
import FeaturedPost from "../components/FeaturedPost";
import { SearchX } from "lucide-react";

const HomePage = () => {
    const [posts, setPosts] = useRecoilState(postsAtom);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchedPosts, setSearchedPosts] = useState([]);
    const [searchClicked, setSearchClicked] = useState(false);
    const showToast = useShowToast();

    useEffect(() => {
        const getFeedPosts = async () => {
            setLoading(true);
            setPosts([]);
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
        };
        getFeedPosts();
    }, [showToast, setPosts]);

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (!searchQuery) {
                setSearchedPosts([]);
                return;
            }

            const res = await fetch(`/api/posts/search?q=${searchQuery}`);
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
    };

    const clearSearch = () => {
        setSearchQuery("");
        setSearchedPosts([]);
        setSearchClicked(false);
    };

    return (
        <Box>
            <Box maxW="1400px" mx="auto" py={4}>
                <form onSubmit={handleSearch} >
                    <Flex maxW="600px" mx={"auto"}>
                        <Input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            bg="whitesmoke"
                            rounded="full"
                            py={2}
                            px={6}
                            focusBorderColor="green.300"
                            placeholder="Search Recipe..."
                            w="full"
                            borderColor={"green.200"}
                        />
                        <Button
                            onClick={handleSearch}
                            bg="green.400"
                            color="white"
                            fontWeight="semibold"
                            py={2}
                            px={6}
                            ml={2}
                            rounded="full"
                            _hover={{ bg: "green.300" }}
                        >
                            Search
                        </Button>
                        <Button
                            onClick={clearSearch}
                            bg="red.200"
                            color="white"
                            fontWeight="bold"
                            py={2}
                            px={4}
                            ml={2}
                            rounded="full"
                            _hover={{ bg: "red.300" }}
                        >
                            <Icon as={SearchX} w={5} h={5} color={"blackAlpha.800"} fill={'blackAlpha.200'} />


                        </Button>
                    </Flex>
                </form>
            </Box>

            <Container maxW="container.lg">
                {loading && searchQuery.length > 0 && searchedPosts.length === 0 && (
                    <Flex justify="center" mt={4}>
                        <Spinner size="xl" />
                    </Flex>
                )}

                {!loading && searchQuery.length > 0 && searchedPosts.length === 0 && (
                    <Flex justify="center" mt={4}>
                        <Text>No results found</Text>
                    </Flex>
                )}

                {searchedPosts.length > 0 && (
                    <Box py={8}>
                        <Text mb={4} fontSize="3xl" fontWeight="semibold">Searched Results</Text>
                        <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={6} maxWidth={"22rem"}>
                            {searchedPosts.map((post) => (
                                <GridItem key={post._id} >
                                    <FeaturedPost post={post} postedBy={post.postedBy} />
                                </GridItem>
                            ))}
                        </Grid>
                    </Box>
                )}
            </Container>

            <Container maxW="container.lg" py={8}>
                {loading && (
                    <Flex justify="center" mt={4}>
                        <Spinner size="xl" />
                    </Flex>
                )}

                {!loading && posts.length === 0 && (
                    <Flex justify="center" mt={4}>
                        <Text>Follow some users to see the feed</Text>
                    </Flex>
                )}

                <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={6} mt={6}>
                    {posts.map((post) => (
                        <GridItem key={post._id}>
                            <FeaturedPost post={post} postedBy={post.postedBy} />
                        </GridItem>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default HomePage;
