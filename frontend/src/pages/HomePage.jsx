import {
	Box,
	Container,
	Flex,
	Heading,
	Grid,
	Input,
	IconButton,
	InputGroup,
	InputRightElement,
	Text,
	Skeleton,
	Button,
	SimpleGrid,
} from "@chakra-ui/react";
import { useEffect, useState, useCallback } from "react";
import { useRecoilState } from "recoil";
import { SearchX } from "lucide-react";
import { motion } from "framer-motion";
import useShowToast from "../hooks/useShowToast";
import postsAtom from "../atoms/postsAtom";
import HeroSection from "../components/Hero";
import RecipeCard from "../components/RecipeCard";

const MotionGrid = motion(Grid);

const cacheKey = 'recipePostsCache';

const HomePage = () => {
	const [posts, setPosts] = useRecoilState(postsAtom);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [searchedPosts, setSearchedPosts] = useState([]);
	const [searchClicked, setSearchClicked] = useState(false);
	const [searchType, setSearchType] = useState("recipe");
	const showToast = useShowToast();

	const fetchPosts = useCallback(async () => {
		setLoading(true);
		try {
			const cachedPosts = localStorage.getItem(cacheKey);
			if (cachedPosts) {
				setPosts(JSON.parse(cachedPosts));
				setLoading(false);
				return;
			}

			const res = await fetch("/api/posts/feed");
			const data = await res.json();
			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}
			setPosts(data);
			localStorage.setItem(cacheKey, JSON.stringify(data));
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
			if (!searchQuery) {
				setSearchedPosts([]);
				setSearchClicked(false);
				return;
			}

			const res = await fetch(`/api/posts/search?${searchType === "recipe" ? `q=${searchQuery}` : `ingredients=${searchQuery}`}`);
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
	}, [searchQuery, searchType, showToast]);

	useEffect(() => {
		if (searchQuery) {
			const delayDebounceFn = setTimeout(() => {
				handleSearch();
			}, 300); // Debounce time in ms

			return () => clearTimeout(delayDebounceFn);
		}
	}, [searchQuery, handleSearch]);

	const clearSearch = () => {
		setSearchQuery("");
		setSearchedPosts([]);
		setSearchClicked(false);
	};

	return (
		<Box>
			<HeroSection />

			{/* Search Section */}
			<Box maxW="1400px" mx="auto" py={4} textAlign="center">
				<Flex maxW="600px" mx={"auto"} direction="column" alignItems="center">
					<Flex mb={4}>
						<Button
							colorScheme={searchType === "recipe" ? "teal" : "gray"}
							onClick={() => setSearchType("recipe")}
							mr={2}
						>
							Search by Recipe
						</Button>
						<Button
							colorScheme={searchType === "ingredients" ? "teal" : "gray"}
							onClick={() => setSearchType("ingredients")}
						>
							Search by Ingredients
						</Button>
					</Flex>
					<Flex width="100%">
						<InputGroup>
							<Input
								type="text"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								bg="whitesmoke"
								rounded="full"
								py={2}
								px={6}
								focusBorderColor="green.300"
								placeholder={`Search delicious ${searchType}...`}
								w="full"
								borderColor={"green.200"}
							/>
							<InputRightElement>
								{searchQuery && (
									<IconButton
										aria-label="Clear search"
										icon={<SearchX />}
										onClick={clearSearch}
										size="sm"
										bg="red.200"
										color="white"
										_hover={{ bg: "red.300" }}
										rounded="full"
									/>
								)}
							</InputRightElement>
						</InputGroup>
						<Button ml={4} colorScheme="teal" rounded="full" onClick={handleSearch}  bgGradient="linear(to-l, #5ED20A, #9CCC65)"
                            _hover={{ bgGradient: 'linear(to-r, #5ED20A, #9CCC65)', opacity: 0.9 ,transform: "scale(1.05)" }}>
							Search
						</Button>
					</Flex>
				</Flex>
			</Box>

			<Container maxW="container.lg" py={8}>
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

				{!loading && searchClicked && searchedPosts.length === 0 && (
					<Heading as="h2" size="md" textAlign="center">
						No results found
					</Heading>
				)}

				{searchedPosts.length > 0 && (
					<Box bg="gray.100" p={4} borderRadius="md" mb={8}>
						<Heading as="h2" size="lg" mb={4}>
							Searched Results
						</Heading>
						<MotionGrid
							templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }}
							mx={"auto"}
							gap={4}
							justifyItems={"between"}
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.5 }}
						>
							{searchedPosts.map((post) => (
								<RecipeCard key={post._id} post={post} />
							))}
						</MotionGrid>
					</Box>
				)}

				<Box py={8}>
					<Heading as="h2" size="lg" textAlign="center" mb={8}>
						Simple and tasty recipes
					</Heading>
					{loading && posts.length === 0 && (
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

					{!loading && posts.length > 0 && (
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

			<Box textAlign="center" color="gray.600" fontSize="sm" py={4}>
				© 2024 ChefSphere. All rights reserved.
			</Box>
		</Box>
	);
};

export default HomePage;
