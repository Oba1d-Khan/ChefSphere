import {
    Box,
    Container,
    Flex,
    Spinner,
    Text,
    Grid,
    GridItem,
    Button,
    Input,
    InputGroup,
    InputRightElement,
    IconButton,
    Heading,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";
import RecipeSuggester from "../components/RecipeSuggester";
import RecipeCard from "../components/RecipeCard";
import { SearchX } from "lucide-react";

const HomePage = () => {
    const [posts, setPosts] = useRecoilState(postsAtom);
    const [loading, setLoading] = useState(true);
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

    return (
        <Box>
            <Container maxW="container.lg" py={8}>
                <RecipeSuggester />
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
                <Heading as="h2" size="lg" mt={4}>
                    Recent Recipes
                </Heading>
                <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={6} mt={6}>
                    {posts.map((post) => (
                        <GridItem key={post._id}>
                            <RecipeCard post={post} postedBy={post.postedBy} />
                        </GridItem>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default HomePage;
