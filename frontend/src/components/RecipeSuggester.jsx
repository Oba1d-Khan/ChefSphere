import {
    Box,
    Button,
    Flex,
    Input,
    Spinner,
    Text,
    Grid,
    GridItem,
    useColorModeValue,
    Container,
    Image
} from "@chakra-ui/react";
import { useState } from "react";
import useShowToast from "../hooks/useShowToast";

const RecipeSuggester = () => {
    const [ingredients, setIngredients] = useState("");
    const [dietaryPreferences, setDietaryPreferences] = useState("");
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
                    ingredients: ingredients.split(",").map(ingredient => ingredient.trim()),
                    dietaryPreferences: dietaryPreferences ? dietaryPreferences.split(",").map(preference => preference.trim()) : [],
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
                        <Input
                            type="text"
                            value={dietaryPreferences}
                            onChange={(e) => setDietaryPreferences(e.target.value)}
                            bg="whitesmoke"
                            rounded="full"
                            py={2}
                            px={6}
                            focusBorderColor="green.300"
                            placeholder="Enter dietary preferences (comma separated)..."
                            w="full"
                            borderColor={"green.200"}
                            ml={2}
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

                {!loading && suggestedRecipes.length === 0 && (
                    <Flex justify="center" mt={4}>
                        <Text>No recipes found</Text>
                    </Flex>
                )}

                <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={6} mt={6}>
                    {suggestedRecipes.map((recipe, index) => (
                        <GridItem key={index}>
                            <Box
                                p={4}
                                borderWidth="1px"
                                borderRadius="lg"
                                overflow="hidden"
                                bg={useColorModeValue("white", "gray.700")}
                            >
                                {recipe.image && (
                                    <Image
                                        src={recipe.image}
                                        alt={recipe.label}
                                        objectFit="cover"
                                        borderRadius="lg"
                                        mb={4}
                                    />
                                )}
                                <Text fontWeight="bold" mb={2}>
                                    {recipe.label}
                                </Text>
                                <Text mb={2}>Calories: {Math.round(recipe.calories)}</Text>
                                <Text mb={2}>Diet Labels: {recipe.dietLabels.join(", ")}</Text>
                                <Text mb={2}>Health Labels: {recipe.healthLabels.join(", ")}</Text>
                                <Button as="a" href={recipe.url} target="_blank" colorScheme="teal">
                                    View Recipe
                                </Button>
                            </Box>
                        </GridItem>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default RecipeSuggester;
