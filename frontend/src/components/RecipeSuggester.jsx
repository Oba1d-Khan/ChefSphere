import {
    Box,
    Button,
    Flex,
    Input,
    Text,
    Grid,
    GridItem,
    Container,
    IconButton,
    InputGroup,
    InputRightElement,
    HStack,
    ButtonGroup,
    Skeleton,
    SkeletonText,
    Heading,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import useShowToast from "../hooks/useShowToast";
import RecipeCard from './RecipeCard';
import { SearchX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const MotionBox = motion(Box);

const RecipeSuggester = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchType, setSearchType] = useState("recipe");
    const [loading, setLoading] = useState(false);
    const [suggestedRecipes, setSuggestedRecipes] = useState([]);
    const showToast = useShowToast();

    useEffect(() => {
        if (searchQuery) {
            handleSearch();
        }
    }, [searchQuery]);

    const handleSearch = async () => {
        setLoading(true);
        setSuggestedRecipes([]);
        try {
            const res = await fetch("/api/posts/suggest", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ingredients: searchQuery.split(",").map(item => item.trim()),
                    searchType,
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

    const handleClear = () => {
        setSearchQuery("");
        setSuggestedRecipes([]);
    };

    return (
        <Box>
            <Box maxW="1400px" mx="auto" py={4}>
                <form onSubmit={(e) => e.preventDefault()}>
                    <Flex maxW="full" mx="auto" justify="center" direction="column" alignItems="center">
                        <InputGroup width="100%" maxW="800px">
                            <Input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                bg="whitesmoke"
                                rounded="full"
                                py={2}
                                px={6}
                                focusBorderColor="green.300"
                                placeholder="Enter search query (comma separated if ingredients)..."
                                w="full"
                                borderColor={"green.200"}
                            />
                            <InputRightElement>
                                {searchQuery && (
                                    <IconButton
                                        aria-label="Clear search"
                                        icon={<SearchX />}
                                        onClick={handleClear}
                                        size="sm"
                                        bg="red.50"
                                        color="gray.500"
                                        _hover={{ bg: "red.100", color: 'gray.600' }}
                                        rounded="full"
                                    />
                                )}
                            </InputRightElement>
                        </InputGroup>
                        <HStack spacing={4} mt={4} justify="center">
                            <Text fontWeight={"semibold"}>Search by :</Text>
                            <ButtonGroup isAttached >
                                <MotionBox
                                    initial={{ opacity: 0.5 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 2 }}
                                >
                                    <Button
                                        onClick={() => setSearchType("ingredients")}
                                        bg={searchType === "ingredients" ? "whatsapp.600" : "white"}
                                        color={searchType === "ingredients" ? "white" : "gray.500"}
                                        fontWeight={searchType === "ingredients" ? "bold" : "normal"}
                                        _hover={{
                                            bg: searchType === "ingredients" ? "whatsapp.500" : "green.50",
                                            borderColor: "green.500", borderWidth: "1px"

                                        }}
                                        roundedLeft="full"
                                    >
                                        Ingredients
                                    </Button>
                                </MotionBox>
                                <MotionBox
                                    initial={{ opacity: 0.5 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 2 }}
                                >
                                    <Button
                                        onClick={() => setSearchType("recipe")}
                                        bg={searchType === "recipe" ? "whatsapp.600" : "white"}
                                        color={searchType === "recipe" ? "white" : "gray.500"}
                                        fontWeight={searchType === "recipe" ? "bold" : "normal"}
                                        _hover={{
                                            bg: searchType === "recipe" ? "whatsapp.500" : "green.50",
                                            borderColor: "green.500", borderWidth: "1px"
                                        }}
                                        roundedRight="full"
                                    >
                                        Recipe
                                    </Button>
                                </MotionBox>
                            </ButtonGroup>
                        </HStack>
                    </Flex>
                </form>
            </Box>

            <Container maxW="container.lg"  >
                {loading && (
                    <Flex justify="center" mt={2}>

                        <Grid templateColumns="repeat(3, 1fr)" gap={6}>
                            {[...Array(6)].map((_, i) => (
                                <GridItem key={i}>
                                    <Skeleton height="300px" borderRadius="lg" />
                                    <SkeletonText mt="4" noOfLines={4} spacing="4" />
                                </GridItem>
                            ))}
                        </Grid>
                    </Flex>
                )}

                {!loading && searchQuery && suggestedRecipes.length === 0 && (
                    <Flex justify="center" mt={4}>
                        <Text>No recipes found</Text>
                    </Flex>
                )}

                {!loading && searchQuery && suggestedRecipes.length > 0 && (
                    <Container bg="gray.50" maxW="container.xl" py={8} backdropBrightness={0.5}>
                        <Heading as="h2" size="lg" mb={4}>
                            Searched Results
                        </Heading>
                        <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={6} mt={6}>
                            <AnimatePresence>
                                {suggestedRecipes.map((recipe) => (
                                    <MotionBox
                                        key={recipe._id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <GridItem>
                                            <RecipeCard post={recipe} postedBy={recipe.postedBy} />
                                        </GridItem>
                                    </MotionBox>
                                ))}
                            </AnimatePresence>
                        </Grid>
                    </Container>
                )}

            </Container>
        </Box>
    );
};

export default RecipeSuggester;
