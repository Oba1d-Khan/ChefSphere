import {
    Box,
    Button,
    Flex,
    Input,
    Spinner,
    Text,
    Grid,
    GridItem,
    Container,
} from "@chakra-ui/react";
import { useState } from "react";
import useShowToast from "../hooks/useShowToast";
import RecipeCard from './RecipeCard';

const RecipeSuggester = () => {
    const [ingredients, setIngredients] = useState("");
    const [loading, setLoading] = useState(false);
    const [suggestedRecipes, setSuggestedRecipes] = useState([]);
    const showToast = useShowToast();

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuggestedRecipes([]);
        try {
            const res = await fetch("/api/posts/suggest", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ingredients: ingredients.split(",").map(ingredient => ingredient.trim())
                }),
            });

            if (!res.ok) {
                const errorData = await res.text();
                console.error('Error response data:', errorData);
                showToast("Error", "Failed to fetch recipes", "error");
                setLoading(false);
                return;
            }

            const data = await res.json();
            setSuggestedRecipes(data);
        } catch (error) {
            console.error('Fetch error:', error.message);
            showToast("Error", error.message, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            <Box maxW="1400px" mx="auto" py={4}>
                <form onSubmit={handleSearch}>
                    <Flex maxW="600px" mx={"auto"}>
                        <Input
                            type="text"
                            value={ingredients}
                            onChange={(e) => setIngredients(e.target.value)}
                            bg="whitesmoke"
                            rounded="full"
                            py={2}
                            px={6}
                            focusBorderColor="green.300"
                            placeholder="Enter ingredients (comma separated)..."
                            w="full"
                            borderColor={"green.200"}
                        />
                        <Button
                            type="submit"
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
                    </Flex>
                </form>
            </Box>

            <Container maxW="container.lg" py={8}>
                {loading && (
                    <Flex justify="center" mt={4}>
                        <Spinner size="xl" />
                    </Flex>
                )}

                {!loading && ingredients.length > 6 && (
                    <Flex justify="center" mt={4}>
                        <Text>No recipes found</Text>
                    </Flex>
                )}

                {!loading && suggestedRecipes.length > 0 && (
                    <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={6} mt={6}>
                        {suggestedRecipes.map((recipe) => (
                            <GridItem key={recipe._id}>
                                <RecipeCard post={recipe} postedBy={recipe.postedBy} />
                            </GridItem>
                        ))}
                    </Grid>
                )}
            </Container>
        </Box>
    );
};

export default RecipeSuggester;
